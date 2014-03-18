import {
  all,
  takeLatest,
  takeEvery,
  put,
  fork,
  call,
  select
} from "redux-saga/effects";
import { logError } from "../../../helpers/utility";
import {
  createNewSupplierAPI,
  updateListingDefaultsDataAPI,
} from "../../../helpers/batch/apis";

import {
  mapListingDefaultFieldToBackendModel,
} from "../../../helpers/batch/utility";

import appActions from "../../app/actions";
import actions from "../actions";
import {
  batchListingDefaultsSelector,
  batchMetadataSelector,
  batchIdSelector,
} from "../selector";

export function* _updateListingDefaultsDatafunction(payload) {
  try {
    const batchMetadata = yield select(batchMetadataSelector);
    const batchId = batchMetadata.id;
    const { fieldValue, fieldName } = payload;
    let data = {};
    let mappedFieldname = mapListingDefaultFieldToBackendModel(fieldName);
    data[mappedFieldname] = fieldValue;
    // Optimistically update - even if the API update failed
    yield put(
      actions.updateListingDefaultsDataSuccess(fieldName, fieldValue)
    );
    yield call(updateListingDefaultsDataAPI, batchId, data);
    if (fieldName === "condition") {
      const { gradingOptions } = yield select(batchListingDefaultsSelector);
      if (!gradingOptions) {
        if (fieldValue === "NoDefault") {
          yield put(appActions.apiCallUserWarning("Grading options will be turned ON due to NoDefault (Speed Mode will be disabled)"));
        } else if (!fieldValue) {
          yield put(appActions.apiCallUserWarning("Grading options will be turned ON due to removal of default condition (Speed Mode will be disabled)"));
        }
        if (!fieldValue || fieldValue === "NoDefault") {
          yield put(actions.updateListingDefaultsData("gradingOptions", true));
        }
      }
    } else if (fieldName === "listPriceRuleType" && (fieldValue === "" || fieldValue === "own-price")) {
      const { pricingOptions } = yield select(batchListingDefaultsSelector);
      if (!pricingOptions) {
        yield put(appActions.apiCallUserWarning("Pricing options will be turned ON (Speed Mode will be disabled)"));
        yield put(actions.updateListingDefaultsData("pricingOptions", true));
      }
    }
  } catch (err) {
    logError(err, {
      tags: {
        exceptionType: actions.UPDATE_LISTING_DEFAULTS_DATA_FAILURE,
        batchId: yield select(batchIdSelector),
      }
    });
  }
}

export function* updateListingDefaultsData() {
  yield takeEvery(actions.UPDATE_LISTING_DEFAULTS_DATA, _updateListingDefaultsDatafunction);
}

export function* createSupplierRequest() {
  yield takeLatest(actions.CREATE_NEW_SUPPLIER_REQUEST, function*(payload) {
    try {
      const { supplierData } = payload;
      const response = yield call(createNewSupplierAPI, supplierData);
      yield put({
        type: actions.CREATE_NEW_SUPPLIER_SUCCESS,
        supplierData: response.data
      });
    } catch (err) {
      yield put({
        type: actions.CREATE_NEW_SUPPLIER_FAILURE
      });
      yield put(appActions.apiCallFailed("Error!  api error"));
      logError(err, {
        tags: {
          exceptionType: "CREATE_NEW_SUPPLIER_REQUEST_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* incrementSKUNumber() {
  yield takeLatest(actions.INCREMENT_SKU_NUMBER, function*(payload) {
    try {
      const { skuNumber } = payload;
      const batchMetadata = yield select(batchMetadataSelector);
      const batchId = batchMetadata.id;
      let data = {};
      let mappedFieldname = mapListingDefaultFieldToBackendModel("skuNumber");
      let incrementedSkuNumber = (parseInt(skuNumber, 10) || 0) + 1;
      data[mappedFieldname] = incrementedSkuNumber;
      // Optimistically update - even if the API update failed
      yield put(
        actions.updateListingDefaultsDataSuccess(
          "skuNumber",
          incrementedSkuNumber
        )
      );
      yield call(updateListingDefaultsDataAPI, batchId, data);
    } catch (err) {
      logError(err, {
        tags: {
          exceptionType: "INCREMENT_SKU_NUMBER_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateListingDefaultsData),
    fork(createSupplierRequest),
    fork(incrementSKUNumber),
  ]);
}
