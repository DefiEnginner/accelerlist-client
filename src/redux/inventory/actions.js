const inventoryActions = {
  FETCH_INVENTORY_ITEMS: "FETCH_INVENTORY_ITEMS",
  FETCH_INVENTORY_ITEMS_SUCCESS: "FETCH_INVENTORY_ITEMS_SUCCESS",

  CHANGE_INVENTORY_TABLE_FIELD_DATA: "CHANGE_INVENTORY_TABLE_FIELD_DATA",
  CHANGE_INVENTORY_TABLE_FIELD_DATA_SUCCESS: "CHANGE_INVENTORY_TABLE_FIELD_DATA_SUCCESS",

  UPLOAD_INVENTORY_ITEMS_FILE: "UPLOAD_INVENTORY_ITEMS_FILE",

  SET_UPLOAD_INVENTORY_ITEMS_FILE_JOB_ID: "SET_UPLOAD_INVENTORY_ITEMS_FILE_JOB_ID",

  FETCH_STRANDED_ITEMS: "FETCH_STRANDED_ITEMS",
  FETCH_STRANDED_ITEMS_SUCCESS: "FETCH_STRANDED_ITEMS_SUCCESS",
  FETCH_STRANDED_ITEMS_EXPORT_SUCCESS: "FETCH_STRANDED_ITEMS_EXPORT_SUCCESS",

  fetchStrandedItems: (channel) => ({
	  type: inventoryActions.FETCH_STRANDED_ITEMS,
	  channel
  }),

  fetchStrandedItemsSuccess: strandedItems => ({
    type: inventoryActions.FETCH_STRANDED_ITEMS_SUCCESS,
    strandedItems
  }),

  fetchStrandedItemsExportSuccess: strandedItems => ({
    type: inventoryActions.FETCH_STRANDED_ITEMS_EXPORT_SUCCESS,
    strandedItems
  }),

	fetchInventoryItems: (channel, status, page, per_page, sort, sort_order,
		search_string) => ({
    type: inventoryActions.FETCH_INVENTORY_ITEMS,
    channel,
    status,
    page,
    per_page,
    sort,
	sort_order,
	search_string,
  }),

  fetchInventoryItemsSuccess: inventoryItems => ({
    type: inventoryActions.FETCH_INVENTORY_ITEMS_SUCCESS,
    inventoryItems
  }),

  setUploadInventoryItemsFileJobId: jobId => ({
    type: inventoryActions.SET_UPLOAD_INVENTORY_ITEMS_FILE_JOB_ID,
    jobId
  }),

  uploadInventoryItemsFile: inventoryItemsData => ({
    type: inventoryActions.UPLOAD_INVENTORY_ITEMS_FILE,
    inventoryItemsData
  }),

  changeInventoryTableFieldData: newTableRowData => ({
    type: inventoryActions.CHANGE_INVENTORY_TABLE_FIELD_DATA,
    newTableRowData
  }),

  changeInventoryTableFieldDataSuccess: newTableRowData => ({
    type: inventoryActions.CHANGE_INVENTORY_TABLE_FIELD_DATA_SUCCESS,
    newTableRowData
  }),

};

export default inventoryActions;
