import { Map } from "immutable/dist/immutable";
import actions from "./actions";

const initState = new Map({
  batchList: null,
  batchListTotalCount: 0,
  batchListError: null,
  loadingList: false,
  batchDeleteError: false,
  batchDeleteLoading: false,
  batchDeleteLoaded: false,
  batchHistoryStats: [],
});

export default function historyReducer(state = initState, action) {
  switch (action.type) {
    case actions.BATCH_LIST_REQUEST:
      return state.set("batchListError", null).set("loadingList", true);
    case actions.BATCH_LIST_SUCCESS:
      return state
        .set("batchList", JSON.parse(action.batchList.results))
        .set("batchListTotalCount", action.batchList.total)
        .set("batchListError", false)
        .set("loadingList", false);
    case actions.BATCH_LIST_ERROR:
      return state.set("batchListError", true).set("loadingList", false);
    case actions.BATCH_DELETE_REQUEST:
      return state
        .set("batchDeleteError", false)
        .set("batchDeleteLoading", true)
        .set("batchDeleteLoaded", true)
        .set("deletingId", action.batchId);
    case actions.BATCH_DELETE_SUCCESS:
      return state
        .set("batchDeleteError", false)
        .set("batchDeleteLoading", false)
        .set("batchDeleteLoaded", true)
        .set("deletingId", null);
    case actions.BATCH_DELETE_ERROR:
      return state
          .set("batchDeleteError", true)
          .set("batchDeleteLoading", false)
          .set("batchDeleteLoaded", true)
          .set("deletingId", null);

	case actions.BATCH_HISTORY_STATS:
      return state
          .set("batchHistoryStats", [])

	case actions.BATCH_HISTORY_STATS_SUCCESS:
      return state
          .set("batchHistoryStats", action.data)

	case actions.BATCH_HISTORY_STATS_ERROR:
      return state
          .set("batchHistoryStats", [])

    default:
      return state;
  }
}
