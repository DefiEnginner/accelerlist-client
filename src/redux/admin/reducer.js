import {
    Map
} from 'immutable/dist/immutable'
import actions from './actions';

const initState = new Map({
	userUN: "",
	showUserData: false,
	showUserDataFailed: false,
	userData: [],
	usersPerMarketplace: [],
	usersErrorLogs: [],
	userTokenUpdateCompleted: false,
	userTokenUpdateFailed: false,
	batchStatsData: [],
});

export default function adminReducer(state = initState, action) {
    switch (action.type) {
      case actions.CHANGE_USER_PASSWORD_SUCCESS:
			return state.set('showPopupPasswordChanged', true);

      case actions.CHANGE_USER_PASSWORD_FAILURE:
			return state.set('showPopupPasswordChangeFailed', true);

      case actions.CHANGE_USER_PASSWORD_FAILURE_MODAL_CLOSE:
			return state.set('showPopupPasswordChangeFailed', false);

      case actions.CHANGE_USER_PASSWORD_SUCCESS_MODAL_CLOSE:
			return state.set('showPopupPasswordChanged', false);

	  case actions.SEARCH_USER_SUCCESS:
			return state
				.set('userData', action.data)
				.set('showUserData', true);

	  case actions.SEARCH_USER_FAILURE:
			return state
				.set('userData', [])
				.set('showUserDataFailed', true)
				.set('showUserData', false);

      case actions.SEARCH_USER_FAILURE_MODAL_CLOSE:
			return state.set('showUserDataFailed', false);

	  case actions.SEARCH_USERS_PER_MARKETPLACE_SUCESS:
			return state
				.set('usersPerMarketplace', action.data)

	  case actions.SEARCH_USERS_ERRORLOGS_SUCESS:
			return state
				.set('usersErrorLogs', action.data)

	  case actions.USER_AUTH_TOKEN_UPDATE:
			return state
				.set("userTokenUpdateCompleted", false)
				.set("userTokenUpdateFailed", false)

	  case actions.USER_AUTH_TOKEN_UPDATE_SUCCESS:
			return state
				.set("userTokenUpdateCompleted", true)
				.set("userTokenUpdateFailed", false)

	  case actions.USER_AUTH_TOKEN_UPDATE_FAILURE:
			return state
				.set("userTokenUpdateFailed", true)
				.set("userTokenUpdateCompleted", false)

	  case actions.BATCH_STATS:
			return state
				.set("batchStatsData", [])

	  case actions.BATCH_STATS_SUCCESS:
			return state
				.set("batchStatsData", action.data)

	  case actions.BATCH_STATS_FAILURE:
			return state
				.set("batchStatsData", [])

      default:
        return state
    }
}
