const landingActions = {
	FETCH_INVENTORY_ITEMS_COUNT: "FETCH_INVENTORY_ITEMS_COUNT",
	FETCH_INVENTORY_ITEMS_SUCCESS: "FETCH_INVENTORY_ITEMS_SUCCESS",

  bFrontItemListedCount: () => ({
    type: landingActions.FETCH_INVENTORY_ITEMS_COUNT,
  }),

  bFrontItemListedCountSuccess: count => ({
    type: landingActions.FETCH_INVENTORY_ITEMS_SUCCESS,
	count
  }),

};

export default landingActions;
