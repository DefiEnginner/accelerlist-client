const addressActions = {
    
    ADDRESS_LIST_REQUEST: 'ADDRESS_LIST_REQUEST',
    ADDRESS_LIST_SUCCESS: 'ADDRESS_LIST_SUCCESS',
    ADDRESS_LIST_ERROR: 'ADDRESS_LIST_ERROR',

    ADDRESS_SAVE_REQUEST: 'ADDRESS_SAVE_REQUEST',
    ADDRESS_SAVE_SUCCESS: 'ADDRESS_SAVE_SUCCESS',
    ADDRESS_SAVE_ERROR: 'ADDRESS_SAVE_ERROR',

    ADDRESS_DELETE_REQUEST: 'ADDRESS_DELETE_REQUEST',
    ADDRESS_DELETE_SUCCESS: 'ADDRESS_DELETE_SUCCESS',
    ADDRESS_DELETE_ERROR: 'ADDRESS_DELETE_ERROR',
  
    fetchAdressList: () => ({
      type: addressActions.ADDRESS_LIST_REQUEST,
    }),

    fetchAddressListSuccess: (addressList) => ({
      type: addressActions.ADDRESS_LIST_SUCCESS,
      addressList
    }),

    fetchAddressListError: () => ({
      type: addressActions.ADDRESS_LIST_ERROR,
    }),
    
    createAddress: (addressPayload, formId) => ({
      type: addressActions.ADDRESS_SAVE_REQUEST,
      addressPayload,
      formId
    }),

    createAddressSuccess: (addressData, addressResponse) => ({
      type: addressActions.ADDRESS_SAVE_SUCCESS,
      address: {
          ...addressData,
          id: addressResponse.address.id
      }
    }),

    createAddressError: () => ({
      type: addressActions.ADDRESS_DELETE_ERROR
    }),

    deleteAddress: addressId => ({
      type: addressActions.ADDRESS_DELETE_REQUEST,
      addressId
    }),

    deleteAddressSuccess: addressId => ({
      type: addressActions.ADDRESS_DELETE_SUCCESS,
      addressId: addressId
    }),

    deleteAddressError: () => ({
      type: addressActions.ADDRESS_DELETE_ERROR
    })

  }
  export default addressActions
  