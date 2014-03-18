const settingsActions = {
  FETCH_LISTING_DEFAULTS: "FETCH_LISTING_DEFAULTS",
  FETCH_LISTING_DEFAULTS_SUCCESS: "FETCH_LISTING_DEFAULTS_SUCCESS",

  SAVE_LISTING_DEFAULTS: "SAVE_LISTING_DEFAULTS",

  FETCH_PRINTER_DEFAULTS: "FETCH_PRINTER_DEFAULTS",
  FETCH_PRINTER_DEFAULTS_SUCCESS: "FETCH_PRINTER_DEFAULTS_SUCCESS",

  SAVE_PRINTER_DEFAULTS: "SAVE_PRINTER_DEFAULTS",
  SAVE_PRINTER_DEFAULTS_ERROR: "SAVE_PRINTER_DEFAULTS_ERROR",

  UPDATE_USER_PASSWORD_REQUEST: "UPDATE_USER_PASSWORD_REQUEST",
  UPDATE_USER_PASSWORD_REQUEST_SUCCESS: "UPDATE_USER_PASSWORD_REQUEST_SUCCESS",
  UPDATE_USER_PASSWORD_REQUEST_FAILURE: "UPDATE_USER_PASSWORD_REQUEST_FAILURE",
  UPDATE_USER_PASSWORD_REQUEST_STATUS: "UPDATE_USER_PASSWORD_REQUEST_STATUS",

  CLOSE_SETTINGS_ALERT: "CLOSE_SETTINGS_ALERT",
  SHOW_SETTINGS_ALERT: "SHOW_SETTINGS_ALERT",

  FETCH_SUPPLIER_LIST: "FETCH_SUPPLIER_LIST",
  FETCH_SUPPLIER_LIST_SUCCESS: "FETCH_SUPPLIER_LIST_SUCCESS",

  ADD_SUPPLIER_TO_LIST: "ADD_SUPPLIER_TO_LIST",
  ADD_SUPPLIER_TO_LIST_SUCCESS: "ADD_SUPPLIER_TO_LIST_SUCCESS",

  DEL_SUPPLIER_FROM_LIST: "DEL_SUPPLIER_FROM_LIST",
  DEL_SUPPLIER_FROM_LIST_SUCCESS: "DEL_SUPPLIER_FROM_LIST_SUCCESS",

  EDIT_SUPPLIER_FROM_LIST: "EDIT_SUPPLIER_FROM_LIST",
  EDIT_SUPPLIER_FROM_LIST_SUCCESS: "EDIT_SUPPLIER_FROM_LIST_SUCCESS",

  UPLOAD_PROFILE_IMAGE: "UPLOAD_PROFILE_IMAGE",
  UPLOAD_PROFILE_IMAGE_SUCCESS: "UPLOAD_PROFILE_IMAGE_SUCCESS",
  UPLOAD_PROFILE_IMAGE_ERROR: "UPLOAD_PROFILE_IMAGE_ERROR",
  GET_PROFILE_IMAGE: "GET_PROFILE_IMAGE",
  GET_PROFILE_IMAGE_SUCCESS: "GET_PROFILE_IMAGE_SUCCESS",
  GET_PROFILE_IMAGE_ERROR: "GET_PROFILE_IMAGE_ERROR",
  GET_PROFILE_BILLING_DATA: 'GET_PROFILE_BILLING_DATA',
  GET_PROFILE_BILLING_DATA_SUCCESS: 'GET_PROFILE_BILLING_DATA_SUCCESS',

	SETTINGS_UPDATE_USER_DATA: "SETTINGS_UPDATE_USER_DATA",
	SETTINGS_UPDATE_USER_DATA_SUCCESS: "SETTINGS_UPDATE_USER_DATA_SUCCESS",
	SETTINGS_UPDATE_USER_DATA_ERROR: "SETTINGS_UPDATE_USER_DATA_ERROR",

	SETTINGS_UPDATE_USER_SETTINGS: "SETTINGS_UPDATE_USER_SETTINGS",
	SETTINGS_UPDATE_USER_SETTINGS_SUCCESS: "SETTINGS_UPDATE_USER_SETTINGS_SUCCESS",
	SETTINGS_UPDATE_USER_SETINGS_ERROR: "SETTINGS_UPDATE_USER_SETTINGS_ERROR",

  FETCH_SCOUT_LIST: "FETCH_SCOUT_LIST",
  FETCH_SCOUT_LIST_SUCCESS: "FETCH_SCOUT_LIST_SUCCESS",

  ADD_SCOUT_TO_LIST: "ADD_SCOUT_TO_LIST",
  ADD_SCOUT_TO_LIST_SUCCESS: "ADD_SCOUT_TO_LIST_SUCCESS",

  DEL_SCOUT_FROM_LIST: "DEL_SCOUT_FROM_LIST",
  DEL_SCOUT_FROM_LIST_SUCCESS: "DEL_SCOUT_FROM_LIST_SUCCESS",

  EDIT_SCOUT_FROM_LIST: "EDIT_SCOUT_FROM_LIST",
  EDIT_SCOUT_FROM_LIST_SUCCESS: "EDIT_SCOUT_FROM_LIST_SUCCESS",

  fetchScoutList: () => ({
    type: settingsActions.FETCH_SCOUT_LIST,
  }),

  fetchScoutListSuccess: scoutList => ({
    type: settingsActions.FETCH_SCOUT_LIST_SUCCESS,
    scoutList
  }),

  addScoutToList: scoutName => ({
    type: settingsActions.ADD_SCOUT_TO_LIST,
     scoutName
  }),

  addScoutToListSuccess: scoutList => ({
    type: settingsActions.ADD_SCOUT_TO_LIST_SUCCESS,
    scoutList
  }),

  delScoutFromList: scoutId => ({
    type: settingsActions.DEL_SCOUT_FROM_LIST,
    scoutId
  }),

  delScoutFromListSuccess: scoutId => ({
    type: settingsActions.DEL_SCOUT_FROM_LIST_SUCCESS,
    scoutId
  }),

  editScoutFromList: (scoutId, newScoutName) => ({
    type: settingsActions.EDIT_SCOUT_FROM_LIST,
    scoutId,
    newScoutName
  }),

  editScoutFromListSuccess: (scoutId, newScoutName) => ({
    type: settingsActions.EDIT_SCOUT_FROM_LIST_SUCCESS,
    scoutId,
    newScoutName
  }),

	updateUserDataSettings: (data) => ({
		type: settingsActions.SETTINGS_UPDATE_USER_DATA,
		data,
	}),

	updateUserDataSettingsSuccess: () => ({
		type: settingsActions.SETTINGS_UPDATE_USER_DATA_SUCCESS,
	}),

	updateUserDataSettingsError: () => ({
		type: settingsActions.SETTINGS_UPDATE_USER_DATA_ERROR,
	}),

	updateUserSettings: (data) => ({
		type: settingsActions.SETTINGS_UPDATE_USER_SETTINGS,
		data,
	}),

	updateUserSettingsSuccess: () => ({
		type: settingsActions.SETTINGS_UPDATE_USER_SETTINGS_SUCCESS,
	}),

	updateUserSettingsError: () => ({
		type: settingsActions.SETTINGS_UPDATE_USER_SETTINGS_ERROR,
	}),

  fetchListingDefaults: () => ({
    type: settingsActions.FETCH_LISTING_DEFAULTS
  }),

  fetchListingDefaultsSuccess: listingDefaults => ({
    type: settingsActions.FETCH_LISTING_DEFAULTS_SUCCESS,
    listingDefaults
  }),

  saveListingDefaults: listingDefaults => ({
    type: settingsActions.SAVE_LISTING_DEFAULTS,
    listingDefaults
  }),

  fetchPrinterDefaults: () => ({
    type: settingsActions.FETCH_PRINTER_DEFAULTS,
  }),

  fetchPrinterDefaultsSuccess: printerDefaults => ({
    type: settingsActions.FETCH_PRINTER_DEFAULTS_SUCCESS,
    printerDefaults
  }),

  savePrinterDefaults: printerDefaults => ({
    type: settingsActions.SAVE_PRINTER_DEFAULTS,
    printerDefaults
  }),

  savePrinterDefaultsError: () => ({
    type: settingsActions.SAVE_PRINTER_DEFAULTS_ERROR,
  }),

  updateUserPassworsRequest: (oldPassword, newPassword, newPasswordConfirm) => ({
    type: settingsActions.UPDATE_USER_PASSWORD_REQUEST,
    oldPassword,
    newPassword,
    newPasswordConfirm
  }),

  updateUserPassworsRequestSuccess: (successMessage) => ({
    type: settingsActions.UPDATE_USER_PASSWORD_REQUEST_SUCCESS,
    successMessage
  }),

  updateUserPassworsRequestFailure: failureMessage => ({
    type: settingsActions.UPDATE_USER_PASSWORD_REQUEST_FAILURE,
    failureMessage
  }),

  closeSettingsAlert: () => ({
    type: settingsActions.CLOSE_SETTINGS_ALERT,
  }),

  showSettingsAlert: alert => ({
    type: settingsActions.SHOW_SETTINGS_ALERT,
    alert
  }),

  setUpdateUserPassworsRequestToExecution: () => ({
    type: settingsActions.UPDATE_USER_PASSWORD_REQUEST_STATUS,
    status: "execution"
  }),

  setUpdateUserPassworsRequestToComplete: () => ({
    type: settingsActions.UPDATE_USER_PASSWORD_REQUEST_STATUS,
    status: "complete"
  }),

  resetUpdateUserPassworsRequestStatus: () => ({
    type: settingsActions.UPDATE_USER_PASSWORD_REQUEST_STATUS,
    status: null
  }),

  fetchSupplierList: () => ({
    type: settingsActions.FETCH_SUPPLIER_LIST,
  }),

  fetchSupplierListSuccess: supplierList => ({
    type: settingsActions.FETCH_SUPPLIER_LIST_SUCCESS,
    supplierList
  }),

  addSupplierToList: supplierName => ({
    type: settingsActions.ADD_SUPPLIER_TO_LIST,
     supplierName
  }),

  addSupplierToListSuccess: supplierList => ({
    type: settingsActions.ADD_SUPPLIER_TO_LIST_SUCCESS,
    supplierList
  }),

  delSupplierFromList: supplierId => ({
    type: settingsActions.DEL_SUPPLIER_FROM_LIST,
    supplierId
  }),

  delSupplierFromListSuccess: supplierId => ({
    type: settingsActions.DEL_SUPPLIER_FROM_LIST_SUCCESS,
    supplierId
  }),

  editSupplierFromList: (supplierId, newSupplierName) => ({
    type: settingsActions.EDIT_SUPPLIER_FROM_LIST,
    supplierId,
    newSupplierName
  }),

  editSupplierFromListSuccess: (supplierId, newSupplierName) => ({
    type: settingsActions.EDIT_SUPPLIER_FROM_LIST_SUCCESS,
    supplierId,
    newSupplierName
  }),

  uploadProfileImage: file => ({
    type: settingsActions.UPLOAD_PROFILE_IMAGE,
    file
  }),

  uploadProfileImageSuccess: data => ({
    type: settingsActions.UPLOAD_PROFILE_IMAGE_SUCCESS,
    data
  }),

  getProfileImage: () => ({
    type: settingsActions.GET_PROFILE_IMAGE,
  }),

  getProfileImageSuccess: data => ({
    type: settingsActions.GET_PROFILE_IMAGE_SUCCESS,
    data
  }),

  getProfileBillingData: () => ({
    type: settingsActions.GET_PROFILE_BILLING_DATA,
  }),

  getProfileBillingDataSuccess: data => ({
    type: settingsActions.GET_PROFILE_BILLING_DATA_SUCCESS,
    data
  }),

}

export default settingsActions;
