import { all, takeLatest, put, fork, call } from 'redux-saga/effects';
import {
	adminReseUserPasswordAPI,
	adminSearchUserAPI,
	adminSearchUserUsersPerMarketplaceAPI,
	adminSearchUserUsersErrorLogsAPI,
	adminUserChangeTokenAPI,
	adminBatchStatsAPI,
} from '../../helpers/apis'

import actions from './actions'
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* ChangeUserPassword() {
    yield takeLatest('CHANGE_USER_PASSWORD', function* (payload) {
        const { data } = payload;
        try {
            const response = yield call(adminReseUserPasswordAPI, data)
            if (response.status === 200 && !response.data.error) {
              yield put(actions.changeUserPasswordSuccess())
			} else {
				yield put(actions.changeUserPasswordFailure());
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch admin data api error"));
          yield put(actions.changeUserPasswordFailure());
          logError(error, {
            tags: {
              exceptionType: "CHANGE_USER_PASSWORD_ERROR"
            }
          });
        }
    })
}

export function* SearchUser() {
    yield takeLatest('SEARCH_USER', function* (payload) {
        const { data } = payload;
        try {
            const response = yield call(adminSearchUserAPI, data)
            if (response.status === 200 && !response.data.error) {
              yield put(actions.searchUserSuccess(response.data.data))
			} else {
				yield put(actions.searchUserFailure());
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch admin data api error"));
          yield put(actions.searchUserFailure());
          logError(error, {
            tags: {
              exceptionType: "SEARCH_USER_ERROR"
            }
          });
        }
    })
}

export function* SearchUsersPerMarketplace() {
    yield takeLatest('SEARCH_USERS_PER_MARKETPLACE', function* (payload) {
        try {
            const response = yield call(adminSearchUserUsersPerMarketplaceAPI)
            if (response.status === 200 && !response.error) {
              yield put(actions.searchUsersPerMarketplaceSuccess(response.data.data))
			} else {
				yield put(actions.searchUsersPerMarketplaceFailure());
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch admin data users per marketplace api error"));
          yield put(actions.searchUsersPerMarketplaceFailure());
          logError(error, {
            tags: {
              exceptionType: "SEARCH_USERS_PER_MARKETPLACE_ERROR"
            }
          });
        }
    })
}

export function* SearchUsersErrorLogs() {
    yield takeLatest('SEARCH_USERS_ERRORLOGS', function* (payload) {
        try {
            const response = yield call(adminSearchUserUsersErrorLogsAPI)
            if (response.status === 200 && !response.error) {
              yield put(actions.searchUsersErrorlogsSuccess(response.data.data))
			} else {
				yield put(actions.searchUsersErrorlogsFailure());
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch admin data users error logs api error"));
          yield put(actions.searchUsersErrorlogsFailure());
          logError(error, {
            tags: {
              exceptionType: "SEARCH_USERS_ERRORLOGS_ERROR"
            }
          });
        }
    })
}

export function* userUpdateAuthToken() {
    yield takeLatest('USER_AUTH_TOKEN_UPDATE', function* (payload) {
        const { data } = payload;
        try {
            const response = yield call(adminUserChangeTokenAPI, data)
            if (response.status === 200 && !response.data.error) {
              yield put(actions.userTokenUpdateSuccess())
			} else {
				yield put(actions.userTokenUpdateFailure());
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch admin data api error"));
          yield put(actions.userTokenUpdateFailure());
          logError(error, {
            tags: {
              exceptionType: "ADMIN_USER_UPDATE_TOKEN_ERROR"
            }
          });
        }
    })
}

export function* getBatchStats() {
    yield takeLatest('BATCH_STATS', function* (payload) {
        try {
            const response = yield call(adminBatchStatsAPI)
            if (response.status === 200 && !response.data.error) {
              yield put(actions.batchStatsSuccess(response.data))
			} else {
				yield put(actions.batchStatsFailure());
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch admin data api error"));
          yield put(actions.batchStatsFailure());
          logError(error, {
            tags: {
              exceptionType: "ADMIN_BATCH_STATS_ERROR"
            }
          });
        }
    })
}

export default function* rootSaga() {
    yield all([
        fork(ChangeUserPassword),
        fork(SearchUser),
		fork(SearchUsersPerMarketplace),
		fork(SearchUsersErrorLogs),
		fork(userUpdateAuthToken),
		fork(getBatchStats),
    ])
}
