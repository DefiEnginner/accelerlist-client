import {
    all,
    takeLatest,
    put,
    fork,
    call
} from 'redux-saga/effects';

import {
    getSavedAddresses,
    createAddress,
    deleteAddress
} from '../../helpers/apis'
import actions from './actions'
import { logError } from "../../helpers/utility";

export function* addressListRequest() {
    yield takeLatest(actions.ADDRESS_LIST_REQUEST, function* () {

        try {
            const addressList = yield call(getSavedAddresses)
            console.log('success', addressList)
            yield put(actions.fetchAddressListSuccess(addressList))
        } catch (error) {
            yield put(actions.fetchAddressListError());
            logError(error, {
                tags: {
                    exceptionType: actions.ADDRESS_LIST_ERROR
                }
            });
        }
    })
}

export function* createAddressRequest() {
    yield takeLatest(actions.ADDRESS_SAVE_REQUEST, function* (payload) {
        const addressData = payload.addressPayload;
        const formId = payload.formId;

        try {
            const addressResponse = yield call(createAddress, addressData)
            yield put(actions.createAddressSuccess(addressData, addressResponse));
            document.getElementById(formId).reset();
        } catch (error) {
            yield put(actions.createAddressError());
            logError(error, {
              tags: {
                  exceptionType: actions.ADDRESS_SAVE_ERROR
              }
          });
        }
    })
}

export function* deleteAddressRequest() {
    yield takeLatest(actions.ADDRESS_DELETE_REQUEST, function* (payload) {

        const {
            addressId
        } = payload;

        try {
            yield call(deleteAddress, addressId);
            yield put(actions.deleteAddressSuccess(addressId));
        } catch (error) {
            yield put(actions.deleteAddressError());
            logError(error, {
              tags: {
                  exceptionType: actions.ADDRESS_DELETE_ERROR
              }
          });
        }
    })
}

export default function* rootSaga() {
    yield all([
        fork(addressListRequest),
        fork(createAddressRequest),
        fork(deleteAddressRequest)
    ])
}