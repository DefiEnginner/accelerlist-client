import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col
} from "reactstrap";
import { secureProtocolImgURL } from "../../../../../helpers/utility";

const BatchProductCard = (props) => {
  const { products, additionalContent, sku } = props;

  const getDataFromProducts = (sku, field) => {
    let item = null;
    if (products) {
      products.forEach(element => {
        if (element.sku === sku) {
          item = element[field];
        }
      })
      if ( field === "FulfillmentNetworkSKU") {
        products.forEach(element => {
          if (element.sku === sku) {
            // private batch case
            if (element.fnsku) {
              item = element.fnsku
            } else if (element.fulfillmentCenters && element.fulfillmentCenters[0]) {
              item = element.fulfillmentCenters[0][field];
            } else {
              item = "N/A"
            }
          }
        })
      }
    };
    if (item) {
      return item;
    }
    return "N/A"
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader><span style={{ fontWeight: "bold"}}>{getDataFromProducts(sku, "name")} </span></CardHeader>
        <CardBody>
          <Row>
            <Col xs="1" style={{display: "flex", alignItems: "center"}}>
              <img 
                src={
                  secureProtocolImgURL(getDataFromProducts(sku, "imageUrl"))
                  } 
                alt="item_pic"
                style={{ width: "48px" }}
              />
            </Col>
            <Col xs="11">
              <Row>
                <Col xs="4">
                  ASIN: <span style={{ fontWeight: "bold"}}>{getDataFromProducts(sku, "asin")} </span>
                </Col>
                <Col xs="4">
                  UPC: <span style={{ fontWeight: "bold"}}>{getDataFromProducts(sku, "asin")} </span>
                </Col>
                <Col xs="4">
                  Category: <span style={{ fontWeight: "bold"}}>{getDataFromProducts(sku, "category")} </span>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs="4">
                  Sales Rank: <span style={{ fontWeight: "bold"}}>{getDataFromProducts(sku, "salesrank")} </span>
                </Col>
                <Col xs="4">
                  FNSKU: <span style={{ fontWeight: "bold"}}>{getDataFromProducts(sku, "FulfillmentNetworkSKU")} </span>
                </Col>
                <Col xs="4">
                  Condition: <span style={{ fontWeight: "bold"}}>{getDataFromProducts(sku, "condition")} </span>
                </Col>
              </Row>
            </Col>
          </Row>
          {additionalContent ? additionalContent : ""}
        </CardBody>
      </Card>
      <br />
    </React.Fragment>
  )
}

BatchProductCard.propTypes = {
  additionalContent: PropTypes.object,
  products: PropTypes.array.isRequired,
  sku: PropTypes.string.isRequired
}

export default BatchProductCard;