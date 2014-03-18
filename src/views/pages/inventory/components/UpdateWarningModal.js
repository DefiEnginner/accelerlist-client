import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody
} from 'reactstrap'
import PropTypes from 'prop-types'

import './style.css';
import ErrorCircle from 'react-icons/lib/md/error'

class UpdateWarningModal extends Component {
  render() {
    const { close, isOpen } = this.props;
    return (
      <Modal isOpen={isOpen}>
        <ModalBody>
          <div className="col-align-center">
            <ErrorCircle size={130} color='red'/>
          </div>
          <br />
		  <div className="text-center">
			  <b>As a new user you will need to wait anywhere from 3 to 24 hours before we can completely sync with your Amazon inventory.</b>
		  </div>
          <br />
          <div className="col-align-center">
            <Button color="success" onClick={close}>UNDERSTAND</Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

UpdateWarningModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
}

export default UpdateWarningModal;
