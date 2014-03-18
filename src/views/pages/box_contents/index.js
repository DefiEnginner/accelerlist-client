import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Card, CardBlock } from "reactstrap";
import ViewHeader from "./ViewHeader";
import boxContentsAction from "../../../redux/box_contents/actions";
import settingActions from "../../../redux/settings/actions";
import ViewContent from "./ViewContent";
import ShipmentList from "./ShipmentList";
import SelectASINModal from "./modals/SelectAsinModal";
import SelectSKUModal from "./modals/SelectSKUModal";
import ShipmentItemsSearchBox from "./ShipmentItemsSearchBox";
import SweetAlert from "sweetalert2-react";
import "./style.css";
import { printCodeForBox } from "../../../helpers/batch/utility";

const {
  loadingShipment,
  updateSelectedShipmentReadyFlag,
  updateSelectedShipmentBox,
  addShipmentBox,
  removeSelectedShipment,
  fetchShipmentList,
  selectShipmentRequest,
  selectShipmentBox,
  moveItem,
  showAlert,
  closeAlert,
  updateQuery,
  searchProductRequest,
  chooseSearchItem,
  changePaginationLimit,
  printShipmentItem,
  changeBoxDialogPaginationLimit,
  clearAddProductError,
  delProductRequest
} = boxContentsAction;
const { fetchPrinterDefaults, savePrinterDefaults } = settingActions;

class BoxContents extends Component {
  componentDidMount() {
    this.props.fetchShipmentList();
    this.props.fetchPrinterDefaults();
  }

  selectShipment = (
    { selectShipmentRequest, removeSelectedShipment },
    selectedShipment,
    checked
  ) => {
    if (checked) {
      selectShipmentRequest(selectedShipment);
    } else {
      let dataIndex, shipmentIndex;
      this.props.selectedShipmentsData.find((data, i) => {
        if (data.selectedShipment.ShipmentId === selectedShipment.ShipmentId) {
          dataIndex = i;
          return true;
        }
        return false;
      });
      this.props.selectedShipments.find((data, i) => {
        if (data.ShipmentId === selectedShipment.ShipmentId) {
          shipmentIndex = i;
          return true;
        }
        return false;
      });
      removeSelectedShipment(dataIndex, shipmentIndex);
    }
  };

  updatePrinterDefaults = printLabelFlag => {
    console.log("Label Flag: ", printLabelFlag);
    this.props.savePrinterDefaults({
      print_while_scanning_box_contents: printLabelFlag
    });
  };

  changeLimit = (limit) => {
    const { changePaginationLimit } = this.props;
    changePaginationLimit(1, limit);
  };

  changePage = (page) => {
    const { changePaginationLimit, limit } = this.props;
    changePaginationLimit(page, limit);
  };

  addBox = shipmentId => {
    if(!this.props.loadingAddBox) {
      this.props.addShipmentBox(shipmentId);
    }
  };

  updateCurrentBox = (shipmentId, box) => {
    let shipmentIndex;
    this.props.selectedShipmentsData.find((data, i) => {
      if (data.selectedShipment.ShipmentId === shipmentId) {
        shipmentIndex = i;
        return true;
      }
      return false;
    });
    this.props.updateSelectedShipmentBox(shipmentId, shipmentIndex, box);
  };

  workOnBox({ selectedShipmentData, selectShipmentBox }, boxId) {
    const box = selectedShipmentData.boxes.find(box => {
      return box.id === boxId;
    });
    if (box) {
      selectShipmentBox(box);
    }
  }

  searchProduct = ({ query, selectedShipmentsData, searchProductRequest, changePaginationLimit }) => {
    console.log("Query: ", query);
    if (!query) {
      return;
    }
    searchProductRequest(query, selectedShipmentsData);
	  //changePaginationLimit(1, 5);
  };

  moveProduct = (
    { moveItem },
    itemId,
    toBoxId,
    toQty,
    selectedShipment,
    selectedShipmentBox
  ) => {
    moveItem(itemId, toBoxId, toQty, selectedShipment, selectedShipmentBox);
  };

