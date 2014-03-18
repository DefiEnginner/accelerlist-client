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
  Badge
} from "reactstrap";
import PropTypes from "prop-types";
import {   
  momentDateIsValid,
  momentDateToISOFormatConversion,
  secureProtocolImgURL 
} from "../../../../helpers/utility";
import ReplenishmentWarningModalTable from "../displays/shared/ReplenishmentWarningModalTable";
import { getConditionOptions } from "../../../../helpers/batch/utility";

const condEum = getConditionOptions();

class ReplenishmentWarningModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addQty: 1,
      newPrice: null,
      replenishableListings: []
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { currentSelectedSearchResult } = newProps;
    
    if (currentSelectedSearchResult){
      const { replenishableListings } = currentSelectedSearchResult;
      let parsedReplenishableListings = [];

      replenishableListings.forEach(element => {
        let buff = JSON.parse(element);
        buff.expDate = '';
        buff.quantity = 1;
        parsedReplenishableListings.push(buff);
      });

      if (parsedReplenishableListings.length > 0){
        this.setState({
          replenishableListings: parsedReplenishableListings
        })
      }
    }
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

  addItemToBatch = (replenishableListing) => {
    const {
      currentSelectedSearchResult,
      addItemToBatch,
      close,
      batchListingDefaults,
    } = this.props;
    
    let expDateToString = momentDateIsValid(replenishableListing.expDate) ? momentDateToISOFormatConversion(replenishableListing.expDate) : '';
    const currentSelectedSearchResultWithBatchListingDefaults = Object.assign({}, batchListingDefaults, currentSelectedSearchResult)
    const payload = {
      ...currentSelectedSearchResultWithBatchListingDefaults,
      searchResultData: Object.assign({}, currentSelectedSearchResult),
      condition: (condEum[replenishableListing.item_condition] || condEum[0]).value,
      maxPrice: replenishableListing.max_price || batchListingDefaults.maxPrice,
      minPrice: replenishableListing.min_price || batchListingDefaults.minPrice,
      price: replenishableListing.price || batchListingDefaults.price,
      buyCost: replenishableListing.buy_cost || batchListingDefaults.buyCost,
      asin: currentSelectedSearchResult.ASIN,
      sku: replenishableListing.seller_sku,
      expDate: expDateToString || batchListingDefaults.expDate,
      datePurchased: replenishableListing.date_purchased || batchListingDefaults.datePurchased,
      qty: replenishableListing.quantity || batchListingDefaults.qty,
      note: replenishableListing.item_note || batchListingDefaults.note,
    };
    addItemToBatch(payload, false);
    close();
  }

  onChangeItemValue = (item) => {
    let replenishableListings = [...this.state.replenishableListings];

    Object.keys(replenishableListings).forEach(element => {
      if (replenishableListings[element].seller_sku === item.seller_sku) {
        replenishableListings[element] = Object.assign({}, item);
      } 
    })

    this.setState({
      replenishableListings
    })
  }

  render() {
    const {
      isOpen,
      close,
      currentSelectedSearchResult
    } = this.props;
    const { replenishableListings } = this.state;
    if (!currentSelectedSearchResult || !currentSelectedSearchResult.replenishableListings || currentSelectedSearchResult.replenishableListings.length === 0) {
      return null;
    }
    const {
      imageUrl,
      ASIN,
      name,
      salesrank
    } = currentSelectedSearchResult;
 
    return (
      <div>
        {currentSelectedSearchResult ? (
          <Modal isOpen={isOpen} size="lg" className="replenish-modal">
            <ModalHeader>
              <strong>Existing MSKU</strong>
              <br />
              <small>
                You currently have MSKU(s) matching this ASIN in your inventory
              </small>
            </ModalHeader>
            <ModalBody>
            <Card style={{ overflow: "visible" }}>
              <CardBody>
                <Row>
                  <Col xs="2" className="col-align-center">
                    <img src={secureProtocolImgURL(imageUrl)} alt="Product Listing" />
                  </Col>
                  <Col xs="10">
                    <Row>
                      <Col xs="12">
                        <div className="modal-title">{name || ""}</div>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="6">
                        <Badge color="info">{`Rank: ${salesrank ||
                          ""}`}</Badge>
                        <Badge color="info">{`ASIN: ${ASIN || ""}`}</Badge>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <br />
                <Row>
                  <ReplenishmentWarningModalTable
                    replenishableListings={replenishableListings}
                    onChangeItemValue={this.onChangeItemValue}
                    addItemToBatch={this.addItemToBatch}
                  />
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
      </div>
    );
  }
}

ReplenishmentWarningModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currentSelectedSearchResult: PropTypes.object,
  currentListingWorkflowOptions: PropTypes.object,
  close: PropTypes.func.isRequired,
  addItemToBatch: PropTypes.func.isRequired,
  setCurrentFlow: PropTypes.func.isRequired,
  batchListingDefaults: PropTypes.object,
};

export default ReplenishmentWarningModal;
