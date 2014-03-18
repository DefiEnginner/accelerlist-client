import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row
} from 'reactstrap'
import PropTypes from 'prop-types'
import BoxContentsTable from '../displays/shared/BoxContentsTable';
import './style.css';
import 'react-datepicker/dist/react-datepicker.css';
import forOwn from 'lodash/forOwn';

class EditListingItemBoxContentModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
        listingItem: {
          boxContents: []
        },
        boxContents: [],
        shipmentQty: [],
        UnAssignedQuantity: [],
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    let tempListingItem = newProps.listingItem; 
    if(!!tempListingItem && !!tempListingItem.boxContents) {
      let tempBox = {};
      let shipmentQuantity = {};
      let UnAssignedQuantity = {};
      Object.keys(tempListingItem.boxContents).forEach((key) => {
        let shipmentContent = [];
        let shipmentQty = 0;
        let boxCount = this.props.shipmentIdToBoxCountMapping[key];
        for (let i = 1; i <= boxCount; i++) {
          if(i in tempListingItem.boxContents[key])
          {
            shipmentContent.push({
                key: i,
                value: Number(tempListingItem.boxContents[key][i])
            });
            shipmentQty += Number(tempListingItem.boxContents[key][i]);
          }
          else
          {
            shipmentContent.push({
                key: i,
                value: 0
            });
          }
        }
        tempBox[key] = shipmentContent;
        shipmentQuantity[key] = shipmentQty;
        UnAssignedQuantity[key] = 0;
      })
      this.setState({ boxContents: tempBox, shipmentQty: shipmentQuantity, UnAssignedQuantity });
    }
    this.setState({ listingItem: Object.assign({}, newProps.listingItem) });
  }

  handleChange = (field, value, param) => {
    if(field === 'UnAssignedQuantity') {
      let UnAssignedQuantity = this.state.UnAssignedQuantity;
      UnAssignedQuantity[param] = value;
      this.setState({ UnAssignedQuantity });
    }
  }

  saveChanges = () => {
    let check = false;
    forOwn(this.state.UnAssignedQuantity, function(value, key) {
      if(value > 0) check = true;
    });
    if(check) {
      alert("There are UnAssigned Quantities!");
      return false;
    }
    let finalBoxContents = {}
    Object.keys(this.state.boxContents).forEach((key) => {
      let tempBox = {};
      this.state.boxContents[key].forEach((box) => {
        if(Number(box.value) !== 0)
        {
          tempBox[box.key] = box.value;
        }
      })
      finalBoxContents[key] = tempBox;
    })
    let listing = this.state.listingItem;
    listing.boxContents = finalBoxContents;
    this.setState({ listingItem: listing});
    console.log("LISTING: ", listing);
    this.props.editListingItem(this.state.listingItem)
    this.props.close(); 
  }

  

  render() {
    const { isOpen, close } = this.props;
    const { listingItem } = this.state;
    const { fulfillmentCenters } = listingItem;
    return (
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader>
          <strong>Box Level Contetnts</strong>
          <br />
          <div>Make edits to the contents of your boxes for this SKU</div>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs="12">
              {
                  !!fulfillmentCenters && fulfillmentCenters.map((fulfillmentCenter, j) => (
                      <Row key={`box_contents_${j}`} xs="10">
                        <div className="col-md-12"><strong>{"Destination: " + fulfillmentCenter.DestinationFulfillmentCenterId + " (" + fulfillmentCenter.ShipmentId + ")"}</strong></div>
                        <div className="col-md-12">Quantity Shipped: { this.state.shipmentQty[fulfillmentCenter.ShipmentId] }  | UnAssigned Quantity: {this.state.UnAssignedQuantity[fulfillmentCenter.ShipmentId]}</div>
                        <div className="col-md-10 m-auto pt-4">
                          <BoxContentsTable
                            boxContents={this.state.boxContents}
                            ShipmentId={fulfillmentCenter.ShipmentId}
                            box={this.state.boxContents[fulfillmentCenter.ShipmentId]}
                            totalQty={ this.state.shipmentQty[fulfillmentCenter.ShipmentId] }
                            handleChange={this.handleChange}
                          />                              
                        </div>
                    </Row>
                ))
              }
              </Col>
            </Row>

        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={this.saveChanges}
          >
            Save Changes
          </Button>
          <Button color="secondary" onClick={close}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

EditListingItemBoxContentModal.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  listingItem: PropTypes.object,
  editListingItem: PropTypes.func.isRequired,
  shipmentIdToBoxCountMapping: PropTypes.object.isRequired,
}

export default EditListingItemBoxContentModal;