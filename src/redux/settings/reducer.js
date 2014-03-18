import { Map } from "immutable/dist/immutable";
import actions from "./actions";

const initState = new Map({
  listingDefaults: {
    list_price: null,
    buy_cost: null,
    quantity: null,
    min_price: null,
    max_price: null,
    tax_code: null,
    list_price_rule_type: "",
    list_price_rule_amount: "",
    price_rule_type: false,
    price_rule_direction: "",
    default_list_price: null,
    keepa_date_range: null,
    sku_prefx: null,
    condition: '',
  },
  printerDefaults: {
    printer_name: null,
    manufacturer: null,
    label_type: null,
    label_width: null,
    label_height: null,
    orientation: null,
    print_while_scanning: null,
    print_while_scanning_box_contents: null,
    printer_system: null,
  },
  currentAlert: null,
  updatePasswordRequestStatus: null,
  supplierList: null,
  scoutList: null,
  printerDefaultsAreProcessing: false,
  profileImage: require("../../assets/images/users/generic-profile-image.png"),
  profileBillingDataSet: {
	'user_data': {
		'username': '',
		'businessname': '',
		'created': ''
	},
	'billing_data': []
  },
  is_member: false,
  isUserSettingsUpdating: false,
  isUserSettingsDataUpdating: false,
});

export default function settingsReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_LISTING_DEFAULTS_SUCCESS:
      return state
        .set("listingDefaults", action.listingDefaults)

    case actions.FETCH_PRINTER_DEFAULTS:
      return state
          .set("printerDefaultsAreProcessing", true)

    case actions.FETCH_PRINTER_DEFAULTS_SUCCESS:
      return state
        .set("printerDefaults", action.printerDefaults)
        .set("printerDefaultsAreProcessing", false)

    case actions.SAVE_PRINTER_DEFAULTS:
      return state
        .set("printerDefaultsAreProcessing", true)

    case actions.SAVE_PRINTER_DEFAULTS_ERROR:
      return state
        .set("printerDefaultsAreProcessing", false)

    case actions.CLOSE_SETTINGS_ALERT:
        return state.set("currentAlert", null)

    case actions.SHOW_SETTINGS_ALERT:
        return state.set("currentAlert", action.alert)

    case actions.UPDATE_USER_PASSWORD_REQUEST_STATUS:
        return state.set("updatePasswordRequestStatus", action.status)

    case actions.FETCH_SUPPLIER_LIST_SUCCESS:
        return state.set("supplierList", action.supplierList)

    case actions.ADD_SUPPLIER_TO_LIST_SUCCESS:
      let newSupplierList = state.get("supplierList");
      return state.set("supplierList", [...newSupplierList, action.supplierList])

    case actions.DEL_SUPPLIER_FROM_LIST_SUCCESS:
      let supplierList = state.get("supplierList");
      supplierList.forEach((element, index) => {
        if (element.id === action.supplierId) {
          supplierList.splice(index, 1);
          return false;
        }
      })
      return state.set("supplierList", [...supplierList])

    case actions.EDIT_SUPPLIER_FROM_LIST_SUCCESS:{
      return state.update("supplierList", (supplierList) => {
        const supplierIndex = supplierList.findIndex(element => {
          return element.id === action.supplierId;
        })
        if (supplierIndex > -1) {
          supplierList[supplierIndex].supplier_name = action.newSupplierName;
          return [...supplierList];
        }
        return [...supplierList];
      });
    }

    case actions.UPLOAD_PROFILE_IMAGE_SUCCESS:
		  return state.set("profileImage", action.data['url'])

    case actions.GET_PROFILE_IMAGE_SUCCESS:
		  return state.set("profileImage", action.data['url'])

    case actions.GET_PROFILE_BILLING_DATA_SUCCESS:
		  let billing_data = action.data;
		  return state
				.set("is_member", (billing_data.user_data.active === 'true'))
				.set("profileBillingDataSet", billing_data)

    case actions.SETTINGS_UPDATE_USER_DATA:
		  return state
				.set("isUserSettingsUpdating", true)

    case actions.SETTINGS_UPDATE_USER_DATA_SUCCESS:
		  return state
				.set("isUserSettingsUpdating", false)

    case actions.SETTINGS_UPDATE_USER_DATA_ERROR:
		  return state
				.set("isUserSettingsUpdating", false)

    case actions.SETTINGS_UPDATE_USER_SETTINGS:
		  return state
				.set("isUserSettingsDataUpdating", true)

    case actions.SETTINGS_UPDATE_USER_SETTINGS_SUCCESS:
		  return state
				.set("isUserSettingsDataUpdating", false)

    case actions.SETTINGS_UPDATE_USER_SETTINGS_ERROR:
		  return state
				.set("isUserSettingsDataUpdating", false)

    case actions.FETCH_SCOUT_LIST_SUCCESS:
        return state.set("scoutList", action.scoutList)

    case actions.ADD_SCOUT_TO_LIST_SUCCESS:
      let newScoutList = state.get("scoutList");
      return state.set("scoutList", [...newScoutList, action.scoutList])

    case actions.DEL_SCOUT_FROM_LIST_SUCCESS:
      let scoutList = state.get("scoutList");
      scoutList.forEach((element, index) => {
        if (element.id === action.scoutId) {
          scoutList.splice(index, 1);
          return false;
        }
      })
      return state.set("scoutList", [...scoutList])

    case actions.EDIT_SCOUT_FROM_LIST_SUCCESS:{
      return state.update("scoutList", (scoutList) => {
        const scoutIndex = scoutList.findIndex(element => {
          return element.id === action.scoutId;
        })
        if (scoutIndex > -1) {
          scoutList[scoutIndex].scout_name = action.newScoutName;
          return [...scoutList];
        }
        return [...scoutList];
      });
    }

    default:
      return state
  }
}
