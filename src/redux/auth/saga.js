import {
  all,
  takeEvery,
  takeLatest,
  put,
  fork,
  call
} from "redux-saga/effects";
import { push } from "react-router-redux";
import LogRocket from "logrocket";

import { clearToken, logError } from "../../helpers/utility";
import {
  loginAPI,
  adminLoginAPI,
  getUserInternationalizationConfigAPI,
  refreshTokenAPI,
  getUserAPI,
  signupAPI,
  verifyCredentialAPI,
  requestPassswordResetApi,
  updatePassswordApi
} from "../../helpers/apis";
import actions from "./actions";
import appActions from "../app/actions";
import { User } from "../../models/User";

export function* loginRequest() {
  yield takeLatest("LOGIN_REQUEST", function*(payload) {
    const authData = payload.authData;

    try {
      const user = yield call(loginAPI, authData);
      let expDate = new Date();
      let expMins = 1;
      expDate.setMinutes(expDate.getMinutes() + expMins);

      if (user.data.error) {
        yield put(appActions.apiCallFailed("Error! " + user.data.error));
        yield put({ type: actions.LOGIN_ERROR });
      } else {
        yield put({
          type: actions.LOGIN_SUCCESS,
          access_token: user.data.access_token,
          refresh_token: user.data.refresh_token,
          expires_in: expMins
        });
        yield put(push("/dashboard/home"));
      }
    } catch (error) {
      yield put({ type: actions.LOGIN_ERROR });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.LOGIN_ERROR
        }
      });
    }
  });
}

export function* adminLoginRequest() {
  yield takeLatest("ADMIN_LOGIN_REQUEST", function*(payload) {
    const authData = payload.authData;

    try {
      const user = yield call(adminLoginAPI, authData);
      let expDate = new Date();
      let expMins = 1;
      expDate.setMinutes(expDate.getMinutes() + expMins);

      if (user.data.error) {
        yield put(appActions.apiCallFailed("Error! " + user.data.error));
        yield put({ type: actions.LOGIN_ERROR });
      } else {
        yield put({
          type: actions.LOGIN_SUCCESS,
          access_token: user.data.access_token,
          refresh_token: user.data.refresh_token,
          expires_in: expMins
        });
      }
      yield put(push("/dashboard/home"));
    } catch (error) {
      yield put({ type: actions.LOGIN_ERROR });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.LOGIN_ERROR
        }
      });
    }
  });
}

export function* signupRequest() {
  yield takeLatest("SIGNUP_REQUEST", function*(payload) {
    const userData = payload.userData;

    try {
      const response = yield call(signupAPI, userData);

      if (response.error !== null) {
        yield put({ type: actions.SIGNUP_ERROR });
        yield put(
          appActions.apiCallFailed(
            "Error! Failed to sign up for account. Error: " + response.error
          )
        );
      } else {
        const { user } = response;
        yield put({
          type: actions.SIGNUP_SUCCESS,
          user
        });


		/*
        let authData = {
          username_or_email: userData.username,
          password: userData.password
        };

        yield put({
          type: actions.LOGIN_REQUEST,
          authData
		});
		*/
        yield put(push("/thankyou"));
      }
    } catch (error) {
      yield put({ type: actions.SIGNUP_ERROR });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.SIGNUP_ERROR
        }
      });
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield localStorage.setItem("access_token", payload.access_token);
    yield localStorage.setItem("refresh_token", payload.refresh_token);
    yield localStorage.setItem("expires_in", payload.expires_in);
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*(payload) {
	clearToken();
    yield put(push(payload.redirect || "/"));
  });
}

