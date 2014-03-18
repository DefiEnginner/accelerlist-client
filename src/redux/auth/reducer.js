import { Map } from "immutable";
import { getToken } from "../../helpers/utility";
import actions from "./actions";
import { userData } from "../../config/storeKeys";

const initState = new Map({
  access_token: null,
  refresh_token: null,
  token_valid: false,
  loginError: false,
  credentialVerified: true,
  expires_in: null,
  mwsAuthValues: {},
  internationalization_config: {
    currency_code: "USD",
    fulfillment_channel_id_for_fba: "AMAZON_NA",
    ship_to_country_code: "US",
    sales_channel: "Amazon.com",
    amazon_url: "www.amazon.com",
    seller_central_url: "sellercentral.amazon.com",
    currency_identifier: "$",
    developer_account_number: "5445-7997-8640",
    keepa_domain: "com",
    camelcamelcamel_url: "camelcamelcamel.com",
	ebay_url: "www.ebay.com",
    keepa_url: "keepa.com"
  },
  navBarIndex: null,
  isOpenMwsAuthorizeModal: false,
  passwordResetMessage: null,
  signinRequestInProcess: false,
  signupRequestInProcess: false
});

export default function authReducer(
  state = initState.merge(getToken()),
  action
) {
  switch (action.type) {
    case actions.SIGNUP_REQUEST:
      return state.set("signupRequestInProcess", true);

    case actions.SIGNUP_SUCCESS:
      return state.set("signupRequestInProcess", false);

    case actions.SIGNUP_ERROR:
      return state.set("signupRequestInProcess", false);

    case actions.LOGIN_REQUEST:
      return state.set("signinRequestInProcess", true).set("loginError", false);
    case actions.LOGIN_SUCCESS:
      return state
        .set("signinRequestInProcess", false)
        .set("access_token", action.access_token)
        .set("refresh_token", action.refresh_token)
        .set("expires_in", action.expires_in)
        .set("loginError", false);

    case actions.LOGIN_ERROR:
      return state.set("signinRequestInProcess", false).set("loginError", true);

    case actions.LOGOUT:
      return initState;

    case actions.REFRESH_TOKEN_SUCCESS:
      return state
        .set("access_token", action.access_token)
        .set("expires_in", action.expires_in)
        .set("token_valid", true);

    case actions.REFRESH_TOKEN_ERROR:
      return state.set("token_valid", false);

    case actions.GET_USER_INTERNATIONALIZATION_CONFIG_REQUEST_SUCCESS:
      return state.set("internationalization_config", action.config);

    case actions.CREDENTIAL_VERIFY_SUCCESS:
      return state
        .set("credentialVerified", true)
        .set("mwsAuthValues", action.credentialData)
        .set("isOpenMwsAuthorizeModal", false);

    case actions.CREDENTIAL_VERIFIED:
      return state
        .set("credentialVerified", true)
        .set(userData, action.userData);

    case actions.CREDENTIAL_NOT_VERIFIED:
      return state.set("credentialVerified", false);

    case actions.CREDENTIAL_VERIFY_ERROR:
      return state.set("credentialVerified", false);
    case actions.NAV_BAR_INDEX_REQUEST:
      return state.set("navBarIndex", action.navBarIndex);

    case actions.UPDATE_USER_DATA:
      return state.set("userData", Object.assign({}, action.userData));

    case actions.SET_OPEN_MWS_AUTHORIZE_MODAL:
      return state.set("isOpenMwsAuthorizeModal", true);

    case actions.SET_CLOSE_MWS_AUTHORIZE_MODAL:
      return state.set("isOpenMwsAuthorizeModal", false);

    case actions.PASSWORD_RESET_REQUEST_SUCCESS:
      return state.set("passwordResetMessage", action.message);

    default:
      return state;
  }
}
