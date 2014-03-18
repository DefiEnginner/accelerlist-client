import { all, takeLatest, put, fork, call } from "redux-saga/effects";

import {
	deleteBatchAPI,
	getBatchListAPI,
	getBatchHistoryStatsAPI,
} from "../../helpers/batch/apis";

import actions from "./actions";
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";


export function* batchListRequest() {
  yield takeLatest("BATCH_LIST_REQUEST", function*(payload) {
    const { requestObject } = payload;
    try {
      let batchList = [];
      let result;
      result = yield call(() =>
        getBatchListAPI(requestObject)
      );
      if (result.error) {
        throw new Error(result.error);
      }
      batchList = result.data;
      yield put(actions.fetchBatchListSuccess(batchList));
    } catch (error) {
      yield put(actions.fetchBatchListError(error));
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.BATCH_LIST_ERROR
        }
      });
    }
  });
}

export function* deleteBatchRequest() {
  yield takeLatest("BATCH_DELETE_REQUEST", function*(payload) {
    const { batchIds, requestObject } = payload;

    try {
      yield call(deleteBatchAPI, batchIds);
      let result = yield call(() =>
        getBatchListAPI(requestObject)
      );
      if (result.error) {
        throw new Error(result.error);
      }
      yield put(actions.fetchBatchListSuccess(result.data));
      yield put({
        type: actions.BATCH_DELETE_SUCCESS,
        batchIds
      });
    } catch (error) {
      yield put({
        type: actions.BATCH_DELETE_ERROR,
        batchIds
      });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.BATCH_DELETE_ERROR
        }
      });
    }
  });
}

export function* getBatchHistoryStatsRequest() {
  yield takeLatest("BATCH_HISTORY_STATS", function*(payload) {
    try {
      const response = yield call(getBatchHistoryStatsAPI);
      if (response.error) {
        yield actions.getBatchHistoryStatsError();
      } else {
	      yield put(actions.getBatchHistoryStatsSuccess(response.data));
	  }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching batch api error"));
    }
  });
}

export default function* rootSaga() {
	yield all([
		fork(batchListRequest),
		fork(deleteBatchRequest),
		fork(getBatchHistoryStatsRequest),
	]);
}
