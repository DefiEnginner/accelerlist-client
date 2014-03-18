import { all, takeEvery, takeLatest, put, fork, call, select } from "redux-saga/effects";

import {
  getShipmentsListAPI,
  getShipmentAPI,
  addShipmentBoxAPI,
  updateCurrentShipmentBoxAPI,
  moveItemToBox,
  searchProductAPI,
  addItemToBox,
  updateItemCount,
  delItemFromBox
} from "../../helpers/box_contents_apis";
import actions from "./actions";
import appActions from "../app/actions";
import printerActions from "../../redux/print_service/actions";
import {
  printerDefaultsSelector
} from "../settings/selector";
import { logError } from "../../helpers/utility";
import { setFocusToAmazonSearchBar } from "../../helpers/batch/utility";
import { suggestShipment } from "../../helpers/box_contents/shipmentSelectorAlgorithm";
import { getASINForInput, getCachedSearchResult } from "../../helpers/box_contents/utility";
import moment from "moment";

export function* shipmentListRequest() {
  yield takeLatest(actions.LOAD_SHIPMENT_LIST_REQUEST, function*() {
    try {
      const shipmentListResponse = yield call(getShipmentsListAPI);
      yield put(actions.fetchShipmentListSuccess(shipmentListResponse.data));
    } catch (error) {
      yield put(actions.fetchShipmentListError());
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "LOAD_SHIPMENT_LIST_REQUEST_ERROR"
        }
      });
    }
  });
}

export function* selectShipmentRequest() {
  yield takeEvery(actions.SELECT_SHIPMENT_REQUEST, function*({
    selectedShipment,
  }) {
    try {
      const shipmentResponse = yield call(
        getShipmentAPI,
        selectedShipment.ShipmentId
      );
      if (shipmentResponse.data.error) {
        // do something
      } else {
        yield put(actions.selectShipmentSuccess(
          shipmentResponse.data,
          selectedShipment,
          selectedShipment.ShipmentId
        ));
        if (!shipmentResponse.data.boxes || shipmentResponse.data.boxes.length === 0) {
          yield put(actions.addShipmentBox(
            selectedShipment.ShipmentId
          ));
        }
      }
    } catch (error) {
      yield put(actions.selectShipmentError(selectedShipment.ShipmentId));
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "SELECT_SHIPMENT_REQUEST_ERROR"
        }
      });
    }
  });
}

export function* addShipmentBoxRequest() {
  yield takeLatest(actions.ADD_SHIPMENT_BOX_REQUEST, function*({ shipmentId }) {
    try {
      const shipmentBoxResponse = yield call(addShipmentBoxAPI, { shipmentId });
      if(!shipmentBoxResponse.data.error) {
        yield put(actions.addShipmentBoxSuccess(shipmentBoxResponse.data.box, shipmentId));
        yield call(setFocusToAmazonSearchBar);
      }
      else {
        yield put(actions.addShipmentBoxError());
        yield put(appActions.apiCallFailed("Error! Fetching api error"));
      }
    } catch (error) {
      yield put(actions.addShipmentBoxError());
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "ADD_SHIPMENT_BOX_REQUEST_ERROR"
        }
      });
    }
  });
}

export function* updateCurrentShipmentBoxRequest() {
  yield takeLatest(actions.UPDATE_SELECTED_SHIPMENT_BOX, function*({ shipmentId, box }) {
    try {
      const shipmentCurrentBoxResponse = yield call(updateCurrentShipmentBoxAPI, { shipmentId, boxId: box.id });
      if(shipmentCurrentBoxResponse.data.error) {
        yield put(appActions.apiCallFailed("Error! Fetching api error"));
      } else {
        yield call(setFocusToAmazonSearchBar);
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "UPDATE_SELECTED_SHIPMENT_BOX_REQUEST_ERROR"
        }
      });
    }
  });
}

export function* moveItemRequest() {
  yield takeLatest(actions.MOVE_ITEM_REQUEST, function*({
    itemId,
    boxId,
    qty,
    selectedShipment,
  }) {
    try {
      let response = yield call(moveItemToBox, boxId, itemId, qty);
      let {boxes} = response.data;
      yield put(actions.moveItemSuccess(selectedShipment.ShipmentId, boxes));
    } catch (error) {
      console.log("Error moving item: " + error);
      yield put(actions.moveItemError());
      yield put(appActions.apiCallFailed("Error! Failed to move item."));
      logError(error, {
        tags: {
          exceptionType: "MOVE_ITEM_REQUEST_ERROR"
        }
      });
    }
  });
}


