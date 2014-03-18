import { all, takeEvery, takeLatest, put, fork, call } from 'redux-saga/effects';
import {
	getDashboardDataAPI,
	getDashboardSalesExpensesAPI
} from '../../helpers/dashboard_apis'

import actions from './actions'
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* FetchDashboardDataRequest() {
    yield takeEvery('FETCH_DASHBOARD_DATA', function* (payload) {

        try {
            let {
                stat,
                key,
                minTimestamp,
                maxTimestamp
            } = payload;
            let data = {
                stat,
                minTimestamp,
                maxTimestamp
            }
            yield put(actions.fetchDashboardDataStatus(key, false));
            const dashboard_data = yield call(getDashboardDataAPI, data);
            if (dashboard_data.status === 200 && dashboard_data.data) {
              yield put(actions.fetchDashboardDataSuccess(key, dashboard_data.data[stat]));
              yield put(actions.fetchDashboardDataStatus(key, true));
            }
        } catch (error) {
          const { key } = payload;
          yield put(appActions.apiCallFailed("Error! Fetch dashboard data api error"));
          yield put(actions.fetchDashboardDataStatus(key, false));
          logError(error, {
            tags: {
              exceptionType: "FETCH_DASHBOARD_DATA_ERROR"
            }
          });
        }
    })
}

export function* getSalesExpensesData() {
    yield takeLatest('GET_SALES_STATS', function* (payload) {
        try {
            const response = yield call(getDashboardSalesExpensesAPI)
            if (response.status === 200 && !response.data.error) {
              yield put(actions.getSalesStatsSuccess(response.data))
			} else {
				yield put(actions.getSalesStatsFailure());
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch dashboard sales data api error"));
          yield put(actions.getSalesStatsFailure());
          logError(error, {
            tags: {
              exceptionType: "FETCH_DASHBOARD_SALES_DATA_ERROR"
            }
          });
        }
    })
}

export default function* rootSaga() {
    yield all([
        fork(FetchDashboardDataRequest),
		fork(getSalesExpensesData),
    ])
}
