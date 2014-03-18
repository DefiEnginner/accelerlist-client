import {
  all,
  takeLatest,
  takeEvery,
  put,
  fork,
  call,
  select
} from "redux-saga/effects";
import { push } from "react-router-redux";
import { logError } from "../../../helpers/utility";
import {
  createNewBatchAPI,
  getBatchDataAPI,
  getSupplierListAPI,
  getScoutListAPI,
  completeBatchApi,
	funnyFacebookShareAPI,
} from "../../../helpers/batch/apis";

import appActions from "../../app/actions";
import actions from "../actions";
import {
  batchIdSelector,
  batchMetadataSelector,
} from "../selector";
import { openInNewTab } from '../../../helpers/utility';

export function* createBatchRequest() {
  yield takeLatest(actions.CREATE_NEW_BATCH_REQUEST, function*(payload) {
    try {
      const response = yield call(createNewBatchAPI, payload.batchData);
      yield put({
        type: actions.CREATE_NEW_BATCH_SUCCESS,
        batchId: response.data.batchId
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_NEW_BATCH_ERROR
      });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(err, {
        tags: {
          exceptionType: actions.CREATE_NEW_BATCH_ERROR
        }
      });
    }
  });
}

export function* createBatchSuccess() {
  yield takeEvery(actions.CREATE_NEW_BATCH_SUCCESS, function*(payload) {
    yield put(push("/dashboard/batch/" + payload.batchId));
  });
}

export function* loadBatch() {
  yield takeLatest(actions.LOAD_BATCH, function*(payload) {
    try {
      yield put(actions.clearBatch());
      const response = yield call(getBatchDataAPI, payload.batchId);
      if (response.data.error) {
        yield put(appActions.apiCallFailed("Error! That batch wasn't found!"));
        return;
      }
      const responseSupplier = yield call(getSupplierListAPI);
      const responseScout = yield call(getScoutListAPI);
      let batchMetadata = response.data.batch_metadata,
        products = response.data.products,
        productFeedSubmissions = response.data.product_feed_submissions,
        suppliers = responseSupplier,
        scouts = responseScout,
        shipmentIdToCurrentBoxMapping =
          response.data.shipment_id_to_current_box_mapping,
        shipmentIdToBoxCountMapping =
          response.data.shipment_id_to_box_count_mapping,
        conditionNotes = response.data.condition_notes,
        listingDefaults = response.data.listing_defaults;

      yield put(
        actions.loadBatchSuccess(
          batchMetadata,
          products,
          productFeedSubmissions,
          suppliers,
		  scouts,
          shipmentIdToCurrentBoxMapping,
          shipmentIdToBoxCountMapping,
          conditionNotes,
          listingDefaults
        )
      );
    } catch (err) {
      // @TODO: Add action to handle failure scenario
      yield put({
        type: actions.LOAD_BATCH_FAILURE
      });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(err, {
        tags: {
          exceptionType: actions.LOAD_BATCH_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* completeBatch() {
  yield takeEvery(actions.COMPLETE_BATCH, function*(payload) {
    try {
      const batchMetadata = yield select(batchMetadataSelector);
      const batchId = batchMetadata.id;
      const response = yield call(completeBatchApi, batchId);
      if (!response.error) {
        yield put({
          type: actions.COMPLETE_BATCH_SUCCESS,
          batchId
        });
      } else {
        appActions.apiCallFailed(
          `Error! Failed to complete batch: ${response.error}`
        );
      }
    } catch (err) {
      yield put(appActions.apiCallFailed("Error! Failed to complete batch"));
      logError(err, {
        tags: {
          exceptionType: "COMPLETE_BATCH_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* completeBatchSuccess() {
  yield takeEvery(actions.COMPLETE_BATCH_SUCCESS, function*(payload) {
    try {
      yield put(push("/dashboard/history?tab=completed"));
    } catch (err) {
      yield put(appActions.apiCallFailed("Error! Failed to redirect"));
      logError(err, {
        tags: {
          exceptionType: "COMPLETE_BATCH_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* funnyFacebookShare() {
  yield takeEvery(actions.FACEBOOK_SHARE, function*(payload) {
    try {
      const response = yield call(funnyFacebookShareAPI, payload.data);
      if (!response.error) {
			actions.facebookShareSuccess(response.public_url);
			let url = "https://www.facebook.com/sharer/sharer.php?u="+response.public_url+"&quote=Check%20out%20my%20batch%20statistics%20from%20AccelerList%21%20%20You%20too%20can%20make%20money%20on%20Amazon%2C%20click%20on%20the%20image%20to%20sign%20up%20today.";
		    openInNewTab(url);
      } else {
			actions.facebookShareError();
      }
    } catch (err) {
		yield put(appActions.apiCallFailed("Error! Facebook share failed"));
      logError(err, {
        tags: {
          exceptionType: "FACEBOOK_SHARE_ERROR",
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(createBatchRequest),
    fork(createBatchSuccess),
    fork(loadBatch),
    fork(completeBatch),
    fork(completeBatchSuccess),
	fork(funnyFacebookShare),
  ]);
}
