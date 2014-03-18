import { Map } from "immutable";
import actions from "./actions";

const defaultWorkflowOptions = {
  isHoldingAreaListing: false,
  speedMode: false,
  showPricing: false,
}

let initialState = new Map({
  currentFlow: "created_listings_display",
  sidebarTabId: "1",
  batchModalVisible: false,
  createdBatchId: null,
  currentSelectedSearchResult: null,
  currentModal: null,
  currentAlert: null,
  search: {
    searchResults: null,
    isLoadingSearchResults: false,
    query: "",
  },
  conditionNotes: [],
  shipmentIdToCurrentBoxMapping: {},
  shipmentIdToBoxCountMapping: {},
  currentWorkingListingData: null,
  currentListingWorkflowOptions: {
    ...defaultWorkflowOptions
  },
  currentEditableListingData: null,
  currentFeedStatusData: null,
  currentShipmentPlans: null,
  batchListingDefaults: {
    shouldUseCustomSkuTemplate: true,
    skuPrefix: "",
    skuNumber: 1,
    buyCost: "",
    supplier: "",
    datePurchased: "",
    expDate: "",
    price: "",
    qty: 1,
    condition: "NoDefault",
    note: "",
    taxCode: "A_GEN_TAX",
    minPrice: 0.01,
    maxPrice: 999.99,
    noteCategory: "All Categories",
    noteSubcategory: "All Subcategories",
    shippingTemplate: "",
    listPriceRuleType: "",
    listPriceRuleAmount: "",
    priceRuleType: false,
    priceRuleDirection: "",
    pricingOptions: false,
    gradingOptions: false,
    keepaDateRange: null,
  },
  batchMetadata: {
    id: null,
    channel: null,
    labelingPreference: null,
    intendedBoxContentsSource: null,
    addressId: null,
    name: null,
    workflowType: null,
    status: null
  },
  products: [],
  listingProcess: "precision",
  listingCurrentPage: 1,
  productFeedSubmissions: [],
  holdings: null,
  loadingHoldings: false,
  addingToHoldings: false,
  inboundShipmentPlans: [],
  existingShipments: [],
  createShipmentPlansRequestStatus: "",
  isHoldingAreaListing: false,
  addToBatchStatus: false,
  suppliers: [],
  scouts: [],

  createHoldingAreaShipmentLoading: false,
  createHoldingAreaShipmentLoaded: false,
  createHoldingAreaShipmentError: false,
  holdingAreaShipmentBatch: { created_batch_id: null },
  batchLoaded: false,
  allBatchListingRowsExpanded: false,
  searchResultIsEmpty: false,
	facebookShareURL: null,
	facebookShareInProgress: false,
});


