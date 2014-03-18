const adminActions = {

    CHANGE_USER_PASSWORD: 'CHANGE_USER_PASSWORD',
    CHANGE_USER_PASSWORD_SUCCESS: 'CHANGE_USER_PASSWORD_SUCCESS',
    CHANGE_USER_PASSWORD_FAILURE: 'CHANGE_USER_PASSWORD_FAILURE',
    CHANGE_USER_PASSWORD_FAILURE_MODAL_CLOSE: 'CHANGE_USER_PASSWORD_FAILURE_MODAL_CLOSE',
    CHANGE_USER_PASSWORD_SUCCESS_MODAL_CLOSE: 'CHANGE_USER_PASSWORD_SUCCESS_MODAL_CLOSE',
    SEARCH_USER: 'SEARCH_USER',
    SEARCH_USER_SUCCESS: 'SEARCH_USER_SUCCESS',
    SEARCH_USER_FAILURE: 'SEARCH_USER_FAILURE',
	SEARCH_USER_FAILURE_MODAL_CLOSE: 'SEARCH_USER_FAILURE_MODAL_CLOSE',

    SEARCH_USERS_PER_MARKETPLACE: 'SEARCH_USERS_PER_MARKETPLACE',
    SEARCH_USERS_PER_MARKETPLACE_SUCESS: 'SEARCH_USERS_PER_MARKETPLACE_SUCCESS',
    SEARCH_USERS_PER_MARKETPLACE_FAILURE: 'SEARCH_USERS_PER_MARKETPLACE_FAILURE',
    SEARCH_USERS_ERRORLOGS: 'SEARCH_USERS_ERRORLOGS',
    SEARCH_USERS_ERRORLOGS_SUCESS: 'SEARCH_USERS_ERRORLOGS_SUCCESS',
    SEARCH_USERS_ERRORLOGS_FAILURE: 'SEARCH_USERS_ERRORLOGS_FAILURE',

    USER_AUTH_TOKEN_UPDATE: 'USER_AUTH_TOKEN_UPDATE',
    USER_AUTH_TOKEN_UPDATE_SUCCESS: 'USER_AUTH_TOKEN_UPDATE_SUCCESS',
    USER_AUTH_TOKEN_UPDATE_FAILURE: 'USER_AUTH_TOKEN_UPDATE_FAILURE',

	BATCH_STATS: 'BATCH_STATS',
	BATCH_STATS_SUCCESS: 'BATCH_STATS_SUCCESS',
	BATCH_STATS_FAILURE: 'BATCH_STATS_FAILURE',

    batchStats: () => ({
		type: adminActions.BATCH_STATS,
    }),
    batchStatsSuccess: (data) => ({
		type: adminActions.BATCH_STATS_SUCCESS,
		data
    }),
    batchStatsFailure: () => ({
		type: adminActions.BATCH_STATS_FAILURE,
    }),

    userTokenUpdate: (data) => ({
		type: adminActions.USER_AUTH_TOKEN_UPDATE,
		data
    }),
    userTokenUpdateSuccess: () => ({
		type: adminActions.USER_AUTH_TOKEN_UPDATE_SUCCESS,
    }),
    userTokenUpdateFailure: () => ({
		type: adminActions.USER_AUTH_TOKEN_UPDATE_FAILURE,
    }),

    searchUsersErrorLogs: () => ({
      type: adminActions.SEARCH_USERS_ERRORLOGS,
    }),
    searchUsersErrorlogsSuccess: (data) => ({
		type: adminActions.SEARCH_USERS_ERRORLOGS_SUCESS,
		data
    }),
    searchUsersErrorlogsFailure: () => ({
      type: adminActions.SEARCH_USERS_ERRORLOGS_FAILURE,
    }),

    searchUsersPerMarketplace: () => ({
      type: adminActions.SEARCH_USERS_PER_MARKETPLACE,
    }),
    searchUsersPerMarketplaceSuccess: (data) => ({
		type: adminActions.SEARCH_USERS_PER_MARKETPLACE_SUCESS,
		data
    }),
    searchUsersPerMarketplaceFailure: () => ({
      type: adminActions.SEARCH_USERS_PER_MARKETPLACE_FAILURE,
    }),

    changeUserPassword: (data) => ({
      type: adminActions.CHANGE_USER_PASSWORD,
	  data
    }),

    changeUserPasswordSuccess: () => ({
      type: adminActions.CHANGE_USER_PASSWORD_SUCCESS,
    }),

    changeUserPasswordFailure: () => ({
      type: adminActions.CHANGE_USER_PASSWORD_FAILURE,
    }),

    changeUserPasswordFailureModalClose: () => ({
      type: adminActions.CHANGE_USER_PASSWORD_FAILURE_MODAL_CLOSE,
    }),

    changeUserPasswordSuccessModalClose: () => ({
      type: adminActions.CHANGE_USER_PASSWORD_SUCCESS_MODAL_CLOSE,
    }),

    searchUser: (data) => ({
      type: adminActions.SEARCH_USER,
	  data
    }),

    searchUserSuccess: (data) => ({
		type: adminActions.SEARCH_USER_SUCCESS,
		data
    }),

    searchUserFailureModalClose: () => ({
        type: adminActions.SEARCH_USER_FAILURE_MODAL_CLOSE
    }),

    searchUserFailure: () => ({
        type: adminActions.SEARCH_USER_FAILURE
    }),

}

export default adminActions;