export function* searchProductRequest() {
  yield takeLatest(actions.SEARCH_PRODUCT_REQUEST, function*({
    query,
    selectedShipmentsData,
  }) {
    try {
      console.log("Query: ", selectedShipmentsData);
      let modifiedQueryForAPI = getASINForInput(query, selectedShipmentsData) || query;
      console.log("Modified Query: ", modifiedQueryForAPI);
      let searchResults = null;
		//console.log('BEFORE CACHED...........................................');
      let cachedSearch = getCachedSearchResult(modifiedQueryForAPI, selectedShipmentsData);
		console.log('AFRET CACHED...........................................');
      if (!cachedSearch) {
        const searchResultResponse = yield call(searchProductAPI, modifiedQueryForAPI);
        searchResults = searchResultResponse.data.results
      } else {
        searchResults = [cachedSearch];
      }
		//console.log("BEFORE Result: ");
      const algorithmOutput = suggestShipment(query, selectedShipmentsData, searchResults);
		//console.log("Result: ", algorithmOutput);
      if(algorithmOutput.shipmentId) {
		  //console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ');
        let index = selectedShipmentsData.findIndex((shipment) => {
          return shipment.selectedShipment.ShipmentId === algorithmOutput.shipmentId;
        })
		  //console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
		  let selectedShipmentData = selectedShipmentsData[index];

		  //console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ');
		  //console.log("Adding: ", selectedShipmentData);
        yield put(
          actions.addProductRequest(
            selectedShipmentData,
            algorithmOutput.selectedSKU,
            algorithmOutput.selectedSearchResult,
          )
        );
		  //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        yield put(actions.searchProductSuccess());
        yield put(actions.clearQuery());
      }
      else if (algorithmOutput.error) {
        // yield put(appActions.apiCallFailed(algorithmOutput.error));
        let items = [];
        let type = null;
        if(algorithmOutput.matchingASINs) {
          let results = searchResults;
          type = "ASIN";
          results.forEach((result) => {
            if(algorithmOutput.matchingASINs.filter(asin => result.ASIN === asin).length > 0) {
              items.push(result);
            }
          })
        }
        else if (algorithmOutput.matchingSKUs) {
          type = "SKU";
          items = algorithmOutput.matchingSKUs;
          yield put(actions.chooseSearchItem(algorithmOutput.selectedSearchResult));
        } else {
          yield put(appActions.apiCallFailed(algorithmOutput.error));
        }
        yield put(actions.searchProductError(items, type));
        yield put(actions.clearQuery());
      } else if (!searchResults) {
        yield put(appActions.apiCallFailed("No product found"));
        yield put(actions.searchProductError());
        yield put(actions.clearQuery());
      }
    } catch (error) {
      yield put(actions.searchProductError());
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "SEARCH_PRODUCT_REQUEST_ERROR"
        }
      });
    }
  });
}

