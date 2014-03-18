import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  EditableCurrencyField,
  EditableDateField,
  EditableQtyField,
  EditableStringField
} from "../../../../../shared/components/editableReactTableCells";
import { getConditionOptions } from "../../../../../helpers/batch/utility";
import { Button } from "reactstrap";
import moment from "moment";

const condEum = getConditionOptions();

class ReplenishmentWarningModalTable extends Component {

  render() {
    
    const {
      replenishableListings,
      onChangeItemValue,
      addItemToBatch
    } = this.props;

    let tableColumns = [
      {
        id: "seller_sku",
        Header: "Merchant SKU",
        accessor: "seller_sku",
        minWidth: 200,
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "item_condition",
        Header: "Item Condition",
        accessor: "item_condition",
        Cell: props => (
          <div>{(condEum[props.value] || {}).value}</div>
        ),
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "item_note",
        Header: "Item Note",
        accessor: "item_note",
        className: "text-center",
        style: { alignSelf: "center" },
        Cell: props => (
          <EditableStringField
            cellInfo={props}
            onChangeValue={(e) => onChangeItemValue(e)}
          />
        ),
      },
      {
        id: "channel",
        Header: "Channel",
        accessor: "fulfillment_channel",
        className: "text-center"
      },
      {
        id: "quantity",
        Header: "Active Qty.",
        accessor: "quantity",
        className: "text-center",
        Cell: props => (
          <EditableQtyField
            cellInfo={props}
            onChangeValue={(e) => onChangeItemValue(e)}
          />
        ),
      },
      {
        id: "price",
        Header: "Price",
        minWidth: 150,
        accessor: "price",
        className: "text-center",
        Cell: props => (
          <EditableCurrencyField
            cellInfo={props}
            onChangeValue={(e) => onChangeItemValue(e)}
          />
        ),
      },
      {
        id: "expDate",
        Header: "Expiration date",
        minWidth: 150,
        accessor:  d => moment(d.expDate),
        className: "text-center",
        Cell: props => (
          <EditableDateField
            cellInfo={props}
            onChangeValue={(e) => onChangeItemValue(e)}
          />
        ),
      },
      {
        Header: "",
        minWidth: 150,
        accessor:  "seller_sku",
        className: "text-center",
        Cell: props => (
          <Button
            color="success"
            onClick={() => addItemToBatch(props.original)}
          >
            Replenish
          </Button>
        ),
      }
    ];
    
    return (
      <React.Fragment>
        {replenishableListings ? (
          <ReactTable
            style={{ width: "100%"}}
            data={replenishableListings}
            columns={tableColumns}
            defaultPageSize={replenishableListings.length}
            showPagination={false}
            sortable={false}
          />
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}
ReplenishmentWarningModalTable.propTypes = {
  replenishableListings: PropTypes.array,
  onChangeItemValue: PropTypes.func,
  addItemToBatch: PropTypes.func
};

export default ReplenishmentWarningModalTable;
