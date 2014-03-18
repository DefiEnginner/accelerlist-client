import React from "react";
import { Col, Row } from "reactstrap";
import ShipmentBox from './ShipmentBox';
import PropTypes from "prop-types";
import ButtonExportShipmentToTsv from "./components/ButtonExportShipmentToTsv";
import IconCheckCircle from 'react-icons/lib/md/check-circle';
import ButtonPrintItems from "./components/ButtonPrintItems";

const ShipmentCard = ({
  updateCurrentBox,
  shipment,
  isSelected,
  selectShipment,
  selectedShipment,
  addBox,
  printQr,
  changeLimit,
  changePage,
  page,
  limit
}) => {
  if (isSelected) {
    let boxes = [];
    let totalWeight = 0;
    let totalQtyPrepped = 0;
    selectedShipment.boxes.forEach(box => {
      let weight = 0;
      box.items.forEach(item => {
        totalQtyPrepped += Number(item.QuantityShippedInBox);
        if (
          !!item.ProductSearchResult &&
          !!item.ProductSearchResult.itemDimensions &&
          !!item.ProductSearchResult.itemDimensions.Weight
        ) {
          weight += Number(item.ProductSearchResult.itemDimensions.Weight) || 0;
        }
      });
      boxes.push({
        box: box,
        boxNumber: box.box_number,
        id: box.id,
        weight: weight
      });
      totalWeight += weight;
    });
    let totalQtyInShipment = 0;
    selectedShipment.inboundShipmentItems.forEach(item => {
      totalQtyInShipment += Number(item.QuantityShipped);
    });

    let boxNodes;
    let actionButtons;
    if (boxes.length > 0) {
      boxNodes = boxes.map((box, i) => {
        return (
          <ShipmentBox
            key={shipment.ShipmentId + "-box-" + i}
            updateCurrentBox={updateCurrentBox}
            boxData={box}
            ShipmentId={shipment.ShipmentId}
            isSelected={selectedShipment.currentBox.id === box.id}
            printQr={printQr}
            shipment={shipment}
            changeLimit={changeLimit}
            changePage={changePage}
            page={page}
            limit={limit}
          ></ShipmentBox>
        );
      });

      actionButtons = (
        <Col md="4" className="text-right">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ButtonPrintItems
              shipment={selectedShipment}
            />
            <ButtonExportShipmentToTsv
              shipment={selectedShipment}
            />
          </div>
        </Col>
      );
    }
    return (
      <div className="d-flex align-items-center mb-4">
        <div className="check mr-4">
          <label className="container-check">
            <input
              type="checkbox"
              onClick={e => {
                selectShipment(shipment, e.target.checked);
              }}
              checked={isSelected}
            />
            <span className="checkmark" />
          </label>
        </div>
        <div className={`shipment-item ${isSelected ? "active" : ""}`}>
          <div className="shipment-header">
            <Row className="align-items-center">
              <Col md="8">
                <h4 className="shipment-title">{shipment.ShipmentName}</h4>
              </Col>
              {actionButtons}
            </Row>
            <Row className="align-items-center">
              <Col md="9">
                <span>Shipment ID: {shipment.ShipmentId}</span>
              </Col>
              <Col md="3" className="text-right">
                <span
                  className={`badge warehouse-badge ${
                    shipment.DestinationFulfillmentCenterId
                  }`}
                >
                  {shipment.DestinationFulfillmentCenterId}
                </span>
              </Col>
            </Row>
          </div>
          <div className="shipment-body">
            <div className="shipment-info">
              <span>
                <svg
                  width="13"
                  height="15"
                  viewBox="0 2 13 15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5555556 3.44444444H8.53666667C8.23333333 2.60666667 7.43888889 2 6.5 2c-.93888889 0-1.73333333.60666667-2.03666667 1.44444444H1.44444444C.65 3.44444444 0 4.09444444 0 4.88888889V15c0 .7944444.65 1.4444444 1.44444444 1.4444444H11.5555556C12.35 16.4444444 13 15.7944444 13 15V4.88888889c0-.79444445-.65-1.44444445-1.4444444-1.44444445zm-5.0555556 0c.39722222 0 .72222222.325.72222222.72222223 0 .39722222-.325.72222222-.72222222.72222222s-.72222222-.325-.72222222-.72222222c0-.39722223.325-.72222223.72222222-.72222223zM7.94444444 13.5555556H2.88888889v-1.4444445h5.05555555v1.4444445zm2.16666666-2.8888889H2.88888889V9.22222222h7.22222221v1.44444448zm0-2.88888892H2.88888889V6.33333333h7.22222221v1.44444445z"
                    fill="#BEC6BA"
                    fillRule="evenodd"
                  />
                </svg>
                {`${totalQtyPrepped} / ${totalQtyInShipment} total Items`}
              </span>
              <span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 2 15 15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.125 3.875h-.7617188c.4804688.82910156.7617188 1.78710938.7617188 2.8125 0 3.10253906-2.5224609 5.625-5.625 5.625-3.10253906 0-5.625-2.52246094-5.625-5.625 0-1.02539062.28125-1.98339844.76171875-2.8125H1.875C.84082031 3.875 0 4.71582031 0 5.75v9.375C0 16.1591797.84082031 17 1.875 17h11.25C14.1591797 17 15 16.1591797 15 15.125V5.75c0-1.03417969-.8408203-1.875-1.875-1.875zm-5.625 7.5c2.5898438 0 4.6875-2.09765625 4.6875-4.6875S10.0898438 2 7.5 2C4.91015625 2 2.8125 4.09765625 2.8125 6.6875S4.91015625 11.375 7.5 11.375zm-.00878906-4.45019531l.984375-2.296875c.10253906-.24023438.37792969-.34863281.61523437-.24609375.23730469.10253906.34863282.37792968.24609375.61523437l-.98730468 2.30273438c.19628906.20800781.31933593.48632812.31933593.79394531 0 .64746094-.52441406 1.171875-1.171875 1.171875-.64746093 0-1.171875-.52441406-1.171875-1.171875.00292969-.64453125.52441407-1.16601562 1.16601563-1.16894531z"
                    fill="#BEC6BA"
                    fillRule="evenodd"
                  />
                </svg>
                {totalWeight.toFixed(2)}
                lbs
              </span>
            </div>
            <div className="shipment-boxes">
              {boxNodes}
              <div
                className="shipment-box box-add"
                onClick={() => addBox(shipment.ShipmentId)}
              >
                <svg
                  width="32"
                  height="31"
                  viewBox="-1 0 32 31"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.8535156 10.8164063L26.8886719 1.921875C26.5078125.7734375 25.4355469 0 24.2226562 0H15.9375v11.25h13.9863281c-.0234375-.1464844-.0234375-.2929687-.0703125-.4335937zM14.0625 0H5.77734375C4.56445312 0 3.4921875.7734375 3.11132812 1.921875L.14648437 10.8164063c-.046875.140625-.046875.2871093-.0703125.4335937H14.0625V0zM0 13.125v14.0625C0 28.7402344 1.25976562 30 2.8125 30h24.375C28.7402344 30 30 28.7402344 30 27.1875V13.125H0z"
                    fill="#858C82"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="box-number">+</span>
                <span className="box-weight">Add box</span>
              </div>
            </div>
            {totalQtyPrepped === totalQtyInShipment && 
              <div className="icon-shipment-done">
                <IconCheckCircle size="26"/>
              </div>
            }
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="d-flex align-items-center mb-4">
        <div className="check mr-4">
          <label className="container-check">
            <input
              type="checkbox"
              onClick={e => {
                selectShipment(shipment, e.target.checked);
              }}
              checked={isSelected}
            />
            <span className="checkmark" />
          </label>
        </div>
        <div onClick={() => { selectShipment(shipment, !isSelected); }} className={`shipment-item ${isSelected ? "active" : ""}`}>
          <div className="shipment-header">
            <Row className="align-items-center">
              <Col md="9">
                <h4 className="shipment-title">{shipment.ShipmentName}</h4>
              </Col>
              <Col md="3" className="text-right">
                <button
                  type="button"
                  className="btn btn-link btn-success btn-manage"
                >
                  Manage
                </button>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md="9">
                <span>Shipment ID: {shipment.ShipmentId}</span>
              </Col>
              <Col md="3" className="text-right">
                <span
                  className={`badge warehouse-badge ${
                    shipment.DestinationFulfillmentCenterId
                  }`}
                >
                  {shipment.DestinationFulfillmentCenterId}
                </span>
              </Col>
            </Row>
          </div>
          <div className="shipment-body">
            <div className="shipment-boxes">
              <div className="shipment-box box-add">
                <svg
                  width="32"
                  height="31"
                  viewBox="-1 0 32 31"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.8535156 10.8164063L26.8886719 1.921875C26.5078125.7734375 25.4355469 0 24.2226562 0H15.9375v11.25h13.9863281c-.0234375-.1464844-.0234375-.2929687-.0703125-.4335937zM14.0625 0H5.77734375C4.56445312 0 3.4921875.7734375 3.11132812 1.921875L.14648437 10.8164063c-.046875.140625-.046875.2871093-.0703125.4335937H14.0625V0zM0 13.125v14.0625C0 28.7402344 1.25976562 30 2.8125 30h24.375C28.7402344 30 30 28.7402344 30 27.1875V13.125H0z"
                    fill="#858C82"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="box-number">+</span>
                <span className="box-weight">Work on Shipment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

ShipmentCard.propTypes = {
  shipment: PropTypes.object,
  isSelected: PropTypes.bool,
  selectShipment: PropTypes.func,
  selectedShipment: PropTypes.object,
  addBox: PropTypes.func,
  updateCurrentBox: PropTypes.func,
  printQr: PropTypes.func,
  changeLimit: PropTypes.func,
  changePage: PropTypes.func,
  page: PropTypes.number,
  limit: PropTypes.number
};

export default ShipmentCard;
