import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col
} from "reactstrap";
import PropTypes from "prop-types";
import ReactToPrint from "react-to-print";
import PrintViewItems from "../displays/shared/PrintViewItems";
import PrintTemplate from "react-print";
import "./style.css";

import BatchProductCard from "../displays/shared/BatchProductCard";

class ShipViewItems extends Component {
  render() {
    const { isOpen, close, currentShipmentPlans, products } = this.props;
    let shipingItemsSKUList = [];

    if (currentShipmentPlans) {
      let plans = currentShipmentPlans;
      plans.forEach(plan => {
        var { Items } = plan;
        Items.forEach(element => {
          const additionalContent = (
            <React.Fragment>
              <br />
              <Row>
                <Col xs="1" />
                <Col xs="11">
                  <Row>
                    <Col xs="4">
                      Quantity: <span style={{ fontWeight: 'bold'}}>{element.Quantity} </span>
                    </Col>
                    <Col xs="8">
                      SKU: <span style={{ fontWeight: 'bold'}}>{element.SellerSKU} </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </React.Fragment>
          )
          shipingItemsSKUList.push(
            <BatchProductCard 
              key={Math.random()}
              products={products}
              sku={element.SellerSKU}
              additionalContent={additionalContent}
            />
          )
        })
      })
    }
    return (
      <Modal isOpen={isOpen} toggle={close} size="lg">
        <ModalHeader>
          <strong>View Items</strong>
        </ModalHeader>
        {currentShipmentPlans && (shipingItemsSKUList.length > 0) ? (
          <ModalBody>
            {shipingItemsSKUList}
          </ModalBody>
        ) : (
          ""
        )}
        <ModalFooter>
          <ReactToPrint
           trigger={() => (
             <a>
               <Button
                color="primary"
               >
                 Print Items
               </Button>
             </a>
           )}
           content={() => this.componentRef}
          />
          <Button onClick={close}>Close</Button>
        </ModalFooter>
        <PrintTemplate>
          <PrintViewItems className="printable" ref={el => (this.componentRef = el)} />
        </PrintTemplate>
      </Modal>
    );
  }
}          

ShipViewItems.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  products: PropTypes.array.isRequired,
  currentShipmentPlans: PropTypes.array,
  close: PropTypes.func.isRequired
};

export default ShipViewItems;
