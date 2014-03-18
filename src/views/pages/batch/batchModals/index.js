import React from "react";
import { connect } from "react-redux";
import { string, object, array, func } from "prop-types";
import batchActions from "../../../../redux/batch/actions";
import ExportTrackingSpreadsheetModal from "./ExportTrackingSpreadsheetModal";
import NewShipmentConfirmationModal from "./NewShipmentConfirmationModal";
import DuplicateASINWarningModal from "./DuplicateASINWarningModal";
import DeleteListingItemModal from "./DeleteListingItemModal";
import FeedStatusModal from "./FeedStatusModal";
import ShipViewItemsModal from "./ShipViewItemsModal";
import EditListingItemModal from "./EditListingItemModal";
import EditListingItemModalForClosed from "./EditListingItemModalForClosed";
import ReplenishmentWarningModal from "./ReplenishmentWarningModal";
import EditListingItemBoxContentModal from "./EditListingItemBoxContentModal";
import SubmitProductFeedWarningModal from "./SubmitProductFeedWarningModal";
import { setFocusToAmazonSearchBar } from "../../../../helpers/batch/utility";

class BatchModals extends React.Component {
  static propTypes = {
    currentShipmentPlans: array,
    currentModal: string,
    products: array,
    closeModal: func,
    currentWorkingListingData: object,
    approveShipmentCreation: func,
    sendToHoldings: func,
    currentSelectedSearchResult: object,
    currentEditableListingData: object,
    setCurrentFlow: func,
    currentFeedStatusData: object,
    batchMetadata: object,
    shipmentIdToCurrentBoxMapping: object,
    printerDefaults: object,
    batchListingDefaults: object,
    shipmentIdToBoxCountMapping: object,
    updateInboundShipmentQuantityAndEditListing: func,
    editListing: func,
    id: string,
    deleteListing: func,
    deleteHoldingAreaListing: func,
    tryAddingItemToBatch: func,
    updateAddToBatchStatus: func,
    rejectNewLiveBatchShipment: func,
    submitProductFeed: func,
    completeBatch: func,
    createShipmentPlans: func,
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if (!!this.props.currentModal && !newProps.currentModal) {
      setFocusToAmazonSearchBar();
    }
  }

  tryAddingItemToBatch(listing, isHoldingAreaListing) {
    const {
      tryAddingItemToBatch,
    } = this.props;
    tryAddingItemToBatch(listing, isHoldingAreaListing);
  }

  approveShipmentCreation = () => {
    let {
      approveShipmentCreation,
    } = this.props;

    approveShipmentCreation();
  };
  sendToHoldings = () => {
    let {
      currentWorkingListingData,
      currentSelectedSearchResult,
      sendToHoldings,
      batchListingDefaults
    } = this.props;

    sendToHoldings(
      currentWorkingListingData,
      currentSelectedSearchResult,
      batchListingDefaults.skuNumber
    );
  };

  editListingItem = listing => {
    let {
      batchMetadata,
      updateInboundShipmentQuantityAndEditListing,
      editListing,
      id,
      products,
    } = this.props;

    if (!batchMetadata || !batchMetadata.workflowType) {
      return;
    }

    let qtyEdited = false;
    let qtyIncreased = 0;
    products.forEach(product => {
      if (product.sku === listing.sku && product.qty !== listing.qty) {
        qtyEdited = true;
        qtyIncreased = listing.qty - product.qty;
      }
    });

    let isHoldingAreaListing = false;
    if (qtyEdited && batchMetadata.workflowType === "live") {
      updateInboundShipmentQuantityAndEditListing(
        listing,
        qtyIncreased,
        isHoldingAreaListing
      );
    } else {
      editListing(
        id,
        listing,
        qtyIncreased,
        isHoldingAreaListing
      );
    }
  };

  deleteListingItem = (listing, isHoldingAreaListing) => {
    let {
      batchMetadata,
      updateInboundShipmentQuantityAndDeleteListing,
      deleteListing,
      deleteHoldingAreaListing,
      id
    } = this.props;

    // "isHoldingAreaListing" it's only comes from HOLDING Area products
    if (isHoldingAreaListing) {
      deleteHoldingAreaListing(listing.sku);
      return;
    }

    // Otherwise, proceed with regular delete listing flow.
    if (!batchMetadata || !batchMetadata.workflowType) {
      return;
    }

    if (batchMetadata.workflowType === "live") {
      updateInboundShipmentQuantityAndDeleteListing(listing, batchMetadata);
    } else {
      deleteListing(id, listing);
    }
  };

