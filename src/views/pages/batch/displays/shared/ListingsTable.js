import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Badge, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import IoPrinter from "react-icons/lib/io/printer";
import IoIosBox from "react-icons/lib/io/ios-box";
import PropTypes from "prop-types";
import PriceTrackersButtonGroup from "./PriceTrackersButtonGroup";
import NotePopover from "./NotePopover";
import {
  digitСonversion,
  getPage,
  getPaginatorOptions,
  momentDateToLocalFormatConversion,
  secureProtocolImgURL
} from "../../../../../helpers/utility";
import batchActions from "../../../../../redux/batch/actions";
import { setFocusToAmazonSearchBar } from "../../../../../helpers/batch/utility";
import printerActions from "../../../../redux/print_service/actions";

const {
  goToPreviousPage, goToNextPage, setCurrentPage
} = batchActions;

const { print } = printerActions;

/*
This component is used to display previous listings that the user has created, within
a particular batch.

props field expects:
1) data field corresponding to array of listings
*/

const pageSize = 5;

class ListingsTable extends Component {
  ref = {};
  openEditModal = listing => {
    let isHoldingAreaListing = false;
    this.props.setCurrentEditableListing(listing, isHoldingAreaListing);
    this.props.updateModalDisplay("edit_listing_item");
  };
  openDeleteModal = listing => {
    let isHoldingAreaListing = false;
    this.props.setCurrentEditableListing(listing, isHoldingAreaListing);
    this.props.updateModalDisplay("delete_listing_item");
  };

  openEditBoxContentModal = listing => {
    let isHoldingAreaListing = false;
    this.props.setCurrentEditableListing(listing, isHoldingAreaListing);
    this.props.updateModalDisplay("edit_box_content_listing_item");
  };

