import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Button } from "reactstrap";
import PrintIcon from "react-icons/lib/md/print";
import "../../style.css";

class StrandedTable extends Component {

  filterView(status){
	const { strandedItems } = this.props;
	let items = [];
	if(status === 'stranded_closed'){
		status = 'Inactive';
	} else if(status === 'stranded_active'){
		status = 'Active';
	}
	strandedItems.forEach(item => {
		if(item['status_primary'] === status){
			items.push(item);
		}
	});
	return items;
  }

  render() {
    let tableColumns = [
      {
        id: "asin",
        Header: "ASIN",
        accessor: "asin",
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "seller_sku",
        Header: "SKU",
        accessor: "seller_sku",
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "fnsku",
        Header: "FNSKU",
        accessor: "fnsku",
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "status_primary",
        Header: "STATUS PRIMARY",
        accessor: "status_primary",
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "status_secondary",
        Header: "STATUS SECONDARY",
        accessor: "status_secondary",
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "date_stranded",
        Header: "DATE STRANDED",
        accessor: "date_stranded",
        className: "text-center",
        style: { alignSelf: "center" }
      },
      {
        id: "error_message",
        Header: "ERROR MESSGE",
        accessor: "error_message",
        className: "text-center",
        style: { alignSelf: "center" }
      },
    ];

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

    return (
      <React.Fragment>
          <ReactTable
			data={this.filterView(this.props.viewStatus)} // should default to []
            columns={tableColumns}
          />
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
  }),
  {}
)(StrandedTable);
