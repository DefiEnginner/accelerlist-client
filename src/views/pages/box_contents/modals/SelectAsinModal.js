import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'reactstrap'
import PropTypes from 'prop-types'
import './style.css'

class SelectAsinModal extends Component {
 
  submitSelectedAsin(item) {
    this.props.submitSelectedAsin(item);
  }

  render() {
    const { close, isOpen, searchErrorData } = this.props;
    console.log("Search Error Data: ", searchErrorData);
    return (
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader>
          <strong>Multiple results found</strong>
        </ModalHeader>
        <ModalBody>
          <p>Multiple ASIN matches found in the selected shipments. Please select one.</p>
          <Table className="acc-table mt-4">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Condition</th>
                <th>ASIN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                !!searchErrorData && searchErrorData.map((item) => {
                  return (
                    <tr>
                      <td>
                        <img src={item.imageUrl} width="40" alt="item_image" />
                      </td>
                      <td width="30%">{item.name}</td>
                      <td>VG</td>
                      <td>{item.ASIN}</td>
                      <td><Button onClick={() => this.submitSelectedAsin(item)} color="primary">Choose</Button></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={close}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

SelectAsinModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  submitSelectedAsin: PropTypes.func,
  searchErrorData: PropTypes.array
}

export default SelectAsinModal;