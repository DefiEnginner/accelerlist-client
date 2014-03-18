import { all, takeLatest, put, fork, call } from "redux-saga/effects";

import { getLeaderboardAPI } from "../../helpers/apis";

import actions from "./actions";
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* getLeaderboard() {
  yield takeLatest(actions.GET_LEADERBOARD, function*() {
    try {
		const response = yield call(getLeaderboardAPI);
		if(!response.data.error){
			  yield put(actions.getLeaderboardSuccess(response.data.leaderboard));
		} else {
			yield put(actions.getLeaderboardError());
		}
    } catch (error) {
		yield put(appActions.apiCallFailed("Error! Leaderboard api error"));
		logError(error, {
			tags: {
	          exceptionType: "LEADERBOARD_GET_ERROR"
		    }
	      });
    }
  });
}

export default function* leaderboardSaga() {
  yield all([
    fork(getLeaderboard)
  ]);
}
