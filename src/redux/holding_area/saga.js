import { all, takeLatest, put, fork, call } from "redux-saga/effects";

import {
	deleteHoldingAreaListingsInBulk
} from "../../helpers/holding_area_apis";

import actions from "./actions";
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* DeleteHoldingAreaItemsInBulk() {
  yield takeLatest("HOLDING_AREA_BULK_DELETE", function*(payload) {
    try {
      const { data } = payload;
      const deleteItems = yield call(deleteHoldingAreaListingsInBulk, data);
      if (deleteItems.status === 200 && !deleteItems.data.error) {
		  yield put(actions.deleteHoldingAreaInBulkSuccess());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "HOLDING_AREA_BULK_DELETE_ERROR"
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(DeleteHoldingAreaItemsInBulk),
  ]);
}
