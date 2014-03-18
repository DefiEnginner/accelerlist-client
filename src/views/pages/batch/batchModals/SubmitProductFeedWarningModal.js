import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import PropTypes from "prop-types";
import WarningImg from "react-icons/lib/md/error-outline"

class SubmitProductFeedWarningModal extends Component {

  onClickButtonSubmitFeedCompleteBatch = () => {
    const { submitProductFeed, products, batchMetadata, completeBatch, close } = this.props;
    if (products && batchMetadata) {
      submitProductFeed(products, batchMetadata);
      completeBatch();
      close();
    }
  }

  onClickButtonPreviewInboundShipmentPlans = () => {
    const { createShipmentPlans, products, batchMetadata, setCurrentFlow, close } = this.props;
    let params = {batchId: batchMetadata.id};
    console.log(params)
    createShipmentPlans(products, params);
    close();
    setCurrentFlow("shipment_plans_display");
  }

  render() {
    const { isOpen, close } = this.props;
    return (
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader>
          <strong>Submit Feed Only</strong>
        </ModalHeader>
        <ModalBody className="center">
          <div>
            <WarningImg size="100" color="#f8bb86" />
          </div>
          <br />
          <div className="description">
            If you choose to submit feed only, we will complete and close out the batch. You will ONLY be able to create shipments through Seller Central.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={close}>
            Cancel
          </Button>
          <Button color="warning" onClick={this.onClickButtonPreviewInboundShipmentPlans}>
            Preview Inbound Shipment Plans Instead
          </Button>
          <Button color="success" onClick={this.onClickButtonSubmitFeedCompleteBatch}>
            {`Submit Feed & Complete Batch`}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}          

SubmitProductFeedWarningModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  submitProductFeed: PropTypes.func.isRequired,
  createShipmentPlans: PropTypes.func.isRequired,
  setCurrentFlow: PropTypes.func.isRequired,
  completeBatch: PropTypes.func.isRequired,
  products: PropTypes.array,
  batchMetadata: PropTypes.object,
};

export default SubmitProductFeedWarningModal;
