import {
  all,
  takeLatest,
  takeEvery,
  put,
  fork,
  call,
  select,
} from "redux-saga/effects";
import Papa from "papaparse";
import { logError } from "../../../helpers/utility";
import {
  postProductsFeedToAmazonAPI,
  getBatchProductsFeedAPI,
} from "../../../helpers/batch/apis";

import {
  generateInventoryLoaderData,
} from "../../../helpers/batch/utility";

import appActions from "../../app/actions";
import actions from "../actions";
import { batchIdSelector } from "../selector";

export function* submitProductFeed() {
  yield takeLatest(actions.SUBMIT_PRODUCT_FEED, function*(payload) {
    try {
      let exportableData = generateInventoryLoaderData(
        payload.products,
        payload.batchMetadata.channel
      );
      let feedData = Papa.unparse(JSON.stringify(exportableData), {
        delimiter: "\t",
        header: true,
        skipEmptyLines: false
      });
      let redirectToFeedPage = payload.redirectToFeedPage;
      let batchId = payload.batchMetadata.id;
      let shipmentName = payload.batchMetadata.batchName;
      let fulfillmentCenter = "N/A";
      let qty = payload.products
        .map(product => product.qty)
        .reduce((a, b) => a + b, 0);
      let numSkus = payload.products.length;
      let shouldCompleteBatch = false;
      console.log(payload.batchMetadata, "batchmetadata");
      if (payload.batchMetadata.workflowType === "live") {
        shouldCompleteBatch = true;
      }

      if (
        payload.batchMetadata.workflowType === "private" &&
        payload.batchMetadata.channel === "DEFAULT"
      ) {
        shouldCompleteBatch = true;
      }

      let data = {
        feedData,
        batchId,
        shipmentName,
        fulfillmentCenter,
        qty,
        numSkus,
        shouldCompleteBatch
      };

      const response = yield call(postProductsFeedToAmazonAPI, data);
      const responseData = response.data;
      if (responseData.error) {
        yield put(actions.submitProductFeedFailure());
      } else {
        yield put(
          actions.submitProductFeedSuccess(responseData.product_feed_submission)
        );
        if (redirectToFeedPage) {
          yield put(actions.setCurrentFlow("product_feed_display"));
        }
      }
    } catch (err) {
      yield put(
        appActions.apiCallFailed("Error! Unable to submit product feed")
      );
      logError(err, {
        tags: {
          exceptionType: actions.SUBMIT_PRODUCT_FEED_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* getProductFeedStatus() {
  yield takeEvery(actions.GET_PRODUCT_FEED_STATUS, function*(payload) {
    try {
      const response = yield call(getBatchProductsFeedAPI, payload.feedIds);
      yield put(actions.getProductFeedStatusSuccess(response.data));
    } catch (err) {
      yield put(
        appActions.apiCallFailed("Error! Unable to fetch product feed status")
      );
      logError(err, {
        tags: {
          exceptionType: "GET_PRODUCT_FEED_STATUS_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(submitProductFeed),
    fork(getProductFeedStatus),
  ]);
}
