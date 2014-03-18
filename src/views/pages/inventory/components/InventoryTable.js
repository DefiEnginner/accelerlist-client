import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { digitСonversion, momentDateTimeToLocalFormatConversion } from "../../../../helpers/utility";
import { Button } from "reactstrap";
import PrintIcon from "react-icons/lib/md/print";
import "../../style.css";

class InventoryTable extends Component {
  getNextPage = (state) => {
    this.props.fetchInventoryData(parseInt(state.page, 10) + 1, state.pageSize, state.sorted);
  }

  render() {
    const {
      inventoryItems,
      showLabelsColumn,
    } = this.props;
  
    let tableColumns = [
      {
        id: "item_name",
        accessor: "item_name",
        Header: "Product",
        Cell: props => (
          <div>
            <div>{props.original.item_name}</div>
            <div>{`ASIN: ${props.original.asin1}`}</div>
          </div>
        ),
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "seller_sku",
        Header: "SKU",
        accessor: "seller_sku",
        minWidth: 200,
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "quantity",
        Header: "Qty",
        accessor: "quantity",
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "price",
        Header: "Price",
        accessor: "price",
        className: "text-center",
        style: { alignSelf: "center" },
        Cell: props => (
          <div>{digitСonversion(props.value, "currency",
          this.props.internationalization_config.currency_code)}</div>
        )
      },
      {
        id: "buy_cost",
        Header: "Buy Cost",
        accessor: "buy_cost",
        className: "text-center",
        style: { alignSelf: "center" },
        Cell: props => (
          <div>{digitСonversion(props.value, "currency",
          this.props.internationalization_config.currency_code)}</div>
        )
      },
      {
        id: "supplier",
        Header: "Supplier",
        accessor: "supplier",
        className: "text-center"
      },
      {
        id: "purchased_date",
        accessor: "purchased_date",
        Header: "Purchased On",
        minWidth: 150,
        className: "text-center",
        Cell: props => (
          <div>
            {
              props.value
              ? momentDateTimeToLocalFormatConversion(props.value, true)
              : ""
            }
          </div>
        ),
      }
    ];

    if (showLabelsColumn) {
      tableColumns.push(
        {
          id: "labels",
          Header: "Labels",
          className: "text-center",
          Cell: props => (
            <Button color="primary" onClick={() => this.props.print(props.original)}>
              <PrintIcon /> Print
            </Button>
          )
        },
      );
    }

    return (
      <React.Fragment>
        {inventoryItems ? (
          <ReactTable
            data={inventoryItems.results} // should default to []
            pages={inventoryItems.pages}
            columns={tableColumns}
            defaultPageSize={10}
            loading={this.props.loading}
            manual // informs React Table that you'll be handling sorting and pagination server-side
            onFetchData={(state, instance) => { this.getNextPage(state) }}
          />

        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}
InventoryTable.propTypes = {
  inventoryItems: PropTypes.object,
  changeInventoryTableFieldData: PropTypes.func.isRequired,
  showLabelsColumn: PropTypes.bool,
  print: PropTypes.func,
  fetchInventoryData: PropTypes.func,
  loading: PropTypes.bool.isRequired
};

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config")
  }),
  {}
)(InventoryTable);
