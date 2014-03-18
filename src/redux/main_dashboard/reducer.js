import {
    Map
} from 'immutable/dist/immutable'
import actions from './actions'

const initState = new Map({
  stats: {},
  statusOfFetchData: {},
  salesExpensesData: [],
})

export default function dashboardReducer(state = initState, action) {
    switch (action.type) {
      case actions.FETCH_DASHBOARD_DATA_SUCCESS:
      	let {key, value} = action;
      	let stats = Object.assign({}, state.get("stats"));
      	stats[key] = value;
        return state.set('stats', stats);

      case actions.FETCH_DASHBOARD_DATA_STATUS:
        let statusOfFetchData = Object.assign({}, state.get("statusOfFetchData"));
        statusOfFetchData[action.key] = action.status;
        return state.set('statusOfFetchData', statusOfFetchData);

	  case actions.GET_SALES_STATS:
			return state
				.set("salesExpensesData", [])

	  case actions.GET_SALES_STATS_SUCCESS:
			return state
				.set("salesExpensesData", action.data.sales)

	  case actions.GET_SALES_STATS_ERROR:
			return state
				.set("salesExpensesData", [])

      default:
        return state
    }
}
