import {
  all,
  takeLatest,
  put,
  fork,
  call,
  select
} from "redux-saga/effects";
import { skuNumberConversion } from "../../../helpers/batch/utility";
import { logError } from "../../../helpers/utility";
import {
  postLiveBatchListingToAmazonAPI,
  approveShipmentCreationAPI,
  updateItemQuantityOnAmazonAPI,
  updateBoxInfoForLiveBatchShipmentAPI,
  addBoxInfoForLiveBatchShipmentAPI
} from "../../../helpers/batch/apis";

import {
  updateShipmentToBoxMapping,
  generateBoxContents,
  editBoxContents,
  generateTemplatedSKU,
  constructExistingShipmentsFromListings,
} from "../../../helpers/batch/utility";

import appActions from "../../app/actions";
import actions from "../actions";
import {
  batchIdSelector,
  batchListingDefaultsSelector,
  batchMetadataSelector,
  currentWorkingListingDataSelector,
  productsSelector,
  shipmentIdToBoxCountMappingSelector,
  shipmentIdToCurrentBoxMappingSelector,
  currentListingWorkflowOptionsSelector
} from "../selector";

export function* tryAddingItemToLiveBatch() {
  yield takeLatest(actions.TRY_ADDING_ITEM_TO_LIVE_BATCH, function*(payload) {
    try {
      let {
        listing,
        isHoldingAreaListing
      } = payload;

      const batchMetadata = yield select(batchMetadataSelector);
      const batchListingDefaults = yield select(batchListingDefaultsSelector);
      const skuNumber = batchListingDefaults.skuNumber;

      const products = yield select(productsSelector);
      const existingShipments = constructExistingShipmentsFromListings(products);

      // If the SKU is not found - try to infer the SKU by looking
      // for skuPrefix and skuNumber.
      // We would end up in this flow if we added an item regularly
      // through the listing flow. We would have SKU already set
      // usually in the special cases (duplicate asin, replenish listing,
      // holding area, etc.)
      if (!listing.sku || listing.isGeneratedSku) {
		listing.sku = generateTemplatedSKU(listing)
		if(listing.sku.includes('{count}')){
			listing.sku = listing.sku.replace(
				'{count}', skuNumberConversion(listing.skuNumber));
		} else {
			listing.sku = listing.sku + '-' + skuNumberConversion(listing.skuNumber);
		}
		listing.isGeneratedSku = true;
      }
      yield put(actions.updateAddToBatchStatus(true));
      yield put(actions.setCurrentWorkingListing(listing));
      yield put(actions.requestFulfillmentCenterData());

      let { asin, sku, condition, qty } = listing;

      let {
        labelingPreference,
        intendedBoxContentsSource,
        addressId
      } = batchMetadata;

      let shipmentName = batchMetadata.batchName;

      let requestBody = {
        asin,
        sku,
        condition,
        qty,
        addressId,
        labelingPreference,
        intendedBoxContentsSource,
        existingShipments,
        shipmentName
      };
      const response = yield call(postLiveBatchListingToAmazonAPI, requestBody);

      let data = response.data;

      if (data.error) {
        // @TODO: Handle the case where server returns an error
        yield put(actions.showAlert("Listing Error!", data.error));
        yield put(actions.incrementSKUNumber(skuNumber));
        yield put(actions.updateAddToBatchStatus(false));
        yield put(appActions.apiCallFailed("Error! Unable to save listing"));
        return;
      }

      if (data.status === "waiting_for_user_approval") {
        yield put(actions.addInboundShipmentPlans(data.inbound_shipment_plans));
        if (
          data.inbound_shipment_plans &&
          data.inbound_shipment_plans.length > 0
        ) {
          let fnsku = "";
          data.inbound_shipment_plans.forEach(shipmentPlans => {
            if (shipmentPlans.Items &&
              shipmentPlans.Items.member &&
              shipmentPlans.Items.member.FulfillmentNetworkSKU
            ) {
              fnsku = shipmentPlans.Items.member.FulfillmentNetworkSKU.value;
              return;
            }
          })
          if (fnsku !== "") {
            yield put(actions.setFNSKU(fnsku));
          }
        }
        yield put(actions.updateModalDisplay("new_shipment_confirmation"));
        return;
      }

      if (!data.fulfillmentCenters) {
        // @TODO: Handle the case where server doesn't return error but field is missing.
        return;
      }

      yield put(
        actions.receiveLiveBatchFulfillmentCenterData(
          listing,
          data,
          skuNumber,
          isHoldingAreaListing
        )
      );
    } catch (err) {
      yield put(actions.updateAddToBatchStatus(false));
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(err, {
        tags: {
          exceptionType: "TRY_ADDING_ITEM_TO_LIVE_BATCH_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* receiveLiveBatchFulfillmentCenterData() {
  yield takeLatest(
    actions.RECEIVE_LIVE_BATCH_FULFILLMENT_CENTER_DATA,
    function*(payload) {
      try {
        let {
          listing,
          fulfillmentCenterData,
          skuNumber,
          isHoldingAreaListing
        } = payload;

        let shipmentIdToBoxCountMapping = yield select(shipmentIdToBoxCountMappingSelector);
        let shipmentIdToCurrentBoxMapping = yield select(shipmentIdToCurrentBoxMappingSelector);

        yield put(
          actions.setLiveBatchFulfillmentCenterData(fulfillmentCenterData)
        );

        let wasUpdated = updateShipmentToBoxMapping(
          fulfillmentCenterData.fulfillmentCenters,
          shipmentIdToCurrentBoxMapping,
          shipmentIdToBoxCountMapping
        );
        let boxContents = generateBoxContents(
          fulfillmentCenterData.fulfillmentCenters,
          shipmentIdToCurrentBoxMapping
        );

        yield put(
          actions.autoAddItemToBoxContents(
            boxContents,
            shipmentIdToCurrentBoxMapping,
            shipmentIdToBoxCountMapping
          )
        );
        listing.boxContents = boxContents;
        listing.fulfillmentCenters = fulfillmentCenterData.fulfillmentCenters;

        if (!wasUpdated) {
          // Set these to null so that the backend does not make updates unless it has to
          shipmentIdToCurrentBoxMapping = null;
          shipmentIdToBoxCountMapping = null;
        }

        if (
          fulfillmentCenterData &&
          fulfillmentCenterData.fulfillmentCenters &&
          fulfillmentCenterData.fulfillmentCenters.length > 0
        ) {
          let fnsku = "";
          fulfillmentCenterData.fulfillmentCenters.forEach(fnCenter => {
            if (fnCenter.FulfillmentNetworkSKU) {
              fnsku = fnCenter.FulfillmentNetworkSKU;
              console.log(`fnsku: ${fnsku}`)
              return;
            }
          })
          yield put(actions.setFNSKU(fnsku));
          listing.fnsku = fnsku;
        }

        yield put(
          actions.saveListing(
            listing,
            shipmentIdToCurrentBoxMapping,
            shipmentIdToBoxCountMapping,
            skuNumber,
            isHoldingAreaListing
          )
        );
      } catch (err) {
        yield put(actions.updateAddToBatchStatus(false));
        yield put(appActions.apiCallFailed("Error! Fetching api error"));
        logError(err, {
          tags: {
            exceptionType: "RECEIVE_LIVE_BATCH_FULFILLMENT_CENTER_DATA_ERROR",
            batchId: yield select(batchIdSelector),
          }
        });
      }
    }
  );
}

export function* approveShipmentCreation() {
  yield takeLatest(actions.APPROVE_SHIPMENT_CREATION, function*() {
    try {

      const listing = yield select(currentWorkingListingDataSelector);
      const batchMetadata = yield select(batchMetadataSelector);
      const batchListingDefaults = yield select(batchListingDefaultsSelector);

      const products = yield select(productsSelector);
      const existingShipments = constructExistingShipmentsFromListings(products);
      const batchId = yield select(batchIdSelector);
      let {
        labelingPreference,
        intendedBoxContentsSource,
        addressId
      } = batchMetadata;

      let inboundShipmentPlans = listing.inboundShipmentPlans,
        shipmentName = batchMetadata.batchName;

      let requestBody = {
        addressId,
        labelingPreference,
        intendedBoxContentsSource,
        existingShipments,
        shipmentName,
        inboundShipmentPlans,
        batchId
      };

      let response = yield call(approveShipmentCreationAPI, requestBody);
      let data = response.data;

      if (response.error) {
        yield put(actions.approveShipmentCreationFailure());
        yield put(actions.updateAddToBatchStatus(false));
        return;
      }

      yield put(
        actions.receiveLiveBatchFulfillmentCenterData(
          listing,
          data,
          batchListingDefaults.skuNumber,
          listing.isHoldingAreaListing
        )
      );
    } catch (err) {
      yield put(actions.updateAddToBatchStatus(false));
      yield put(appActions.apiCallFailed("Error! Unable to approve shipment"));
      logError(err, {
        tags: {
          exceptionType: actions.APPROVE_SHIPMENT_CREATION_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* updateInboundShipmentQuantityAndEditListing() {
  yield takeLatest(
    actions.UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_EDIT_LISTING,
    function*(payload) {
      try {
        let {
          listing,
          qtyIncreased,
          isHoldingAreaListing
        } = payload;
        let { asin, sku, condition, qty, fulfillmentCenters } = listing;

        const batchMetadata = yield select(batchMetadataSelector);
        const shipmentIdToCurrentBoxMapping = yield select(shipmentIdToCurrentBoxMappingSelector);

        let { labelingPreference, addressId, id } = batchMetadata;

        let shipmentName = batchMetadata.batchName;

        let requestBody = {
          asin,
          sku,
          condition,
          qty,
          addressId,
          labelingPreference,
          shipmentName,
          fulfillmentCenters
        };

        const amazonResponse = yield call(
          updateItemQuantityOnAmazonAPI,
          requestBody
        );
        let fulfillmentCenterData = amazonResponse.data;
        if (fulfillmentCenterData.fulfillmentCenters) {
          let updatedListing = Object.assign({}, listing);
          updatedListing.fulfillmentCenters =
            fulfillmentCenterData.fulfillmentCenters;
          updatedListing.boxContents = editBoxContents(
            listing.boxContents,
            listing.fulfillmentCenters,
            updatedListing.fulfillmentCenters,
            shipmentIdToCurrentBoxMapping
          );

          yield put(
            actions.editListing(
              id,
              updatedListing,
              qtyIncreased,
              isHoldingAreaListing
            )
          );
        } else {
          yield put(actions.editListingFailure());
        }
      } catch (err) {
        yield put(appActions.apiCallFailed("Error! Unable to update shipment"));
        logError(err, {
          tags: {
            exceptionType: "UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_EDIT_LISTING_ERROR",
            batchId: yield select(batchIdSelector),
          }
        });
      }
    }
  );
}

// @TODO: Figure out a way to break this down so we don't have to
// repeat the code constructing the update inbound shipment API call
export function* updateInboundShipmentQuantityAndDeleteListing() {
  yield takeLatest(
    actions.UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_DELETE_LISTING,
    function*(payload) {
      try {
        let { listing, batchMetadata } = payload;
        let { asin, sku, condition, fulfillmentCenters } = listing;
        let qty = 0;
        let { labelingPreference, addressId, id } = batchMetadata;

        let shipmentName = batchMetadata.batchName;

        let requestBody = {
          asin,
          sku,
          condition,
          qty,
          addressId,
          labelingPreference,
          shipmentName,
          fulfillmentCenters
        };

        const amazonResponse = yield call(
          updateItemQuantityOnAmazonAPI,
          requestBody
        );
        let fulfillmentCenterData = amazonResponse.data;
        if (fulfillmentCenterData.fulfillmentCenters) {
          yield put(actions.deleteListing(id, listing));
        } else {
          yield put(actions.deleteListingFailure());
        }
      } catch (err) {
        yield put(appActions.apiCallFailed("Error! Unable to update shipment"));
        logError(err, {
          tags: {
            exceptionType: "UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_DELETE_LISTING_ERROR",
            batchId: yield select(batchIdSelector),
          }
        });
      }
    }
  );
}

export function* updateBoxInfoForShipment() {
  yield takeLatest(actions.UPDATE_BOX_INFO_FOR_SHIPMENT, function*(payload) {
    try {
      const batchMetadata = yield select(batchMetadataSelector);
      let data = {
        batchId: batchMetadata.id,
        shipmentId: payload.shipmentId,
        currentBox: payload.currentBox,
        boxCount: payload.boxCount
      };
      const response = yield call(updateBoxInfoForLiveBatchShipmentAPI, data);
      if (response.data && response.data.error) {
        yield put(actions.updateBoxInfoForShipmentFailure());
      } else {
        let currentBoxUpdate = {},
          boxCountUpdate = {};
        currentBoxUpdate[payload.shipmentId] = payload.currentBox;
        boxCountUpdate[payload.shipmentId] = payload.boxCount;

        yield put(
          actions.updateBoxInfoForShipmentSuccess(
            currentBoxUpdate,
            boxCountUpdate
          )
        );
      }
    } catch (err) {
      yield put(
        appActions.apiCallFailed(
          "Error! Unable to update box info for the current shipment"
        )
      );
      logError(err, {
        tags: {
          exceptionType: actions.UPDATE_BOX_INFO_FOR_SHIPMENT_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* addBoxInfoForShipment() {
  yield takeLatest(actions.ADD_BOX_INFO_FOR_SHIPMENT, function*(payload) {
    try {
      const batchMetadata = yield select(batchMetadataSelector);
      let data = {
        batchId: batchMetadata.id,
        shipmentId: payload.shipmentId
      };
      const response = yield call(addBoxInfoForLiveBatchShipmentAPI, data);
      if (response.data && response.data.error) {
        yield put(actions.addBoxInfoForShipmentFailure());
      } else {
        let currentBoxUpdate = response.data.shipment_id_to_current_box_mapping,
          boxCountUpdate = response.data.shipment_id_to_box_count_mapping;

        yield put(
          actions.addBoxInfoForShipmentSuccess(currentBoxUpdate, boxCountUpdate)
        );
      }
    } catch (err) {
      yield put(
        appActions.apiCallFailed(
          "Error! Unable to update box info for the current shipment"
        )
      );
      logError(err, {
        tags: {
          exceptionType: actions.ADD_BOX_INFO_FOR_SHIPMENT_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* rejectNewLiveBatchShipment() {
  yield takeLatest(actions.REJECT_NEW_LIVE_BATCH_SHIPMENT, function*() {
    try {
      yield put(actions.closeModal());
      yield put(actions.cancelListingCreationflow());
      const currentListingWorkflowOptions = yield select(currentListingWorkflowOptionsSelector);
      if (!currentListingWorkflowOptions.isHoldingAreaListing) {
        const listingDefaults = yield select(batchListingDefaultsSelector);
        yield put(actions.incrementSKUNumber(listingDefaults.skuNumber));
      }
    } catch (err) {
      logError(err, {
        tags: {
          exceptionType: actions.REJECT_NEW_LIVE_BATCH_SHIPMENT_ERROR,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateInboundShipmentQuantityAndEditListing),
    fork(updateInboundShipmentQuantityAndDeleteListing),
    fork(receiveLiveBatchFulfillmentCenterData),
    fork(tryAddingItemToLiveBatch),
    fork(approveShipmentCreation),
    fork(updateBoxInfoForShipment),
    fork(addBoxInfoForShipment),
    fork(rejectNewLiveBatchShipment)
  ]);
}
