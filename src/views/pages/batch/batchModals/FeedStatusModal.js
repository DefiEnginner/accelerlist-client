import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row,
  Badge
} from "reactstrap";
import PropTypes from "prop-types";
import "./style.css";

import TemplateErrorsView from "../displays/shared/TemplateErrorsView";
import SKUErrorsView from "../displays/shared/SKUErrorsView";
import { 
  momentDateIsValid,
  momentDateTimeToLocalFormatConversion
} from "../../../../helpers/utility";

class FeedStatusModal extends Component {
  render() {
    const { isOpen, close, currentFeedStatusData, products } = this.props;
    let feedErrors = [];

    if (currentFeedStatusData) {
      var {
        parsed_feed,
        feed_id,
        fulfillment_center,
        shipment_name,
        created_at
      } = currentFeedStatusData;
      
      if (parsed_feed && !parsed_feed.is_fallback_report) {
        var { num_processed, num_successful, headers, rows } = parsed_feed;
        
        if (rows !== null) {
          rows.forEach((row) => {
            let obj = {};
            row.forEach((element, index) => {
              obj[headers[index]] = element
            });
            feedErrors.push(obj);
          });
        }
      }
    }

    return (
      <Modal isOpen={isOpen} toggle={close} size="lg">
        <ModalHeader>
          <strong>Feed status</strong>
        </ModalHeader>
        {currentFeedStatusData ? (
          <ModalBody>
            <Row>
              <Col xs="3">Shipment Name:</Col>
              <Col xs="8">
                <strong>{shipment_name ? shipment_name : "N/A"}</strong>
              </Col>
            </Row>
            <Row>
              <Col xs="3" style={{ verticalAlign: "middle" }}>
                Fulfillment Center:
              </Col>
              <Col xs="9">
                <h4>
                  <Badge color="danger">
                    {fulfillment_center ? fulfillment_center : "N/A"}
                  </Badge>
                </h4>
              </Col>
            </Row>
            <Row>
              <Col xs="3">Feed ID:</Col>
              <Col xs="9">
                <strong>{feed_id ? feed_id : "N/A"}</strong>
              </Col>
            </Row>
            <Row>
              <Col xs="3">Create Time:</Col>
              <Col xs="9">
                <strong>
                  {momentDateIsValid(created_at)
                    ? momentDateTimeToLocalFormatConversion(created_at)
                    : "N/A"}
                </strong>
              </Col>
            </Row>
            <br />

            <div>{`Number of records processed   ${
              num_processed ? num_processed : "N/A"
            }`}</div>
            <div>{`Number of records successful  ${
              num_successful ? num_successful : "N/A"
            }`}</div>
            <div>{`Number of records failed      ${
              num_successful && num_processed
                ? Number(num_processed) - Number(num_successful)
                : "N/A"
            }`}</div>
            <br />
            <TemplateErrorsView feedErrors={feedErrors} />
            <br />
            <SKUErrorsView products={products} feedErrors={feedErrors} />
          </ModalBody>
        ) : (
          ""
        )}
        <ModalFooter>
          <Button onClick={close}>Ok</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

FeedStatusModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  products: PropTypes.array.isRequired,
  currentFeedStatusData: PropTypes.object,
  close: PropTypes.func.isRequired
};

export default FeedStatusModal;
