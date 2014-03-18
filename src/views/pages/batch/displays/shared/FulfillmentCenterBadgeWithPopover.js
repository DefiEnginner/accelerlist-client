import React from "react";
import {
  Badge,
  Popover,
  PopoverHeader,
  PopoverBody,
  Button,
  FormGroup,
  Label
} from "reactstrap";
import PropTypes from "prop-types";
import {
  generateBarcodeDataForBox,
  printCodeForBox
} from "../../../../..//helpers/batch/utility";
import Select from "react-select";
import batchActions from "../../../../../redux/batch/actions";
import { connect } from "react-redux";

const { updateBoxInfoForShipment, addBoxInfoForShipment, showAlert } = batchActions;

class FulfillmentCenterBadgeWithPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = { popoverOpen: false };
  }

  togglePopover() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  addBox() {
    let shipmentId = this.props.fulfillmentCenter.ShipmentId;

    this.props.addBoxInfoForShipment(shipmentId);
  }

  updateCurrentBox(option) {
    let currentBox = option.value;
    let shipmentId = this.props.fulfillmentCenter.ShipmentId;
    let { fulfillmentCenter, shipmentIdToBoxCountMapping } = this.props;
    let boxCount =
      shipmentIdToBoxCountMapping[fulfillmentCenter.ShipmentId] || 1;
    this.props.updateBoxInfoForShipment(
      shipmentId,
      currentBox,
      boxCount
    );
  }

  printBarcodes = (shipmentId) => {
    let numBoxes = this.props.shipmentIdToBoxCountMapping[shipmentId] || 0;
    for (let boxNumber = 1; boxNumber <= numBoxes; boxNumber++) {
      let barcodeData = generateBarcodeDataForBox(
        this.props.products,
        shipmentId,
        boxNumber
      );
      console.log("THIS IS BARCODE DATA TO PRINT", barcodeData);
      const boxProductsList = this.props.products.filter(product => {
        return (product.boxContents[shipmentId] && product.boxContents[shipmentId][boxNumber] > 0);
      }).slice(0, 5).map(item => {
        return item
      });

      const boxWeight = boxProductsList.reduce((acc, item) => {
        return acc + Number(item.itemWeight);
      }, 0);
      const shipmentName = `ShipmentId: ${shipmentId}`;
      const unitsCount = boxProductsList.reduce((acc, item) => {
        if (item.boxContents[shipmentId][boxNumber] && Number(item.boxContents[shipmentId][boxNumber]) > 0) {
          return acc + Number(item.boxContents[shipmentId][boxNumber]);
        }
        return acc;
      }, 0);
      const warehouseName = this.props.fulfillmentCenter.DestinationFulfillmentCenterId;
      printCodeForBox("print_barcode", barcodeData, boxWeight.toFixed(2), shipmentName, boxNumber, unitsCount, warehouseName, this.props.showAlert);
    }
  }

  render() {
    let {
      fulfillmentCenter,
      shipmentIdToCurrentBoxMapping,
      shipmentIdToBoxCountMapping
    } = this.props;

    let boxCount =
      shipmentIdToBoxCountMapping[fulfillmentCenter.ShipmentId] || 1;
    let currentBox =
      shipmentIdToCurrentBoxMapping[fulfillmentCenter.ShipmentId] || 1;

    let boxOptions = [];
    for (let c = 1; c <= boxCount; c++) {
      boxOptions.push({ value: c, label: c });
    }

    return (
      <span>
        <a
          href="#a"
          id={"popover-" + fulfillmentCenter.ShipmentId}
          onClick={this.togglePopover.bind(this)}
        >
          <Badge color={"badge warehouse-badge " + fulfillmentCenter.DestinationFulfillmentCenterId}>
            {fulfillmentCenter.DestinationFulfillmentCenterId}{" "}
            <small>
              <strong>({fulfillmentCenter.QuantityShipped})</strong>
            </small>
          </Badge>
        </a>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target={"popover-" + fulfillmentCenter.ShipmentId}
          toggle={this.togglePopover.bind(this)}
        >
          <PopoverHeader className="text-center">
            <span>
              {fulfillmentCenter.DestinationFulfillmentCenterId}
              <small> ({fulfillmentCenter.ShipmentId})</small>
            </span>
          </PopoverHeader>
          <PopoverBody>
            <hr />
            <div className="text-center">
              <Button
                color="success"
                className="light-right-margin"
                onClick={this.printBarcodes.bind(
                  this,
                  fulfillmentCenter.ShipmentId
                )}
              >
                PRINT 2D BARCODE
              </Button>
            </div>
            <div>
            <iframe
              title="print_barcode"
              id="printable_barcode"
              name="print_barcode"
              width="0"
              height="0"
              frameBorder="0"
              src="about:blank"
            />
            </div>
            <hr />
            <FormGroup>
              <Label>
                <strong>Current Box: </strong>
              </Label>
              <Select
                value={{ label: currentBox, value: currentBox }}
                options={boxOptions}
                onChange={this.updateCurrentBox.bind(this)}
              />
            </FormGroup>
            <FormGroup className="text-center">
              <Button size="sm" onClick={this.addBox.bind(this)}>
                Add Box
              </Button>
            </FormGroup>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}

FulfillmentCenterBadgeWithPopover.propTypes = {
  fulfillmentCenter: PropTypes.object.isRequired,
  shipmentIdToCurrentBoxMapping: PropTypes.object.isRequired,
  shipmentIdToBoxCountMapping: PropTypes.object.isRequired,
  batchMetadata: PropTypes.object.isRequired
};

export default connect(
  state => ({
    batchMetadata: state.Batch.get("batchMetadata"),
    shipmentIdToBoxCountMapping: state.Batch.get("shipmentIdToBoxCountMapping"),
    shipmentIdToCurrentBoxMapping: state.Batch.get(
      "shipmentIdToCurrentBoxMapping"
    ),
    products: state.Batch.get("products")
  }),
  {
    updateBoxInfoForShipment,
    addBoxInfoForShipment,
    showAlert
  }
)(FulfillmentCenterBadgeWithPopover);
