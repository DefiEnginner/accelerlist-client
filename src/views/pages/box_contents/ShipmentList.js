import React from 'react';
import ShipmentCard from './ShipmentCard';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

const ShipmentList = ({ page, limit, changeLimit, changePage, printQr, shipments, selectedShipmentsData, selectShipment, addBox, updateCurrentBox }) => {
  if (!shipments) {
    return (
      <div />
    );
  }
  let shipmentsAreSelected = [];
  let shipmentsAreNotSelected = [];
  let sortedShipments = [];

  shipments.forEach(shipment => {
    var selectedShipment;
    if (selectedShipmentsData) {
      selectedShipment = selectedShipmentsData.find(shipmentObj => {
        return shipmentObj.selectedShipment.ShipmentId === shipment.ShipmentId;
      })
    }
    if (!!selectedShipment) {
      shipmentsAreSelected.push(shipment)
    } else {
      shipmentsAreNotSelected.push(shipment)
    }
  });

  sortedShipments = shipmentsAreSelected.concat(shipmentsAreNotSelected);

  var shipmentNodes = sortedShipments.map(function(shipment, i) {
    var selectedShipment;
    if (selectedShipmentsData) {
      selectedShipment = selectedShipmentsData.find((shipmentObj, i) => {
        return shipmentObj.selectedShipment.ShipmentId === shipment.ShipmentId;
      })
    }
    return (
      <ShipmentCard
        key={shipment.ShipmentId}
        shipment={shipment}
        isSelected={!!selectedShipment ? true : false}
        selectShipment={selectShipment}
        selectedShipment={selectedShipment}
        addBox={addBox}
        updateCurrentBox={updateCurrentBox}
        printQr={printQr}
        changeLimit={changeLimit}
        changePage={changePage}
        page={page}
        limit={limit}
      />
    )
  })
  return (
    <Col md="5">
      <div className="mb-3">
        <strong>Manage your shipments below</strong>
      </div>   
      <div className="shipments">
        {shipmentNodes}
      </div>
    </Col>
  );
}

ShipmentList.propTypes = {
  shipments: PropTypes.array,
  selectedShipmentsData: PropTypes.array,
  selectShipment: PropTypes.func,
  addBox: PropTypes.func,
  updateCurrentBox: PropTypes.func,
  printQr: PropTypes.func,
  changeLimit: PropTypes.func,
  changePage: PropTypes.func,
  page: PropTypes.number,
  limit: PropTypes.number
};

export default ShipmentList;