import React from 'react';
import ShipmentSearchResultItem from './ShipmentSearchResultItem';
import AmazonSearchBar from '../batch/displays/shared/AmazonSearchBar';
import { Col, Row, Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import LoadingIndicator from "../../../shared/components/LoadingIndicator";
import PaginatorFooter from "../../../shared/components/PaginatorFooter";
import { take, drop } from 'lodash';

const ShipmentItemsSearchBox = (
  {
    printItem,
    changePage,
    changeLimit,
    page,
    limit,
    loadingShipment,
    updatePrinterDefaults,
    printerDefaults,
    selectedShipmentsData,
    moveItem,
    loading,
    searchLoading,
    scannerDetectedCallback,
    updateItemQuery,
    shipmentItemsQuery,
    delProductRequest,
  }) => {

    let shipmentBoxItemNodes;

    if(loadingShipment) {
      shipmentBoxItemNodes = (
        <div className="hpanel">
          <div className="panel-body text-center">
            <LoadingIndicator />
          </div>
        </div>
      );
    }
    else if (!!selectedShipmentsData && selectedShipmentsData.length > 0) {
      let boxItems = [];
      let boxIdToShipmentIdMapping = {};
      let shipmentIdToShipmentMapping = {};
      let boxIdToBoxMapping = {};
      selectedShipmentsData.forEach(shipment => {
        shipmentIdToShipmentMapping[shipment.selectedShipment.ShipmentId] = shipment;
        if(!!shipment.boxes && shipment.boxes.length > 0) {
          shipment.boxes.forEach(box => {
            if(!!box && !!box.items && box.items.length > 0) {
              boxItems = boxItems.concat(box.items);
              boxIdToBoxMapping[box.id] = box;
              boxIdToShipmentIdMapping[box.id] = shipment.selectedShipment.ShipmentId;
            }
          })
        }
      });
      boxItems.sort((item1, item2) => {
        if (item2.UpdatedAt > item1.UpdatedAt) {
          return 1;
        } else if (item2.UpdatedAt < item1.UpdatedAt) {
          return -1;
        }
        return 0;
      });
      let paginatedSelectedShipmentsBoxItems = take(drop(boxItems, limit * (page - 1)), limit);
      shipmentBoxItemNodes = paginatedSelectedShipmentsBoxItems.map((shipmentBoxItem, idx) => {
        let boxId = shipmentBoxItem.BoxId;
        let shipmentId = boxIdToShipmentIdMapping[boxId];
        let shipment = shipmentIdToShipmentMapping[shipmentId];
        let box = boxIdToBoxMapping[boxId];
        return (
          <ShipmentSearchResultItem key={'sbic-' + idx}
            printItem={printItem}
            shipmentBoxItem={shipmentBoxItem}
            boxes={shipment.boxes}
            currentBox={shipment.currentBox}
            inboundShipmentItems={shipment.inboundShipmentItems}
            selectedShipment={shipment.selectedShipment}
            shipmentId={box.shipment_id}
            boxId={box.id}
            boxNumber={box.box_number}
            moveItem={moveItem}
            loading={loading}
            DestinationFulfillmentCenterId={shipment.selectedShipment.DestinationFulfillmentCenterId}
            delProductRequest={delProductRequest}
            shipment={shipment}
          />
        )
      })
      if(shipmentBoxItemNodes.length > 0)
      {
        shipmentBoxItemNodes.push((
          <Row>
            <Col md="12">
              <PaginatorFooter
                changeLimit={changeLimit}
                limit={limit}
                totalCount={boxItems.length}
                page={page}
                changePage={changePage}
              />
            </Col>
          </Row>
        ));
      }
    }

    if (!shipmentBoxItemNodes || shipmentBoxItemNodes.length === 0) {
      shipmentBoxItemNodes =  (
        <Row>
          <div className="col-lg-12">
            <Card>
              <CardBody>
                <h4>No Items found. </h4>
                <p>Select a shipment to list Items here!</p>
              </CardBody>
            </Card>
          </div>
        </Row>
      )
    }

    return (
      <Col md="7">
        <div className="d-flex justify-content-between mb-3">
          <strong>Scan items here to find shipment</strong>
          <div className="check m-0">
            <label className="container-check">
              <input type="checkbox" checked={printerDefaults.print_while_scanning_box_contents} onChange={ e => { updatePrinterDefaults(!printerDefaults.print_while_scanning_box_contents)}} />
              <span className="checkmark"></span>
              <span className="text ml-2">Print Label on Scan</span>
            </label>
          </div>
        </div>
        <div className="batch-toolbox">
          <AmazonSearchBar handleSearchSubmit={scannerDetectedCallback}
            handleSearchChange={(val) => {
              updateItemQuery(val)
            }}
			query={shipmentItemsQuery}
            isLoading={searchLoading}
			scannerDetectedCallback={scannerDetectedCallback}
			handleChange={updateItemQuery}
		/>
        </div>
        <div className="shipment-search-result">
          {shipmentBoxItemNodes}
        </div>
      </Col>
    );
}

ShipmentItemsSearchBox.propTypes = {
  shipmentBox: PropTypes.object,
  selectedShipmentsData: PropTypes.array,
  loading: PropTypes.bool,
  searchLoading: PropTypes.bool,
  moveItem: PropTypes.func,
  scannerDetectedCallback: PropTypes.func,
  updateItemQuery: PropTypes.func,
  shipmentItemsQuery: PropTypes.string,
  printerDefaults: PropTypes.object,
  updatePrinterDefaults: PropTypes.func,
  loadingShipment: PropTypes.bool,
  page: PropTypes.number,
  limit: PropTypes.number,
  changePage: PropTypes.func,
  changeLimit: PropTypes.func,
  printItem: PropTypes.func,
  delProductRequest: PropTypes.func,
};

export default ShipmentItemsSearchBox;
