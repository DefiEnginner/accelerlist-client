const leaderboardActions = {
	GET_LEADERBOARD: "GET_LEADERBOARD",
	GET_LEADERBOARD_SUCCESS: "GET_LEADERBOARD_SUCCESS",
	GET_LEADERBOARD_ERROR: "GET_LEADERBOARD_ERROR",

  getLeaderboard: () => ({
    type: leaderboardActions.GET_LEADERBOARD,
  }),
  getLeaderboardSuccess: (data) => ({
	  type: leaderboardActions.GET_LEADERBOARD_SUCCESS,
	  data
  }),
  getLeaderboardError: () => ({
    type: leaderboardActions.GET_LEADERBOARD_ERROR,
  }),
};

export default leaderboardActions;
