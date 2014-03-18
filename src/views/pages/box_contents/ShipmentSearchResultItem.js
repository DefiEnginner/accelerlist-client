import React, { Component } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import { secureProtocolImgURL } from "../../../helpers/utility";
import DeleteIco from "../../../shared/components/SVGIcons/DeleteIco";
import PopoverCustomElementAndContent from "../../../shared/components/PopoverCustomElementAndContent";
import DeleteItemsPopover from "./components/DeleteItemsPopover";

class ShipmentSearchResultItem extends Component {
  state = {
    moveItemsFlag: false
  };

  handleSelect = (event, BoxContentItemId) => {
    let qty = parseInt($(".select-qty").val(), 10);
    let toBoxId = parseInt(event.target.value, 10);
    if (qty && toBoxId) {
      this.props.moveItem(
        BoxContentItemId,
        toBoxId,
        qty,
        this.props.selectedShipment,
        this.props.currentBox
      );
      this.setState({ moveItemsFlag: false });
    }
  };
  render() {
    const {
      boxes,
      shipmentBoxItem,
      shipmentId,
      boxNumber,
      DestinationFulfillmentCenterId,
      printItem,
      delProductRequest,
      shipment,
    } = this.props;
    let quantityOptions = [];
    for (var i = 1; i <= shipmentBoxItem.QuantityShippedInBox; i++) {
      quantityOptions.push(
        <option key={`qty_option_${i}`} value={i}>
          {i}
        </option>
      );
    }
    let quantityShipped = this.props.inboundShipmentItems.reduce(
      (acc, item) => {
        let val = 0;
        if (item.SellerSKU === shipmentBoxItem.SellerSKU) {
          val = Number(item.QuantityShipped) || 0;
        }
        return acc + val;
      },
      0
    );
	  //console.log("this is shipment box item", shipmentBoxItem);
    let productSearchResult = shipmentBoxItem.ProductSearchResult;
    let imageUrl = "";
    let prepInstructions = "Not Found";
    if (!!productSearchResult) {
		imageUrl = productSearchResult.imageUrl;
      prepInstructions = productSearchResult.prepInstructions;
	}

    return (
      <div className="result-item">
        <div className="media">

          <img
            src={secureProtocolImgURL(imageUrl.replace("_SL75_", "_SL200_"))}
            className="img-fluid"
            alt=""
		  />

        </div>
        <div className="info">
          <div className="info-row">
            <span>
              ASIN: <strong>{shipmentBoxItem.ASIN}</strong>
            </span>
            <span>
              FNSKU: <strong>{shipmentBoxItem.FulfillmentNetworkSKU}</strong>
            </span>
            <span>
              Box Qty:{" "}
              <strong>
                {shipmentBoxItem.QuantityShippedInBox}/{quantityShipped}
              </strong>
            </span>
          </div>
          <div className="info-row">
            <span>
              <strong>
                {prepInstructions}
              </strong>
            </span>
            <span>
              Shipment: <strong>{shipmentId}</strong>
            </span>
            <span>
              <span className="dropdown dropdown-move show">
                <button
                  onClick={() => {
                    this.setState({ moveItemsFlag: !this.state.moveItemsFlag });
                  }}
                  type="button"
                  className="btn btn-link btn-success btn-move"
                >
                  <svg
                    className="icon"
                    width="12"
                    height="12"
                    viewBox="0 3 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.16671722 8.89584882v-3.4375016c0-.12413225-.04535604-.2315542-.13606769-.32226586-.09071165-.09071165-.1981336-.13606769-.32226586-.13606769h-3.4375016c-.20052103 0-.34136316.09309909-.42252637.27929725-.08116322.1957466-.04774304.36284832.10026052.50130472l1.03124919 1.0312492-3.82422165 3.82422166c-.09071166.0907116-.1360677.1981336-.1360677.3222659 0 .1241322.04535604.2315542.1360677.3222658l.73046978.7304698c.09071165.0907116.19813361.1360677.32226586.1360677.12413225 0 .2315542-.0453561.32226585-.1360677l3.82422166-3.82422166 1.0312492 1.0312492c.08593765.09071165.1933596.13606769.32226585.13606769.05729191 0 .11697082-.01193578.17903673-.03580735.18619817-.08116321.27929725-.22200534.27929725-.42252637l.00000128-6.9e-7zm1.83333338-3.66667094v6.87499462c0 .5681451-.2017146 1.05393-.6051436 1.4573591-.40342912.4034291-.88921405.6051436-1.45735912.6051436H2.06255323c-.56814507 0-1.05393-.2017145-1.45735907-.6051436-.40342907-.4034291-.6051436-.889214-.6051436-1.4573591V5.22917788c0-.56814507.20171453-1.05393.6051436-1.45735907.40342907-.40342907.889214-.6051436 1.45735907-.6051436h6.87499465c.56814507 0 1.05393.20171453 1.45735912.6051436.403429.40342907.6051436.889214.6051436 1.45735907z"
                      fill="#00C853"
                      fillRule="evenodd"
                    />
                  </svg>
                  Move Boxes
                </button>
                {this.state.moveItemsFlag && (
                  <div className="dropdown-menu dropdown-menu-right">
                    <select className="form-control form-control-sm select-qty">
                      {quantityOptions}
                    </select>
                    <select
                      onChange={e =>
                        this.handleSelect(e, shipmentBoxItem.BoxContentItemId)
                      }
                      className="form-control form-control-sm select-box"
                    >
                      <option value="">To Box...</option>
                      {boxes.map((box, i) => {
                        console.log(
                          box,
                          "this is the box id",
                          box.id,
                          box.box_number
                        );
                        return (
                          <option key={`box_option_${i}`} value={box.id}>
                            {box.box_number}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </span>
            </span>

              <PopoverCustomElementAndContent
                userStyle={{ display: "inline-flex", alignItems: "center" }}
                tooltipId={`DeleteIcon${shipmentBoxItem.BoxContentItemId}`}
                TooltipContent={(props) => (
                  <DeleteItemsPopover
                    shipment={shipment}
                    shipmentBoxItem={shipmentBoxItem}
                    delProductRequest={delProductRequest}
                    togglePopover={props.togglePopover}
                  />
                )}
                customElement={
                  <span>
                    <div
                      className="btn btn-link btn-success btn-move"
                      style={{
                        display: "inline-flex",
                        alignItems: "center"
                      }}
                    >
                      <DeleteIco />
                      <div style={{ marginLeft: "5px", color: "#F22F2F" }}>Delete item from box</div>
                    </div>
                  </span>
                }
              />

          </div>
        </div>
        <div className="right">
          <span
            className={`badge warehouse-badge ${DestinationFulfillmentCenterId}`}
          >
            {DestinationFulfillmentCenterId}, Box {boxNumber}
          </span>
          <br />
          <button onClick={() => printItem(shipmentBoxItem)} type="button" className="btn btn-link">
            <svg
              width="15"
              height="14"
              viewBox="451 2 15 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M463.75 5.75h-10.5C452.005 5.75 451 6.755 451 8v4.5h3v3h9v-3h3V8c0-1.245-1.005-2.25-2.25-2.25zM461.5 14h-6v-3.75h6V14zm2.25-5.25c-.4125 0-.75-.3375-.75-.75s.3375-.75.75-.75.75.3375.75.75-.3375.75-.75.75zM463 2h-9v3h9V2z"
                fill="#BAC5B4"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}

ShipmentSearchResultItem.propTypes = {
  shipmentBoxItem: PropTypes.object,
  boxId: PropTypes.number,
  boxNumber: PropTypes.number,
  moveItem: PropTypes.func,
  shipmentId: PropTypes.string,
  DestinationFulfillmentCenterId: PropTypes.string,
  boxes: PropTypes.array,
  selectedShipment: PropTypes.object,
  currentBox: PropTypes.object,
  printItem: PropTypes.func,
  delProductRequest: PropTypes.func,
  shipment: PropTypes.object,
};

export default ShipmentSearchResultItem;
