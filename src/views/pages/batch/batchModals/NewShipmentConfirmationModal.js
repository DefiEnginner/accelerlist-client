import React, { Component } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Table
} from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

class NewShipmentConfirmationModal extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  approve() {
    this.props.approve();
    this.props.close();
  }

  sendToHoldings() {
    this.props.sendToHoldings();
    this.props.close();
  }

  close = () => {
    this.props.close();
    this.props.updateAddToBatchStatus();
  }

  render() {
    let {
      isOpen,
      currentWorkingListingData,
      rejectNewLiveBatchShipment
    } = this.props;
    var shipmentRows;
    if (currentWorkingListingData && currentWorkingListingData.inboundShipmentPlans) {
      shipmentRows = currentWorkingListingData.inboundShipmentPlans.map(function (plan) {
        return (
          <tr key={plan.ShipmentId.value}>
            <td>{plan.Items.member.Quantity.value}</td>
            <td>{plan.ShipmentId.value}</td>
            <td>{plan.DestinationFulfillmentCenterId.value}</td>
          </tr>
        )
      })
    }

    return (
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader>
          Shipment Designations
            <br />
          <small className="font-bold">
            These are your shipment designations for the current listing.
            Amazon wants to create some new shipments to be able to add your inbound items.
            Please approve the new shipments that you would like Amazon to create.
            </small>
        </ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>Quantity Shipped</th>
                <th>Shipment ID</th>
                <th>Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {shipmentRows}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.approve.bind(this)}>Approve</Button>
		  {/*
          {currentWorkingListingData && currentWorkingListingData.isHoldingAreaListing ? "" :
            <Button color="success" onClick={this.sendToHoldings.bind(this)}>Send to Holding Area</Button>
		  }
		  */}
          <Button color="secondary" onClick={() => rejectNewLiveBatchShipment()}>Reject</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

NewShipmentConfirmationModal.propTypes = {
  close: PropTypes.func.isRequired,
  approve: PropTypes.func.isRequired,
  shipments: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  updateAddToBatchStatus: PropTypes.func.isRequired
}

export default NewShipmentConfirmationModal;
