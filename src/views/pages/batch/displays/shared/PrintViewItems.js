import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col
} from "reactstrap";
import PropTypes from "prop-types";
import BatchProductCard from "../../displays/shared/BatchProductCard";

class PrintViewItems extends Component {
  render() {
    const { currentShipmentPlans, products } = this.props;
    let shipingItemsSKUList = [];

    if (currentShipmentPlans) {
      var plans = currentShipmentPlans;
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
            <div 
              style={{ display: 'block' }}
              key={Math.random()}
            >
              <BatchProductCard 
                products={products}
                sku={element.SellerSKU}
                additionalContent={additionalContent}
              />
            </div>
          )
        })
      })
    }
    return (
      <div className="printable">
        {currentShipmentPlans && (shipingItemsSKUList.length > 0) ? (
          <div>
            <strong>Shipment Plan: {currentShipmentPlans.ShipmentId}</strong>
            <br />
            <br />
            {shipingItemsSKUList}
          </div>
          ) : (
            ""
          )}
      </div>
    );
  }
}          

PrintViewItems.propTypes = {
  products: PropTypes.array.isRequired,
  currentShipmentPlans: PropTypes.array,
};

export default connect(
  state => ({
    currentShipmentPlans: state.Batch.get("currentShipmentPlans"),
    products: state.Batch.get("products")
  }), 
  {}
)(PrintViewItems);

