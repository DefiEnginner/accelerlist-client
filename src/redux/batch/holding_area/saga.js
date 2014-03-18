import {
  all,
  takeLatest,
  takeEvery,
  put,
  fork,
  call,
  select
} from "redux-saga/effects";
import { logError } from "../../../helpers/utility";
import {
  addToHoldingsAPI,
  getHoldingsAPI,
  deleteHoldingAreaListingAPI,
  bulkAddToHoldingAreaAPI,
  createHoldingAreaShipmentAPI
} from "../../../helpers/batch/apis";

import appActions from "../../app/actions";
import actions from "../actions";
import {
  batchIdSelector,
  batchMetadataSelector
} from "../selector";

export function* createHoldingAreaShipment() {
  yield takeLatest(actions.CREATE_HOLDING_AREA_SHIPMENT, function*(payload) {
    try {
      const response = yield call(createHoldingAreaShipmentAPI, payload.holdingAreaShipmentData);
      console.log("JOB REPOSE1: ", response.data);
      if (response.data.error) {
        yield put({
          type: actions.CREATE_HOLDING_AREA_SHIPMENT_FAILURE,
          error: "Error"
        });
        yield put(actions.showAlert("Create Holding Area Shipment Error!", response.data.error));
        logError(response.data.error, {
          tags: {
            exceptionType: actions.CREATE_HOLDING_AREA_SHIPMENT_FAILURE,
            batchId: yield select(batchIdSelector),
          }
        });
      } else {
        yield put({
          type: actions.CREATE_HOLDING_AREA_SHIPMENT_SUCCESS,
          holdingAreaShipmentBatch: response.data,
          addedInboundShipmentPlan: payload.holdingAreaShipmentData.inboundShipmentPlans[0]
        });
      }

    } catch (err) {
      yield put({
        type: actions.CREATE_HOLDING_AREA_SHIPMENT_FAILURE,
        error: "Error"
      });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(err, {
        tags: {
          exceptionType: actions.CREATE_HOLDING_AREA_SHIPMENT_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* getHoldings() {
  yield takeEvery(actions.GET_HOLDINGS, function*() {
    try {
      const response = yield call(getHoldingsAPI);
      if (response.data.error) {
        yield put(actions.getHoldingsFailure());
        yield put(actions.showAlert("Error!", "Unable to fetch holdings"));
      } else {
        yield put(actions.getHoldingsSuccess(response.data.data));
      }
    } catch (err) {
      yield put(actions.getHoldingsFailure());
      yield put(appActions.apiCallFailed("Error! Unable to fetch holdings"));
      logError(err, {
        tags: {
          exceptionType: actions.GET_HOLDINGS_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* sendToHoldings() {
  yield takeEvery(actions.SEND_TO_HOLDING_AREA, function*(payload) {
    try {
      const { skuNumber, searchResult, listingData } = payload;
      const { itemDimensions, packageDimensions } = searchResult;
      let data = {
        listing: JSON.stringify({
          ...listingData,
          searchResultData: searchResult,
          isHoldingAreaListing: true,
          itemDimensions,
          packageDimensions
        })
      };
      yield put(actions.incrementSKUNumber(skuNumber));
      const response = yield call(addToHoldingsAPI, data);
      if (response.data.error) {
        yield put(actions.updateAddToBatchStatus(false));
        yield put(actions.sendToHoldingsFailure());
        yield put(actions.showAlert("Error!", "Unable to add to holdings"));
      } else {
        yield put(actions.sendToHoldingsSuccess());
        yield put(actions.cancelListingCreationflow());
        yield put(actions.updateAddToBatchStatus(false));
      }
    } catch (err) {
      yield put(actions.sendToHoldingsFailure());
      yield put(actions.updateAddToBatchStatus(false));
      yield put(appActions.apiCallFailed("Error! Unable to add to holdings"));
      logError(err, {
        tags: {
          exceptionType: actions.SEND_TO_HOLDING_AREA_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* bulkSendToHoldingArea() {
  yield takeEvery(actions.BULK_SEND_TO_HOLDING_AREA, function*(payload) {
    try {
      let { productsInDestId, rejectedShipmentIds } = payload;
      const batchMetadata = yield select(batchMetadataSelector);
      const batchId = batchMetadata.id;

      let data = {
        listings: productsInDestId,
        batchId: batchId
      };
      const response = yield call(bulkAddToHoldingAreaAPI, data);
      if (response.error) {
        yield put(actions.bulkSendToHoldingAreaFailure());
        yield put(actions.showAlert("Error!", "Unable to add to holding area"));
      } else {
        let products = response.products;
        yield put(
          actions.bulkSendToHoldingAreaSuccess(products, rejectedShipmentIds)
        );
      }
    } catch (err) {
      yield put(actions.bulkSendToHoldingAreaFailure());
      yield put(actions.showAlert("Error!", "Unable to add to holding area"));
      yield put(
        appActions.apiCallFailed("Error! Unable to add to holding area")
      );
      logError(err, {
        tags: {
          exceptionType: actions.BULK_SEND_TO_HOLDING_AREA_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* deleteHoldingAreaListing() {
  yield takeLatest(actions.DELETE_HOLDING_AREA_LISTING, function*(payload) {
    try {
      const response = yield call(deleteHoldingAreaListingAPI, payload.sku);
      if (response.data && response.data.error) {
        yield put(actions.deleteHoldingAreaListingFailure());
      } else {
        yield put(actions.deleteHoldingAreaListingSuccess(payload.sku));
      }
    } catch (err) {
      yield put(
        appActions.apiCallFailed("Error! Unable to delete holding area listing")
      );
      logError(err, {
        tags: {
          exceptionType: actions.DELETE_HOLDING_AREA_LISTING_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* tryAddingHoldingAreaItemToBatch() {
  yield takeLatest(actions.TRY_ADDING_HOLDING_AREA_ITEM_TO_BATCH, function*(payload) {
    try {
      let {listing} = payload;
      let isHoldingAreaListing = true;
      yield put(actions.updateCurrentListingWorkflowOptions("isHoldingAreaListing", isHoldingAreaListing));
      yield put(actions.tryAddingItemToBatch(listing, isHoldingAreaListing));
    } catch (err) {
      console.log(err)
      yield put(
        appActions.apiCallFailed("Failed to add holding area item to batch.")
      );
      logError(err, {
        tags: {
          exceptionType: "TRY_ADDING_HOLDING_AREA_ITEM_TO_BATCH_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}


export default function* rootSaga() {
  yield all([
    fork(getHoldings),
    fork(sendToHoldings),
    fork(deleteHoldingAreaListing),
    fork(bulkSendToHoldingArea),
    fork(createHoldingAreaShipment),
    fork(tryAddingHoldingAreaItemToBatch)
  ]);
}
