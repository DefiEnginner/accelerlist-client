import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col
} from "reactstrap";
import PropTypes from "prop-types";

class BoxManagerPrintViewItems extends Component {
	state = {
		shipmentsItemsView: [],
	}

   UNSAFE_componentWillMount() {
    const { shipment } = this.props;
	   const {
		   //selectedShipment,
		   inboundShipmentItems, additionalData } = shipment;
    let additionalItemsData = additionalData || {};
	let shipmentsItems = []

    if (inboundShipmentItems) {
      inboundShipmentItems.forEach(element => {
        const elementAdditionalData = additionalItemsData[element.SellerSKU] || {};
        shipmentsItems.push(
          <div
            style={{ display: 'block' }}
            key={Math.random()}
          >
            <Card>
              <CardHeader><span style={{ fontWeight: "bold"}}>{elementAdditionalData.name || "N/A"}</span></CardHeader>
              <CardBody>
                <Row>
                  <Col xs="1" style={{display: "flex", alignItems: "center"}}>
                    <img
                      src={elementAdditionalData.image_url}
                      alt="item_pic"
                      style={{ width: "48px" }}
					/>
                  </Col>
                  <Col xs="11">
                    <Row>
                      <Col xs="4">
                        SKU: <span style={{ fontWeight: "bold"}}>{element.SellerSKU || "N/A"} </span>
                      </Col>
                      <Col xs="4">
                        ASIN: <span style={{ fontWeight: "bold"}}>{element.ASIN || "N/A"}</span>
                      </Col>
                      <Col xs="4">
                        Category: <span style={{ fontWeight: "bold"}}>{elementAdditionalData.category || "N/A"} </span>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col xs="4">
                        Sales Rank: <span style={{ fontWeight: "bold"}}>{elementAdditionalData.salesrank || "N/A"} </span>
                      </Col>
                      <Col xs="4">
                        FNSKU: <span style={{ fontWeight: "bold"}}>{element.FulfillmentNetworkSKU || "N/A"} </span>
                      </Col>
                      <Col xs="4">
                        Condition: <span style={{ fontWeight: "bold"}}>{elementAdditionalData.condition || "N/A"} </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <br />
          </div>
        )
      })
	}
	  this.setState({ shipmentsItemsView: shipmentsItems });
   }

	render(){
		return (
		  <div className="printable">
			{this.props.shipment.selectedShipment && (this.props.shipment.inboundShipmentItems.length > 0) ? (
			  <div>
				<strong>Shipment Name: {this.props.shipment.selectedShipment.ShipmentName}</strong>
				<br />
				<br />
				{this.state.shipmentsItemsView}
			  </div>
			  ) : (
				""
			  )}
		  </div>
		);
  }
}

BoxManagerPrintViewItems.propTypes = {
  shipment: PropTypes.object.isRequired
};

export default BoxManagerPrintViewItems;
