import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  digitСonversion,
  secureProtocolImgURL
} from "../../../../../helpers/utility";
import React, { Fragment, Component } from "react";
import TableGenerator from "../../../../../shared/components/TableGenerator";
import DeleteIcon from "../../../../../shared/components/SVGIcons/Delete";
import RetryIcon from "../../../../../shared/components/SVGIcons/Retry";
import batchActions from "../../../../../redux/batch/actions";
import BatchToolBoxRow from "../shared/BatchToolBoxRow";
import { Row, Col } from "reactstrap";

const {
  tryAddingHoldingAreaItemToBatch,
  getHoldings,
  setCurrentEditableListing,
  updateModalDisplay
} = batchActions;

class BatchHoldingArea extends Component {
  componentDidMount = () => {
    this.props.getHoldings();
  };

  openDeleteModal = listing => {
    let isHoldingAreaListing = true;
    this.props.setCurrentEditableListing(listing, isHoldingAreaListing);
    this.props.updateModalDisplay("delete_listing_item");
  };

  scannedProductsTableOptionMapper = option => {
    const {
      internationalization_config,
      tryAddingHoldingAreaItemToBatch,
      currentWorkingListingData,
      addToBatchStatus,
      currentListingWorkflowOptions
    } = this.props;
    
    let isRetrying =
      !!currentListingWorkflowOptions &&
      !!currentListingWorkflowOptions.isHoldingAreaListing &&
      !!addToBatchStatus &&
      !!currentWorkingListingData &&
      currentWorkingListingData.sku === option.sku;

    return (
      <Fragment>
        <td>
          <div className="d-flex align-items-center">
            <div className="media">
              <img
                src={secureProtocolImgURL(option.imageUrl)}
                alt={option.name}
              />
            </div>
            <h4 className="book-title">{option.name}</h4>
          </div>
        </td>
        <td>{option.sku}</td>
        <td>{option.condition}</td>
        <td>{option.asin}</td>
        <td>
          {digitСonversion(
            option.price,
            "currency",
            internationalization_config.currency_code
          )}
        </td>
        <td>{option.qty}</td>
        {/*<td>{option.attempts || 5}</td>*/}
        <td>
          <div className="action-controls">
            <RetryIcon
              onClick={() => tryAddingHoldingAreaItemToBatch(option, true)}
              isLoading={isRetrying}
            />
            <DeleteIcon onClick={() => this.openDeleteModal(option)} />
          </div>
        </td>
      </Fragment>
    );
  };

  render() {
    const scannedProductsTableHeaders = [
      { className: "title", name: "TITLE", value: "name" },
      { name: "SKU", value: "sku" },
      { name: "CONDITION", value: "condition" },
      { name: "ASIN", value: "asin" },
      { name: "PRICE", value: "price" },
      { name: "COUNT", value: "qty" },
      { name: "ACTIONS", sortable: false }
    ];

    const { holdings } = this.props;
    return (
      <Row>
        <Col lg="12" className="col">
          <BatchToolBoxRow hideSearch={true} />
          <div className="card">
            <div className="card-block">
              <h3 className="h5 card-title">Batch Holding Area</h3>
              <p>
                Click on individual items to re-try adding them to your current
                batch to see if Amazon will send it to a preferred warehouse
                designation.
              </p>
              {!!holdings && (
                <TableGenerator
                  rootClassName="table acc-table"
                  headerTitles={scannedProductsTableHeaders}
                  optionMapper={this.scannedProductsTableOptionMapper}
                  sortable={false}
                  options={holdings}
                  checkedRowName="sku"
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

BatchHoldingArea.propTypes = {
  holdings: PropTypes.array,
  batchMetadata: PropTypes.object.isRequired,
  currentListingWorkflowOptions: PropTypes.object,
  internationalization_config: PropTypes.object.isRequired,
  currentWorkingListingData: PropTypes.object,
  addToBatchStatus: PropTypes.bool.isRequired
};

export default connect(
  state => ({
    ...state.Batch.toJS(),
    internationalization_config: state.Auth.get("internationalization_config"),
    holdings: state.Batch.get("holdings")
  }),
  {
    tryAddingHoldingAreaItemToBatch,
    getHoldings,
    setCurrentEditableListing,
    updateModalDisplay
  }
)(BatchHoldingArea);
