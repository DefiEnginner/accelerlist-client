import { fromJS } from "immutable";
import actions from "./actions";

const initState = fromJS({
  shipmentList: null,
  shipmentListError: null,
  loadingList: false,
  loadingShipment: false,
  loadingAddBox: false,
  selectedShipments: [],
  selectedShipmentsData: [],
  selectedShipment: null,
  selectedShipmentError: false,
  selectedShipmentBox: null,
  currentAlert: null,
  query: "",
  searchingProduct: false,
  searchErrorType: null,
  searchErrorData: [],
  addingProduct: false,
  selectedSearchItem: null,
  page: 1,
  limit: 50,
  boxDialogPage: 1,
  boxDialogLimit: 5
});


export default function boxContentReducer(state = initState, action) {
  switch (action.type) {
    case actions.CHANGE_BOX_DIALOG_PAGINATION_LIMIT:
      return state
        .set('boxDialogPage', action.page)
        .set('boxDialogLimit', action.limit);
    case actions.CHANGE_PAGINATION_LIMIT:
      return state
        .set('page', action.page)
        .set('limit', action.limit);
    case actions.CHOOSE_SEARCH_ITEM:
      return state
        .set("selectedSearchItem", action.item)
        .set("searchErrorType", null)
        .set("searchErrorData", []);
    case actions.LOAD_SHIPMENT_LIST_REQUEST:
      return state
        .set("shipmentListError", null)
        .set("loadingList", true);
    case actions.LOAD_SHIPMENT_LIST_SUCCESS:
      return state
        .set("shipmentList", fromJS(action.shipmentList))
        .set("shipmentListError", false)
        .set("loadingList", false);
    case actions.LOAD_SHIPMENT_LIST_ERROR:
      return state
        .set("shipmentListError", true)
        .set("loadingList", false);
    case actions.UPDATE_SELECTED_SHIPMENT_READY_FLAG:
      return state
        .updateIn(["selectedShipmentsData", action.shipmentIndex, 'isReady'], value => action.flag);
    case actions.UPDATE_SELECTED_SHIPMENT_BOX:
      return state
        .updateIn(["selectedShipmentsData", action.shipmentIndex, 'currentBox'], value => action.box);
    case actions.REMOVE_SELECTED_SHIPMENT:
      return state
        .deleteIn(['selectedShipmentsData', action.dataIndex])
        .deleteIn(['selectedShipments', action.shipmentIndex])
    case actions.SELECT_SHIPMENT_REQUEST:
      return state
        .update('selectedShipments', arr => arr.push(fromJS(action.selectedShipment)))
        .set("loadingShipment", true)
        .set("selectedShipmentError", false);
    case actions.SELECT_SHIPMENT_SUCCESS: {
      let currentBox;
      let {selectedShipmentData, selectedShipment} = action;
      if(!!selectedShipmentData.current_box_id) {
        let index = selectedShipmentData.boxes.findIndex((box) => {
          if (selectedShipmentData && selectedShipmentData.current_box_id) {
            return box.id === Number(selectedShipmentData.current_box_id);
          }
          return false;
        })
        currentBox = selectedShipmentData.boxes[index];
      }
      return state
        .update("selectedShipmentsData", arr => arr.push(fromJS({
          boxes: selectedShipmentData.boxes,
          inboundShipmentItems:
            selectedShipmentData.inbound_shipment_items,
          selectedShipment: selectedShipment,
          currentBox: currentBox,
          isReady: false,
          inputToAsinListMapping: selectedShipmentData.input_to_asin_list_mapping,
          asinToSearchResultDataMapping: selectedShipmentData.asin_to_search_result_data_mapping,
          additionalData: selectedShipmentData.sku_additional_data_mapping,
          warning: selectedShipmentData.warning
        })))
        .set("loadingShipment", false)
        .set("addingProduct", false)
        .set("query", "");
    }

    case actions.MOVE_ITEM_SUCCESS: {
      let selectedShipmentsData = state.get("selectedShipmentsData").toJS();
      let index = selectedShipmentsData.findIndex((shipment) => {
        return shipment.selectedShipment.ShipmentId === action.shipmentId;
      })
      return state
        .updateIn(["selectedShipmentsData", index], (shipment) => {
			//console.log("this is the input to the move item update", shipment);
          let output = Object.assign({}, shipment.toJS(), {
            boxes: action.boxes
          });
			// console.log("this is the output to the move item update", output);
          return fromJS(output);
        })
        .set("loadingShipment", false)
        .set("addingProduct", false)
        .set("query", "");
    }

    case actions.SELECT_SHIPMENT_ERROR:
      return state
        .set("loadingShipment", false)
        .set("selectedShipmentError", true)
        .set("addingProduct", false)
    case actions.SELECT_SHIPMENT_BOX:
      return state.set("selectedShipmentBox", action.selectedShipmentBox);
    case actions.ADD_SHIPMENT_BOX_REQUEST:
      return state.set("loadingAddBox", true);
    case actions.ADD_SHIPMENT_BOX_ERROR:
      return state.set("loadingAddBox", false);
    case actions.ADD_SHIPMENT_BOX_SUCCESS: {
      let selectedShipmentsData = state.get("selectedShipmentsData").toJS();
      let index = selectedShipmentsData.findIndex((shipment) => {
        return shipment.selectedShipment.ShipmentId === action.shipmentId;
      })
      let newShipment = selectedShipmentsData[index];
      newShipment.boxes.push(action.shipmentBox);
      newShipment.currentBox = action.shipmentBox;
      return state
        .updateIn(["selectedShipmentsData", index], () => fromJS(newShipment))
        .set("loadingAddBox", false);
    }
    case actions.CLOSE_ALERT:
      return state.set("currentAlert", null);
    case actions.SHOW_ALERT:
      return state.set("currentAlert", action.alert);
    case actions.UPDATE_QUERY:
		  //console.log(action.query);
      return state.set("query", action.query);
    case actions.SEARCH_PRODUCT_REQUEST:
      return state.set("searchingProduct", true)
        .set("searchErrorType", null)
        .set("searchErrorData", [])
        .set("selectedSearchItem", null)
    case actions.SEARCH_PRODUCT_SUCCESS:
      return state.set("searchingProduct", false)
      .set("searchErrorType", null)
      .set("searchErrorData", [])
    case actions.SEARCH_PRODUCT_ERROR:
      return state
        .set("searchingProduct", false)
        .set("searchErrorType", action.searchErrorType)
        .set("searchErrorData", action.searchErrorData);
    case actions.ADD_PRODUCT_REQUEST:
      return state.set("addingProduct", true);
    case actions.ADD_PRODUCT_SUCCESS:
      return state
        .set("addingProduct", false)
        .update("selectedShipmentsData", selectedShipmentsData => {
          return selectedShipmentsData.map(selectedShipmentData => {
            let selectedShipmentDataJS = selectedShipmentData.toJS();
            return fromJS({
              ...selectedShipmentDataJS,
              boxes: selectedShipmentDataJS.boxes.map(box => {
                box = Object.assign({}, box);
                if (box.id === action.boxId) {
                  box.items.unshift(action.product);
                }
                return box;
              })
            })
          })
        });

    case actions.ADD_PRODUCT_ERROR:
      return state
        .set("addingProduct", false);

    case actions.UPDATE_PRODUCT_SUCCESS:
      return state
        .set("addingProduct", false)
        .update("selectedShipmentsData", selectedShipmentsData => {
          return selectedShipmentsData.map(selectedShipmentData => {
            let selectedShipmentDataJS = selectedShipmentData.toJS();
            return fromJS({
              ...selectedShipmentDataJS,
              boxes: selectedShipmentDataJS.boxes.map(box => {
                if (box.id === action.boxId) {
                  box.items = box.items.map(product => {
                    if (product.BoxContentItemId === action.itemId) {
                      product = {
                        ...product,
                        ...action.updatedData,
                      }
                    }
                    return product;
                  })
                }
                return box;
              })
            });
          })
        });

    case actions.CLEAR_ADD_PRODUCT_ERROR:
      return state
        .set("searchErrorType", null)
        .set("searchErrorData", []);

    case actions.DEL_PRODUCT_REQUEST_SUCCESS:
      return state
        .update("selectedShipmentsData", selectedShipmentsData => {
          return selectedShipmentsData.map(selectedShipmentData => {
            let selectedShipmentDataJS = selectedShipmentData.toJS();
            return fromJS({
              ...selectedShipmentDataJS,
              boxes: selectedShipmentDataJS.boxes.map(box => {
                if (box.id === action.boxId) {
                  const itemsArray = box.items.filter(el => el.BoxContentItemId !== action.itemId);
                  let buffBox = box;
                  buffBox.items = itemsArray;
                  return buffBox;
                } else {
                  return box;
                }
              })
            });
          })
        });

    default:
      return state;
  }
}
