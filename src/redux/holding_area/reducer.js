import { Map } from "immutable/dist/immutable";
import actions from "./actions";

const initState = new Map({
  batchDeleteExecuted: false,
});

export default function holdingAreaReducer(state = initState, action) {
  switch (action.type) {
    case actions.HOLDING_AREA_BULK_DELETE_SUCCESS:
      return state
        .set("batchDeleteExecuted", true)
    case actions.HOLDING_AREA_BULK_DELETE_SUCCESS_REFRESHED:
      return state
        .set("batchDeleteExecuted", false)
    default:
      return state;
  }
}
