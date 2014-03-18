import { all, takeLatest, put, fork, call } from 'redux-saga/effects';
import { getAggregateDataAPI } from '../../helpers/stats_api'

import actions from './actions'
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* FetchAggregateDataRequest() {
    yield takeLatest('FETCH_AGGREGATE_DATA', function* (payload) {
        const { startRange, endRange } = payload;
        try {
            const aggregate_data = yield call(getAggregateDataAPI, startRange, endRange)
            if (aggregate_data.status === 200 && aggregate_data.data) {
              yield put(actions.fetchAggregateDataSuccess(aggregate_data.data))
            }
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch aggregate data api error"));
          yield put(actions.fetchAggregateDataFailure());
          logError(error, {
            tags: {
              exceptionType: "FETCH_AGGREGATE_DATA_ERROR"
            }
          });
        }
    })
}

export default function* rootSaga() {
    yield all([
        fork(FetchAggregateDataRequest),
    ])
}