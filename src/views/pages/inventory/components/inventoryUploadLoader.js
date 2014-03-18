import React, { Component, Fragment } from 'react';
import {
  Button,
  Row
} from 'reactstrap'
import FaSpinner from "react-icons/lib/fa/spinner";

import PropTypes from 'prop-types'

class InventoryUploadLoader extends Component {  
  render() {
    const { close } = this.props;
    return (
      <Fragment>
        <Row className="m-auto" style={{justifyContent: 'center'}}>
            <FaSpinner className="fa-spin fa-4x mt-3 mb-3" />
        </Row>
       
        <Row style={{justifyContent: 'center'}}>
          <Button color="secondary" onClick={close}>Cancel</Button>
        </Row>
      </Fragment>
    );
  }
}

InventoryUploadLoader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
}

export default InventoryUploadLoader;