  printQr = (shipmentBox, selectedShipment) => {
    let qrCodeText = "AMZN,PO:" + selectedShipment.ShipmentId;
    shipmentBox.items.forEach(item => {
      qrCodeText += ",ASIN:" + item.ASIN + ",QTY:" + item.QuantityShippedInBox;
    });
    const boxWeight = shipmentBox.items.reduce((acc, item) => {
      if (!!item.ProductSearchResult && !!item.ProductSearchResult.itemDimensions && !!item.ProductSearchResult.itemDimensions.Weight) {
        acc = acc + (Number(item.ProductSearchResult.itemDimensions.Weight));
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
    printCodeForBox(
      "print_frame",
      qrCodeText,
      boxWeight.toFixed(2),
      shipmentName,
      boxNumber,
      unitsCount,
      warehouseName,
      this.props.showAlert
    );
  };

  searchProductRequest = (query) => {
    console.log("query: ", query);
    const { searchProductRequest, selectedShipmentsData } = this.props;
    searchProductRequest(query, selectedShipmentsData);
  };

  selectSearchASIN = (item) => {
    this.props.chooseSearchItem(item);
    this.searchProductRequest(item.ASIN);
  }

  selectSearchSKU = (item) => {
    this.searchProductRequest(item);
  }

  printItem = (item) => {
    this.props.printShipmentItem(item);
  }

  changeBoxDialogPage = (page) => {
    this.props.changeBoxDialogPaginationLimit(page, this.props.boxDialogLimit);
  }

  changeBoxDialogLimit = (limit) => {
    this.props.changeBoxDialogPaginationLimit(1, limit);
  }

  render() {
    const {
      searchErrorType,
      searchErrorData,
      printerDefaults,
      loadingShipment,
      selectedShipmentsData,
      shipmentList,
      currentAlert,
      closeAlert,
      loading,
      selectedShipmentBox,
      query,
      updateQuery,
      movingItemId,
      searchingProduct,
      addingProduct,
      selectedSearchItem,
      page,
      limit,
      boxDialogPage,
      boxDialogLimit,
      clearAddProductError,
      delProductRequest
    } = this.props;
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
      );
    }
    if (!shipmentList) {
      boxContentsToolContainer = (
        <Row>
          <div className="mt-5 col-lg-12">
            <h4>Loading...</h4>
          </div>
        </Row>
      );
    } else if (shipmentList.length === 0) {
      boxContentsToolContainer = (
        <Row>
          <div className="col-lg-12">
            <Card>
              <CardBlock>
                <h4>No shipments found. </h4>
                <p>
                  List some items and create some open working shipments to see
                  them here!
                </p>
              </CardBlock>
            </Card>
          </div>
        </Row>
      );
    } else {
      boxContentsToolContainer = (
        <Row className="mt-5">
          <ShipmentList
            shipments={shipmentList}
            selectedShipmentsData={selectedShipmentsData}
            selectShipment={this.selectShipment.bind(this, this.props)}
            updateCurrentBox={this.updateCurrentBox}
            addBox={this.addBox}
            printQr={this.printQr}
            changeLimit={this.changeBoxDialogLimit}
            changePage={this.changeBoxDialogPage}
            page={boxDialogPage}
            limit={boxDialogLimit}
          />
          <ShipmentItemsSearchBox
            page={page}
            printItem={this.printItem}
            limit={limit}
            changePage={this.changePage}
            changeLimit={this.changeLimit}
            printerDefaults={printerDefaults}
            updatePrinterDefaults={this.updatePrinterDefaults}
            selectedShipmentsData={selectedShipmentsData}
            shipmentBox={selectedShipmentBox}
            shipmentItemsQuery={query}
            scannerDetectedCallback={() => {
              this.searchProduct(this.props);
            }}
            updateItemQuery={value => {
              updateQuery(value);
            }}
            moveItem={(
              itemId,
              toBoxId,
              toQty,
              selectedShipment,
              selectedShipmentBox
            ) => {
              this.moveProduct(
                this.props,
                itemId,
                toBoxId,
                toQty,
                selectedShipment,
                selectedShipmentBox
              );
            }}
            movingItemId={movingItemId}
            searchLoading={searchingProduct || addingProduct}
            loading={loading}
            loadingShipment={loadingShipment}
            delProductRequest={delProductRequest}
          />
        </Row>
      );
    }

    return (
      <div className="view">
        <div>{alert}</div>
        <ViewContent>
          <ViewHeader />
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
        {searchErrorType &&
          !!searchErrorData &&
          searchErrorData.length > 0 &&
          searchErrorType === "ASIN" && (
            <SelectASINModal
              isOpen={!!searchErrorType}
              searchErrorData={searchErrorData}
              submitSelectedAsin={this.selectSearchASIN}
              close={clearAddProductError}
            />
          )}
          {searchErrorType &&
          !!searchErrorData &&
          searchErrorData.length > 0 &&
          searchErrorType === "SKU" && (
            <SelectSKUModal
              isOpen={!!searchErrorType}
              searchErrorData={searchErrorData}
              submitSelectedSku={this.selectSearchSKU}
              selectedSearchItem={selectedSearchItem}
              selectedShipmentsData={selectedShipmentsData}
              close={clearAddProductError}
            />
          )}
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.BoxContents.toJS(),
    printerDefaults: state.Settings.get("printerDefaults"),
  }),
  {
    changeBoxDialogPaginationLimit,
    chooseSearchItem,
    savePrinterDefaults,
    loadingShipment,
    updateSelectedShipmentReadyFlag,
    updateSelectedShipmentBox,
    removeSelectedShipment,
    fetchShipmentList,
    selectShipmentRequest,
    selectShipmentBox,
    addShipmentBox,
    moveItem,
    showAlert,
    closeAlert,
    updateQuery,
    searchProductRequest,
    fetchPrinterDefaults,
    changePaginationLimit,
    printShipmentItem,
    clearAddProductError,
    delProductRequest
  }
)(BoxContents);
