import {
    Map
} from 'immutable/dist/immutable'
import actions from './actions'

const initState = new Map({
    addressList: null,
    addressListError: null,
    addressSaveError: null,
    addressDeleteError: null,
    loadingList: false,
    savingAddress: false,
    deletingId: null
})

export default function addressReducer(state = initState, action) {
    switch (action.type) {
        case actions.ADDRESS_LIST_REQUEST:
            return state
                .set('addressListError', null)
                .set('loadingList', true)
        case actions.ADDRESS_LIST_SUCCESS:
            console.log('success', action)
            return state
                .set('addressList', action.addressList)
                .set('addressListError', false)
                .set('loadingList', false)
        case actions.ADDRESS_LIST_ERROR:
            return state
                .set('addressListError', true)
                .set('loadingList', false)
        case actions.ADDRESS_SAVE_REQUEST:
            return state
                .set('addressSaveError', null)
                .set('savingAddress', true)
        case actions.ADDRESS_SAVE_SUCCESS:
            return state.update('addressList', (addressList) => {
                    const newAddress = [action.address];
                    if (addressList === null) {
                        return newAddress;
                    }
                    return newAddress.concat(addressList);
                })
                .set('addressSaveError', false)
                .set('savingAddress', false);
        case actions.ADDRESS_SAVE_ERROR:
            return state
                .set('addressSaveError', true)
                .set('savingAddress', false)
        case actions.ADDRESS_DELETE_REQUEST:
            return state
                .set('addressDeleteError', null)
                .set('deletingId', action.addressId)
        case actions.ADDRESS_DELETE_SUCCESS:
            return state
                .update('addressList', (addressList) => {
                    const deleteIndex = addressList.findIndex(address => {
                        return address.id === action.addressId;
                    });
                    if (deleteIndex > -1) {
                        return [
                            ...addressList.slice(0, deleteIndex),
                            ...addressList.slice(deleteIndex + 1)
                        ];
                    }
                    return addressList;
                })
                .set('addressDeleteError', false)
                .set('deletingId', null);
        case actions.ADDRESS_DELETE_ERROR:
            return state
                .set('addressDeleteError', true)
                .set('deletingId', null);
        default:
            return state
    }
}