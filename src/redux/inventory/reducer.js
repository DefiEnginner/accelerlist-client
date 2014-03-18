import { Map } from "immutable/dist/immutable";
import actions from "./actions";

const initState = new Map({
  inventoryItems: {},
  uploadJobId: null,
  strandedItems: [],
  strandedItemsExport: [],
  showUpdateWarning: false,
});

export default function inventoryReducer(state = initState, action) {
  switch (action.type) {
	case actions.FETCH_INVENTORY_ITEMS_SUCCESS:
		return state
			.set("inventoryItems", action.inventoryItems)

    case actions.SET_UPLOAD_INVENTORY_ITEMS_FILE_JOB_ID:
      return state.set("uploadJobId", action.jobId);

    case actions.CHANGE_INVENTORY_TABLE_FIELD_DATA_SUCCESS:{
      let inventoryItems = state.get("inventoryItems").slice();
      const newTableRowData = action.newTableRowData;
      let newInventoryItems = [];

      inventoryItems.forEach( row => {
        if (row.seller_sku === newTableRowData.seller_sku) {
          row = Object.assign({}, row, newTableRowData);
        }
        newInventoryItems.push(row);
      });

      return state.set("inventoryItems", newInventoryItems);
    }

    case actions.FETCH_STRANDED_ITEMS_SUCCESS:
      return state.set("strandedItems", action.strandedItems);

    case actions.FETCH_STRANDED_ITEMS_EXPORT_SUCCESS:
      return state.set("strandedItemsExport", action.strandedItems);

    default:
      return state;
  }
}