export function* addProductRequest() {
  yield takeLatest(actions.ADD_PRODUCT_REQUEST, function*({
    selectedShipmentData,
    sku,
    result,
  }) {
    try {
		//console.log('START ADDING....................');
      const itemInInbound = selectedShipmentData.inboundShipmentItems.find(item => item.SellerSKU === sku);
		//console.log('AFTER START ADDING....................');

      if (!itemInInbound) {
		  //console.log("Failed to find item in inboundShipmentPlans", sku, selectedShipmentData.inboundShipmentItems);
        yield put(actions.addProductError());
        yield put(appActions.apiCallFailed("Error! Failed to find SKU in inbound shipment items."));
        logError(
          new Error("Failed to find SKU in selectedShipment even though our algorithm suggested this shipment."), {
          tags: {
            exceptionType: "ADD_PRODUCT_REQUEST_ERROR"
          }
        });
        return;
      }

		//console.log('AFTER AFTER START ADDING....................');
      let itemId = null;
      let itemCountInCurrentBox = 0;
      selectedShipmentData.boxes.forEach(box => {
        box.items.forEach(item => {
          if (item.SellerSKU === sku && box.id === selectedShipmentData.currentBox.id) {
            if (box.id === selectedShipmentData.currentBox.id) {
              itemId = item.BoxContentItemId;
              itemCountInCurrentBox = item.QuantityShippedInBox;
            }
          }
        });
      });

		//console.log('AFTER LOOP....................');
      let updatedQty = itemCountInCurrentBox + 1;
      if (itemId !== null) {
        const { data } = yield call(updateItemCount, itemId, updatedQty);
		  //console.log("Item Count Updated: ", data)
        if (!data.error) {
          yield put(actions.updateProductSuccess(selectedShipmentData.currentBox.id, itemId, {
            QuantityShippedInBox: updatedQty,
            UpdatedAt: moment.utc().format("YYYY-MM-DDTHH:mm:ssssss")
          }));
        } else {
          // @TODO: yield a real error here
          throw new Error()
        }
      } else {
		  //console.log('START addItemToBox,....................');
        const { data } = yield call(addItemToBox, selectedShipmentData.currentBox.id, {
          SellerSKU: itemInInbound.SellerSKU,
          FulfillmentNetworkSKU: itemInInbound.FulfillmentNetworkSKU,
          ASIN: itemInInbound.ASIN,
          QuantityShippedInBox: 1,
          ProductSearchResult: result,
          UpdatedAt: moment.utc().format("YYYY-MM-DDTHH:mm:ssssss")
        });
		  //console.log('END addItemToBox,....................');
        if (!data.error) {
          yield put(actions.addProductSuccess(selectedShipmentData.currentBox.id, data.item));
        } else {
          throw new Error()
        }
      }
		//console.log('BEFORE PRINTER....................');
      const printerDefaults = yield select(printerDefaultsSelector);
      console.log("this is the printer defaults", printerDefaults);
      if (printerDefaults && printerDefaults.print_while_scanning_box_contents) {
        yield put(printerActions.print({
          fnsku: itemInInbound.FulfillmentNetworkSKU,
          name: result.name
        }, 1))
      }
      yield put(appActions.apiCallUserSoundNotificationSuccess());

    } catch (error) {
      console.log(error);
      yield put(actions.addProductError());
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "ADD_PRODUCT_REQUEST_ERROR"
        }
      });
    }
  });
}

export function* delProductRequest() {
  yield takeLatest(actions.DEL_PRODUCT_REQUEST, function*({
    selectedShipmentData,
    sku,
    boxId,
    qty
  }) {
    try {
      let itemId = null;
      let itemCountInCurrentBox = 0;
      selectedShipmentData.boxes.forEach(box => {
        box.items.forEach(item => {
          if (item.SellerSKU === sku && box.id === boxId) {
            itemId = item.BoxContentItemId;
            itemCountInCurrentBox = item.QuantityShippedInBox;
          }
        });
      });

      let updatedQty = itemCountInCurrentBox - qty;
      if (itemId !== null && itemCountInCurrentBox > 0) {
        if (updatedQty === 0) {
          const { data } = yield call(delItemFromBox, boxId, itemId);

          if (!data.error) {
            yield put(actions.delItemFromBoxSuccess(boxId, itemId));
          }
        } else {
          const { data } = yield call(updateItemCount, itemId, updatedQty);

          if (!data.error) {
            yield put(actions.updateProductSuccess(boxId, itemId, {
              QuantityShippedInBox: updatedQty,
              UpdatedAt: moment.utc().format("YYYY-MM-DDTHH:mm:ssssss")
            }));
          }
        }
      } else {
        throw new Error()
      }
      yield put(appActions.apiCallUserSoundNotificationSuccess());
    } catch (error) {
      console.log(error);
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "DEL_PRODUCT_REQUEST"
        }
      });
    }
  });
}

export function* printShipmentItem() {
  yield takeLatest(actions.PRINT_SHIPMENT_ITEM, function*({
    item,
  }) {
    try {
      yield put(printerActions.print({
        fnsku: item.FulfillmentNetworkSKU,
        name: item.ProductSearchResult.name
      }, 1))
      yield put(appActions.apiCallUserSoundNotificationSuccess());
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Failed to print item."));
      logError(error, {
        tags: {
          exceptionType: "PRINT_SHIPMENT_ITEM_ERROR"
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(shipmentListRequest),
    fork(selectShipmentRequest),
    fork(addShipmentBoxRequest),
    fork(moveItemRequest),
    fork(searchProductRequest),
    fork(addProductRequest),
    fork(updateCurrentShipmentBoxRequest),
    fork(printShipmentItem),
    fork(delProductRequest),
  ]);
}
