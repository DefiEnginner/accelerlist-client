import React, { Component } from 'react';
import { connect } from "react-redux";
import { Row, Card, CardBody, Col } from 'reactstrap';
import ViewHeader from './ViewHeader';
import WistiaPlayer from "../../../shared/components/WistiaEmbed";

import boxContentsAction from "../../../redux/box_contents/actions";
import settingActions from "../../../redux/settings/actions";
import ViewContent from './ViewContent';
import ShipmentSelectorCard from './ShipmentSelectorCard';
import BoxSelectorCard from './BoxSelectorCard';
import ShipmentBoxItemsCard from './ShipmentBoxItemsCard';
import SweetAlert from 'sweetalert2-react';
import { boxContentManagerVideoWistiaID } from "../../../config/mediaLinks";
import './style.css';
import { printCodeForBox } from "../../../helpers/batch/utility";
const { fetchShipmentList, selectShipmentRequest, selectShipmentBox, addShipmentBox, moveItem, showAlert, closeAlert, updateQuery, searchProductRequest } = boxContentsAction;
const { fetchPrinterDefaults } = settingActions;

class BoxContentsManager extends Component {
  componentDidMount() {
    this.props.fetchShipmentList();
    this.props.fetchPrinterDefaults();
  }

  selectShipment = ({ selectShipmentRequest }, selectedShipment) => {
    selectShipmentRequest(selectedShipment);
  }

  addBox({ addShipmentBox }, shipmentId) {
    addShipmentBox(shipmentId);
  }

  workOnBox({ selectedShipmentData, selectShipmentBox }, boxId) {
    const box = selectedShipmentData.boxes.find(box => {
      return (box.id === boxId)
    });
    if (box) {
      selectShipmentBox(box);
    }
  }

  searchProduct = ({ query, selectedShipmentData, selectedShipmentBox, searchProductRequest }) => {
    if (!query) {
      return;
    }
    searchProductRequest(query, selectedShipmentData, selectedShipmentBox);
  }

  moveProduct = ({ moveItem, selectedShipmentData, selectedShipmentBox }, itemId, toBoxId, toQty) => {
    moveItem(itemId, toBoxId, toQty, selectedShipmentData.selectedShipment, selectedShipmentBox);
  }

  printQr = (shipmentBox, selectedShipment) => {
    let qrCodeText = "AMZN,PO:" + selectedShipment.ShipmentId;
    shipmentBox.items.forEach(item => {
      qrCodeText += ",ASIN:" + item.ASIN + ",QTY:" + item.QuantityShippedInBox;
    });
    const boxWeight = shipmentBox.items.reduce((acc, item) => {
      if (!!item.ProductSearchResult && !!item.ProductSearchResult.itemDimensions && !!item.ProductSearchResult.itemDimensions.Weight) {
        return acc + Number(item.ProductSearchResult.itemDimensions.Weight);
      }
      return acc;
    }, 0);
    const shipmentName = `Shipment name: ${selectedShipment.ShipmentName}`;
    const boxNumber = shipmentBox.box_number;
    const unitsCount = shipmentBox.items.reduce((acc, item) => {
      return acc + Number(item.QuantityShippedInBox);
    }, 0);
    const warehouseName = selectedShipment.DestinationFulfillmentCenterId;
    console.log("THIS IS QR CODE TEXT TO PRINT", qrCodeText);
    printCodeForBox("print_frame", qrCodeText, boxWeight.toFixed(2), shipmentName, boxNumber, unitsCount, warehouseName, this.props.showAlert);
  };

  render() {
    const { shipmentList, currentAlert, closeAlert, selectedShipmentData, loading, loadingShipmentId, selectedShipmentBox, query, updateQuery, movingItemId, searchingProduct, addingProduct } = this.props;
    var boxContentsToolContainer;
    let alert;
    if (currentAlert !== null) {
      alert = (
        <SweetAlert
          show={currentAlert !== null}
          title={currentAlert.title}
          text={currentAlert.text}
          confirmButtonColor={"#3085d6"}
          onConfirm={() => closeAlert()}
        />
      )

    }
    if (!shipmentList) {
      boxContentsToolContainer = (
        <Row>
          <div className="col-lg-12">
            <h4>Loading...</h4>
          </div>
        </Row>
      )
    } else if (shipmentList.length === 0) {
      boxContentsToolContainer = (
        <Row>
          <div className="col-lg-12">
            <Card>
              <CardBody>
                <h4>No shipments found. </h4>
                <p>List some items and create some open working shipments to see them here!</p>
              </CardBody>
            </Card>
          </div>
        </Row>
      );
    } else {
      boxContentsToolContainer = (
        <Row>
          <div className="col-lg-3">
            <ShipmentSelectorCard
              shipments={shipmentList}
              selectedShipmentData={selectedShipmentData}
              loadingShipmentId={loadingShipmentId}
              selectShipment={this.selectShipment.bind(this, this.props)}
            />
          </div>
          <div className="col-lg-4">
            <BoxSelectorCard
              selectedShipmentData={selectedShipmentData}
              selectedShipmentBox={selectedShipmentBox}
              addBox={this.addBox.bind(this, this.props)}
              workOnBox={this.workOnBox.bind(this, this.props)}
              printQr={this.printQr}
            />
          </div>
          <div className="col-lg-5">
            <ShipmentBoxItemsCard
              selectedShipmentData={selectedShipmentData}
              shipmentBox={selectedShipmentBox}
              shipmentItemsQuery={query}
              scannerDetectedCallback={() => {
                this.searchProduct(this.props);
              }}
              updateItemQuery={(value) => {
                updateQuery(value);
              }}
              moveItem={(itemId, toBoxId, toQty) => {
                this.moveProduct(this.props, itemId, toBoxId, toQty);
              }}
              movingItemId={movingItemId}
              searchLoading={searchingProduct || addingProduct}
              loading={loading}
            />
          </div>
        </Row>
      )
    }

    return (
      <div className="view">
        <div>
          {alert}
        </div>
        <ViewHeader />
        <ViewContent>
          <Row>
            <Col style={{ maxWidth: "535px", minWidth: "535px" }}>
              <Card>
                <CardBody>
                  <WistiaPlayer
                    hashedId={boxContentManagerVideoWistiaID}
                    playerColor="#00c853"
                    aspectRatio={38}
                  />
                </CardBody>
              </Card>
            </Col>
              <Col>
                <p>
                  A FREE way to manage Amazon's box content requirements for your business!
                  <br />
                  Watch our free training video to the left for a step by step guide on how leverage
                  the box contents manager for error free shipments to Amazon's Fulfillment Centers.
                </p>
              </Col>
          </Row>
          <hr />
          {boxContentsToolContainer}
        </ViewContent>
        <iframe
          title="print_frame"
          id="printable"
          name="print_frame"
          width="0"
          height="0"
          frameBorder="0"
          src="about:blank"
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.BoxContents.toJS(),
    printerDefaults: state.Settings.get("printerDefaults")
  }),
  { fetchShipmentList, selectShipmentRequest, selectShipmentBox, addShipmentBox, moveItem, showAlert, closeAlert, updateQuery, searchProductRequest, fetchPrinterDefaults }
)(BoxContentsManager);
