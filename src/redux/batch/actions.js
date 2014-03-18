const batchActions = {
  //Actions for Batch Modal
  SHOW_BATCH_MODAL: "SHOW_BATCH_MODAL",
  HIDE_BATCH_MODAL: "HIDE_BATCH_MODAL",

  CREATE_NEW_BATCH_REQUEST: "CREATE_NEW_BATCH_REQUEST",
  CREATE_NEW_BATCH_SUCCESS: "CREATE_NEW_BATCH_SUCCESS",
  CREATE_NEW_BATCH_ERROR: "CREATE_NEW_BATCH_ERROR",

  CREATE_HOLDING_AREA_SHIPMENT: "CREATE_HOLDING_AREA_SHIPMENT",
  CREATE_HOLDING_AREA_SHIPMENT_SUCCESS: "CREATE_HOLDING_AREA_SHIPMENT_SUCCESS",
  CREATE_HOLDING_AREA_SHIPMENT_FAILURE: "CREATE_HOLDING_AREA_SHIPMENT_FAILURE",

  //Actions for Ship View Items Modal
  SET_CURRENT_SHIPMENT_PLANS: "SET_CURRENT_SHIPMENT_PLANS",

  UPDATE_CURRENT_LISTING_WORKFLOW_OPTIONS: "UPDATE_CURRENT_LISTING_WORKFLOW_OPTIONS",
  RESET_CURRENT_LISTING_WORKFLOW_OPTIONS: "RESET_CURRENT_LISTING_WORKFLOW_OPTIONS",

  //Actions for Batch others
  SET_CURRENT_FLOW: "SET_CURRENT_FLOW",
  RECEIVE_PRODUCT_SEARCH_RESULTS: "RECEIVE_PRODUCT_SEARCH_RESULTS",
  HANDLE_PRODUCT_SEARCH_QUERY_CHANGE: "HANDLE_PRODUCT_SEARCH_QUERY_CHANGE",
  CLEAR_SEARCH: "CLEAR_SEARCH",
  CLEAR_SEARCH_QUERY: "CLEAR_SEARCH_QUERY",
  CLEAR_CURRENT_WORKING_LISTING: "CLEAR_CURRENT_WORKING_LISTING",
  SELECT_PRODUCT_SEARCH_RESULT: "SELECT_PRODUCT_SEARCH_RESULT",
  SET_CURRENT_WORKING_LISTING: "SET_CURRENT_WORKING_LISTING",
  SET_CURRENT_FEED_STATUS: "SET_CURRENT_FEED_STATUS",
  INITIALIZE_CURRENT_WORKING_LISTING: "INITIALIZE_CURRENT_WORKING_LISTING",
  UPDATE_CURRENT_WORKING_LISTING: "UPDATE_CURRENT_WORKING_LISTING",
  ADD_CURRENT_WORKING_LISTING_TO_BATCH: "ADD_CURRENT_WORKING_LISTING_TO_BATCH",
  REQUEST_FULFILLMENT_CENTER_DATA: "REQUEST_FULFILLMENT_CENTER_DATA",
  RECEIVE_LIVE_BATCH_FULFILLMENT_CENTER_DATA: "RECEIVE_LIVE_BATCH_FULFILLMENT_CENTER_DATA",
  RECEIVE_PRIVATE_BATCH_FULFILLMENT_CENTER_DATA: "RECEIVE_PRIVATE_BATCH_FULFILLMENT_CENTER_DATA",
  INCREMENT_SKU_NUMBER: "INCREMENT_SKU_NUMBER",
  UPDATE_MODAL_DISPLAY: "UPDATE_MODAL_DISPLAY",
  CLOSE_MODAL: "CLOSE_MODAL",
  AUTO_ADD_ITEM_TO_BOX_CONTENTS: "AUTO_ADD_ITEM_TO_BOX_CONTENTS",

  REQUEST_PRODUCT_SEARCH_RESULTS: "REQUEST_PRODUCT_SEARCH_RESULTS",
  REQUEST_PRODUCT_SEARCH_RESULTS_FAILED: "REQUEST_PRODUCT_SEARCH_RESULTS_FAILED",

  SELECT_PRODUCT_SEARCH_RESULT_AND_INITIALIZE_CURRENT_WORKING_LISTING: "SELECT_PRODUCT_SEARCH_RESULT_AND_INITIALIZE_CURRENT_WORKING_LISTING",
  TRY_ADDING_ITEM_TO_BATCH: "TRY_ADDING_ITEM_TO_BATCH",
  TRY_ADDING_HOLDING_AREA_ITEM_TO_BATCH: "TRY_ADDING_HOLDING_AREA_ITEM_TO_BATCH",
  TRY_ADDING_ITEM_TO_LIVE_BATCH: "TRY_ADDING_ITEM_TO_LIVE_BATCH",
  TRY_ADDING_ITEM_TO_PRIVATE_BATCH: "TRY_ADDING_ITEM_TO_PRIVATE_BATCH",
  CANCEL_LISTING_CREATION_FLOW: "CANCEL_LISTING_CREATION_FLOW",
  ADD_INBOUND_SHIPMENT_PLANS: "ADD_INBOUND_SHIPMENT_PLANS",
  APPROVE_SHIPMENT_CREATION: "APPROVE_SHIPMENT_CREATION",
  APPROVE_SHIPMENT_CREATION_FAILURE: "APPROVE_SHIPMENT_CREATION_FAILURE",
  SET_LIVE_BATCH_FULFILLMENT_CENTER_DATA: "SET_LIVE_BATCH_FULFILLMENT_CENTER_DATA",
  SET_CURRENT_EDITABLE_LISTING: "SET_CURRENT_EDITABLE_LISTING",
  CLEAR_CURRENT_EDITABLE_LISTING: "CLEAR_CURRENT_EDITABLE_LISTING",
  SHOW_ALERT: "SHOW_ALERT",
  CLOSE_ALERT: "CLOSE_ALERT",

  UPDATE_LISTING_DEFAULTS_DATA: "UPDATE_LISTING_DEFAULTS_DATA",
  UPDATE_LISTING_DEFAULTS_DATA_SUCCESS: "UPDATE_LISTING_DEFAULTS_DATA_SUCCESS",
  UPDATE_LISTING_DEFAULTS_DATA_FAILURE: "UPDATE_LISTING_DEFAULTS_DATA_FAILURE",

  LOAD_BATCH: "LOAD_BATCH",
  CLEAR_BATCH: "CLEAR_BATCH",
  LOAD_BATCH_SUCCESS: "LOAD_BATCH_SUCCESS",
  LOAD_BATCH_FAILURE: "LOAD_BATCH_FAILURE",

  SAVE_LISTING: "SAVE_LISTING",
  SAVE_LISTING_SUCCESS: "SAVE_LISTING_SUCCESS",
  SAVE_LISTING_FAILURE: "SAVE_LISTING_FAILURE",

  UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_EDIT_LISTING: "UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_EDIT_LISTING",
  UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_DELETE_LISTING: "UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_DELETE_LISTING",
  EDIT_LISTING: "EDIT_LISTING",
  EDIT_LISTING_SUCCESS: "EDIT_LISTING_SUCCESS",
  EDIT_LISTING_FAILURE: "EDIT_LISTING_FAILURE",

  DELETE_LISTING: "DELETE_LISTING",
  DELETE_LISTING_SUCCESS: "DELETE_LISTING_SUCCESS",
  DELETE_LISTING_FAILURE: "DELETE_LISTING_FAILURE",

  SUBMIT_PRODUCT_FEED: "SUBMIT_PRODUCT_FEED",
  SUBMIT_PRODUCT_FEED_SUCCESS: "SUBMIT_PRODUCT_FEED_SUCCESS",
  SUBMIT_PRODUCT_FEED_FAILURE: "SUBMIT_PRODUCT_FEED_FAILURE",

  GET_PRODUCT_FEED_STATUS: "GET_PRODUCT_FEED_STATUS",
  GET_PRODUCT_FEED_STATUS_SUCCESS: "GET_PRODUCT_FEED_STATUS_SUCCESS",

  GET_PRICING_DATA: "GET_PRICING_DATA",
  GET_PRICING_DATA_SUCCESS: "GET_PRICING_DATA_SUCCESS",
  GET_PRICING_DATA_FAILURE: "GET_PRICING_DATA_FAILURE",

  APPLY_AUTO_PRICING_RULES: "APPLY_AUTO_PRICING_RULES",

  SEND_TO_HOLDING_AREA: "SEND_TO_HOLDING_AREA",
  SEND_TO_HOLDING_AREA_SUCCESS: "SEND_TO_HOLDING_AREA_SUCCESS",
  SEND_TO_HOLDING_AREA_FAILURE: "SEND_TO_HOLDING_AREA_FAILURE",

  BULK_SEND_TO_HOLDING_AREA: "BULK_SEND_TO_HOLDING_AREA",
  BULK_SEND_TO_HOLDING_AREA_SUCCESS: "BULK_SEND_TO_HOLDING_AREA_SUCCESS",
  BULK_SEND_TO_HOLDING_AREA_FAILURE: "BULK_SEND_TO_HOLDING_AREA_FAILURE",

  GET_HOLDINGS: "GET_HOLDINGS",
  GET_HOLDINGS_SUCCESS: "GET_HOLDINGS_SUCCESS",
  GET_HOLDINGS_FAILURE: "GET_HOLDINGS_FAILURE",

  DELETE_HOLDING_AREA_LISTING: "DELETE_HOLDING_AREA_LISTING",
  DELETE_HOLDING_AREA_LISTING_SUCCESS: "DELETE_HOLDING_AREA_LISTING_SUCCESS",
  DELETE_HOLDING_AREA_LISTING_FAILURE: "DELETE_HOLDING_AREA_LISTING_FAILURE",

  SET_SIDEBAR_TAB_ID: "SET_SIDEBAR_TAB_ID",
  SET_FNSKU: "SET_FNSKU",

  CREATE_NEW_SUPPLIER_REQUEST: "CREATE_NEW_SUPPLIER_REQUEST",
  CREATE_NEW_SUPPLIER_SUCCESS: "CREATE_NEW_SUPPLIER_SUCCESS",
  CREATE_NEW_SUPPLIER_FAILURE: "CREATE_NEW_SUPPLIER_FAILURE",
  ADD_BOX_INFO_FOR_SHIPMENT: "ADD_BOX_INFO_FOR_SHIPMENT",
  ADD_BOX_INFO_FOR_SHIPMENT_SUCCESS: "ADD_BOX_INFO_FOR_SHIPMENT_SUCCESS",
  ADD_BOX_INFO_FOR_SHIPMENT_FAILURE: "ADD_BOX_INFO_FOR_SHIPMENT_FAILURE",

  UPDATE_BOX_INFO_FOR_SHIPMENT: "UPDATE_BOX_INFO_FOR_SHIPMENT",
  UPDATE_BOX_INFO_FOR_SHIPMENT_SUCCESS: "UPDATE_BOX_INFO_FOR_SHIPMENT_SUCCESS",
  UPDATE_BOX_INFO_FOR_SHIPMENT_FAILURE: "UPDATE_BOX_INFO_FOR_SHIPMENT_FAILURE",

  CREATE_SHIPMENT_PLANS: "CREATE_SHIPMENT_PLANS",
  CREATE_SHIPMENT_PLANS_SUCCESS: "CREATE_SHIPMENT_PLANS_SUCCESS",
  CREATE_SHIPMENT_PLANS_FAILURE: "CREATE_SHIPMENT_PLANS_FAILURE",
  CREATE_SHIPMENT_PLANS_STATUS: "CREATE_SHIPMENT_PLANS_STATUS",

  CREATE_SHIPMENT: "CREATE_SHIPMENT",
  CREATE_SHIPMENT_SUCCESS: "CREATE_SHIPMENT_SUCCESS",
  CREATE_SHIPMENT_FAILURE: "CREATE_SHIPMENT_FAILURE",

  PRINT_LISTING: "PRINT_LISTING",

  GOTO_NEXT_PAGE: "GOTO_NEXT_PAGE",

  GOTO_PREVIOUS_PAGE: "GOTO_PREVIOUS_PAGE",

  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",

  COMPLETE_BATCH: "COMPLETE_BATCH",
  COMPLETE_BATCH_SUCCESS: "COMPLETE_BATCH_SUCCESS",

  UPDATE_CREATE_SHIPMENT_PLANS_REQUEST_STATUS: "UPDATE_CREATE_SHIPMENT_PLANS_REQUEST_STATUS",
  UPDATE_ADD_TO_BATCH_STATUS: "UPDATE_ADD_TO_BATCH_STATUS",

  UPDATE_KEY_VALUE: "UPDATE_KEY_VALUE",

  UPDATE_CALCULATED_PRICE: "UPDATE_CALCULATED_PRICE",
  UPDATE_CALCULATED_PRICE_SUCCESS: "UPDATE_CALCULATED_PRICE_SUCCESS",
  UPDATE_CALCULATED_PRICE_ERROR: "UPDATE_CALCULATED_PRICE_ERROR",

  REJECT_NEW_LIVE_BATCH_SHIPMENT: "REJECT_NEW_LIVE_BATCH_SHIPMENT",
  REJECT_NEW_LIVE_BATCH_SHIPMENT_ERROR: "REJECT_NEW_LIVE_BATCH_SHIPMENT_ERROR",

  SET_EXPANDING_ROWS_BATCH_LIST: "SET_EXPANDING_ROWS_BATCH_LIST",

  SET_SEARCH_RESULT_IS_EMPTY: "SET_SEARCH_RESULT_IS_EMPTY",

  SUSPEND_SPEED_MODE: "SUSPEND_SPEED_MODE",


	REJECT_SHIPMENT_PLANS: "REJECT_SHIPMENT_PLANS",
	REJECT_SHIPMENT_PLANS_SUCCESS: "REJECT_SHIPMENT_PLANS_SUCCESS",

	FACEBOOK_SHARE: 'FACEBOOK_SHARE',
	FACEBOOK_SHARE_SUCCESS: 'FACEBOOK_SHARE_SUCCESS',
	FACEBOOK_SHARE_ERROR: 'FACEBOOK_SHARE_ERROR',

	BATCH_METADATA_UPDATE: 'BATCH_METADATA_UPDATE',
	BATCH_METADATA_UPDATE_SUCCESS: 'BATCH_METADATA_UPDATE_SUCCESS',
	BATCH_METADATA_UPDATE_ERROR: 'BATCH_METADATA_UPDATE_ERROR',

	batchMetadataUpdate: (data) => ({
		type: batchActions.BATCH_METADATA_UPDATE,
		data
	}),
	batchMetadataUpdateSuccess: (data) => ({
		type: batchActions.BATCH_METADATA_UPDATE_SUCCESS,
		data
	}),
	batchMetadataUpdateError: (data) => ({
		type: batchActions.BATCH_METADATA_UPDATE_ERROR,
		data
	}),

	facebookShare: (data) => ({
		type: batchActions.FACEBOOK_SHARE,
		data
	}),
	facebookShareSuccess: (data) => ({
		type: batchActions.FACEBOOK_SHARE_SUCCESS,
		data
	}),
	facebookShareError: () => ({
		type: batchActions.FACEBOOK_SHARE_ERROR,
	}),


  rejectShipmentPlans: (batchId) => ({
	  type: batchActions.REJECT_SHIPMENT_PLANS,
	  batchId
  }),
  rejectShipmentPlansSuccess: () => ({
	type: batchActions.REJECT_SHIPMENT_PLANS_SUCCESS,
  }),

  updateKeyValue: (fieldName, fieldValue) => ({
    type: batchActions.UPDATE_KEY_VALUE,
    fieldName,
    fieldValue
  }),

  updateAddToBatchStatus: (status) => ({
    type: batchActions.UPDATE_ADD_TO_BATCH_STATUS,
    status
  }),

  showAlert: (title, text, error2) => ({
    type: batchActions.SHOW_ALERT,
    alert: {
      title,
	  text,
	  error2,
    }
  }),

  closeAlert: () => ({
    type: batchActions.CLOSE_ALERT
  }),

  loadBatch: batchId => ({
    type: batchActions.LOAD_BATCH,
    batchId
  }),

  clearBatch: () => ({
    type: batchActions.CLEAR_BATCH
  }),

  loadBatchSuccess: (
    batchMetadata,
    products,
    productFeedSubmissions,
    suppliers,
	scouts,
    shipmentIdToCurrentBoxMapping,
    shipmentIdToBoxCountMapping,
    conditionNotes,
    listingDefaults
  ) => ({
    type: batchActions.LOAD_BATCH_SUCCESS,
    batchMetadata,
    products,
    productFeedSubmissions,
	suppliers,
	scouts,
    shipmentIdToCurrentBoxMapping,
    shipmentIdToBoxCountMapping,
    conditionNotes,
    listingDefaults
  }),

  loadBatchFailure: () => ({
    type: batchActions.LOAD_BATCH_FAILURE
  }),

  showBatchModal: () => ({
    type: batchActions.SHOW_BATCH_MODAL
  }),

  hideBatchModal: () => ({
    type: batchActions.HIDE_BATCH_MODAL
  }),

  createNewBatch: batchData => ({
    type: batchActions.CREATE_NEW_BATCH_REQUEST,
    batchData
  }),

  setCurrentFlow: currentFlow => ({
    type: batchActions.SET_CURRENT_FLOW,
    currentFlow
  }),

  receiveProductSearchResults: searchResults => ({
    type: batchActions.RECEIVE_PRODUCT_SEARCH_RESULTS,
    searchResults
  }),

  handleProductSearchQueryChange: query => ({
    type: batchActions.HANDLE_PRODUCT_SEARCH_QUERY_CHANGE,
    query
  }),

  clearSearch: () => ({
    type: batchActions.CLEAR_SEARCH
  }),

  clearSearchQuery: () => ({
    type: batchActions.CLEAR_SEARCH_QUERY
  }),

  clearCurrentWorkingListing: () => ({
    type: batchActions.CLEAR_CURRENT_WORKING_LISTING
  }),

  selectProductSearchResult: searchResult => ({
    type: batchActions.SELECT_PRODUCT_SEARCH_RESULT,
    searchResult
  }),

  initializeCurrentWorkingListing: () => ({
    type: batchActions.INITIALIZE_CURRENT_WORKING_LISTING
  }),

  updateCurrentWorkingListingData: (fieldName, fieldValue, isApplyConverter = true) => ({
    type: batchActions.UPDATE_CURRENT_WORKING_LISTING,
    fieldName,
    fieldValue,
    isApplyConverter
  }),

  updateListingDefaultsData: (fieldName, fieldValue) => ({
    type: batchActions.UPDATE_LISTING_DEFAULTS_DATA,
    fieldName,
    fieldValue
  }),

  updateListingDefaultsDataSuccess: (fieldName, fieldValue) => ({
    type: batchActions.UPDATE_LISTING_DEFAULTS_DATA_SUCCESS,
    fieldName,
    fieldValue
  }),

  updateListingDefaultsDataFailure: () => ({
    type: batchActions.UPDATE_LISTING_DEFAULTS_DATA_FAILURE
  }),

  saveListing: (
    listing,
    shipmentIdToCurrentBoxMapping,
    shipmentIdToBoxCountMapping,
    skuNumber,
    isHoldingAreaListing
  ) => ({
    type: batchActions.SAVE_LISTING,
    listing,
    shipmentIdToCurrentBoxMapping,
    shipmentIdToBoxCountMapping,
    skuNumber,
    isHoldingAreaListing
  }),

  saveListingSuccess: (
    listing,
    skuNumber,
    isHoldingAreaListing
  ) => ({
    type: batchActions.SAVE_LISTING_SUCCESS,
    listing,
    skuNumber,
    isHoldingAreaListing
  }),

  saveListingFailure: () => ({
    type: batchActions.SAVE_LISTING_FAILURE
  }),

  updateInboundShipmentQuantityAndEditListing: (
    listing,
    qtyIncreased,
    isHoldingAreaListing
  ) => ({
    type: batchActions.UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_EDIT_LISTING,
    listing,
    qtyIncreased,
    isHoldingAreaListing
  }),

  updateInboundShipmentQuantityAndDeleteListing: (listing, batchMetadata) => ({
    type: batchActions.UPDATE_INBOUND_SHIPMENT_QUANTITY_AND_DELETE_LISTING,
    listing,
    batchMetadata
  }),

  editListing: (
    batchId,
    listing,
    qtyIncreased,
    isHoldingAreaListing
  ) => ({
    type: batchActions.EDIT_LISTING,
    batchId,
    listing,
    qtyIncreased,
    isHoldingAreaListing
  }),

  editListingSuccess: (
    listing,
    qtyIncreased,
  ) => ({
    type: batchActions.EDIT_LISTING_SUCCESS,
    listing,
    qtyIncreased,
  }),

  editListingFailure: () => ({
    type: batchActions.EDIT_LISTING_FAILURE
  }),

  deleteListing: (batchId, listing) => ({
    type: batchActions.DELETE_LISTING,
    batchId,
    listing
  }),

  deleteListingSuccess: sku => ({
    type: batchActions.DELETE_LISTING_SUCCESS,
    sku
  }),

  deleteListingFailure: () => ({
    type: batchActions.DELETE_LISTING_FAILURE
  }),

  requestFulfillmentCenterData: () => ({
    type: batchActions.REQUEST_FULFILLMENT_CENTER_DATA
  }),

  receivePrivateBatchFulfillmentCenterData: (
    listing,
    fnsku,
    skuNumber,
    isHoldingAreaListing
  ) => ({
    type: batchActions.RECEIVE_PRIVATE_BATCH_FULFILLMENT_CENTER_DATA,
    listing,
    fnsku,
    skuNumber,
    isHoldingAreaListing
  }),

  setFNSKU: fnsku => ({
    type: batchActions.SET_FNSKU,
    fnsku
  }),

  incrementSKUNumber: (skuNumber) => ({
    type: batchActions.INCREMENT_SKU_NUMBER,
    skuNumber
  }),

  updateModalDisplay: (modalName) => ({
    type: batchActions.UPDATE_MODAL_DISPLAY,
    modalName: modalName
  }),

  closeModal: () => ({
    type: batchActions.CLOSE_MODAL
  }),

  setCurrentShipmentPlans: shipmentPlans => ({
    type: batchActions.SET_CURRENT_SHIPMENT_PLANS,
    shipmentPlans
  }),

  autoAddItemToBoxContents: (
    boxContents,
    shipmentIdToCurrentBoxMapping,
    shipmentIdToBoxCountMapping
  ) => ({
    type: batchActions.AUTO_ADD_ITEM_TO_BOX_CONTENTS,
    boxContents,
    shipmentIdToCurrentBoxMapping,
    shipmentIdToBoxCountMapping
  }),

  addInboundShipmentPlans: inboundShipmentPlans => ({
    type: batchActions.ADD_INBOUND_SHIPMENT_PLANS,
    inboundShipmentPlans
  }),

  addCurrentWorkingListingToBatch: () => ({
    type: batchActions.ADD_CURRENT_WORKING_LISTING_TO_BATCH
  }),

  setLiveBatchFulfillmentCenterData: fulfillmentCenterData => ({
    type: batchActions.SET_LIVE_BATCH_FULFILLMENT_CENTER_DATA,
    fulfillmentCenterData
  }),

  setCreateShipmentPlansRequestStatusToComplete: () => ({
    type: batchActions.UPDATE_CREATE_SHIPMENT_PLANS_REQUEST_STATUS,
    status: "complete"
  }),

  resetCreateShipmentPlansRequestStatus: () => ({
    type: batchActions.UPDATE_CREATE_SHIPMENT_PLANS_REQUEST_STATUS,
    status: ""
  }),

  setCreateShipmentPlansRequestStatusToExecution: () => ({
    type: batchActions.UPDATE_CREATE_SHIPMENT_PLANS_REQUEST_STATUS,
    status: "execution"
  }),

  setAllBatchListingRowsExpanded: (expandedState) => ({
    type: batchActions.SET_EXPANDING_ROWS_BATCH_LIST,
    allBatchListingRowsExpanded: expandedState
  }),

  setSearchResultIsEmpty: status => ({
    type: batchActions.SET_SEARCH_RESULT_IS_EMPTY,
    status
  }),

  /* Saga related actions BELOW */

  requestProductSearchResults: (query, channel, existingProducts) => ({
    type: batchActions.REQUEST_PRODUCT_SEARCH_RESULTS,
    query,
    channel,
    existingProducts,
  }),

  requestProductSearchResultsFailed: () => ({
    type: batchActions.REQUEST_PRODUCT_SEARCH_RESULTS_FAILED,
  }),

  selectProductSearchResultAndInitializeListing: (
    searchResult,
    channel,
    existingProducts,
  ) => ({
    type: batchActions.SELECT_PRODUCT_SEARCH_RESULT_AND_INITIALIZE_CURRENT_WORKING_LISTING,
    searchResult,
    channel,
    existingProducts,
  }),

  tryAddingItemToBatch: (
    listing,
    isHoldingAreaListing
  ) => ({
    type: batchActions.TRY_ADDING_ITEM_TO_BATCH,
    listing,
    isHoldingAreaListing
  }),

  tryAddingHoldingAreaItemToBatch: (
    listing,
  ) => ({
    type: batchActions.TRY_ADDING_HOLDING_AREA_ITEM_TO_BATCH,
    listing,
  }),

  tryAddingItemToLiveBatch: (
    listing,
    isHoldingAreaListing
  ) => ({
    type: batchActions.TRY_ADDING_ITEM_TO_LIVE_BATCH,
    listing,
    isHoldingAreaListing
  }),

  tryAddingItemToPrivateBatch: (
    listing,
    isHoldingAreaListing
  ) => ({
    type: batchActions.TRY_ADDING_ITEM_TO_PRIVATE_BATCH,
    listing,
    isHoldingAreaListing
  }),

  approveShipmentCreation: () => ({
    type: batchActions.APPROVE_SHIPMENT_CREATION,
  }),

  approveShipmentCreationFailure: () => ({
    type: batchActions.APPROVE_SHIPMENT_CREATION_FAILURE
  }),

  receiveLiveBatchFulfillmentCenterData: (
    listing,
    fulfillmentCenterData,
    skuNumber,
    isHoldingAreaListing
  ) => ({
    type: batchActions.RECEIVE_LIVE_BATCH_FULFILLMENT_CENTER_DATA,
    listing,
    fulfillmentCenterData,
    skuNumber,
    isHoldingAreaListing
  }),

  cancelListingCreationflow: () => ({
    type: batchActions.CANCEL_LISTING_CREATION_FLOW
  }),

  submitProductFeed: (products, batchMetadata, redirectToFeedPage) => ({
    type: batchActions.SUBMIT_PRODUCT_FEED,
    products,
    batchMetadata,
    redirectToFeedPage
  }),

  submitProductFeedSuccess: productFeedSubmission => ({
    type: batchActions.SUBMIT_PRODUCT_FEED_SUCCESS,
    productFeedSubmission
  }),

  submitProductFeedFailure: () => ({
    type: batchActions.SUBMIT_PRODUCT_FEED_FAILURE
  }),

  getProductFeedStatus: feedIds => ({
    type: batchActions.GET_PRODUCT_FEED_STATUS,
    feedIds
  }),

  getProductFeedStatusSuccess: statuses => ({
    type: batchActions.GET_PRODUCT_FEED_STATUS_SUCCESS,
    statuses
  }),

  getPricingData: (asin, channel) => ({
    type: batchActions.GET_PRICING_DATA,
    asin,
    channel
  }),

  getPricingDataSuccess: pricingData => ({
    type: batchActions.GET_PRICING_DATA_SUCCESS,
    pricingData
  }),

  getPricingDataFailure: () => ({
    type: batchActions.GET_PRICING_DATA_FAILURE
  }),

  applyAutoPricingRules: () => ({
    type: batchActions.APPLY_AUTO_PRICING_RULES
  }),

  sendToHoldings: (listingData, searchResult, skuNumber) => ({
    type: batchActions.SEND_TO_HOLDING_AREA,
    listingData,
    searchResult,
    skuNumber
  }),

  sendToHoldingsSuccess: () => ({
    type: batchActions.SEND_TO_HOLDING_AREA_SUCCESS
  }),

  sendToHoldingsFailure: () => ({
    type: batchActions.SEND_TO_HOLDING_AREA_FAILURE
  }),

  bulkSendToHoldingArea: (productsInDestId, rejectedShipmentIds) => ({
    type: batchActions.BULK_SEND_TO_HOLDING_AREA,
    productsInDestId,
    rejectedShipmentIds
  }),

  bulkSendToHoldingAreaSuccess: (products, rejectedShipmentIds) => ({
    type: batchActions.BULK_SEND_TO_HOLDING_AREA_SUCCESS,
    products,
    rejectedShipmentIds
  }),

  bulkSendToHoldingAreaFailure: () => ({
    type: batchActions.BULK_SEND_TO_HOLDING_AREA_FAILURE
  }),

  getHoldings: () => ({
    type: batchActions.GET_HOLDINGS
  }),

  getHoldingsSuccess: holdings => ({
    type: batchActions.GET_HOLDINGS_SUCCESS,
    holdings
  }),

  getHoldingsFailure: () => ({
    type: batchActions.GET_HOLDINGS_FAILURE
  }),

  setCurrentWorkingListing: listing => ({
    type: batchActions.SET_CURRENT_WORKING_LISTING,
    listing
  }),


  displayCustomSKUTemplateModal: () => ({
    type: batchActions.UPDATE_MODAL_DISPLAY,
    modalName: "custom_sku_template_modal"
  }),

  setCurrentEditableListing: (listing, isHoldingAreaListing) => ({
    type: batchActions.SET_CURRENT_EDITABLE_LISTING,
    listing,
    isHoldingAreaListing
  }),

  displayFeedStatusModal: () => ({
    type: batchActions.UPDATE_MODAL_DISPLAY,
    modalName: "feed_status_item"
  }),

  setCurrentFeedStatus: listing => ({
    type: batchActions.SET_CURRENT_FEED_STATUS,
    listing
  }),

  setSidebarTabId: tabId => ({
    type: batchActions.SET_SIDEBAR_TAB_ID,
    tabId
  }),

  clearCurrentEditableListing: () => ({
    type: batchActions.CLEAR_CURRENT_EDITABLE_LISTING
  }),

  deleteHoldingAreaListing: sku => ({
    type: batchActions.DELETE_HOLDING_AREA_LISTING,
    sku
  }),

  deleteHoldingAreaListingSuccess: sku => ({
    type: batchActions.DELETE_HOLDING_AREA_LISTING_SUCCESS,
    sku
  }),

  deleteHoldingAreaListingFailure: () => ({
    type: batchActions.DELETE_HOLDING_AREA_LISTING_FAILURE
  }),

  createNewSupplier: supplierData => ({
    type: batchActions.CREATE_NEW_SUPPLIER_REQUEST,
    supplierData
  }),

  addBoxInfoForShipment: (shipmentId) => ({
    type: batchActions.ADD_BOX_INFO_FOR_SHIPMENT,
    shipmentId
  }),

  addBoxInfoForShipmentSuccess: (currentBoxUpdate, boxCountUpdate) => ({
    type: batchActions.ADD_BOX_INFO_FOR_SHIPMENT_SUCCESS,
    currentBoxUpdate,
    boxCountUpdate
  }),

  addBoxInfoForShipmentFailure: () => ({
    type: batchActions.ADD_BOX_INFO_FOR_SHIPMENT_FAILURE
  }),

  updateBoxInfoForShipment: (shipmentId, currentBox, boxCount) => ({
    type: batchActions.UPDATE_BOX_INFO_FOR_SHIPMENT,
    shipmentId,
    currentBox,
    boxCount
  }),

  updateBoxInfoForShipmentSuccess: (currentBoxUpdate, boxCountUpdate) => ({
    type: batchActions.UPDATE_BOX_INFO_FOR_SHIPMENT_SUCCESS,
    currentBoxUpdate,
    boxCountUpdate
  }),

  updateBoxInfoForShipmentFailure: () => ({
    type: batchActions.UPDATE_BOX_INFO_FOR_SHIPMENT_FAILURE
  }),

  createShipmentPlans: (products, params) => ({
    type: batchActions.CREATE_SHIPMENT_PLANS,
    products,
    params
  }),

  createShipmentPlansStatus: (jobId) => ({
    type: batchActions.CREATE_SHIPMENT_PLANS_STATUS,
    jobId
  }),

  createShipmentPlansSuccess: inboundShipmentPlans => ({
    type: batchActions.CREATE_SHIPMENT_PLANS_SUCCESS,
    inboundShipmentPlans
  }),

  createShipmentPlansFailure: () => ({
    type: batchActions.CREATE_SHIPMENT_PLANS_FAILURE
  }),

  createHoldingAreaShipment: (holdingAreaShipmentData) => ({
    type: batchActions.CREATE_HOLDING_AREA_SHIPMENT,
    holdingAreaShipmentData,
  }),

  createHoldingAreaShipmentSuccess: (holdingAreaShipmentBatch, addedInboundShipmentPlan) => ({
    type: batchActions.CREATE_HOLDING_AREA_SHIPMENT_SUCCESS,
    holdingAreaShipmentBatch,
    addedInboundShipmentPlan
  }),

  createHoldingAreaShipmentFailure: (error) => ({
    type: batchActions.CREATE_HOLDING_AREA_SHIPMENT_FAILURE,
    error
  }),

  createShipment: inboundShipmentPlans => ({
    type: batchActions.CREATE_SHIPMENT,
    inboundShipmentPlans
  }),

  createShipmentSuccess: (createdShipmentIds, existingShipments) => ({
    type: batchActions.CREATE_SHIPMENT_SUCCESS,
    createdShipmentIds,
    existingShipments
  }),

  createShipmentFailure: () => ({
    type: batchActions.CREATE_SHIPMENT_PLANS_FAILURE
  }),

  printListing: (
    listing,
    qty
  ) => ({
    type: batchActions.PRINT_LISTING,
    listing,
    qty
  }),

  goToPreviousPage: () => ({
    type: batchActions.GOTO_PREVIOUS_PAGE
  }),

  goToNextPage: () => ({
    type: batchActions.GOTO_NEXT_PAGE
  }),

  setCurrentPage: (page) => ({
    type: batchActions.SET_CURRENT_PAGE,
    page
  }),

  completeBatch: () => ({
    type: batchActions.COMPLETE_BATCH
  }),

  completeBatchSuccess: () => ({
    type: batchActions.COMPLETE_BATCH_SUCCESS
  }),

  updateCalculatedPrice: (price) => ({
    type: batchActions.UPDATE_CALCULATED_PRICE,
    price
  }),

  updateCalculatedPriceError: () => ({
    type: batchActions.UPDATE_CALCULATED_PRICE_ERROR,
  }),

  updateCurrentListingWorkflowOptions: (key, value) => ({
    type: batchActions.UPDATE_CURRENT_LISTING_WORKFLOW_OPTIONS,
    key,
    value
  }),

  resetWorkflowOptions: () => ({
    type: batchActions.UPDATE_CURRENT_LISTING_WORKFLOW_OPTIONS,
  }),

  rejectNewLiveBatchShipment: () => ({
    type: batchActions.REJECT_NEW_LIVE_BATCH_SHIPMENT
  }),

  suspendSpeedMode: () => ({
    type: batchActions.SUSPEND_SPEED_MODE,
  })
};

export default batchActions;
