import {
  all,
  takeLatest,
  put,
  fork,
  call,
  select,
  race,
  take,
} from "redux-saga/effects";
import { logError } from "../../../helpers/utility";
import {
  checkDataOfAddingBatchItem,
  serializeListing,
  checkPriceLimit,
} from "../../../helpers/batch/utility";
import {
  searchAmazonProductsAPI,
  saveBatchItemAPI,
  updateBatchItemAPI,
	deleteBatchItemAPI,
	updateBatchDataAPI,
} from "../../../helpers/batch/apis";

import { getListingDefaults } from "../../../helpers/settings_apis";

import appActions from "../../app/actions";
import printerActions from "../../print_service/actions";
import actions from "../actions";
import {
  batchIdSelector,
  batchMetadataSelector,
  batchListingDefaultsSelector,
  currentWorkingListingDataSelector,
  productsSelector,
} from "../selector";

import { printerDefaultsSelector } from "../../settings/selector";


export function* productSearchResultsRequest() {
  yield takeLatest(actions.REQUEST_PRODUCT_SEARCH_RESULTS, function*(payload) {
    try {
      let { query, channel, existingProducts } = payload;
      const response = yield call(searchAmazonProductsAPI, query);
      if (response.data.error) {
        // @TODO: Add action to handle failure scenario
      } else {
        let searchResults = response.data.results;
        yield put(actions.receiveProductSearchResults(searchResults));
        if (searchResults.length === 1) {
          yield put(
            actions.selectProductSearchResultAndInitializeListing(
              searchResults[0],
              channel,
              existingProducts,
            )
          );
        } else {
          yield put(actions.setCurrentFlow("search_results_display"));
          if (searchResults.length === 0) {
            yield put(actions.setCurrentFlow("created_listings_display"));
            yield put(actions.clearSearchQuery());
            yield put(actions.setSearchResultIsEmpty(true));

          }
        }
      }
    } catch (err) {
      yield put(actions.requestProductSearchResultsFailed());
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(err, {
        tags: {
          exceptionType: actions.REQUEST_PRODUCT_SEARCH_RESULTS,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* cancelListingCreationFlow() {
  yield takeLatest(actions.CANCEL_LISTING_CREATION_FLOW, function*(payload) {
    try {
      yield put(actions.setCurrentFlow("created_listings_display"));
      yield put(actions.clearSearch());
      yield put(actions.clearCurrentWorkingListing());
      yield put(actions.resetWorkflowOptions());
    } catch (err) {
      yield put({
        type: actions.CANCEL_LISTING_CREATION_FLOW_ERROR
      });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(err, {
        tags: {
          exceptionType: actions.CANCEL_LISTING_CREATION_FLOW_ERROR,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* _selectProductSearchResultAndInitializeCurrentWorkingListing(payload) {
  try {
    let { searchResult, channel, existingProducts, printerHelper } = payload;
    yield put(actions.selectProductSearchResult(searchResult));
    yield put(actions.initializeCurrentWorkingListing());
    yield put(actions.getPricingData(searchResult.ASIN, channel));
    yield put(actions.updateCurrentListingWorkflowOptions('speedMode', true));
    yield put(actions.updateAddToBatchStatus(true));
    // yield put(actions.updateCurrentListingWorkflowOptions('showPricing', true));

    let matchingProduct = null;
    existingProducts.forEach(product => {
      if (product.asin === searchResult.ASIN) {
        matchingProduct = product;
      }
    });

    let canAddListing = false;
    if (matchingProduct) {
      yield put(actions.setCurrentEditableListing(matchingProduct, false));
      yield put(actions.updateModalDisplay("duplicate_asin_warning"));
    } else if (
      searchResult.replenishableListings &&
		searchResult.replenishableListings.length > 0 &&
		!searchResult.listWithNewMSKU
    ) {
      yield put(actions.updateModalDisplay("replishment_modal_warning"));
    } else {
      yield put(actions.setCurrentFlow("listing_creator_display"));
      canAddListing = true;
    }

    const { abort, suspend, priceCalculatedSuccess } = yield race({
      //pricingDataFailure: take(actions.GET_PRICING_DATA_FAILURE),
      priceCalculatedSuccess: take(actions.UPDATE_CALCULATED_PRICE),
      priceCalculatedError: take(actions.UPDATE_CALCULATED_PRICE_ERROR),
      abort: take(actions.SELECT_PRODUCT_SEARCH_RESULT_AND_INITIALIZE_CURRENT_WORKING_LISTING),
      suspend: take(actions.SUSPEND_SPEED_MODE),
    });
	  const batchListingDefaults = yield select(batchListingDefaultsSelector);
	  const listing_defaults = yield call(getListingDefaults);
	if(batchListingDefaults.shouldUseCustomSkuTemplate){
		if(batchListingDefaults.skuPrefix !== listing_defaults.data.data.sku_prefix){
		    yield put(actions.updateCurrentWorkingListingData(
				  "skuPrefix", batchListingDefaults.skuPrefix, false));
		} else {
		    yield put(actions.updateCurrentWorkingListingData(
				  "skuPrefix", listing_defaults.data.data.sku_prefix, false));
		}
	}

    let speedMode = false;
    if (priceCalculatedSuccess) {
      yield put(actions.updateCurrentWorkingListingData("price", priceCalculatedSuccess.price, false));
      if (!!batchListingDefaults && !batchListingDefaults.pricingOptions && !batchListingDefaults.gradingOptions && batchListingDefaults.condition !== "NoDefault") {
        speedMode = true;
      }
    }
    yield put(actions.updateCurrentListingWorkflowOptions('showPricing', !priceCalculatedSuccess));
    yield put(actions.updateCurrentListingWorkflowOptions('speedMode', speedMode));
    yield put(actions.updateAddToBatchStatus(canAddListing && speedMode));
    if (abort || suspend) {
      return;
    }

    if (canAddListing && speedMode) {
      yield put(actions.tryAddingItemToBatch(
        null,
        printerHelper,
        false
      ));
    }
  } catch (err) {
    yield put(appActions.apiCallFailed("Error! Fetching api error"));
    logError(err, {
      tags: {
        exceptionType: "SELECT_PRODUCT_SEARCH_RESULT_AND_INITIALIZE_CURRENT_WORKING_LISTING_ERROR",
        batchId: yield select(batchIdSelector),
      }
    });
  }
}

export function* selectProductSearchResultAndInitializeCurrentWorkingListing() {
  yield takeLatest(
    actions.SELECT_PRODUCT_SEARCH_RESULT_AND_INITIALIZE_CURRENT_WORKING_LISTING,
    _selectProductSearchResultAndInitializeCurrentWorkingListing
  );
}

export function* saveListing() {
  yield takeLatest(actions.SAVE_LISTING, function*(payload) {
    try {
      const {
        listing,
        shipmentIdToCurrentBoxMapping,
        shipmentIdToBoxCountMapping,
        skuNumber,
        isHoldingAreaListing
      } = payload;

      const batchMetadata = yield select(batchMetadataSelector);
      const batchId = batchMetadata.id;

      let pricingData = listing.pricingData;
      if (pricingData) {
        pricingData = {
          fees: pricingData.fees
        };
      }
      let {
        isGeneratedSku,
        ...updatedListing
      } = listing
      let data = {
        batchId,
        shipmentIdToCurrentBoxMapping, // can be null
        shipmentIdToBoxCountMapping, // can be null
        item: {
          ...updatedListing,
          pricingData: pricingData
        }
      };
      const response = yield call(saveBatchItemAPI, data);
      if (response.data && response.data.error) {
        yield put(actions.saveListingFailure());
        yield put(appActions.apiCallFailed("Error! Unable to save listing"));
      } else {
        yield put(
          actions.saveListingSuccess(
            updatedListing,
            skuNumber,
            isHoldingAreaListing
          )
        );
        yield put(actions.setCurrentWorkingListing(updatedListing));
      }
      yield put(actions.updateAddToBatchStatus(false));
    } catch (err) {
      yield put(actions.updateAddToBatchStatus(false));
      yield put(appActions.apiCallFailed("Error! Unable to save listing"));
      logError(err, {
        tags: {
          exceptionType: actions.SAVE_LISTING_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* saveListingSuccess() {
  yield takeLatest(actions.SAVE_LISTING_SUCCESS, function*(payload) {
    try {
      let {
        listing,
        skuNumber,
        isHoldingAreaListing
      } = payload;
      if (isHoldingAreaListing) {
        // @TODO: Alert the user about what the current warehouse is.
        yield put(actions.deleteHoldingAreaListing(listing.sku));
        yield put(
          appActions.apiCallSuccess(
            "Successfully Added the listing to your batch."
          )
        );
      } else {
        yield put(appActions.apiCallUserSoundNotificationSuccess());
        yield put(actions.incrementSKUNumber(skuNumber));
        yield put(actions.setCurrentFlow("created_listings_display"));
      }

      yield put(actions.addCurrentWorkingListingToBatch());
      yield put(actions.clearSearch());
      yield put(actions.clearCurrentWorkingListing());
      yield put(actions.resetWorkflowOptions());
      yield put(
        actions.printListing(
          listing,
          listing.qty
        )
      );
      yield put(actions.setCurrentPage(1));
    } catch (err) {
      yield put(appActions.apiCallFailed("Error! Unable to save listing"));
      logError(err, {
        tags: {
          exceptionType: actions.SAVE_LISTING_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* editListing() {
  yield takeLatest(actions.EDIT_LISTING, function*(payload) {
    try {
      const {
        batchId,
        listing,
        qtyIncreased,
        isHoldingAreaListing
      } = payload;
      let pricingData = listing.pricingData;
      if (pricingData) {
        pricingData = {
          fees: pricingData.fees
        };
      }
      let data = {
        batchId,
        item: {
          ...listing,
          pricingData: pricingData
        }
      };

      const response = yield call(updateBatchItemAPI, data);
      let responseData = response.data;

      if (responseData.error) {
        yield put(actions.editListingFailure());
      } else {
        yield put(
          actions.editListingSuccess(
            listing,
            qtyIncreased,
          )
        );
        if (isHoldingAreaListing) {
          yield put(actions.deleteHoldingAreaListing(listing.sku));
          yield put(
            appActions.apiCallSuccess(
              "Successfully Updated the listing in your batch."
            )
          );
        }
      }
    } catch (err) {
      yield put(appActions.apiCallFailed("Error! Unable to edit listing"));
      logError(err, {
        tags: {
          exceptionType: actions.EDIT_LISTING_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* editListingSuccess() {
  yield takeLatest(actions.EDIT_LISTING_SUCCESS, function*(payload) {
    try {
      const {
        listing,
        qtyIncreased,
      } = payload;
      if (qtyIncreased > 0) {
        yield put(
          actions.printListing(
            listing,
            qtyIncreased
          )
        );
      }
    yield put(actions.clearSearch());
    } catch (err) {
      logError(err, {
        tags: {
          exceptionType: actions.EDIT_LISTING_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* deleteListing() {
  yield takeLatest(actions.DELETE_LISTING, function*(payload) {
    try {
      let { sku } = payload.listing;
      let data = {
        batchId: payload.batchId,
        sku
      };
      const response = yield call(deleteBatchItemAPI, data);
      const responseData = response.data;
      if (responseData.error) {
        yield put(actions.deleteListingFailure());
      } else {
        yield put(actions.deleteListingSuccess(sku));
      }
      yield put(actions.clearCurrentEditableListing());
    } catch (err) {
      yield put(appActions.apiCallFailed("Error! Unable to delete listing!"));
      yield put(actions.clearCurrentEditableListing());
      logError(err, {
        tags: {
          exceptionType: actions.DELETE_LISTING_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* printListing() {
  yield takeLatest(actions.PRINT_LISTING, function*(payload) {
    try {
      const {
        listing,
        qty
      } = payload;
      const batchMetadata = yield select(batchMetadataSelector);
      const printerDefaults = yield select(printerDefaultsSelector);
		if (printerDefaults && batchMetadata.labelingPreference === "SELLER_LABEL"
			&& (printerDefaults.print_while_scanning || batchMetadata.printWhileScan)) {
        yield put(printerActions.print(listing, qty));
      }
    } catch (err) {
      logError(err, {
        tags: {
          exceptionType: "PRINT_LISTING_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* tryAddingItemToBatch() {
  yield takeLatest(actions.TRY_ADDING_ITEM_TO_BATCH, function*(payload) {
    try {
      const {
        isHoldingAreaListing,
      } = payload;
       let { listing } = payload;
       let currentWorkingListingData = yield select(currentWorkingListingDataSelector);
      const batchMetadata = yield select(batchMetadataSelector);
      const { id, channel } = batchMetadata;
      const batchListingDefaults = yield select(batchListingDefaultsSelector);

      const { shippingTemplate } = batchListingDefaults;
      const products = yield select(productsSelector);
       if (!listing) {
        listing = checkPriceLimit(currentWorkingListingData, batchListingDefaults);
      }
      listing = serializeListing(listing);
      if (channel && channel === "DEFAULT") {
        if (shippingTemplate === "" || shippingTemplate === null ) {
          yield put(appActions.apiCallFailed("Shipping Template is missing, please check and try gain."));
          return;
        }
      }
      if (!checkDataOfAddingBatchItem(listing)) {
        yield put(appActions.apiCallFailed("Some required fields were missing or incorrectly filled (SKU, quantity, condition or price)."));
        return;
      }
       if (isHoldingAreaListing) {
        let matchingProduct = null;
        products.forEach(product => {
          if (product.sku === listing.sku) {
            matchingProduct = product;
          }
        });
         if (matchingProduct) {
          const qtyIncreased = listing.qty;
          const { qty } = matchingProduct;
           if (qtyIncreased && qtyIncreased > 0) {
            const updatedListing = Object.assign({}, matchingProduct, {
              qty: qty + qtyIncreased
            });
            if (batchMetadata.workflowType === "live") {
              yield put(actions.updateInboundShipmentQuantityAndEditListing(
                updatedListing,
                qtyIncreased,
                isHoldingAreaListing
              ));
            } else {
              yield put(actions.editListing(
                id,
                updatedListing,
                qtyIncreased,
                isHoldingAreaListing
              ));
            }
          }
          return;
        }
      }
       if (listing) {
        currentWorkingListingData = listing;
      }
       if (batchMetadata.workflowType === "private") {
        yield put(actions.tryAddingItemToPrivateBatch(
          currentWorkingListingData,
          isHoldingAreaListing
        ));
      } else if (batchMetadata.workflowType === "live") {
        yield put(actions.tryAddingItemToLiveBatch(
          currentWorkingListingData,
          isHoldingAreaListing
        ));
      }
    } catch (err) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(err, {
        tags: {
          exceptionType: "TRY_ADDING_ITEM_TO_BATCH_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  })
}

export function* updateCurrentWorkingListing() {
  yield takeLatest(actions.UPDATE_CURRENT_WORKING_LISTING, function*(payload) {
    try {
      const {
        fieldName,
      } = payload;
      if (fieldName === "price") {
        yield put(actions.suspendSpeedMode());
      }
    } catch (err) {
      logError(err, {
        tags: {
          exceptionType: "UPDATE_CURRENT_WORKING_LISTING_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* updateBatchData() {
  yield takeLatest(actions.BATCH_METADATA_UPDATE, function*(payload) {
    try {
		const { data } = payload;
		const update_data = {
			batch_id: yield select(batchIdSelector),
			update_data: {
				printWhileScan: data.printWhileScan
			}
		}
		const response = yield call(updateBatchDataAPI, update_data);
		if(response.data.error){
			yield put(actions.batchMetadataUpdateSuccess(data));
		} else {
			yield put(actions.batchMetadataUpdateError());
		}
    } catch (err) {
      logError(err, {
        tags: {
          exceptionType: "BATCH_METADATA_UPDATE_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(productSearchResultsRequest),
    fork(cancelListingCreationFlow),
    fork(selectProductSearchResultAndInitializeCurrentWorkingListing),
    fork(saveListing),
    fork(saveListingSuccess),
    fork(editListing),
    fork(editListingSuccess),
    fork(deleteListing),
    fork(printListing),
    fork(tryAddingItemToBatch),
    fork(updateCurrentWorkingListing),
	fork(updateBatchData),
  ]);
}
