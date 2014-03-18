import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody
} from 'reactstrap'
import PropTypes from 'prop-types'

import './style.css';
import CloseCircle from 'react-icons/lib/md/highlight-off'

class DeleteListingsItemsInBulkModal extends Component {

  deleteItems = () => {
    const {
	  skus,
	  close,
	  deleteListingItems,
    } = this.props;
    deleteListingItems(skus);
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
          <div className="text-center" style={{ fontSize: '20px', fontWeight: 'bold' }}>Are you sure you want to delete selected items?</div>
          <br />
          <div className="text-center">Once deleted, you will have to re-list these items if you want to add those items to the batch.</div>
          <br />
          <div className="col-align-center">
            <Button color="secondary" onClick={close}>Cancel</Button>
			<Button
				style={{ marginLeft: '10px'}}
				color="info"
				onClick={this.deleteItems}>Ok</Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

DeleteListingsItemsInBulkModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  deleteListingItems: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
}

export default DeleteListingsItemsInBulkModal;
