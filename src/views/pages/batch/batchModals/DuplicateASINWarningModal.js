import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Col,
  Row,
  Badge,
  Input
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PriceTrackersButtonGroup from '../displays/shared/PriceTrackersButtonGroup';
import "react-datepicker/dist/react-datepicker.css";
import { digitСonversion, secureProtocolImgURL } from "../../../../helpers/utility";

class DuplicateASINWarningModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addQty: "1"
    };
  }

  listWithNewMSKU = () => {
    const {
      addItemToBatch,
      currentListingWorkflowOptions,
    } = this.props;
    this.props.setCurrentFlow("listing_creator_display");
    this.props.close();
    if (currentListingWorkflowOptions.speedMode) {
      addItemToBatch(null, false);
    }
  };
  handleChangeAddQty = e => {
    this.setState({
      addQty: e.target.value
    });
  };
  addListingQty = () => {
    const addQty = Number(this.state.addQty);
    const currentEditableListingData = this.props.currentEditableListingData;
    const { qty } = currentEditableListingData;

    if (addQty && addQty > 0) {
      let data = Object.assign({}, currentEditableListingData, {
        qty: qty + addQty
      });
      this.props.editListingItem(data);
      this.props.close();
	  this.setState({ addQty: "1" })
    }
  };
  render() {
    const {
      close,
      isOpen,
      currentEditableListingData,
      currentSelectedSearchResult,
      internationalization_config
    } = this.props;
    if (currentEditableListingData) {
      var {
        imageUrl,
        asin,
        name,
        salesrank,
        condition,
        price
      } = currentEditableListingData;
    }

    return (
      <React.Fragment>
        {currentEditableListingData && currentSelectedSearchResult ? (
          <Modal isOpen={isOpen} size="lg">
            <ModalHeader>
              <strong>Duplicate ASIN in Batch</strong>
              <br />
              <small>
                There is a MSKU in the current batch matching this ASIN. You
                should update the quantity of the existing MSKU.
              </small>
            </ModalHeader>
            <ModalBody>
              <Card>
                <CardBody>
                  <Row>
                    <Col xs="2" className="col-align-center">
                      <img
                        style={{ width: "80%" }}
                        src={secureProtocolImgURL(imageUrl)}
                        alt="Product Listing"
                      />
                    </Col>
                    <Col xs="8">
                      <Row>
                        <Col xs="12">
                          <strong>{`${name}`}</strong>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="6">
                          <Badge color="primary">{`Rank: ${salesrank}`}</Badge>
                          <Badge
                            style={{ marginLeft: "10px" }}
                            color="info"
                          >{`ASIN: ${asin}`}</Badge>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4" style={{ marginTop: '5px', marginBottom: '5px'}}>
                          <PriceTrackersButtonGroup
                            ASIN={asin}
                            itemName={name}
                            amazonUrl={internationalization_config.amazon_url}
                            keepaBaseUrl={internationalization_config.keepa_url}
                            camelCamelCamelBaseUrl={internationalization_config.camelcamelcamel_url}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="6">
                          {`${condition}, Listed at ${digitСonversion(
                            price,
                            "currency",
                            internationalization_config.currency_code
                          )}`}
                        </Col>
                      </Row>
                    </Col>
                    <Col xs="2">
                      <Row style={{ justifyContent: "center" }}>
                        <Input
                          style={{ maxWidth: "70px" }}
                          type="number"
                          value={this.state.addQty}
                          onChange={this.handleChangeAddQty}
                        />
                      </Row>
                      <br />
                      <Row style={{ justifyContent: "center" }}>
                        <Button color="primary" onClick={this.addListingQty}>
                          Add Qty
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={close}>
                Cancel
              </Button>
              <Button color="success" onClick={this.listWithNewMSKU}>
                List With New MSKU
              </Button>
            </ModalFooter>
          </Modal>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

DuplicateASINWarningModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  editListingItem: PropTypes.func.isRequired,
  currentEditableListingData: PropTypes.object,
  close: PropTypes.func.isRequired,
  setCurrentFlow: PropTypes.func.isRequired,
  addItemToBatch: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config"),
    currentListingWorkflowOptions: state.Batch.get("currentListingWorkflowOptions"),
  }),
  {}
)(DuplicateASINWarningModal);
