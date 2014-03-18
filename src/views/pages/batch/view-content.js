import React from "react";
import batchActions from "../../../redux/batch/actions";
import appActions from "../../../redux/app/actions";
import settingActions from "../../../redux/settings/actions";
import addressActions from "../../../redux/address/actions";
import { connect } from "react-redux";
import CreatedListingsDisplay from "./displays/CreatedListingsDisplay";
import ListingCreatorDisplay from "./displays/ListingCreatorDisplay";
import SearchResultsDisplay from "./displays/SearchResultsDisplay";
import ShipmentPlansDisplay from "./displays/ShipmentPlansDisplay";
import BatchHoldingArea from "./displays/holding_area/BatchHoldingArea";
import FeedDisplay from "./displays/FeedDisplay";
import {
  constructExistingShipmentsFromListings
} from "../../../helpers/batch/utility";
import SweetAlert from "sweetalert2-react";
import BatchModals from "./batchModals";
import AlertBox from "../../../shared/components/AlertBox";

const {
  requestProductSearchResults,
  handleProductSearchQueryChange,
  selectProductSearchResultAndInitializeListing,
  tryAddingItemToBatch,
  closeModal,
  updateModalDisplay,
  displayCustomSKUTemplateModal,
  updateListingDefaultsData,
  loadBatch,
  showAlert,
  closeAlert,
  updateCurrentWorkingListingData,
  setCurrentFlow,
  submitProductFeed,
  updateInboundShipmentQuantityAndEditListing,
  updateInboundShipmentQuantityAndDeleteListing,
  sendToHoldings,
  getHoldings,
  setCurrentEditableListing,
  clearCurrentEditableListing,
  setSidebarTabId,
  setCurrentWorkingListing,
  deleteHoldingAreaListing,
  createNewSupplier,
  createShipmentPlans,
  createHoldingAreaShipment,
  createShipment,
  completeBatch,
  updateAddToBatchStatus,
  getProductFeedStatus,
  clearBatch,
  cancelListingCreationflow,
  rejectNewLiveBatchShipment,
  setAllBatchListingRowsExpanded,
} = batchActions;
const {
  apiCallSuccess,
  apiCallFailed
} = appActions;
const { fetchPrinterDefaults } = settingActions;
const { fetchAdressList } = addressActions;

class ListingFlow extends React.Component {
  constructor(props) {
    super(props);
	  this.state = {
		collapse: true,
		NewAlertOpen: false,
	  };
    this.ref = {};
  }

	NewAlertToggle(){
		this.setState({NewAlertOpen: false});
	}

