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
import { getShipmentDataForSKU } from "../../../../helpers/box_contents/utility";


class SelectSKUModal extends Component {
 
  submitSelectedSku(sku) {
    this.props.submitSelectedSku(sku);
  }

  render() {
    const { close, isOpen, searchErrorData, selectedShipmentsData, selectedSearchItem } = this.props;
    console.log("Search Error Data: ", searchErrorData);
    return (
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader>
          <strong>Multiple results found</strong>
        </ModalHeader>
        <ModalBody>
            <p>Multiple SKU matches found in the selected shipments. Please select one.</p>
            {
                !!selectedSearchItem &&
                    <Table className="acc-table mt-4">
                    <thead className="d-none">
                        <tr>
                        <th>&nbsp;</th>
                        <th>Title</th>
                        <th>ASIN</th>
                        <th>Salesrank</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>
                            <img src="http://ecx.images-amazon.com/images/I/41LWAZFRm9L._SL200_.jpg" width="40" alt="images-amazon" />
                        </td>
                        <td width="30%"><strong>Title</strong><br/> {selectedSearchItem.name}</td>
                        <td><strong>ASIN</strong><br/> {selectedSearchItem.ASIN}</td>
                        <td><strong>Salesrank</strong><br/> {selectedSearchItem.salesrank}</td>
                        </tr>
                    </tbody>
                    </Table>
            }
            <Table className="acc-table acc-table-left mt-4">
              <thead>
                <tr>
                  <th>Shipment IDs</th>
                  <th>SKU</th>
                  <th>FNSKU</th>
                  <th>Action</th>
                </tr>
              </thead>
            <tbody>
              {
                !!searchErrorData && searchErrorData.map((item) => {
                  return (
                    <tr>
                      <td width="30%">{getShipmentDataForSKU(item, selectedShipmentsData).shipmentIds.join(", ")}</td>
                      <td>{item}</td>
                      <td>{getShipmentDataForSKU(item, selectedShipmentsData).fnsku}</td>
                      <td><Button onClick={() => this.submitSelectedSku(item)} color="primary">Choose</Button></td>
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

SelectSKUModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  submitSelectedSku: PropTypes.func,
  searchErrorData: PropTypes.array,
  selectedSearchItem: PropTypes.object
}

export default SelectSKUModal;