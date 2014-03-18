const holdingAreaActions = {

	HOLDING_AREA_BULK_DELETE: "HOLDING_AREA_BULK_DELETE",
	HOLDING_AREA_BULK_DELETE_SUCCESS: "HOLDING_AREA_BULK_DELETE_SUCCESS",
	HOLDING_AREA_BULK_DELETE_ERROR: "HOLDING_AREA_BULK_DELETE_ERROR",
	HOLDING_AREA_BULK_DELETE_SUCCESS_REFRESHED: "HOLDING_AREA_BULK_DELETE_SUCCESS_REFRESHED",

  deleteHoldingAreaInBulk: (data) => ({
	  type: holdingAreaActions.HOLDING_AREA_BULK_DELETE,
	  data
  }),

  deleteHoldingAreaInBulkSuccess: () => ({
	  type: holdingAreaActions.HOLDING_AREA_BULK_DELETE_SUCCESS,
  }),

  deleteHoldingAreaInBulkError: () => ({
	  type: holdingAreaActions.HOLDING_AREA_BULK_DELETE_ERROR,
  }),

  deleteHoldingAreaInBulkSuccessRefreshed: () => ({
	  type: holdingAreaActions.HOLDING_AREA_BULK_DELETE_SUCCESS_REFRESHED,
  }),
};

export default holdingAreaActions;
