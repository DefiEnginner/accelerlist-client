const boxContentActions = {
  LOAD_SHIPMENT_LIST_REQUEST: "LOAD_SHIPMENT_LIST_REQUEST",
  LOAD_SHIPMENT_LIST_SUCCESS: "LOAD_SHIPMENT_LIST_SUCCESS",
  LOAD_SHIPMENT_LIST_ERROR: "LOAD_SHIPMENT_LIST_ERROR",

  SELECT_SHIPMENT_REQUEST: "SELECT_SHIPMENT_REQUEST",
  SELECT_SHIPMENT_SUCCESS: "SELECT_SHIPMENT_SUCCESS",
  SELECT_SHIPMENT_ERROR: "SELECT_SHIPMENT_ERROR",

  SELECT_SHIPMENT_BOX: "SELECT_SHIPMENT_BOX",

  ADD_SHIPMENT_BOX_REQUEST: "ADD_SHIPMENT_BOX_REQUEST",
  ADD_SHIPMENT_BOX_SUCCESS: "ADD_SHIPMENT_BOX_SUCCESS",
  ADD_SHIPMENT_BOX_ERROR: "ADD_SHIPMENT_BOX_ERROR",

  MOVE_ITEM_REQUEST: "MOVE_ITEM_REQUEST",
  MOVE_ITEM_SUCCESS: "MOVE_ITEM_SUCCESS",
  MOVE_ITEM_ERROR: "MOVE_ITEM_ERROR",

  SHOW_ALERT: "SHOW_ALERT",
  CLOSE_ALERT: "CLOSE_ALERT",

  UPDATE_QUERY: "UPDATE_QUERY",

  SEARCH_PRODUCT_REQUEST: "SEARCH_PRODUCT_REQUEST",
  SEARCH_PRODUCT_SUCCESS: "SEARCH_PRODUCT_SUCCESS",
  SEARCH_PRODUCT_ERROR: "SEARCH_PRODUCT_ERROR",

  ADD_PRODUCT_REQUEST: "ADD_PRODUCT_REQUEST",
  ADD_PRODUCT_SUCCESS: "ADD_PRODUCT_SUCCESS",
  ADD_PRODUCT_ERROR: "ADD_PRODUCT_ERROR",

  DEL_PRODUCT_REQUEST: "DEL_PRODUCT_REQUEST",
  DEL_PRODUCT_REQUEST_SUCCESS: "DEL_PRODUCT_REQUEST_SUCCESS",

  UPDATE_PRODUCT_SUCCESS: "UPDATE_PRODUCT_SUCCESS",

  REMOVE_SELECTED_SHIPMENT: "REMOVE_SELECTED_SHIPMENT",

  UPDATE_SELECTED_SHIPMENT_BOX: "UPDATE_SELECTED_SHIPMENT_BOX",
  UPDATE_SELECTED_SHIPMENT_READY_FLAG: "UPDATE_SELECTED_SHIPMENT_READY_FLAG",

  CHOOSE_SEARCH_ITEM : "CHOOSE_SEARCH_ITEM",
  CHANGE_PAGINATION_LIMIT: "CHANGE_PAGINATION_LIMIT",

  PRINT_SHIPMENT_ITEM: "PRINT_SHIPMENT_ITEM",

  CHANGE_BOX_DIALOG_PAGINATION_LIMIT: "CHANGE_BOX_DIALOG_PAGINATION_LIMIT",

  CLEAR_ADD_PRODUCT_ERROR: "CLEAR_ADD_PRODUCT_ERROR",

  changeBoxDialogPaginationLimit: (page, limit) => ({
    type: boxContentActions.CHANGE_BOX_DIALOG_PAGINATION_LIMIT,
    page,
    limit
  }),

  printShipmentItem: (item) => ({
    type: boxContentActions.PRINT_SHIPMENT_ITEM,
    item,
  }),

  changePaginationLimit: (page, limit) => ({
    type: boxContentActions.CHANGE_PAGINATION_LIMIT,
    page,
    limit
  }),

  chooseSearchItem: (item) => ({
    type: boxContentActions.CHOOSE_SEARCH_ITEM,
    item
  }),

  fetchShipmentList: () => ({
    type: boxContentActions.LOAD_SHIPMENT_LIST_REQUEST
  }),

  fetchShipmentListSuccess: shipmentList => ({
    type: boxContentActions.LOAD_SHIPMENT_LIST_SUCCESS,
    shipmentList
  }),

  fetchShipmentListError: () => ({
    type: boxContentActions.LOAD_SHIPMENT_LIST_ERROR
  }),

  updateSelectedShipmentReadyFlag: (
    shipmentIndex,
    flag
  ) => ({
    type: boxContentActions.UPDATE_SELECTED_SHIPMENT_READY_FLAG,
    flag,
    shipmentIndex
  }),
  
  updateSelectedShipmentBox: (
    shipmentId,
    shipmentIndex,
    box
  ) => ({
    type: boxContentActions.UPDATE_SELECTED_SHIPMENT_BOX,
    box,
    shipmentIndex,
    shipmentId
  }),

  removeSelectedShipment: (
    dataIndex,
    shipmentIndex
  ) => ({
    type: boxContentActions.REMOVE_SELECTED_SHIPMENT,
    dataIndex,
    shipmentIndex
  }),

  selectShipmentRequest: (
    selectedShipment,
  ) => ({
    type: boxContentActions.SELECT_SHIPMENT_REQUEST,
    selectedShipment,
  }),

  selectShipmentSuccess: (selectedShipmentData, selectedShipment, shipmentId) => ({
    type: boxContentActions.SELECT_SHIPMENT_SUCCESS,
    selectedShipmentData,
    selectedShipment,
    shipmentId
  }),

  selectShipmentError: (shipmentId) => ({
    type: boxContentActions.SELECT_SHIPMENT_ERROR,
    shipmentId
  }),

  selectShipmentBox: selectedShipmentBox => ({
    type: boxContentActions.SELECT_SHIPMENT_BOX,
    selectedShipmentBox
  }),

  addShipmentBox: shipmentId => ({
    type: boxContentActions.ADD_SHIPMENT_BOX_REQUEST,
    shipmentId
  }),

  addShipmentBoxSuccess: (shipmentBox, shipmentId) => ({
    type: boxContentActions.ADD_SHIPMENT_BOX_SUCCESS,
    shipmentBox,
    shipmentId
  }),

  addShipmentBoxError: () => ({
    type: boxContentActions.ADD_SHIPMENT_BOX_ERROR
  }),

  moveItem: (itemId, boxId, qty, selectedShipment, selectedShipmentBox) => ({
    type: boxContentActions.MOVE_ITEM_REQUEST,
    itemId,
    boxId,
    qty,
    selectedShipment,
    selectedShipmentBox
  }),

  moveItemSuccess: (shipmentId, boxes) => ({
    type: boxContentActions.MOVE_ITEM_SUCCESS,
    shipmentId,
    boxes
  }),

  moveItemError: () => ({
    type: boxContentActions.MOVE_ITEM_ERROR
  }),

  showAlert: (title, text) => ({
    type: boxContentActions.SHOW_ALERT,
    alert: {
      title,
      text
    }
  }),

  closeAlert: () => ({
    type: boxContentActions.CLOSE_ALERT
  }),

  updateQuery: query => ({
    type: boxContentActions.UPDATE_QUERY,
    query
  }),

  clearQuery: () => ({
    type: boxContentActions.UPDATE_QUERY,
    query: ""
  }),

  searchProductRequest: (
    query,
    selectedShipmentsData,
  ) => ({
    type: boxContentActions.SEARCH_PRODUCT_REQUEST,
    query,
    selectedShipmentsData,
  }),

  searchProductSuccess: () => ({
    type: boxContentActions.SEARCH_PRODUCT_SUCCESS
  }),

  searchProductError: (searchErrorData, searchErrorType) => ({
    type: boxContentActions.SEARCH_PRODUCT_ERROR,
    searchErrorData,
    searchErrorType
  }),

  addProductRequest: (
    selectedShipmentData,
    sku,
    result,
  ) => ({
    type: boxContentActions.ADD_PRODUCT_REQUEST,
    selectedShipmentData,
    sku,
    result,
  }),

  addProductSuccess: (boxId, product) => ({
    type: boxContentActions.ADD_PRODUCT_SUCCESS,
    boxId, product
  }),

  updateProductSuccess: (boxId, itemId, updatedData) => ({
    type: boxContentActions.UPDATE_PRODUCT_SUCCESS,
    boxId, itemId, updatedData
  }),

  addProductError: () => ({
    type: boxContentActions.ADD_PRODUCT_ERROR
  }),

  clearAddProductError: () => ({
    type: boxContentActions.CLEAR_ADD_PRODUCT_ERROR
  }),
  
  delProductRequest: (selectedShipmentData, sku, boxId, qty) => ({
    type: boxContentActions.DEL_PRODUCT_REQUEST,
    selectedShipmentData,
    sku,
    boxId,
    qty
  }),

  delItemFromBoxSuccess: (boxId, itemId) => ({
    type: boxContentActions.DEL_PRODUCT_REQUEST_SUCCESS,
    boxId,
    itemId
  }),
};
export default boxContentActions;
