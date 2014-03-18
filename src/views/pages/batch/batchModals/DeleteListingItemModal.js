import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody
} from 'reactstrap'
import PropTypes from 'prop-types'

import './style.css';
import CloseCircle from 'react-icons/lib/md/highlight-off'

class DeleteListingItemModal extends Component {

  deleteItem = () => {
    const {
      isHoldingAreaListing,
      currentEditableListingData,
      deleteListingItem,
      close
    } = this.props;
    deleteListingItem(currentEditableListingData, isHoldingAreaListing);
    close();
  }
  render() {
    const { close, isOpen } = this.props;
    return (
      <Modal isOpen={isOpen}>
        <ModalBody>
          <div className="col-align-center">
            <CloseCircle size={130} color='red'/>
          </div>
          <br />
          <div className="text-center" style={{ fontSize: '20px', fontWeight: 'bold' }}>Are you sure?</div>
          <br />
          <div className="text-center">Once deleted, you will have to re-list this item if you want to add it to the batch.</div>
          <br />
          <div className="col-align-center">
            <Button color="secondary" onClick={close}>Cancel</Button>
            <Button style={{ marginLeft: '10px'}} color="info" onClick={this.deleteItem}>Ok</Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

DeleteListingItemModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currentWorkingListingData: PropTypes.object,
  deleteListingItem: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  isHoldingAreaListing: PropTypes.bool.isRequired
}

export default DeleteListingItemModal;