export default function batchReducer(state = initialState, action) {
  switch (action.type) {
    //Actions related Batch Modal
    case actions.UPDATE_KEY_VALUE:
      return state
              .set(action.fieldName, action.fieldValue);
    case actions.SHOW_BATCH_MODAL:
      return state.set("batchModalVisible", true);

    case actions.HIDE_BATCH_MODAL:
      return state.set("batchModalVisible", false);

    case actions.CREATE_NEW_BATCH_SUCCESS:
      return state
        .set("createdBatchId", action.batchId)
        .set("batchModalVisible", false);

    case actions.CREATE_NEW_SUPPLIER_SUCCESS:
      return state.update("suppliers", suppliers => {
        return [...suppliers, action.supplierData];
      });

    case actions.CLOSE_ALERT:
      return state.set("currentAlert", null);

    case actions.SHOW_ALERT:
      return state.set("currentAlert", action.alert);

    case actions.UPDATE_ADD_TO_BATCH_STATUS:
      return state.set("addToBatchStatus", action.status);

    case actions.RECEIVE_PRODUCT_SEARCH_RESULTS:
      return state.set(
        "search",
        Object.assign({}, state.get("search"), {
          searchResults: action.searchResults,
          isLoadingSearchResults: false
        })
      );

    case actions.REQUEST_PRODUCT_SEARCH_RESULTS_FAILED:
      return state.set(
        "search",
        Object.assign({}, state.get("search"), {
          isLoadingSearchResults: false
        })
      );

    case actions.CLEAR_BATCH:
      return initialState;

    case actions.CREATE_HOLDING_AREA_SHIPMENT:
        return state
          .set("createHoldingAreaShipmentLoading", true)
          .set("createHoldingAreaShipmentLoaded", false)
          .set("createHoldingAreaShipmentError", false);
    case actions.CREATE_HOLDING_AREA_SHIPMENT_SUCCESS:
        const newInboundShipmentPlans = state
          .get("inboundShipmentPlans")
          .filter(plan => plan.ShipmentId !== action.addedInboundShipmentPlan.ShipmentId);
        return state
          .set("createHoldingAreaShipmentLoading", false)
          .set("createHoldingAreaShipmentLoaded", true)
          .set("createHoldingAreaShipmentError", false)
          .set("holdingAreaShipmentBatch", action.holdingAreaShipmentBatch)
          .set("holdings", action.holdingAreaShipmentBatch.holding_area_listings)
          .set("inboundShipmentPlans", newInboundShipmentPlans);

    case actions.CREATE_HOLDING_AREA_SHIPMENT_FAILURE:
      return state
          .set("createHoldingAreaShipmentLoading", false)
          .set("createHoldingAreaShipmentLoaded", true)
          .set("createHoldingAreaShipmentError", action.error);
    case actions.LOAD_BATCH_SUCCESS:
      return state
        .set("products", action.products)
        .set("batchMetadata", action.batchMetadata)
        .set("productFeedSubmissions", action.productFeedSubmissions)
        .set("suppliers", action.suppliers)
        .set("scouts", action.scouts)
        .set("shipmentIdToBoxCountMapping", action.shipmentIdToBoxCountMapping)
        .set(
          "shipmentIdToCurrentBoxMapping",
          action.shipmentIdToCurrentBoxMapping
        )
        .set("conditionNotes", action.conditionNotes)
        .update("batchListingDefaults", batchListingDefaults => {
          return Object.assign({}, batchListingDefaults, action.listingDefaults)
        })
        .set("batchLoaded", true);

    case actions.SET_CURRENT_FLOW:
      return state.set("currentFlow", action.currentFlow);

    case actions.REQUEST_PRODUCT_SEARCH_RESULTS:
      return state.set(
        "search",
        Object.assign({}, state.get("search"), {
          isLoadingSearchResults: true
        })
      );

    case actions.HANDLE_PRODUCT_SEARCH_QUERY_CHANGE:
      return state
        .set("searchResultIsEmpty", false)
        .set(
          "search",
          Object.assign({}, state.get("search"), {
            query: action.query
          })
        );

    case actions.SELECT_PRODUCT_SEARCH_RESULT:
      return state.set("currentSelectedSearchResult", action.searchResult);

    case actions.SET_CURRENT_EDITABLE_LISTING: {
      let currentEditableListingData = Object.assign({}, action.listing);
      return state.set(
        "currentEditableListingData",
        currentEditableListingData
      ).set(
        "isHoldingAreaListing",
        action.isHoldingAreaListing
      );
    }

    case actions.SET_CURRENT_FEED_STATUS: {
      let currentFeedStatusData = Object.assign({}, action.listing);
      return state.set("currentFeedStatusData", currentFeedStatusData);
    }

    case actions.SET_CURRENT_WORKING_LISTING: {
      let currentWorkingListingData = Object.assign({}, action.listing);
      return state.set("currentWorkingListingData", currentWorkingListingData);
    }

    case actions.INITIALIZE_CURRENT_WORKING_LISTING: {
      /*
      Initializing a listing means taking
        1) the preset listing defaults,
        2) some fields from the current search results,
      Attaching them to a new listing, and then setting that as the
      currentWorkingListingData field in batch state.
      */
      let currentSearchResult = Object.assign(
        {},
        state.get("currentSelectedSearchResult")
      );
      let batchListingDefaults = Object.assign(
        {},
        state.get("batchListingDefaults")
      );
      let currentWorkingListingData = Object.assign({}, batchListingDefaults, {
        asin: currentSearchResult.ASIN,
        imageUrl: currentSearchResult.imageUrl,
        salesrank: parseInt(currentSearchResult.salesrank, 10) || null,
        prepInstructions: currentSearchResult.prepInstructions,
        name: currentSearchResult.name,
        category: currentSearchResult.category,
        itemWeight: (currentSearchResult.itemDimensions || {}).Weight || 0.0,
        packageWeight: (currentSearchResult.packageDimensions || {}).Weight || 0.0,
      });
      if (currentWorkingListingData.condition === "NoDefault") {
        currentWorkingListingData.condition = "";
      }
      return state.set("currentWorkingListingData", currentWorkingListingData);
    }

    case actions.UPDATE_CURRENT_LISTING_WORKFLOW_OPTIONS: {
      let currentListingWorkflowOptions = Object.assign({}, state.get("currentListingWorkflowOptions"), {
        [action.key]: action.value
      })
      return state.set("currentListingWorkflowOptions", currentListingWorkflowOptions);
    }

    case actions.RESET_CURRENT_LISTING_WORKFLOW_OPTIONS: {
      return state.set("currentListingWorkflowOptions", defaultWorkflowOptions);
    }

    case actions.CLEAR_CURRENT_WORKING_LISTING:
      return state.set("currentWorkingListingData", null);

    case actions.CLEAR_CURRENT_EDITABLE_LISTING:
      return state.set("currentEditableListingData", null);

    case actions.UPDATE_CURRENT_WORKING_LISTING: {
      let currentWorkingListingData = Object.assign(
        {},
        state.get("currentWorkingListingData")
      );

      // Don't do any conversion here
      currentWorkingListingData[action.fieldName] = action.fieldValue;
      return state.set("currentWorkingListingData", currentWorkingListingData);
    }

    case actions.UPDATE_LISTING_DEFAULTS_DATA_SUCCESS: {
      let batchListingDefaults = Object.assign(
        {},
        state.get("batchListingDefaults")
      );
      batchListingDefaults[action.fieldName] = action.fieldValue;
      return state
        .set("batchListingDefaults", batchListingDefaults);
    }

    case actions.CLEAR_SEARCH:
      return state.set("search", initialState.get("search"));

    case actions.CLEAR_SEARCH_QUERY:
      return state.update("search", (search) => {
        return Object.assign({}, search, { query: ""})
      });

    case actions.ADD_CURRENT_WORKING_LISTING_TO_BATCH: {
      let currentWorkingListingData = Object.assign(
        {},
        state.get("currentWorkingListingData")
      );
      let products = state.get("products").slice();
      products.unshift(currentWorkingListingData);
      return state.set("products", products);
    }

    case actions.REQUEST_FULFILLMENT_CENTER_DATA:
      // @TODO: Use this to set loading state
      return state;

    case actions.SET_LIVE_BATCH_FULFILLMENT_CENTER_DATA: {
      let fulfillmentCenters = action.fulfillmentCenterData.fulfillmentCenters;
      let currentWorkingListingData = Object.assign(
        {},
        state.get("currentWorkingListingData")
      );
      currentWorkingListingData.fulfillmentCenters = fulfillmentCenters;
      return state.set("currentWorkingListingData", currentWorkingListingData);
    }

    case actions.SET_FNSKU: {
      let currentWorkingListingData = Object.assign(
        {},
        state.get("currentWorkingListingData")
      );
      currentWorkingListingData.fnsku = action.fnsku;
      return state.set("currentWorkingListingData", currentWorkingListingData);
    }

    case actions.UPDATE_MODAL_DISPLAY:
      return state.set("currentModal", action.modalName);

    case actions.CLOSE_MODAL:
      return state.set("currentModal", initialState.get("currentModal"));

    case actions.AUTO_ADD_ITEM_TO_BOX_CONTENTS: {
      let currentWorkingListingData = Object.assign(
        {},
        state.get("currentWorkingListingData")
      );
      currentWorkingListingData.boxContents = action.boxContents;
      let shipmentIdToCurrentBoxMapping = action.shipmentIdToCurrentBoxMapping;
      let shipmentIdToBoxCountMapping = action.shipmentIdToBoxCountMapping;
      return state
        .set("currentWorkingListingData", currentWorkingListingData)
        .set("shipmentIdToCurrentBoxMapping", shipmentIdToCurrentBoxMapping)
        .set("shipmentIdToBoxCountMapping", shipmentIdToBoxCountMapping);
    }

    case actions.ADD_INBOUND_SHIPMENT_PLANS: {
      let currentWorkingListingData = state.get("currentWorkingListingData");
      currentWorkingListingData.inboundShipmentPlans =
        action.inboundShipmentPlans;
      return state.set("currentWorkingListingData", currentWorkingListingData);
    }

    case actions.SUBMIT_PRODUCT_FEED_SUCCESS: {
      let productFeedSubmissions = state.get("productFeedSubmissions").slice();
      productFeedSubmissions.push(action.productFeedSubmission);
      return state.set("productFeedSubmissions", productFeedSubmissions);
    }

    case actions.GET_PRODUCT_FEED_STATUS_SUCCESS: {
      const feedIds = Object.keys(action.statuses);

      let newProductFeedSubmissions = state.get("productFeedSubmissions");
      newProductFeedSubmissions = newProductFeedSubmissions.map(submission => {
        if (feedIds.indexOf(submission.feed_id) !== -1) {
          return {
            ...submission,
            status: action.statuses[submission.feed_id].status,
            feed_result: action.statuses[submission.feed_id].feed_result,
            parsed_feed: action.statuses[submission.feed_id].parsed_feed
          };
        }
        return submission;
      });

      return state.set("productFeedSubmissions", newProductFeedSubmissions);
    }

    case actions.GET_PRICING_DATA_SUCCESS: {
      let currentWorkingListingData = Object.assign(
        {},
        state.get("currentWorkingListingData")
      );
      let pricingData = action.pricingData;
      currentWorkingListingData.pricingData = action.pricingData;
      currentWorkingListingData.totalFeeEstimate = Number(pricingData.totalFeeEstimate);
      return state.set("currentWorkingListingData", currentWorkingListingData);
    }

    case actions.EDIT_LISTING_SUCCESS: {
      let products = state.get("products").slice(),
        editedListing = action.listing,
        newProducts = [];

      products.forEach(product => {
        if (product.sku === editedListing.sku) {
          product = Object.assign({}, product, editedListing);
        }
        newProducts.push(product);
      });

      return state.set("products", newProducts);
    }

    case actions.DELETE_LISTING_SUCCESS:
      let listingCurrentPage = state.get("listingCurrentPage");
      const products = state.get("products");
      if (products && products.length > 0 && products[products.length - 1].sku === action.sku) {
        listingCurrentPage = Math.max(listingCurrentPage - 1, 1)
      }
      let newProducts = state
        .get("products")
        .slice()
        .filter(product => product.sku !== action.sku);
      return state
        .set("products", newProducts)
        .set("listingCurrentPage", listingCurrentPage);

    case actions.SEND_TO_HOLDING_AREA:
      return state.set("addingToHoldings", true);

    case actions.SEND_TO_HOLDING_AREA_SUCCESS:
      return state.set("addingToHoldings", false);

    case actions.SEND_TO_HOLDING_AREA_FAILURE:
      return state.set("addingToHoldings", false);

    case actions.BULK_SEND_TO_HOLDING_AREA_SUCCESS: {
      let rejectedShipmentIds = action.rejectedShipmentIds;
      let products = action.products;
      let inboundShipmentPlans = state.get("inboundShipmentPlans")
        .slice()
        .filter(plan => rejectedShipmentIds.indexOf(plan.ShipmentId) === -1);

      return state
        .set("inboundShipmentPlans", inboundShipmentPlans)
        .set("products", products);
    }

    case actions.GET_HOLDINGS:
      return state.set("loadingHoldings", true);

    case actions.GET_HOLDINGS_SUCCESS:
      return state
        .set("loadingHoldings", false)
        .set("holdings", action.holdings);

    case actions.GET_HOLDINGS_FAILURE:
      return state.set("loadingHoldings", false);

    case actions.DELETE_HOLDING_AREA_LISTING_SUCCESS:
      let holdings = state
        .get("holdings")
        .slice()
        .filter(holding => holding.sku !== action.sku);
      return state.set("holdings", holdings);

    case actions.ADD_BOX_INFO_FOR_SHIPMENT_SUCCESS:
    case actions.UPDATE_BOX_INFO_FOR_SHIPMENT_SUCCESS:
      let { currentBoxUpdate, boxCountUpdate } = action;
      let shipmentIdToBoxCountMapping = Object.assign(
        {},
        state.get("shipmentIdToBoxCountMapping"),
        boxCountUpdate
      );
      let shipmentIdToCurrentBoxMapping = Object.assign(
        {},
        state.get("shipmentIdToCurrentBoxMapping"),
        currentBoxUpdate
      );

      return state
        .set("shipmentIdToBoxCountMapping", shipmentIdToBoxCountMapping)
        .set("shipmentIdToCurrentBoxMapping", shipmentIdToCurrentBoxMapping);

    case actions.SET_SIDEBAR_TAB_ID:
      return state.set("sidebarTabId", action.tabId);

    case actions.CREATE_SHIPMENT_PLANS_SUCCESS:
      return state.set("inboundShipmentPlans", action.inboundShipmentPlans);

    case actions.CREATE_SHIPMENT_SUCCESS:
      let createdShipmentIds = action.createdShipmentIds;
      let remainingShipmentPlans = state.get("inboundShipmentPlans").slice();
      remainingShipmentPlans = remainingShipmentPlans.filter(
        plan => createdShipmentIds.indexOf(plan.ShipmentId) === -1
      );
      return state
        .set("inboundShipmentPlans", remainingShipmentPlans)
        .set("existingShipments", action.existingShipments);

    case actions.SET_CURRENT_SHIPMENT_PLANS:
      return state.set("currentShipmentPlans", action.shipmentPlans);

    case actions.GOTO_PREVIOUS_PAGE:
      return state
        .update('listingCurrentPage', (listingCurrentPage) => {
          if (listingCurrentPage > 1) {
            return listingCurrentPage - 1
          }
          return 1
        });

    case actions.GOTO_NEXT_PAGE:
      return state
        .update('listingCurrentPage', (listingCurrentPage) => {
          return listingCurrentPage + 1
        })

    case actions.SET_CURRENT_PAGE:
      return state
        .update('listingCurrentPage', (listingCurrentPage) => {
          if (action.page < 1) {
            return 1;
          }
          return action.page
        })

    case actions.UPDATE_CREATE_SHIPMENT_PLANS_REQUEST_STATUS:
      return state.set("createShipmentPlansRequestStatus", action.status);

    case actions.SET_EXPANDING_ROWS_BATCH_LIST:
      return state.set("allBatchListingRowsExpanded", action.allBatchListingRowsExpanded);

    case actions.SET_SEARCH_RESULT_IS_EMPTY:
      return state.set("searchResultIsEmpty", action.status);

    case actions.REJECT_SHIPMENT_PLANS_SUCCESS:
		return state
			.set("inboundShipmentPlans", [])
			.set("holdings", null)
			.set("currentShipmentPlans", null)
			.set("existingShipments", [])
			.set("createShipmentPlansRequestStatus", "")

    case actions.FACEBOOK_SHARE:
		  return state
			  .set("facebookShareInProgress", true)
			  .set("facebookShareURL", null)

    case actions.FACEBOOK_SHARE_SUCCESS:
		  return state
			  .set("facebookShareInProgress", false)
			  .set("facebookShareURL", null)

    case actions.FACEBOOK_SHARE_ERROR:
		  return state
			  .set("facebookShareInProgress", false)
			  .set("facebookShareURL", null)

	case actions.BATCH_METADATA_UPDATE:
		return state
			.set("batchMetadata", Object.assign({}, action.data))

    default:
      return state;
  }
}
