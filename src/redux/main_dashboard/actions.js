const dashboardActions = {

    FETCH_DASHBOARD_DATA: 'FETCH_DASHBOARD_DATA',
    FETCH_DASHBOARD_DATA_SUCCESS: 'FETCH_DASHBOARD_DATA_SUCCESS',
    FETCH_DASHBOARD_DATA_STATUS: 'FETCH_DASHBOARD_DATA_STATUS',

	GET_SALES_STATS: 'GET_SALES_STATS',
	GET_SALES_STATS_SUCCESS: 'GET_SALES_SUCCESS',
	GET_SALES_STATS_ERROR: 'GET_SALES_STATS_ERROR',

    getSalesStats: () => ({
		type: dashboardActions.GET_SALES_STATS,
    }),
    getSalesStatsSuccess: (data) => ({
		type: dashboardActions.GET_SALES_STATS_SUCCESS,
		data
    }),
    getSalesStatsError: () => ({
		type: dashboardActions.GET_SALES_STATS_ERROR,
    }),

    fetchDashboardData: (key, stat, minTimestamp, maxTimestamp) => ({
      type: dashboardActions.FETCH_DASHBOARD_DATA,
      key,
      stat,
      minTimestamp,
      maxTimestamp
    }),
    fetchDashboardDataSuccess: (key, value) => ({
      type: dashboardActions.FETCH_DASHBOARD_DATA_SUCCESS,
      key, value
    }),
    fetchDashboardDataStatus: (key, status) => ({
      type: dashboardActions.FETCH_DASHBOARD_DATA_STATUS,
      key, status
    })
}

export default dashboardActions

