import {
  all,
  takeLatest,
  takeEvery,
  put,
  fork,
  call,
  select
} from "redux-saga/effects";
import { skuNumberConversion } from "../../../helpers/batch/utility";
import { logError } from "../../../helpers/utility";
import {
  postPrivateBatchListingToAmazonAPI,
  createShipmentAPI
} from "../../../helpers/batch/apis";

import {
  generateTemplatedSKU,
} from "../../../helpers/batch/utility";

import appActions from "../../app/actions";
import actions from "../actions";
import {
  batchIdSelector,
  batchListingDefaultsSelector,
  batchMetadataSelector,
  productsSelector,
  existingShipmentsSelector
} from "../selector";


export function* tryAddingItemToPrivateBatch() {
  yield takeLatest(actions.TRY_ADDING_ITEM_TO_PRIVATE_BATCH, function*(
    payload
  ) {
    try {
      let {
        listing,
        isHoldingAreaListing
      } = payload;

      const batchMetadata = yield select(batchMetadataSelector);
      const batchListingDefaults = yield select(batchListingDefaultsSelector);
      const skuNumber = batchListingDefaults.skuNumber;

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
      if (batchMetadata.channel === "DEFAULT") {
        // MF CODE PATH
        let shipmentIdToBoxCountMapping = null;
        let shipmentIdToCurrentBoxMapping = null;
        yield put(
          actions.saveListing(
            listing,
            shipmentIdToCurrentBoxMapping,
            shipmentIdToBoxCountMapping,
            skuNumber,
            isHoldingAreaListing
          )
        );
      } else {
        // FBA CODE PATH
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
          shipmentName
        };
        actions.requestFulfillmentCenterData();
        let response = yield call(
          postPrivateBatchListingToAmazonAPI,
          requestBody
        );
        let responseData = response.data;
        if (responseData.error) {
			if(responseData.error2){
				// handle new error
				yield put(actions.showAlert(
					"Listing Error!", responseData.error, responseData.error2));
			} else {
				yield put(actions.showAlert("Listing Error!", responseData.error, null));
			}
          yield put(actions.incrementSKUNumber(skuNumber));
          yield put(actions.updateAddToBatchStatus(false));
          yield put(appActions.apiCallFailed("Error! Unable to save listing"));
          return;
        } else {
          let fnsku = responseData.fnsku;
          yield put(
            actions.receivePrivateBatchFulfillmentCenterData(
              listing,
              fnsku,
              skuNumber,
              isHoldingAreaListing
            )
          );
        }
      }
    } catch (err) {
      yield put(actions.updateAddToBatchStatus(false));
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(err, {
        tags: {
          exceptionType: "TRY_ADDING_ITEM_TO_PRIVATE_BATCH_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* receivePrivateBatchFulfillmentCenterData() {
  yield takeLatest(
    actions.RECEIVE_PRIVATE_BATCH_FULFILLMENT_CENTER_DATA,
    function*(payload) {
      try {
        let {
          listing,
          fnsku,
          skuNumber,
          isHoldingAreaListing
        } = payload;
        yield put(actions.setFNSKU(fnsku));
        listing.fnsku = fnsku;
        let shipmentIdToBoxCountMapping = null;
        let shipmentIdToCurrentBoxMapping = null;
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
        yield put(appActions.apiCallFailed("Error! Fetching api error"));
        yield put(actions.updateAddToBatchStatus(false));
        logError(err, {
          tags: {
            exceptionType: "RECEIVE_PRIVATE_BATCH_FULFILLMENT_CENTER_DATA_ERROR",
            batchId: yield select(batchIdSelector),
          }
        });
      }
    }
  );
}

// Create shipment saga used for private batches, after users have started previewing their shipment plans.
// @todo(jeffdh5): existingShipments here comes from Redux, whereas existingShipments is implicitly constructed
// for live batches. We may want to re-design this, so that when a shipment get's created via this endpoint,
// the backend will automatically:
// 1) update qty_shipped field in the batch_item table
// 2) set fulfillment centers for the products that were shipped
// 3) return a new products array from backend, alongside the existing shipments array

// To support this new solution we also need a few more things:
// 1) automatically mark items as shipped when you create items through live batches and save them
// 2) add qtyShipped field into fieldTransformers array
// 3) add new functionality on the batch to "reset shipment data" which allows the user reset
// inboundShipmentPlans/existingShipments from redux state and also mark all items' qtyShipped field = 0
export function* createShipment() {
  yield takeEvery(actions.CREATE_SHIPMENT, function*(payload) {
    try {
      let {
        inboundShipmentPlans
      } = payload;
      const batchMetadata = yield select(batchMetadataSelector);

      const products = yield select(productsSelector);
      const existingShipments = yield select(existingShipmentsSelector);

      let data = {
        batchId: batchMetadata.id,
        inboundShipmentPlans,
        existingShipments
      };
      const response = yield call(createShipmentAPI, data);
      if (!response.status === 200 || response.data.error) {
        yield put(actions.createShipmentFailure());
        yield put(
          actions.showAlert(
            "Error!",
            "Failed to create inbound shipment. Error: " +
              response.data.error
          )
        );
      } else {
        let skus = new Set();
        inboundShipmentPlans.forEach(plan => {
          let items = plan.Items;
          items.forEach(item => {
            skus.add(item.SellerSKU);
          });
        });

        let shipmentProducts = products.filter(product =>
          skus.has(product.sku)
        );

        yield put(
          actions.submitProductFeed(shipmentProducts, batchMetadata, false)
        );
        let createdShipmentIds = inboundShipmentPlans.map(
          plan => plan.ShipmentId
        );
        yield put(
          actions.createShipmentSuccess(
            createdShipmentIds,
            response.data.existing_shipments
          )
        );
      }
    } catch (err) {
      logError(err, {
        tags: {
          exceptionType: "CREATE_SHIPMENT_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
      yield put(actions.createShipmentFailure());
      console.log("create shipment failure trace")
      console.trace()
      yield put(actions.showAlert("Error!", "Unable to Create Shipment"));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(receivePrivateBatchFulfillmentCenterData),
    fork(tryAddingItemToPrivateBatch),
    fork(createShipment)
  ]);
}