export function* refreshToken() {
  yield takeLatest(actions.REFRESH_TOKEN_REQUEST, function*(payload) {
	console.log(payload);
    try {
      if (!localStorage.getItem("refresh_token")) {
        throw Error("Refresh token not found")
	  }
      const response = yield call(refreshTokenAPI);
      let expDate = new Date();
      let expMins = 1;
      expDate.setMinutes(expDate.getMinutes() + expMins);

      if (!response.access_token) {
        throw Error(response.message)
      }

      yield put({
        type: actions.REFRESH_TOKEN_SUCCESS,
        access_token: response.access_token,
        expires_in: expDate
	  });
	  if(payload){
		yield put({
			type: actions.GET_USER_REQUEST,
		});
		  //yield put(actions.getUserInternationalizationConfig());
	  }
    } catch (error) {
      yield put({ type: actions.REFRESH_TOKEN_ERROR });
      yield put(actions.logout("/signin"));
      logError(error, {
        tags: {
          exceptionType: actions.REFRESH_TOKEN_ERROR
        }
      });
    }
  });
}

export function* getUserInternationalizationConfig() {
  yield takeEvery(
    actions.GET_USER_INTERNATIONALIZATION_CONFIG_REQUEST,
    function*() {
      try {
        const response = yield call(getUserInternationalizationConfigAPI);

        yield put({
          type: actions.GET_USER_INTERNATIONALIZATION_CONFIG_REQUEST_SUCCESS,
          config: response
        });
      } catch (error) {
        yield put({
          type: actions.GET_USER_INTERNATIONALIZATION_CONFIG_REQUEST_ERROR
        });
        logError(error, {
          tags: {
            exceptionType: actions.GET_USER_INTERNATIONALIZATION_CONFIG_REQUEST_ERROR
          }
        });
      }
    }
  );
}

export function* refresthTokenSuccess() {
  yield takeEvery(actions.REFRESH_TOKEN_SUCCESS, function*(payload) {
    yield localStorage.setItem("access_token", payload.access_token);
    yield localStorage.setItem("expires_in", payload.expires_in);
  });
}

export function* getUserRequest() {
  yield takeLatest("GET_USER_REQUEST", function*() {
    try {
      const response = yield call(getUserAPI);

      yield put({
        type: actions.GET_USER_SUCCESS,
        userData: response
      });
    } catch (error) {
      yield put({ type: actions.GET_USER_ERROR });
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.GET_USER_ERROR
        }
      });
    }
  });
}

export function* getUserSuccess() {
  yield takeEvery("GET_USER_SUCCESS", function*(payload) {
    const {
      username,
      business_name,
      phone,
      email,
      seller_id,
      auth_token,
      marketplace_id,
      role,
	  trial_remaining,
	  user_settings,
		plan,
		lifetime_user,
    } = payload.userData;

    if(process.env.REACT_APP_LOG_ROCKET_ENV === 'production') LogRocket.identify(payload.userData.username, {
      name: payload.userData.username,
      email: payload.userData.email
    });

    if (
      payload.userData.marketplace_id &&
      payload.userData.seller_id &&
      payload.userData.auth_token
    ) {
      yield put({
        type: actions.CREDENTIAL_VERIFIED,
        userData: new User(
          username,
          business_name,
          email,
          phone,
          seller_id,
          auth_token,
          marketplace_id,
          role,
		  trial_remaining,
			user_settings,
			plan,
			lifetime_user
        )
      });
      yield put({
        type: actions.CREDENTIAL_VERIFY_SUCCESS,
        credentialData: new User(
          username,
          business_name,
          email,
          phone,
          seller_id,
          auth_token,
          marketplace_id
        )
      });
    } else {
      yield put({ type: actions.CREDENTIAL_NOT_VERIFIED });
      yield put({
		  type: actions.UPDATE_USER_DATA,
			userData: new User(
	          username,
		      business_name,
			  email,
	          phone,
		      seller_id,
			  auth_token,
	          marketplace_id,
		      role,
			  trial_remaining,
			  user_settings
		    )

		/*
        userData: new User(
          username,
          business_name,
          email,
          phone
		)
		*/
      });
    }
  });
}

