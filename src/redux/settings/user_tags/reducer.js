import { Map } from "immutable/dist/immutable";
import actions from "./actions";


const initState = new Map({
	userTags: []
});

export default function userTagsReducer(state = initState, action) {
  switch (action.type) {
	  case actions.USER_TAG_GET_SUCCESS:{
			if(action.tags){
				return state.set('userTags', action.tags.split('|'));
			} else {
				return state.set('userTags', []);
			}
		}

    default:
      return state
  }
}
