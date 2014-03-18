import actions from "./actions";
import { Map } from "immutable/dist/immutable";

const initState = new Map({
  item_count: 0,
});

export default function landingItemsCountReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_INVENTORY_ITEMS_SUCCESS: {
		return state.set("item_count", action.count);    
	}
  default:
      return state;
  } 
}
