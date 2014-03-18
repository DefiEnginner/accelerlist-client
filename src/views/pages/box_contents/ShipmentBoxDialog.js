import React, {Fragment} from "react";
import PropTypes from "prop-types";
import {Popover, PopoverHeader, PopoverBody, Row, Col} from "reactstrap";
import { secureProtocolImgURL } from "../../../helpers/utility";
import PaginatorFooter from "../../../shared/components/PaginatorFooter";
import { take, drop } from 'lodash';

const ShipmentBoxDialog = ({
  boxData,
  isOpen,
  target,
  printQr,
  shipment,
  toggle,
  isSelected,
  changeLimit,
  changePage,
  page,
  limit
}) => {
  let paginatedSelectedShipmentsBoxItems = take(drop(boxData.items, limit * (page - 1)), limit);
	//console.log("this is paginatedSelectedShipmentsBoxItems", paginatedSelectedShipmentsBoxItems);
  return (

    <Popover className="popover-shipment" placement="top" isOpen={isOpen} target={target} toggle={toggle}>
          <PopoverHeader>
            <Row>
              <Col md="3">Box {boxData.box_number}</Col>
              <Col md="9" className="text-right">
                <button
                  className="btn btn-success"
                  style={{ padding: "0.5rem"}}
                  onClick={() => printQr(boxData, shipment)}
                >
                  Print 2D Barcode
                </button>
                <button
                  className="btn btn-success ml-2"
                  style={{ padding: "0.5rem"}}
                >
                  Print Manifest
                </button>
              </Col>
              {
                isSelected &&
                <span className="ml-2" style={{ fontSize:"50%", fontWeight:"normal"}}>(Current Box)</span>
              }
            </Row>
          </PopoverHeader>
          <PopoverBody>
            {
              boxData.items.length === 0 &&
              <p>No products found</p>
            }
            {
              boxData.items.length > 0 &&
              <Fragment>
                <strong>Products:</strong>
                  <table className="table">
                    <thead className="d-none">
                      <tr>
                        <th>Image</th><th>FNSKU</th><th>Title</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        paginatedSelectedShipmentsBoxItems.map((item, i) => {
							//console.log("this is item", item);
                          let imageUrl = "";
                          let name = "";
                          if (!!item.ProductSearchResult) {
                            imageUrl = secureProtocolImgURL(item.ProductSearchResult.imageUrl.replace("_SL75_", "_SL200_"));
                            name = item.ProductSearchResult.name;
                          }
                          return  (
                            <tr>
                              <td>
                                <div style={{maxWidth: "60px"}} className="media">
                                  <img
                                    src={imageUrl}
                                    className="img-fluid"
                                    alt=""
                                  />
                                </div>
                              </td>
                              <td style={{ width: "90px" }}>
                                <div>
                                  {item.FulfillmentNetworkSKU}
                                </div>
                                <div className="box-items-qnty">
                                  {`Qnty: ${item.QuantityShippedInBox}`}
                                </div>
                              </td>
                              <td>{name}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  {
                    boxData.items.length > 0 &&
                    <PaginatorFooter
                      changeLimit={changeLimit}
                      limit={limit}
                      totalCount={boxData.items.length}
                      page={page}
                      changePage={changePage}
                    />
                  }
              </Fragment>
            }
          </PopoverBody>
    </Popover>
  );
};

ShipmentBoxDialog.propTypes = {
  boxData: PropTypes.object,
  isOpen: PropTypes.bool,
  target: PropTypes.string,
  printQr: PropTypes.func,
  shipment: PropTypes.object,
  isSelected: PropTypes.bool,
  changeLimit: PropTypes.func,
  changePage: PropTypes.func,
  page: PropTypes.number,
  limit: PropTypes.number
};

export default ShipmentBoxDialog;