  componentDidMount() {
    //var dymo = window.dymo;
    //loadBatch(this.props.batchId)
    this.props.clearBatch();
    this.props.loadBatch(this.props.id);
    this.props.fetchPrinterDefaults();
    this.props.fetchAdressList();
    // poll any feed submission ids that are still tangential and need
    // to be parsed

    this.interval = setInterval(() => {
      if (this.props.productFeedSubmissions) {
        let self = this;
        const notDoneFeeds = this.getNotDoneFeeds(this.props.productFeedSubmissions);
        if (notDoneFeeds.length > 0) {
          self.fireGetProductFeedsStatusRedux(notDoneFeeds);
        }
      }
    }, 45 * 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    const currentProductFeedSubmissions = this.props.productFeedSubmissions;
	const { NewAlertOpen } = this.state;
	const { currentAlert } = this.props;

    if (prevProps.id !== this.props.id) {
      this.props.loadBatch(this.props.id);
    }

    if ((prevProps.productFeedSubmissions && prevProps.productFeedSubmissions.length > 0) &&
      (currentProductFeedSubmissions && currentProductFeedSubmissions.length >0)) {
        prevProps.productFeedSubmissions.forEach((feedElement, index) => {
          if (currentProductFeedSubmissions[index].status &&
            (currentProductFeedSubmissions[index].status !== feedElement.status)) {
              if (currentProductFeedSubmissions[index].status === "_DONE_") {
                this.props.apiCallSuccess(`
                  Feed ID: ${currentProductFeedSubmissions[index].feed_id}
                  Status: ${currentProductFeedSubmissions[index].status}
                `);
              }
              if (currentProductFeedSubmissions[index].status === "_CANCELLED_") {
                this.props.apiCallFailed(`
                  Feed ID: ${currentProductFeedSubmissions[index].feed_id}
                  Status: ${currentProductFeedSubmissions[index].status}
                `);
              }
            }
        })
	}
	//show new alert
	if(currentAlert){
		if(currentAlert.error2 && !NewAlertOpen && currentAlert !== prevProps.currentAlert){
			this.setState({NewAlertOpen: true});
		}
	}

  }

  /*
  The following function give us a helper function inside the component that calls the right
  Redux action based on the props.batchMetadata.workflowType value.

  We prefer to do this custom logic, based on workflow type, here rather than in a saga
  that dispatches a separate action. This is because the payload for each action is
  pretty different and is mostly data from the Redux store. Therefore, in order to avoid
  having to pass lots of Redux state from action to action, we'll just do the logic here.
  */
  getNotDoneFeeds(feedSubmissions) {
    let notDoneFeeds = [];
    feedSubmissions.forEach(function(submission) {
      if (submission.status !== "_DONE_") {
        notDoneFeeds.push(submission);
      }
    });
    return notDoneFeeds;
  }

  fireGetProductFeedsStatusRedux(feeds) {
    let feedIds = [];
    if (feeds.length > 0) {
      feeds.forEach(function(feed) {
        feedIds.push(feed.feed_id);
      });
      this.props.getProductFeedStatus(feedIds);
    }
  }

  tryAddingItemToBatch(listing = null, isHoldingAreaListing) {
    const {
      tryAddingItemToBatch
    } = this.props;
    tryAddingItemToBatch(listing, isHoldingAreaListing);
  }

  requestProductSearchResults = query => {
    const {
      batchMetadata,
      products,
    } = this.props;
    this.props.requestProductSearchResults(
      query,
      batchMetadata.channel,
      products,
    );
  };

  selectProductSearchResultAndInitializeListing = searchResult => {
    const {
      batchMetadata,
      products,
    } = this.props;
    this.props.selectProductSearchResultAndInitializeListing(
      searchResult,
      batchMetadata.channel,
      products,
    );
  };

  createShipmentPlans = () => {
    let params = {batchId: this.props.batchMetadata.id};
    this.props.createShipmentPlans(this.props.products, params);
  };

  toggleRightNav = () => {
    this.setState({
      collapse: !this.state.collapse
    });
  };

  render() {
    let currentFlow = this.props.currentFlow;
    let flowContent;
    let {
      cancelListingCreationflow,
      products,
      updateListingDefaultsData,
      batchListingDefaults,
      currentSelectedSearchResult,
      batchMetadata,
      currentWorkingListingData,
      updateCurrentWorkingListingData,
      setCurrentFlow,
      updateModalDisplay,
      handleProductSearchQueryChange,
      displayCustomSKUTemplateModal,
      search,
      currentModal,
      submitProductFeed,
      productFeedSubmissions,
      setCurrentEditableListing,
      setSidebarTabId,
      sidebarTabId,
      closeModal,
      createNewSupplier,
      suppliers,
	  scouts,
      id,
      inboundShipmentPlans,
      completeBatch,
      createShipmentPlansRequestStatus,
      internationalizationConfig,
      conditionNotes,
      addToBatchStatus,
      updateAddToBatchStatus,
      batchLoaded,
      currentListingWorkflowOptions,
      setAllBatchListingRowsExpanded,
      allBatchListingRowsExpanded
    } = this.props;

    let existingShipments;
    if (batchMetadata.workflowType === "live") {
      existingShipments = constructExistingShipmentsFromListings(
        this.props.products
      );
    }

    if (currentFlow === "created_listings_display") {
      flowContent = (
        <CreatedListingsDisplay
          handleSearchSubmit={this.requestProductSearchResults}
          handleSearchChange={handleProductSearchQueryChange}
          updateModalDisplay={updateModalDisplay}
          displayCustomSKUTemplateModal={displayCustomSKUTemplateModal}
          onResultSelected={this.selectProductSearchResultAndInitializeListing}
          products={products}
          currentModal={currentModal}
          batchMetadata={batchMetadata}
          updateListingDefaultsData={updateListingDefaultsData}
          batchListingDefaults={batchListingDefaults}
          existingShipments={existingShipments}
          submitProductFeed={submitProductFeed}
          setCurrentEditableListing={setCurrentEditableListing}
          setSidebarTabId={setSidebarTabId}
          sidebarTabId={sidebarTabId}
          closeModal={closeModal}
          createNewSupplier={createNewSupplier}
          suppliers={suppliers}
          scouts={scouts}
          collapse={this.state.collapse}
          internationalConfig={internationalizationConfig}
          batchLoaded={batchLoaded}
          setAllBatchListingRowsExpanded={setAllBatchListingRowsExpanded}
          allBatchListingRowsExpanded={allBatchListingRowsExpanded}
        />
      );
    } else if (currentFlow === "search_results_display") {
      flowContent = (
        <SearchResultsDisplay
          search={search}
          products={products}
          batchMetadata={batchMetadata}
          handleSearchSubmit={this.requestProductSearchResults}
          handleSearchChange={handleProductSearchQueryChange}
          onResultSelected={this.selectProductSearchResultAndInitializeListing}
          updateListingDefaultsData={updateListingDefaultsData}
          batchListingDefaults={batchListingDefaults}
          existingShipments={existingShipments}
          submitProductFeed={submitProductFeed}
          updateModalDisplay={updateModalDisplay}
          setCurrentEditableListing={setCurrentEditableListing}
          setSidebarTabId={setSidebarTabId}
          sidebarTabId={sidebarTabId}
          createNewSupplier={createNewSupplier}
          suppliers={suppliers}
          collapse={this.state.collapse}
        />
      );
    } else if (currentFlow === "listing_creator_display") {
      flowContent = (
        <ListingCreatorDisplay
          addItemToBatch={() => this.tryAddingItemToBatch(null, false)}
          currentWorkingListingData={currentWorkingListingData}
          cancelListingCreationflow={cancelListingCreationflow}
          displayCustomSKUTemplateModal={displayCustomSKUTemplateModal}
          currentModal={currentModal}
          products={products}
          updateListingDefaultsData={updateListingDefaultsData}
          batchListingDefaults={batchListingDefaults}
          currentSelectedSearchResult={currentSelectedSearchResult}
          updateCurrentWorkingListingData={updateCurrentWorkingListingData}
          updateModalDisplay={updateModalDisplay}
          setCurrentEditableListing={setCurrentEditableListing}
          setSidebarTabId={setSidebarTabId}
          sidebarTabId={sidebarTabId}
          closeModal={closeModal}
          batchMetadata={batchMetadata}
          createNewSupplier={createNewSupplier}
          suppliers={suppliers}
          collapse={this.state.collapse}
          internationalConfig={internationalizationConfig}
          conditionNotes={conditionNotes}
          addToBatchStatus={addToBatchStatus}
          currentListingWorkflowOptions={currentListingWorkflowOptions}
        />
      );
    } else if (currentFlow === "product_feed_display") {
      flowContent = (
        <FeedDisplay
          submitProductFeed={submitProductFeed}
          productFeedSubmissions={productFeedSubmissions}
        />
      );
    } else if (currentFlow === "shipment_plans_display") {
      flowContent = (
        <ShipmentPlansDisplay
          setCurrentFlow={setCurrentFlow}
          batchMetadata={batchMetadata}
          createShipmentPlans={this.createShipmentPlans}
          inboundShipmentPlans={inboundShipmentPlans}
          completeBatch={completeBatch}
          createShipmentPlansRequestStatus={createShipmentPlansRequestStatus}
          existingShipments={this.props.existingShipments}
        />
      );
    } else if (currentFlow === "holding_area_display") {
      flowContent = (
        <BatchHoldingArea />
      )
    }

    let alert;

    if (this.props.currentAlert !== null) {
		if(this.props.currentAlert.error2){
		//handle new alert
		alert = (
			<AlertBox
				isOpen={this.state.NewAlertOpen}
				toggle={this.NewAlertToggle.bind(this)}
				amazonMessage={this.props.currentAlert.error2.sysmessage}
				message={this.props.currentAlert.error2.message}
				url={this.props.currentAlert.error2.url}
			/>
		)
		} else {
      alert = (
        <SweetAlert
          show={this.props.currentAlert !== null}
          title={this.props.currentAlert.title}
          text={this.props.currentAlert.text}
          confirmButtonColor={"#3085d6"}
          onConfirm={() => this.props.closeAlert()}
        />
	  );
		}
    }

    return (
      <div>
        <div>{alert}</div>
        <button
          className="btn btn-success mt-2 float-right"
          onClick={() => this.toggleRightNav()}
          type="button"
        >
          <i className="fa fa-bars" />
        </button>
        <div className="view-dashboard-content view-dashboard batch-dashboard-content">
          {flowContent}
        </div>
        <BatchModals
          id={id}
          tryAddingItemToBatch={() => this.tryAddingItemToBatch(null)}
          updateAddToBatchStatus={updateAddToBatchStatus}
          rejectNewLiveBatchShipment={rejectNewLiveBatchShipment}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    suppliers: state.Batch.get("suppliers"),
    scouts: state.Batch.get("scouts"),
    inboundShipmentPlans: state.Batch.get("inboundShipmentPlans"),
    conditionNotes: state.Batch.get("conditionNotes"),
    search: state.Batch.get("search"),
    sidebarTabId: state.Batch.get("sidebarTabId"),
    currentModal: state.Batch.get("currentModal"),
    currentWorkingListingData: state.Batch.get("currentWorkingListingData"),
    currentSelectedSearchResult: state.Batch.get("currentSelectedSearchResult"),
    batchListingDefaults: state.Batch.get("batchListingDefaults"),
    currentFlow: state.Batch.get("currentFlow"),
    products: state.Batch.get("products"),
    batchMetadata: state.Batch.get("batchMetadata"),
    productFeedSubmissions: state.Batch.get("productFeedSubmissions"),
    createShipmentPlansRequestStatus: state.Batch.get(
      "createShipmentPlansRequestStatus"
    ),
    printerDefaults: state.Settings.get("printerDefaults"),
    currentAlert: state.Batch.get("currentAlert"),
    internationalizationConfig: state.Auth.get("internationalization_config"),
    addToBatchStatus: state.Batch.get("addToBatchStatus"),
    batchLoaded: state.Batch.get("batchLoaded"),
    currentListingWorkflowOptions: state.Batch.get("currentListingWorkflowOptions"),
    existingShipments: state.Batch.get("existingShipments"),
    allBatchListingRowsExpanded: state.Batch.get("allBatchListingRowsExpanded")
  }),
  {
    requestProductSearchResults,
    handleProductSearchQueryChange,
    selectProductSearchResultAndInitializeListing,
    tryAddingItemToBatch,
    closeModal,
    displayCustomSKUTemplateModal,
    updateListingDefaultsData,
    loadBatch,
    showAlert,
    closeAlert,
    updateCurrentWorkingListingData,
    setCurrentFlow,
    submitProductFeed,
    sendToHoldings,
    getHoldings,
    updateInboundShipmentQuantityAndEditListing,
    updateInboundShipmentQuantityAndDeleteListing,
    setCurrentEditableListing,
    clearCurrentEditableListing,
    updateModalDisplay,
    setSidebarTabId,
    setCurrentWorkingListing,
    deleteHoldingAreaListing,
    createShipmentPlans,
    createShipment,
    fetchPrinterDefaults,
    fetchAdressList,
    createNewSupplier,
    completeBatch,
    updateAddToBatchStatus,
    getProductFeedStatus,
    createHoldingAreaShipment,
    clearBatch,
    cancelListingCreationflow,
    rejectNewLiveBatchShipment,
    setAllBatchListingRowsExpanded,
    apiCallSuccess,
    apiCallFailed
  }
)(ListingFlow);
