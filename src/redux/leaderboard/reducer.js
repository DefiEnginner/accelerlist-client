import actions from "./actions";
import { Map } from "immutable/dist/immutable";

const initState = new Map({
  leaderboard: [],
});

export default function leaderboardReducer(state = initState, action) {
  switch (action.type) {
	  case actions.GET_LEADERBOARD: {
		return state.set("leaderboard", []);
	}
	  case actions.GET_LEADERBOARD_SUCCESS: {
		  const lb_raw = action.data;
		  let leaderboard = [];
		  let data = {};
		  lb_raw.forEach(lb => {
			  data = {
					rank: lb.rank,
					user: {
						name: lb.name,
						username: lb.username,
						avatar_url: lb.avatar_url,
					},
					products_listed: lb.products_listed,
					batches_listed: lb.batches_listed,
					net_profit: lb.net_profit,
					weekly_movement: lb.weekly_movement,
			  }
			  leaderboard.push(data);
			});
		return state.set("leaderboard", leaderboard);
	}

  default:
      return state;
  }
}