export function* verifyCredentialRequest() {
  yield takeLatest("CREDENTIAL_VERIFY_REQUEST", function*(payload) {
    const credentialData = payload.credentialData;

    try {
      const verify = yield call(verifyCredentialAPI, credentialData);

      if (verify.error === null) {
        yield put({
          type: actions.CREDENTIAL_VERIFY_SUCCESS,
          credentialData
        });
      } else {
        yield put(appActions.apiCallFailed(verify.error));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Unexpected error happened. Please contact support."));
      logError(error, {
        tags: {
          exceptionType: actions.CREDENTIAL_VERIFY_ERROR
        }
      });
    }
  });
}

export function* verifyCredentialSuccess() {
  yield takeEvery(actions.CREDENTIAL_VERIFY_SUCCESS, function*() {
    yield localStorage.setItem("credentialVerified", true);
  });
}

export function* verifyCredentialError() {
  yield takeEvery(actions.CREDENTIAL_VERIFY_ERROR, function*() {
    yield localStorage.setItem("credentialVerified", false);
  });
}

export function* apiCallSuccess() {
  yield takeEvery(
    [
      actions.LOGIN_SUCCESS,
      actions.REFRESH_TOKEN_SUCCESS,
      actions.CREDENTIAL_VERIFY_SUCCESS,
      actions.GET_USER_SUCCESS
    ],
    function*() {}
  );
}

export function* apiSingupSuccess() {
  yield takeLatest(actions.SIGNUP_SUCCESS, function*(payload) {
    const { customer_id, email } = payload.user;
    yield window.$FPROM.trackSignup(
      {
        email: email,
        uid: customer_id
      },
      function(error) {
        if (error) {
          logError("Firstpromoter track signup error", error);
        }
      }
    );
  });
}

export function* passwordResetRequest() {
  yield takeLatest(actions.PASSWORD_RESET_REQUEST, function*(payload) {
    const { emailOrMobile } = payload;

    try {
      const passwordResetResponse = yield call(requestPassswordResetApi, emailOrMobile);

      if (passwordResetResponse.error) {
        yield put(appActions.apiCallFailed(passwordResetResponse.error));
      } else {
        yield put(actions.resetPasswordSuccess(passwordResetResponse.msg));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Unexpected error happened. Please contact support."));
      logError(error, {
        tags: {
          exceptionType: actions.PASSWORD_RESET_REQUEST_ERROR
        }
      });
    }
  })
}

export function* passwordUpdateRequest() {
  yield takeLatest(actions.PASSWORD_UPDATE_REQUEST, function*(payload) {
    const { updatePayload } = payload;
    try {
      const passwordUpdateResponse = yield call(updatePassswordApi, updatePayload);
      if (passwordUpdateResponse.error) {
        yield put(appActions.apiCallFailed(passwordUpdateResponse.error));
      } else {
        yield put(actions.resetPasswordSuccess("Password Updated"));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Unexpected error happened. Please contact support."));
      logError(error, {
        tags: {
          exceptionType: "PASSWORD_UPDATE_REQUEST_ERROR"
        }
      });
    }
  })
}

export function* redirectToOnboarding() {
  yield takeLatest(actions.REDIRECT_TO_ONBOARDING, function*(payload) {
	  yield put(push("/dashboard/onboarding"));
  });
}

export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(loginSuccess),
    fork(adminLoginRequest),
    fork(loginError),
    fork(refreshToken),
    fork(refresthTokenSuccess),
    fork(getUserRequest),
    fork(getUserSuccess),
    fork(getUserInternationalizationConfig),
    fork(logout),
    fork(signupRequest),
    fork(verifyCredentialRequest),
    fork(verifyCredentialSuccess),
    fork(verifyCredentialError),
    fork(apiCallSuccess),
    fork(passwordResetRequest),
    fork(passwordUpdateRequest),
    fork(apiSingupSuccess),
	fork(redirectToOnboarding),
  ]);
}
