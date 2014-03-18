import { all, takeLatest, put, fork, call } from "redux-saga/effects";

import {
  getListingDefaults,
  saveListingDefaults,
  getPrinterDefaults,
  savePrinterDefaults,
  updateUserPassword,
  bUplaodProfileImage,
  bGetProfileImage,
  bGetProfileBillingDataAPI,
  updateUserDataAPI,
  updateUserSettingsAPI,
} from "../../helpers/settings_apis";

import {
  getSupplierListAPI,
  createNewSupplierAPI,
  deleteSupplierAPI,
  editSupplierAPI,
  getScoutListAPI,
  createNewScoutAPI,
  deleteScoutAPI,
  editScoutAPI
} from "../../helpers/batch/apis";

import {
  getUserAPI,
  loginAPI
} from "../../helpers/apis";

import actions from "./actions";
import appActions from "../app/actions";
import authActions from "../auth/actions";
import { logError } from "../../helpers/utility";

export function* FetchListingDefaultRequest() {
  yield takeLatest("FETCH_LISTING_DEFAULTS", function*() {
    try {
      const listingDefaults = yield call(getListingDefaults);
      if (listingDefaults.status === 200 && listingDefaults.data.data) {
        yield put(
          actions.fetchListingDefaultsSuccess(listingDefaults.data.data)
        );
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "FETCH_LISTING_DEFAULTS_ERROR"
        }
      });
    }
  });
}

export function* SaveListingDefaultRequest() {
  yield takeLatest("SAVE_LISTING_DEFAULTS", function*(payload) {
    const { listingDefaults } = payload;

    try {
      const response = yield call(saveListingDefaults, listingDefaults);
      if (response.data.error === null) {
        yield put(actions.fetchListingDefaults());
      } else {
        console.log(response.data);
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "SAVE_LISTING_DEFAULTS_ERROR"
        }
      });
    }
  });
}

export function* FetchPrinterDefaultRequest() {
  yield takeLatest('FETCH_PRINTER_DEFAULTS', function* () {
    const errorMessage = "Error! Unable to fetch printer setttings";
    try {
      const printerDefaults = yield call(getPrinterDefaults)
      if (printerDefaults.status === 200 && printerDefaults.data) {
        yield put(actions.fetchPrinterDefaultsSuccess(printerDefaults.data))
      } else {
        yield put(appActions.apiCallFailed(errorMessage));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed(errorMessage));
      logError(error, {
        tags: {
          exceptionType: "FETCH_PRINTER_DEFAULTS_ERROR"
        }
      });
    }
  })
}

export function* SaveprinterDefaultRequest() {
  yield takeLatest('SAVE_PRINTER_DEFAULTS', function* (payload) {

    const {
      printerDefaults
    } = payload;
    const errorMessage = "Failed to save printer settings"

    try {
      const response = yield call(savePrinterDefaults, printerDefaults);
      if (response.data.error === null) {
        yield put(actions.fetchPrinterDefaults())
      } else {
        yield put(appActions.apiCallFailed(errorMessage));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed(errorMessage));
      yield put(actions.savePrinterDefaultsError());
      logError(error, {
        tags: {
          exceptionType: "SAVE_PRINTER_DEFAULTS_ERROR"
        }
      });
    }
  })
}

export function* UpdateUserPassworsRequest() {
  yield takeLatest("UPDATE_USER_PASSWORD_REQUEST", function*(payload) {
    const { oldPassword, newPassword, newPasswordConfirm } = payload;
    try {
      yield put(actions.setUpdateUserPassworsRequestToExecution());
      let updateUserPassworsRes = null;
      let userDataRes = null;
      let checkCurrentPasswordRes = null;

      userDataRes = yield call(getUserAPI);
      if (userDataRes) {
        const { username } = userDataRes;
        if (username) {
          checkCurrentPasswordRes = yield call(loginAPI, {
            username_or_email: username,
            password: oldPassword
          });
          console.log(checkCurrentPasswordRes)
          if (checkCurrentPasswordRes.data.access_token && checkCurrentPasswordRes.data.refresh_token) {
            updateUserPassworsRes = yield call(updateUserPassword, {
                password_2: newPasswordConfirm,
                password: newPassword
              });
            if (updateUserPassworsRes.data.error === null) {
              yield put(actions.updateUserPassworsRequestSuccess(updateUserPassworsRes.data.msg));
              yield put(actions.fetchListingDefaults());
            } else {
              yield put(actions.updateUserPassworsRequestFailure(updateUserPassworsRes.data.error));
            }
          } else {
            yield put(actions.updateUserPassworsRequestFailure(checkCurrentPasswordRes.data.error));
          }
        }
      }
    } catch (error) {
      yield put(actions.setUpdateUserPassworsRequestToComplete());
      yield put(appActions.apiCallFailed("Error! Update user passwors api error"));
      logError(error, {
        tags: {
          exceptionType: "UPDATE_USER_PASSWORD_REQUEST_ERROR"
        }
      });
    }
  });
}

