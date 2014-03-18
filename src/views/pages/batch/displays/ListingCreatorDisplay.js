import React from "react";
import { Row, Col, Collapse } from "reactstrap";
import SearchResult from "./shared/SearchResult";
import GhostResult from "./listing_creator_display/GhostResult";
import PricingPanel from "./listing_creator_display/PricingPanel";
import SideBar from "./sidebar/SideBar";
import PropTypes from "prop-types";

/*
This display is shown when they have not started scanning an item yet, and after the
previous item has been added successfully to the batch and you're ready to start 
listing a new item.
*/

const ListingCreatorDisplay = props => {
  let {
    currentSelectedSearchResult,
    currentWorkingListingData,
    addItemToBatch,
    displayCustomSKUTemplateModal,
    cancelListingCreationflow,
    batchListingDefaults,
    updateListingDefaultsData,
    updateCurrentWorkingListingData,
    setSidebarTabId,
    sidebarTabId,
    currentModal,
    closeModal,
    createNewSupplier,
    suppliers,
    collapse,
    internationalConfig,
    conditionNotes,
    addToBatchStatus,
    currentListingWorkflowOptions
  } = props;
  return (
    <Row>
      <Col className="batch-core">
        <div className="row medium-bottom-margin listing-details">
          <Col lg="12">
            <SearchResult
              onResultSelected={result => console.log(result)}
              result={currentSelectedSearchResult}
            />
            <PricingPanel
              currentWorkingListingData={currentWorkingListingData}
              updateCurrentWorkingListingData={updateCurrentWorkingListingData}
              internationalConfig={internationalConfig}
              conditionNotes={conditionNotes}
              batchListingDefaults={batchListingDefaults}
              currentListingWorkflowOptions={currentListingWorkflowOptions}
              addItemToBatch={addItemToBatch}
              addToBatchStatus={addToBatchStatus}
              cancel={cancelListingCreationflow}
            />
            <GhostResult
              listing={currentWorkingListingData}
              addItemToBatch={addItemToBatch}
              cancel={cancelListingCreationflow}
              updateCurrentWorkingListingData={updateCurrentWorkingListingData}
              suppliers={suppliers}
              internationalConfig={internationalConfig}
              addToBatchStatus={addToBatchStatus}
              currentListingWorkflowOptions={currentListingWorkflowOptions}
            />
          </Col>
        </div>
      </Col>

      <Collapse className="batch-sidebar" isOpen={collapse}>
        <SideBar
          batchListingDefaults={batchListingDefaults}
          updateListingDefaultsData={updateListingDefaultsData}
          displayCustomSKUTemplateModal={displayCustomSKUTemplateModal}
          currentModal={currentModal}
          setSidebarTabId={setSidebarTabId}
          sidebarTabId={sidebarTabId}
          createNewSupplier={createNewSupplier}
          suppliers={suppliers}
          closeModal={closeModal}
        />
      </Collapse>
    </Row>
  );
};

ListingCreatorDisplay.propTypes = {
  currentSelectedSearchResult: PropTypes.object.isRequired,
  currentWorkingListingData: PropTypes.object.isRequired,
  currentListingWorkflowOptions: PropTypes.object.isRequired,
  addItemToBatch: PropTypes.func.isRequired,
  cancelListingCreationflow: PropTypes.func.isRequired,
  batchListingDefaults: PropTypes.object.isRequired,
  updateListingDefaultsData: PropTypes.func.isRequired,
  updateCurrentWorkingListingData: PropTypes.func.isRequired,
  setSidebarTabId: PropTypes.func.isRequired,
  sidebarTabId: PropTypes.string.isRequired,
  printerDefaults: PropTypes.object,
  createNewSupplier: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
  collapse: PropTypes.bool.isRequired,
  internationalConfig: PropTypes.object.isRequired,
  addToBatchStatus: PropTypes.bool.isRequired,
};

export default ListingCreatorDisplay;
