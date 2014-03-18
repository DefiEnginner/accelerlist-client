import { all, takeLatest, put, fork, call } from "redux-saga/effects";

import {
  getInventoryItemsAPI,
  // getResultOfUploadingInventoryItemsFileAPI,
  postUploadInventoryItemsFileAPI,
  getStrandedItemsAPI,
} from "../../helpers/inventory_apis";

import actions from "./actions";
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* FetchInventoryItemsRequest() {
  yield takeLatest("FETCH_INVENTORY_ITEMS", function*(payload) {
    try {
		const { channel, status, page, per_page, sort, sort_order,
			search_string } = payload;
      const inventoryItems = yield call(getInventoryItemsAPI, channel, status, page, per_page, sort, sort_order, search_string);
      if (inventoryItems.status === 200 && inventoryItems.data.data) {
        yield put(actions.fetchInventoryItemsSuccess(inventoryItems.data.data));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "FETCH_INVENTORY_ITEMS_ERROR"
        }
      });
    }
  });
}

export function* ChangeInventoryTableFieldData() {
  yield takeLatest("CHANGE_INVENTORY_TABLE_FIELD_DATA", function*(payload) {
    try {
      const { newTableRowData } = payload;
      // should be here trigger for  API function to change inventory table data
      yield put(actions.changeInventoryTableFieldDataSuccess(newTableRowData));
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "CHANGE_INVENTORY_TABLE_FIELD_DATA_ERROR"
        }
      });
    }
  });
}

export function* UploadInventoryItemsFile() {
  yield takeLatest("UPLOAD_INVENTORY_ITEMS_FILE", function*(payload) {
    try {
      const { inventoryItemsData } = payload;
      var data = new FormData();
      data.append('file', inventoryItemsData.file);
      data.append('overrideOption', "override_always");
      data.append('mapping', inventoryItemsData.mapping)
      let response = yield call(() => postUploadInventoryItemsFileAPI(data));
      if(!!response) {
        let jobId = response.data[inventoryItemsData.file.name].upload_id;
        yield put(actions.setUploadInventoryItemsFileJobId(jobId));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "UPLOAD_INVENTORY_ITEMS_FILE_ERROR"
        }
      });
    }
  });
}

export function* FetchStrandedItemsRequest() {
  yield takeLatest("FETCH_STRANDED_ITEMS", function*(payload) {
    try {
      const { channel } = payload;
      const strandedItems = yield call(getStrandedItemsAPI, channel);
      if (strandedItems.status === 200 && strandedItems.data.data) {
		  //if data for export
		  if(channel === 'all'){
			  yield put(actions.fetchStrandedItemsExportSuccess(strandedItems.data.data));
		  } else {
			  yield put(actions.fetchStrandedItemsSuccess(strandedItems.data.data));
		  }
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "FETCH_STRANDED_ITEMS_ERROR"
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(FetchInventoryItemsRequest),
    fork(UploadInventoryItemsFile),
    fork(ChangeInventoryTableFieldData),
    fork(FetchStrandedItemsRequest),
  ]);
}