export function* UpdateUserPassworsRequestSuccess() {
  yield takeLatest('UPDATE_USER_PASSWORD_REQUEST_SUCCESS', function* (payload) {
    const { successMessage } = payload;
    try {
      yield put(actions.setUpdateUserPassworsRequestToComplete());
      yield put(appActions.apiCallUserSuccess(successMessage));
    } catch (error) {
      logError(error, {
        tags: {
          exceptionType: "UPDATE_USER_PASSWORD_REQUEST_ERROR"
        }
      });
    }
  })
}

export function* UpdateUserPassworsRequestFailure() {
  yield takeLatest('UPDATE_USER_PASSWORD_REQUEST_FAILURE', function* (payload) {
    const { failureMessage } = payload;
    try {
      yield put(actions.setUpdateUserPassworsRequestToComplete());
      yield put(appActions.apiCallUserError(failureMessage));
    } catch (error) {
      logError(error, {
        tags: {
          exceptionType: "UPDATE_USER_PASSWORD_REQUEST_ERROR"
        }
      });
    }
  })
}

export function* FetchSupplierList() {
  yield takeLatest("FETCH_SUPPLIER_LIST", function*() {
    try {
      const response = yield call(getSupplierListAPI);
      yield put(
        actions.fetchSupplierListSuccess(response)
      );
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching SupplierList api error"));
      logError(error, {
        tags: {
          exceptionType: "FETCH_SUPPLIER_LIST_ERROR"
        }
      });
    }
  });
}

