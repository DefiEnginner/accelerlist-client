import { all, takeLatest, put, fork, call } from 'redux-saga/effects';
import {
	getMembershipAPI,
	updateMembershipBillingAPI,
	cancelMembershipAPI,
	restartMembershipAPI,
	cardReplacementMembershipAPI } from '../../helpers/membership_apis'

import actions from './actions'
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* FetchMembershipRequest() {
    yield takeLatest('FETCH_MEMBERSHIP', function* () {

        try {
            const membership = yield call(getMembershipAPI)
            if (membership.status === 200 && membership.data.data) {
              yield put(actions.fetchMembershipSuccess(JSON.parse(membership.data.data)))
            }
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch membership api error"));
          logError(error, {
            tags: {
              exceptionType: "FETCH_MEMBERSHIP_ERROR"
            }
          });
        }
    })
}

export function* UpdateMembershipBillingRequest() {
  yield takeLatest('UPDATE_MEMBERSHIP_BILLING', function* (payload) {

      const {
        newMembershipBilling
      } = payload;

      try {
      yield put(actions.setCardReplacementRequestToExecution())
      const response = yield call(updateMembershipBillingAPI, newMembershipBilling)
      if (response.status === 200 && !response.data.error) {
        const successMessage = (
          `Card replacement Successful!
          Your new card is ${response.data.brand} ending in ${response.data.last4}`
        )
        yield put(actions.updateMembershipBillingSuccess(successMessage))
      }
      if (response.status !== 200 || response.data.error) {
        yield put(actions.updateMembershipBillingFailure(response.data.error))
      }
      } catch (error) {
        yield put(appActions.apiCallFailed("Error! Updatem membership billing api error"));
        yield put(actions.setCardReplacementRequestToComplete());
        logError(error, {
          tags: {
            exceptionType: "UPDATE_MEMBERSHIP_BILLING_ERROR"
          }
        });
      }
  })
}

export function* UpdateMembershipBillingSuccess() {
  yield takeLatest('UPDATE_MEMBERSHIP_BILLING_SUCCESS', function* (payload) {
    const { successMessage } = payload;
    try {
      yield put(appActions.apiCallUserSuccess(successMessage));
      yield put(actions.fetchMembership())
      yield put(actions.setCardReplacementRequestToComplete())
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Unable to do membership request"));
      logError(error, {
        tags: {
          exceptionType: "UPDATE_MEMBERSHIP_BILLING_ERROR"
        }
      });
    }
  })
}

export function* UpdateMembershipBillingFailure() {
  yield takeLatest('UPDATE_MEMBERSHIP_BILLING_FAILURE', function* (payload) {
    const { failureMessage } = payload;
    try {
      yield put(appActions.apiCallUserError(failureMessage));
      yield put(actions.setCardReplacementRequestToComplete())
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Unable to show membership alert"));
      logError(error, {
        tags: {
          exceptionType: "UPDATE_MEMBERSHIP_BILLING_ERROR"
        }
      });
    }
  })
}

export function* CancelMembershipRequest() {
    yield takeLatest('CANCEL_MEMBERSHIP', function* () {

        try {
            const membership = yield call(cancelMembershipAPI)
            if (membership.status === 200 && !membership.data.error) {
              yield put(actions.cancelMembershipSuccess())
			} else {
              yield put(actions.cancelMembershipFailed(membership.data.error))
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch membership api error"));
          logError(error, {
            tags: {
              exceptionType: "CANCEL_MEMBERSHIP_ERROR"
            }
          });
        }
    })
}

export function* RestartMembershipRequest() {
    yield takeLatest('RESTART_MEMBERSHIP', function* () {

        try {
            const membership = yield call(restartMembershipAPI)
            if (membership.status === 200 && !membership.data.error) {
              yield put(actions.restartMembershipSuccess())
			} else {
              yield put(actions.restartMembershipFailed(membership.data.error))
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch membership api error"));
          logError(error, {
            tags: {
              exceptionType: "RESTART_MEMBERSHIP_ERROR"
            }
          });
        }
    })
}

export function* CardReplacementMembershipRequest() {
    yield takeLatest('CARD_REPLACEMENT_MEMBERSHIP', function* (payload) {
		const { data } = payload;
        try {
            const membership = yield call(cardReplacementMembershipAPI, data)
            if (membership.status === 200 && !membership.data.error) {
              yield put(actions.cardReplacementMembershipSuccess())
			} else {
              yield put(actions.cardReplacementMembershipFailed(membership.data.error))
			}
        } catch (error) {
          yield put(appActions.apiCallFailed("Error! Fetch membership api error"));
          logError(error, {
            tags: {
              exceptionType: "CARD_REPLACE_MEMBERSHIP_ERROR"
            }
          });
        }
    })
}

export default function* rootSaga() {
    yield all([
        fork(FetchMembershipRequest),
        fork(UpdateMembershipBillingRequest),
        fork(UpdateMembershipBillingSuccess),
        fork(UpdateMembershipBillingFailure),
        fork(CancelMembershipRequest),
        fork(RestartMembershipRequest),
		fork(CardReplacementMembershipRequest),
    ])
}
