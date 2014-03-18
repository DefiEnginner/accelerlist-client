import { all, takeLatest, put, fork, call } from "redux-saga/effects";

import {
  addUserTagAPI,
  getUserTagAPI,
} from "../../../helpers/settings_apis";

import actions from "./actions";
import appActions from "../../app/actions";
import { logError } from "../../../helpers/utility";

export function* AddUserTag() {
  yield takeLatest("USER_TAG_ADD", function*(payload) {
    const {
		userTags,
     } = payload;
    try {
      const response = yield call(addUserTagAPI, userTags);
      if (response.status === 200 && response.data.status === 'success') {
        yield put(
          actions.addUserTagSuccess(userTags)
        );
      } else {
        console.log(response)
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Add user tag error!"));
      logError(error, {
        tags: {
          exceptionType: "ADD_USER_TAG_ERROR"
        }
      });
    }
  });
}

export function* DeleteUserTag() {
  yield takeLatest("USER_TAG_DELETE", function*(payload) {
    const {
		userTags,
     } = payload;
    try {
      const response = yield call(addUserTagAPI, userTags);
      if (response.status === 200 && response.data.status === 'success') {
        yield put(
          actions.deleteUserTagSuccess(userTags)
        );
      } else {
        console.log(response)
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Delete user tag error!"));
      logError(error, {
        tags: {
          exceptionType: "DELETE_USER_TAG_ERROR"
        }
      });
    }
  });
}

export function* GetUserTag() {
  yield takeLatest("USER_TAG_GET", function*(payload) {
    try {
      const response = yield call(getUserTagAPI);
      if (response.status === 200 && response.data.status === 'success') {
        yield put(
          actions.getUserTagSuccess(response.data.data['custom_sku_tags'])
        );
      } else {
        yield put(
          actions.getUserTagSuccess("")
        );
        console.log(response)
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Get user tag error!"));
      logError(error, {
        tags: {
          exceptionType: "GET_USER_TAG_ERROR"
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(AddUserTag),
    fork(DeleteUserTag),
    fork(GetUserTag),
  ])
}
