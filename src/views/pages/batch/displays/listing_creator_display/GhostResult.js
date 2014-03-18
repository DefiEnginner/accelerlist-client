import React from "react";
import { 
  Label, Input, Badge, Button, FormGroup,
  Row, Col
} from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import PropTypes from "prop-types";
import TaxCodeInputForm from "../../../../../shared/components/taxCodeInputForm";
import { validateFloatInput } from "../../../../../helpers/utility";
import FaSpinner from "react-icons/lib/fa/spinner";
import {
  generateTemplatedSKU,
  skuNumberConversion
} from "../../../../../helpers/batch/utility";
import SupplierInputForm from "../sidebar/SupplierInputForm";
import {   
  momentDateToISOFormatConversion
} from "../../../../../helpers/utility";
import LoadingDisplay from "../loading_display";
import DetailIcon from "react-icons/lib/io/android-list";

/*
This component is used to visualize the listing when it is initialized and there is some default
set for the user, but the user has not elected to add the item to the batch yet. There may be some
final edits before they click it. 

props field expects:
1) listing field
2) addItemToBatch function
3) cancel function
*/

class GhostResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateFloatInputData(fieldName, event) {
    if (!event.target) {
      return;
    }
    const validator = validateFloatInput(true);
    let price = validator(event);
    this.props.updateCurrentWorkingListingData(fieldName, price);
  }

  updateIntInputData(fieldName, event) {
    if (!event.target) {
      return;
    }
    let parsedValue = parseInt(event.target.value, 10);
    if (!isNaN(parsedValue)) {
      this.props.updateCurrentWorkingListingData(fieldName, parsedValue);
    }
  }

  updateCurrentWorkingListingData(fieldName, event) {
    let selectFieldNames = [
      "taxCode",
      "noteCategory",
      "noteSubcatgory",
      "condition",
      "expDate",
      "datePurchased"
    ];
    if (!event && selectFieldNames.indexOf(fieldName) !== -1) {
      // in this case, the event was null but that's because of react-datepicker behavior
      // when the field is empty - it will make the event null.
      // So, in this case it's still ok, and we propogate the null event.
      this.props.updateCurrentWorkingListingData(fieldName, null);
    } else if (event.value && event.label) {
      // ok then it is a select component.
      this.props.updateCurrentWorkingListingData(fieldName, event.value);
    } else if (event._d) {
      // ok then it is a datepicker component (this will be a moment object.)
      // _d field denotes that there is a current date set that can be formatted.
      this.props.updateCurrentWorkingListingData(
        fieldName,
        momentDateToISOFormatConversion(event)
      );
    } else {
      // otherwise it is a regular input field.
      let value = event.target.value;
      this.props.updateCurrentWorkingListingData(fieldName, value);
    }
  }

  render() {
    let { listing, addItemToBatch, cancel, suppliers, addToBatchStatus, currentListingWorkflowOptions } = this.props;

    if (currentListingWorkflowOptions.speedMode && !currentListingWorkflowOptions.showPricing && !!addToBatchStatus) {
      return (
        <LoadingDisplay loadingContainerClass={"loading-container"} message={"Adding the scanned item in speed mode... hang tight for a minute"} />
      )
    }

    let skus = generateTemplatedSKU(listing);
    return (
      <div className="section">
        <h2 className="section-title">
          <DetailIcon color="#cecece" size="22" />
          SKU Details
        </h2>
        <div className="section-content d-block">
          <Row className="mr-0">
            <Col className="pl-0">
              <FormGroup row>
                <Col md="6">
                  <Label>SKU Prefix</Label>
                  <Input
                    className="form-control form-control-sm batch-tab-input"
                    value={
                      listing.shouldUseCustomSkuTemplate
                        ? skus
                        : listing.skuPrefix
                    }
                    invalid={
                      (listing.shouldUseCustomSkuTemplate && skus === "")
                      || (!listing.shouldUseCustomSkuTemplate && listing.skuPrefix === "")
                    }
                    disabled={listing.shouldUseCustomSkuTemplate}
                    onChange={
                      listing.shouldUseCustomSkuTemplate
                        ? null
                        : this.updateCurrentWorkingListingData.bind(
                            this,
                            "skuPrefix"
                          )
                    }
                  />
                </Col>
                <Col md="6">
                  <Label>SKU Number</Label>
                  <Input
                    className="form-control form-control-sm batch-tab-input"
                    min="0"
                    type="number"
                    value={skuNumberConversion(listing.skuNumber) || ""}
                    onChange={this.updateCurrentWorkingListingData.bind(
                      this,
                      "skuNumber"
                    )}
                    onBlur={this.updateIntInputData.bind(this, "skuNumber")}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="6">
                  <Label>Exp. Date</Label>
                  <DatePicker
                    selected={listing.expDate ? moment(listing.expDate) : null}
                    onChange={this.updateCurrentWorkingListingData.bind(
                      this,
                      "expDate"
                    )}
                    className="form-control"
                  />
                </Col>
                <Col md="6">
                  <Label>Date Purchased</Label>
                  <DatePicker
                    selected={
                      listing.datePurchased ? moment(listing.datePurchased) : null
                    }
                    onChange={this.updateCurrentWorkingListingData.bind(
                      this,
                      "datePurchased"
                    )}
                    className="form-control"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="4">
                  <Label>Quantity</Label>
                  <Input
                    className="form-control form-control-sm batch-tab-input"
                    value={!isNaN(listing.qty) ? listing.qty : ""}
                    invalid={isNaN(listing.qty) || listing.qty === "" || Number(listing.qty) <= 0}
                    onChange={this.updateCurrentWorkingListingData.bind(
                      this,
                      "qty"
                    )}
                    onBlur={this.updateIntInputData.bind(this, "qty")}
                  />
                </Col>
                <Col md="8">
                  <Label>Tax Code</Label>
                  <TaxCodeInputForm
                    value={listing.taxCode}
                    onChange={this.updateCurrentWorkingListingData.bind(
                      this,
                      "taxCode"
                    )}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col className="pr-0">
              <FormGroup>
                <Label>ASIN</Label>
                <Input
                  className="form-control form-control-sm batch-tab-input"
                  value={listing.asin}
                  disabled
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>Supplier</Label>
                <SupplierInputForm
                  suppliers={suppliers}
                  value={listing.supplier}
                  onChange={this.updateCurrentWorkingListingData.bind(
                    this,
                    "supplier"
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
          <hr className="separator" />
          <div className="d-flex justify-content-between align-items-center mx-0">
            <div><Badge color="default">Pending Fulfillment Center Data</Badge></div>
            <div>
              <Button
                color="success"
                disabled={!!addToBatchStatus}
                onClick={() => {
                  addItemToBatch(null, false)
                }}
              >
                {
                  !!addToBatchStatus &&
                    <FaSpinner className="fa-spin mr-1" />
                }
                Add To Batch
              </Button>
              
              <Button color="danger" className="ml-2" onClick={cancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GhostResult.propTypes = {
  listing: PropTypes.object.isRequired,
  currentListingWorkflowOptions: PropTypes.object.isRequired,
  addItemToBatch: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
  internationalConfig: PropTypes.object.isRequired,
  addToBatchStatus: PropTypes.bool.isRequired,
};

export default GhostResult;
