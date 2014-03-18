import React from "react";
import SearchResultsVisualizer from "./search_results_display/SearchResultsVisualizer";
import BatchToolBoxRow from "./shared/BatchToolBoxRow";
import SideBar from "./sidebar/SideBar";
import { Row, Col, Collapse } from "reactstrap";
import PropTypes from "prop-types";

const SearchResultsDisplay = props => {
  let {
    handleSearchSubmit,
    handleSearchChange,
    search,
    onResultSelected,
    batchListingDefaults,
    updateListingDefaultsData,
    sidebarTabId,
    setSidebarTabId,
    createNewSupplier,
    suppliers,
    collapse
  } = props;

  return (
    <Row>
      <Col className="batch-core">
        <BatchToolBoxRow
          handleSearchSubmit={handleSearchSubmit}
          handleSearchChange={handleSearchChange}
        />
        <div className="search-results-visualizer medium-top-margin">
          <SearchResultsVisualizer
            onResultSelected={onResultSelected}
            search={search}
          />
        </div>
      </Col>
      <Collapse className="batch-sidebar" isOpen={collapse}>
        <SideBar
          batchListingDefaults={batchListingDefaults}
          updateListingDefaultsData={updateListingDefaultsData}
          sidebarTabId={sidebarTabId}
          setSidebarTabId={setSidebarTabId}
          createNewSupplier={createNewSupplier}
          suppliers={suppliers}
        />
      </Collapse>
    </Row>
  );
};

SearchResultsDisplay.propTypes = {
  handleSearchSubmit: PropTypes.func.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired,
  batchListingDefaults: PropTypes.object.isRequired,
  updateListingDefaultsData: PropTypes.func.isRequired,
  sidebarTabId: PropTypes.string.isRequired,
  setSidebarTabId: PropTypes.func.isRequired,
  createNewSupplier: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
  collapse: PropTypes.bool.isRequired
};

export default SearchResultsDisplay;
