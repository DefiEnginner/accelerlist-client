import { all, takeLatest, put, fork, call } from "redux-saga/effects";

import { bFrontItemListedCountAPI } from "../../helpers/apis";

import actions from "./actions";

export function* FetchbFrontItemListedCount() {
  yield takeLatest(actions.FETCH_INVENTORY_ITEMS_COUNT, function*() {
    try {
  	  const count = yield call(bFrontItemListedCountAPI);
	  yield put(actions.bFrontItemListedCountSuccess(count.count))
    } catch (error) {
		console.log(error);
		//if api issue
		yield put(actions.bFrontItemListedCountSuccess(6258954))
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(FetchbFrontItemListedCount)
  ]);
}