  printListItem(listing) {
    const { print } = this.props;
    print(listing, listing.qty);
    setFocusToAmazonSearchBar();
  }
  render() {
    let { data, workflowType, internationalization_config, goToPreviousPage, goToNextPage, setCurrentPage, listingCurrentPage } = this.props;

    let totalPages = Math.ceil(data.length / pageSize);

    let fulfillmentCenterFormatter;
    if (workflowType === "private") {
      fulfillmentCenterFormatter = listing => (
        <td className="align-middle listing-table-cell">
          <div className="text-center">
            <Button
              className="light-bottom-margin light-top-margin light-right-margin listing-table-listing-actions"
              color="success"
              size="sm"
              onClick={() => {
                this.printListItem(listing);
              }}
            >
              <IoPrinter className="listing-table-listing-action-icon" />
            </Button>
          </div>
        </td>
      );
    } else if (workflowType === "live") {
      fulfillmentCenterFormatter = listing => (
        <td className="align-middle listing-table-cell">
          {listing.fulfillmentCenters.map((fulfillmentCenter, j) => (
            <div key={j}>
              {Object.keys(
                listing.boxContents[fulfillmentCenter.ShipmentId]
              ).map((boxNumber, k) => (
                <div
                  className="medium-bottom-margin text-center"
                  key={j + "-" + k}
                >
                  <Badge className="full-font" color="default">
                    {fulfillmentCenter.DestinationFulfillmentCenterId +
                      " - Box " +
                      boxNumber +
                      ": " +
                      listing.boxContents[fulfillmentCenter.ShipmentId][
                        boxNumber
                      ]}
                  </Badge>
                </div>
              ))}
            </div>
          ))}
          <br />
          <div className="text-center">
            <Button
              className="light-bottom-margin light-top-margin light-right-margin listing-table-listing-actions"
              color="success"
              size="sm"
              onClick={() => {
                this.printListItem(listing);
              }}>
              <IoPrinter className="listing-table-listing-action-icon" />
            </Button>
            <Button
              className="light-bottom-margin light-top-margin listing-table-listing-actions"
              color="success"
              size="sm"
              onClick={() => {
                this.openEditBoxContentModal(listing)
              }}
            >
              <IoIosBox className="listing-table-listing-action-icon" />
            </Button>
            <br />
          </div>
        </td>
      );
    }

    return (
      <div>
        <Table>
          <tbody>
            {data.filter(getPage(listingCurrentPage, pageSize)).map((listing, i) => (
              <tr key={i}>
                <td className="align-middle listing-table-cell">
                  <div className="medium-top-margin text-center">
                    <p>
                      <strong>{listing.name}</strong>
                    </p>
                    <img
                      src={
                        secureProtocolImgURL(listing.imageUrl.replace("_SL75_", "_SL200_"))
                      }
                      alt={listing.name}
                      height="60"
                    />
                    <h5>
                      <Badge color="badge badge-primary">
                        Rank: {digitСonversion(listing.salesrank, "rank")}
                      </Badge>
                    </h5>
                  </div>
                </td>

                <td className="align-top text-center listing-table-cell">
                  <Table>
                    <tbody>
                      <tr>
                        <td className="no-borders">SKU</td>
                        <td className="no-borders">{listing.sku}</td>
                      </tr>
                      <tr>
                        <td>ASIN</td>
                        <td>{listing.asin}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <PriceTrackersButtonGroup
                    ASIN={listing.asin}
                    itemName={listing.name}
                    amazonUrl={internationalization_config.amazon_url}
                    keepaBaseUrl={internationalization_config.keepa_url}
                    camelCamelCamelBaseUrl={internationalization_config.camelcamelcamel_url}
                  />
                  <br />
                  <Button
                    size="sm"
                    className="light-bottom-margin medium-right-margin"
                    onClick={() => this.openEditModal(listing)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    className="light-bottom-margin"
                    onClick={() => this.openDeleteModal(listing)}
                  >
                    Delete
                  </Button>
                </td>
                <td className="align-top listing-table-cell">
                  <Table>
                    <tbody>
                      <tr>
                        <td className="no-borders">Price:</td>
                        <td className="no-borders">
                          {digitСonversion(
                            listing.price,
                            "currency",
                            internationalization_config.currency_code
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Quantity:</td>
                        <td>{listing.qty}</td>
                      </tr>
                      <tr>
                        <td>Condition:</td>
                        <td>{listing.condition}</td>
                      </tr>
                      <tr>
                        <td>Note:</td>
                        <td>
                          <NotePopover id={i} listingNote={listing.note} />
                        </td>
                      </tr>
                      <tr>
                        <td>Exp Date:</td>
                        <td>{momentDateToLocalFormatConversion(listing.expDate) || "N/A"}</td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                <td className="align-top listing-table-cell">
                  <Table>
                    <tbody>
                      <tr>
                        <td className="no-borders">Buy Cost:</td>
                        <td className="no-borders">
                        {listing.buyCost !== null
                            ? (digitСonversion(
                              listing.buyCost,
                              "currency",
                              internationalization_config.currency_code
                            ))
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td>Supplier:</td>
                        <td>{listing.supplier}</td>
                      </tr>
                      <tr>
                        <td>Purchased:</td>
                        <td>{momentDateToLocalFormatConversion(listing.datePurchased) || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>Tax Code:</td>
                        <td>{listing.taxCode}</td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
                {fulfillmentCenterFormatter(listing)}
              </tr>
            ))}
          </tbody>
          {totalPages > 1 && (<tfoot>
            <tr>
              <td colSpan={5}>
                <Pagination className="pull-right">
                  {getPaginatorOptions(listingCurrentPage, totalPages, true).map((option, idx) => {
                    switch (option) {
                      case '...':
                        return (
                          <PaginationItem key={'pgn-' + idx}>
                            <PaginationLink>
                              ...
                            </PaginationLink>
                          </PaginationItem>
                        )
                      case '-':
                        return (
                          <PaginationItem key={'pgn-' + idx} onClick={goToPreviousPage}>
                            <PaginationLink previous />
                          </PaginationItem>
                        )
                      case '+':
                        return (
                          <PaginationItem key={'pgn-' + idx} onClick={goToNextPage}>
                            <PaginationLink next />
                          </PaginationItem>
                        )
                      default:
                        return (
                          <PaginationItem key={'pgn-' + idx} active={option === listingCurrentPage} onClick={setCurrentPage.bind(this, option)}>
                            <PaginationLink>{option}</PaginationLink>
                          </PaginationItem>
                        )
                    }
                  })}
                </Pagination>
              </td>
            </tr>
          </tfoot>)}
        </Table>
      </div>
    );
  }
}

ListingsTable.propTypes = {
  data: PropTypes.array.isRequired,
  updateModalDisplay: PropTypes.func.isRequired,
  setCurrentEditableListing: PropTypes.func.isRequired,
  workflowType: PropTypes.string.isRequired,
  printerDefaults: PropTypes.object
};

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config"),
    listingCurrentPage: state.Batch.get('listingCurrentPage'),
  }),
  {
    goToPreviousPage, goToNextPage, setCurrentPage, print
  }
)(ListingsTable);