export function* AddSupplierToList() {
  yield takeLatest("ADD_SUPPLIER_TO_LIST", function*(payload) {
    const { supplierName } = payload;
    try {
      const response = yield call(createNewSupplierAPI, supplierName);
      if (response.status === 200 && response.data) {
        yield put(
          actions.addSupplierToListSuccess(response.data)
        );
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Add Supplier to List api error"));
      logError(error, {
        tags: {
          exceptionType: "ADD_SUPPLIER_TO_LIST_ERROR"
        }
      });
    }
  });
}

export function* DelSupplierFromList() {
  yield takeLatest("DEL_SUPPLIER_FROM_LIST", function*(payload) {
    const { supplierId } = payload;
    try {
      const response = yield call(deleteSupplierAPI, supplierId);
      if (response.status === 200) {
        yield put(
          actions.delSupplierFromListSuccess(supplierId)
        );
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Delete Supplier from List api error"));
      logError(error, {
        tags: {
          exceptionType: "DEL_SUPPLIER_FROM_LIST_ERROR"
        }
      });
    }
  });
}

export function* EditSupplierFromList() {
  yield takeLatest("EDIT_SUPPLIER_FROM_LIST", function*(payload) {
    const {
      supplierId,
      newSupplierName
     } = payload;
    try {
      const response = yield call(editSupplierAPI, supplierId, newSupplierName);
      if (response.status === 200 && response.data.error === null) {
        yield put(
          actions.editSupplierFromListSuccess(supplierId, newSupplierName)
        );
      } else {
        console.log(response)
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Edit Supplier from List api error"));
      logError(error, {
        tags: {
          exceptionType: "EDIT_SUPPLIER_FROM_LIST_ERROR"
        }
      });
    }
  });
}

export function* UploadUserProfileImage() {
  yield takeLatest('UPLOAD_PROFILE_IMAGE', function* (payload) {
    const { file } = payload;
    try {
      const data = new FormData();
      data.append('file', file);

		const response = yield call(bUplaodProfileImage, data);
      if (response.status === 'success' && response.data) {
        yield put(actions.uploadProfileImageSuccess(response.data));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Upload Transaction Report api error"));
      logError(error, {
        tags: {
          exceptionType: "UPLOAD_PROFILE_IMAGE_ERROR"
        }
      });
    }
  })
}

export function* GetUserProfileImage() {
  yield takeLatest('GET_PROFILE_IMAGE', function* (payload) {
    try {
		const response = yield call(bGetProfileImage);
      if (response.status === 'success' && response.data) {
        yield put(actions.getProfileImageSuccess(response.data));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Upload Transaction Report api error"));
      logError(error, {
        tags: {
          exceptionType: "GET_PROFILE_IMAGE_ERROR"
        }
      });
    }
  })
}

export function* GetUserProfileBillingData() {
  yield takeLatest('GET_PROFILE_BILLING_DATA', function* (payload) {
    try {
		const response = yield call(bGetProfileBillingDataAPI);
      if (response.exec === 'success' && response.data) {
        yield put(actions.getProfileBillingDataSuccess(response.data));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Upload Transaction Report api error"));
      logError(error, {
        tags: {
          exceptionType: "GET_PROFILE_BILLING_DATA_ERROR"
        }
      });
    }
  })
}

export function* updateUserData() {
  yield takeLatest('SETTINGS_UPDATE_USER_DATA', function* (payload) {
    try {
		const response = yield call(updateUserDataAPI, payload.data);
      if (response.status === 200 && !response.error) {
		  const response_user = yield call(getUserAPI);
	      yield put({
		    type: authActions.GET_USER_SUCCESS,
			userData: response_user
		  });
			yield put(actions.updateUserDataSettingsSuccess());
	  } else {
        yield put(actions.updateUserDataSettingsError());
	  }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Update user data api error!"+error));
        yield put(actions.updateUserDataSettingsError());
      logError(error, {
        tags: {
          exceptionType: "SETTINGS_UPDATE_USER_DATA_DATA_ERROR"
        }
      });
    }
  })
}

export function* updateUserSettingsData() {
  yield takeLatest('SETTINGS_UPDATE_USER_SETTINGS', function* (payload) {
    try {
		const response = yield call(updateUserSettingsAPI, payload.data);
      if (response.status === 200 && !response.error) {
        yield put(actions.updateUserSettingsSuccess());
      }
    } catch (error) {
      yield put(actions.updateUserSettingsError());
      yield put(appActions.apiCallFailed("Error! Update user settings api error!"));
      logError(error, {
        tags: {
          exceptionType: "SETTINGS_UPDATE_USER_SETTINGS_DATA_ERROR"
        }
      });
    }
  })
}

export function* FetchScoutList() {
  yield takeLatest("FETCH_SCOUT_LIST", function*() {
    try {
      const response = yield call(getScoutListAPI);
      yield put(
        actions.fetchScoutListSuccess(response)
      );
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching ScoutList api error"));
      logError(error, {
        tags: {
          exceptionType: "FETCH_SCOUT_LIST_ERROR"
        }
      });
    }
  });
}

export function* AddScoutToList() {
  yield takeLatest("ADD_SCOUT_TO_LIST", function*(payload) {
    const { scoutName } = payload;
    try {
      const response = yield call(createNewScoutAPI, scoutName);
      if (response.status === 200 && response.data) {
        yield put(
          actions.addScoutToListSuccess(response.data)
        );
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Add Scout to List api error"));
      logError(error, {
        tags: {
          exceptionType: "ADD_SCOUT_TO_LIST_ERROR"
        }
      });
    }
  });
}

export function* DelScoutFromList() {
  yield takeLatest("DEL_SCOUT_FROM_LIST", function*(payload) {
    const { scoutId } = payload;
    try {
      const response = yield call(deleteScoutAPI, scoutId);
      if (response.status === 200) {
        yield put(
          actions.delScoutFromListSuccess(scoutId)
        );
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Delete Scout from List api error"));
      logError(error, {
        tags: {
          exceptionType: "DEL_SCOUT_FROM_LIST_ERROR"
        }
      });
    }
  });
}

export function* EditScoutFromList() {
  yield takeLatest("EDIT_SCOUT_FROM_LIST", function*(payload) {
    const {
      scoutId,
      newScoutName
     } = payload;
    try {
      const response = yield call(editScoutAPI, scoutId, newScoutName);
      if (response.status === 200 && response.data.error === null) {
        yield put(
          actions.editScoutFromListSuccess(scoutId, newScoutName)
        );
      } else {
        console.log(response)
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Edit Scout from List api error"));
      logError(error, {
        tags: {
          exceptionType: "EDIT_SCOUT_FROM_LIST_ERROR"
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(FetchListingDefaultRequest),
    fork(SaveListingDefaultRequest),
    fork(FetchPrinterDefaultRequest),
    fork(SaveprinterDefaultRequest),
    fork(UpdateUserPassworsRequest),
    fork(UpdateUserPassworsRequestFailure),
    fork(UpdateUserPassworsRequestSuccess),
    fork(FetchSupplierList),
    fork(AddSupplierToList),
    fork(DelSupplierFromList),
    fork(EditSupplierFromList),
	fork(UploadUserProfileImage),
	fork(GetUserProfileImage),
	fork(GetUserProfileBillingData),
	fork(updateUserData),
	fork(updateUserSettingsData),
    fork(FetchScoutList),
    fork(AddScoutToList),
    fork(DelScoutFromList),
    fork(EditScoutFromList),
  ])
}
