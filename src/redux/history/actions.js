const historyActions = {
  BATCH_LIST_REQUEST: "BATCH_LIST_REQUEST",
  BATCH_LIST_SUCCESS: "BATCH_LIST_SUCCESS",
  BATCH_LIST_ERROR: "BATCH_LIST_ERROR",

  BATCH_DELETE_REQUEST: "BATCH_DELETE_REQUEST",
  BATCH_DELETE_SUCCESS: "BATCH_DELETE_SUCCESS",
  BATCH_DELETE_ERROR: "BATCH_DELETE_ERROR",

  BATCH_HISTORY_STATS: "BATCH_HISTORY_STATS",
  BATCH_HISTORY_STATS_SUCCESS: "BATCH_HISTORY_STATS_SUCCESS",
  BATCH_HISTORY_STATS_ERROR: "BATCH_HISTORY_STATS_ERROR",

  getBatchHistoryStats: () => ({
    type: historyActions.BATCH_HISTORY_STATS,
  }),
  getBatchHistoryStatsSuccess: (data) => ({
	  type: historyActions.BATCH_HISTORY_STATS_SUCCESS,
	  data
  }),
  getBatchHistoryStatsError: () => ({
    type: historyActions.BATCH_HISTORY_STATS_ERROR,
  }),

  fetchBatchList: (requestObject = {}) => ({
    type: historyActions.BATCH_LIST_REQUEST,
    requestObject
  }),

  fetchBatchListSuccess: batchList => ({
    type: historyActions.BATCH_LIST_SUCCESS,
    batchList
  }),

  fetchBatchListError: error => ({
    type: historyActions.BATCH_LIST_ERROR,
    error
  }),

  deleteBatch: (batchIds, requestObject) => ({
    type: historyActions.BATCH_DELETE_REQUEST,
    batchIds,
    requestObject
  }),

  deleteBatchSuccess: batchId => ({
    type: historyActions.BATCH_DELETE_SUCCESS,
    batchId
  }),

  deleteBatchError: (batchId, error) => ({
    type: historyActions.BATCH_DELETE_ERROR,
    batchId,
    error
  })
};

export default historyActions;
