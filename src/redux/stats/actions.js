const statsActions = {
    
    FETCH_AGGREGATE_DATA: 'FETCH_AGGREGATE_DATA',
    FETCH_AGGREGATE_DATA_SUCCESS: 'FETCH_AGGREGATE_DATA_SUCCESS',
    FETCH_AGGREGATE_DATA_FAILURE: 'FETCH_AGGREGATE_DATA_FAILURE',

    fetchAggregateData: (startRange, endRange) => ({
      type: statsActions.FETCH_AGGREGATE_DATA,
      startRange,
      endRange
    }),

    fetchAggregateDataSuccess: data => ({
      type: statsActions.FETCH_AGGREGATE_DATA_SUCCESS,
      data
    }),

    fetchAggregateDataFailure: () => ({
      type: statsActions.FETCH_AGGREGATE_DATA_FAILURE,
    })
}

export default statsActions
  