  render() {
    const {
      currentShipmentPlans,
      currentModal,
      products,
      closeModal,
      currentWorkingListingData,
      currentSelectedSearchResult,
      currentEditableListingData,
      setCurrentFlow,
      currentFeedStatusData,
      shipmentIdToBoxCountMapping,
      internationalConfig,
      isHoldingAreaListing,
      updateAddToBatchStatus,
      batchListingDefaults,
      currentListingWorkflowOptions,
      rejectNewLiveBatchShipment,
      submitProductFeed,
      batchMetadata,
      completeBatch,
      createShipmentPlans,
    } = this.props;

    return (
      <React.Fragment>
        <ExportTrackingSpreadsheetModal
          isOpen={currentModal === "export_tracking_spreadsheet"}
          products={products}
          close={closeModal}
		  batchMetadata={batchMetadata}
        />
        <NewShipmentConfirmationModal
          isOpen={currentModal === "new_shipment_confirmation"}
          approve={this.approveShipmentCreation}
          sendToHoldings={this.sendToHoldings}
          currentWorkingListingData={currentWorkingListingData}
          close={closeModal}
          rejectNewLiveBatchShipment={rejectNewLiveBatchShipment}
          updateAddToBatchStatus={updateAddToBatchStatus}
        />
        <DuplicateASINWarningModal
          isOpen={currentModal === "duplicate_asin_warning"}
          currentEditableListingData={currentEditableListingData}
          currentSelectedSearchResult={currentSelectedSearchResult}
          close={closeModal}
          setCurrentFlow={setCurrentFlow}
          editListingItem={this.editListingItem}
          addItemToBatch={this.tryAddingItemToBatch.bind(this)}
          currentListingWorkflowOptions={currentListingWorkflowOptions}
        />
        <DeleteListingItemModal
          isOpen={currentModal === "delete_listing_item"}
          currentEditableListingData={currentEditableListingData}
          isHoldingAreaListing={isHoldingAreaListing}
          close={closeModal}
          deleteListingItem={this.deleteListingItem}
        />
        <FeedStatusModal
          isOpen={currentModal === "feed_status_item"}
          currentFeedStatusData={currentFeedStatusData}
          products={products}
          close={closeModal}
        />
        <ShipViewItemsModal
          isOpen={currentModal === "ship_view_items"}
          currentShipmentPlans={currentShipmentPlans}
          products={products}
          close={closeModal}
        />
        <EditListingItemModal
          isOpen={currentModal === "edit_listing_item"}
          close={closeModal}
          listingItem={currentEditableListingData}
          editListingItem={this.editListingItem}
          internationalConfig={internationalConfig}
          batchListingDefaults={batchListingDefaults}
        />
        <ReplenishmentWarningModal
          isOpen={currentModal === "replishment_modal_warning"}
          currentSelectedSearchResult={currentSelectedSearchResult}
          close={closeModal}
          setCurrentFlow={setCurrentFlow}
          addItemToBatch={this.tryAddingItemToBatch.bind(this)}
          currentListingWorkflowOptions={currentListingWorkflowOptions}
          batchListingDefaults={batchListingDefaults}
        />
        <EditListingItemBoxContentModal
          isOpen={currentModal === 'edit_box_content_listing_item'}
          close={closeModal}
          listingItem={currentEditableListingData}
          editListingItem={this.editListingItem}
          shipmentIdToBoxCountMapping={shipmentIdToBoxCountMapping}
          internationalConfig={internationalConfig}
        />
        <SubmitProductFeedWarningModal
          isOpen={currentModal === 'submit_product_feed_warning'}
          close={closeModal}
          submitProductFeed={submitProductFeed}
          products={products}
          batchMetadata={batchMetadata}
          completeBatch={completeBatch}
          createShipmentPlans={createShipmentPlans}
          setCurrentFlow={setCurrentFlow}
        />
        <EditListingItemModalForClosed
          isOpen={currentModal === "edit_listing_item_for_closed"}
          close={closeModal}
          listingItem={currentEditableListingData}
          editListingItem={this.editListingItem}
          internationalConfig={internationalConfig}
          batchListingDefaults={batchListingDefaults}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    shipmentIdToBoxCountMapping: state.Batch.get("shipmentIdToBoxCountMapping"),
    batchListingDefaults: state.Batch.get("batchListingDefaults"),
    printerDefaults: state.Settings.get("printerDefaults"),
    shipmentIdToCurrentBoxMapping: state.Batch.get(
      "shipmentIdToCurrentBoxMapping"
    ),
    batchMetadata: state.Batch.get("batchMetadata"),
    currentShipmentPlans: state.Batch.get("currentShipmentPlans"),
    currentFeedStatusData: state.Batch.get("currentFeedStatusData"),
    currentSelectedSearchResult: state.Batch.get("currentSelectedSearchResult"),
    currentEditableListingData: state.Batch.get("currentEditableListingData"),
    currentWorkingListingData: state.Batch.get("currentWorkingListingData"),
    products: state.Batch.get("products"),
    currentModal: state.Batch.get("currentModal"),
    isHoldingAreaListing: state.Batch.get("isHoldingAreaListing"),
    currentListingWorkflowOptions: state.Batch.get("currentListingWorkflowOptions"),
    internationalConfig: state.Auth.get("internationalization_config")
  }),
  batchActions
)(BatchModals);
