import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import AmazonSearchBar from "./AmazonSearchBar";
import PropTypes from "prop-types";
import batchActions from "../../../../../redux/batch/actions";
import Tooltip from "../../../../../shared/components/Tooltip";
import {
	generateInventoryLoaderFileAndExport,
    generateBatchItemsFileExport
} from "../../exportCSV";
const {
  setCurrentFlow,
  updateModalDisplay
} = batchActions;

class BatchToolBoxRow extends React.Component {

  activeButtonStyle = buttonFlow => {
    let {
      currentFlow
    } = this.props;
    if (currentFlow === buttonFlow) {
      return "active"
    }
  }

  inventoryLoaderFileExport = () => {
    const { products, batchMetadata } = this.props;
    generateInventoryLoaderFileAndExport(products, batchMetadata.channel)
  }

  /**
   * batch export to csv
   */
  batchItemsFileExport = () => {
	const { products, batchMetadata } = this.props;
	console.log('PRODUCTS', products);
	console.log('META', batchMetadata);
    generateBatchItemsFileExport(products, batchMetadata);
  }

  render() {
    let {
      handleSearchSubmit,
      handleSearchChange,
      search,
      updateModalDisplay,
      setCurrentFlow,
      hideSearch,
      batchMetadata,
      searchResultIsEmpty
    } = this.props;

    let searchBar;
    if (!hideSearch) {
      searchBar = (
        <AmazonSearchBar
          handleSearchSubmit={handleSearchSubmit}
          handleSearchChange={handleSearchChange}
          query={search.query}
          isLoading={search.isLoadingSearchResults}
          scannerDetectedCallback={handleSearchSubmit}
        />
      );
    }

    let listButton = (
      <Button
        size="sm"
        key="toolbox-list-btn"
        className={`toolbox-btn medium-right-margin ${this.activeButtonStyle("created_listings_display")}`}
        onClick={setCurrentFlow.bind(null, "created_listings_display")}
      >
        <strong>List</strong>
      </Button>
    )

    let shipButton = (
      <Button
        size="sm"
        key="toolbox-ship-btn"
        className={`toolbox-btn medium-right-margin ${this.activeButtonStyle("shipment_plans_display")}`}
        onClick={setCurrentFlow.bind(null, "shipment_plans_display")}
      >
        <strong>Ship</strong>
      </Button>
    )

    let feedsButton = (
      <Button
        size="sm"
        key="toolbox-feed-btn"
        className={`toolbox-btn medium-right-margin ${this.activeButtonStyle("product_feed_display")}`}
        onClick={setCurrentFlow.bind(null, "product_feed_display")}
      >
        <strong>Feed</strong>
      </Button>
    )

    // let holdingAreaButton = (
    //   <Button
    //     size="sm"
    //     key="toolbox-holding-area-btn"
    //     className={`toolbox-btn medium-right-margin ${this.activeButtonStyle("holding_area_display")}`}
    //     onClick={setCurrentFlow.bind(null, "holding_area_display")}
    //   >
    //     <strong>Holding Area</strong>
    //   </Button>
    // )

    let exportButton = (
      <UncontrolledDropdown style={{ display: "inline-block" }} key="toolbox-export-btn">
        <DropdownToggle className="toolbox-btn medium-right-margin" size="sm">
          <strong>Export</strong>
        </DropdownToggle>
        <DropdownMenu className="toolbox-dropdownMenu" >
          <DropdownItem onClick={this.inventoryLoaderFileExport}>
            Inventory Loader File
          </DropdownItem>
          <DropdownItem onClick={() => updateModalDisplay("export_tracking_spreadsheet")}>
            Tracking Spreadsheet
          </DropdownItem>
          <DropdownItem onClick={this.batchItemsFileExport}>
            Batch Items
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )

    let buttons;
    if (batchMetadata.workflowType === "live") {
      //buttons = [listButton, feedsButton, holdingAreaButton, exportButton]
      buttons = [listButton, feedsButton, exportButton]
    } else if (batchMetadata.workflowType === "private" && batchMetadata.channel === "DEFAULT") {
      //buttons = [listButton, feedsButton, holdingAreaButton, exportButton]
      buttons = [listButton, feedsButton, exportButton]
    } else if (batchMetadata.workflowType === "private" && batchMetadata.channel && batchMetadata.channel.indexOf("AMAZON_") !== -1) {
      //buttons = [listButton, shipButton, feedsButton, holdingAreaButton, exportButton]
      buttons = [listButton, shipButton, feedsButton, exportButton]
    }

    return (
      <div className="batch-toolbox">
        <Row>
          <Col lg="5">
            {searchBar}
          </Col>
          <Col>
            { searchResultIsEmpty ? (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {"Oops. There is no match to this item on the Amazon.com product catalog."}
                </span>
              ) : ""
            }
          </Col>
          <Col style={{ minWidth: "310px", maxWidth: "310px" }}>
            {buttons}
            <Tooltip
              tooltipId="BatchToolBoxRow"
              tooltipText={`
                This is your navigation bar while listing
                in each individual batch.  Use it to jump
                around to the various sections while listing your items.`}
            />
          </Col>
        </Row>
      </div>
    );
  };
}

BatchToolBoxRow.propTypes = {
  search: PropTypes.object,
  handleSearchSubmit: PropTypes.func,
  handleSearchChange: PropTypes.func,
  updateModalDisplay: PropTypes.func,
  setCurrentFlow: PropTypes.func.isRequired,
  batchMetadata: PropTypes.object.isRequired,
  currentFlow: PropTypes.string,
  hideSearch: PropTypes.bool,
  products: PropTypes.array
};

export default connect(
  state => ({
    search: state.Batch.get("search"),
    batchMetadata: state.Batch.get("batchMetadata"),
    currentFlow: state.Batch.get("currentFlow"),
    products: state.Batch.get("products"),
    searchResultIsEmpty: state.Batch.get("searchResultIsEmpty"),
  }),
  {
    setCurrentFlow,
    updateModalDisplay
  }
)(BatchToolBoxRow);
