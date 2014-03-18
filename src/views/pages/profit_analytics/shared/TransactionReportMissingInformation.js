import React from 'react';
import request from 'superagent';
import {Pie, PieChart, ComposedChart, Area, AreaChart, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { OverlayTrigger, Popover} from 'react-bootstrap';
import {CSVLink, CSVDownload} from 'react-csv';
import Uploader from '../Uploader.jsx';
import { Modal, Button, 
    FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';


export default class TransactionReportMissingInformation extends React.Component {
	constructor() {
		super()
		this.state = {
			editsBySku: {}
		}
	}

	showModal(keyForModal) {
		this.setState({
			showModal: true,
			keyForModal: keyForModal
		})
	}


	onHide() {
		this.setState({
			showModal: false
		})
	}

	recalculateAndHideModal() {
		this.props.saveAndRecalculate({});
		this.onHide();
	}

	render() {
		var options = {
				sizePerPage: 20,
				sizePerPageList: [20, 50, 100],
				paginationSize: 10
		}


		function onAfterSaveCell(row, cellName, cellValue) {
	  		var editsBySku = this.state.editsBySku;
	  		if (!editsBySku[row.sku]) {
	  			editsBySku[row.sku] = {}
	  		}
	  		
  			if (cellName === "buy_cost") {
	  			editsBySku[row.sku][cellName] = parseFloat(cellValue)
  			} else {
	  			editsBySku[row.sku][cellName] = cellValue  			
  			}
	  		this.setState({editsBySku})
	  		console.log(editsBySku);
	  	}

		function onBeforeSaveCell(row, cellName, cellValue) {
			if (cellName === "buy_cost" && !parseFloat(cellValue) && cellValue !== "") {
				return false;
			}
			return true;
		}


		var cellEditProp = {
			mode: "click",
			blurToSave: true,
			beforeSaveCell: onBeforeSaveCell.bind(this), // a hook for before saving cell
			afterSaveCell: onAfterSaveCell.bind(this)  // a hook for after saving cell
		};


		var missingInformationTable = (
			<BootstrapTable
				data={this.props.aggregatedReport.rowsMissingBuyCostOrSupplier} 
				exportCSV={false} 
				striped={true} 
				bordered={false} 
				hover={true} 
				pagination={true} 
				cellEdit={cellEditProp}
				options={options}>
			  <TableHeaderColumn dataAlign="center" dataSort={true} dataField="sku" editable={false} isKey={true}>SKU</TableHeaderColumn>
			  <TableHeaderColumn dataSort={true} dataAlign="center" dataField="buy_cost" editable={true}>Buy Cost</TableHeaderColumn>
			  <TableHeaderColumn dataAlign="center" dataSort={true} dataField="supplier" editable={true}>Supplier</TableHeaderColumn>
			</BootstrapTable>
		)


		var uploaderModal = (
	        <Modal show={this.state.showModal} onHide={this.onHide.bind(this)} bsSize="lg">
	            <Modal.Header closeButton>
	                <h4 className="modal-title" style={{fontWeight:300, fontFamily:'Open Sans', fontSize: "20px"}}>Uploader</h4>
	            </Modal.Header>
	            <Modal.Body>
	                <div className="row text-center">
	                	<Uploader callback={this.recalculateAndHideModal.bind(this)} />
	                </div>
	            </Modal.Body>
			    <Modal.Footer>
			      	<Button bsStyle="primary" onClick={this.onHide.bind(this)}>Close</Button>
			    </Modal.Footer>	         
	        </Modal>
        )

        var data = this.props.aggregatedReport.rowsMissingBuyCostOrSupplier;
        for (var c=0; c<data.length; c++) {
        	if (!data[c].buy_cost) {
        		data[c].buy_cost = ""
        	}
        }

		return (
			<div className="hpanel">
				{uploaderModal}
				<div className="panel-body text-center">
					<div className="panel-header-text">Missing Information</div>
					<div className="divider"></div>
					<br />
					<div className="row">
						<div className="col-lg-12" style={{textAlign: "left"}}>
							<p style={{marginLeft: "10px"}}>We found <strong className="text-danger">{this.props.aggregatedReport.rowsMissingBuyCostOrSupplier.length} SKUs</strong> missing either supplier or buy cost information. Please set that information here for the most accurate analytics possible!</p>
							
							<CSVLink data={this.props.aggregatedReport.rowsMissingBuyCostOrSupplier} filename={"skus_missing_information.csv"} headers={[{label: 'SellerSKU', key: 'sku'}, {label: 'Cost/Unit', key: 'buy_cost'}, {label: 'Supplier', key: 'supplier'}]}>
								<button className="btn btn-primary" style={{fontWeight: 300, fontFamily: 'Open Sans', marginLeft: "10px"}}>EXPORT TO CSV</button>
							</CSVLink>				
							<button className="btn btn-primary" style={{fontWeight: 300, fontFamily: 'Open Sans', marginLeft: "10px"}} onClick={this.showModal.bind(this)}>UPLOAD</button>
							<button className="btn btn-success" style={{fontWeight: 300, fontFamily: 'Open Sans', marginLeft: "10px"}} onClick={this.props.saveAndRecalculate.bind(null, this.state.editsBySku)}>SAVE CHANGES & RECALCULATE</button>
							{missingInformationTable}
							<button className="btn btn-success pull-right" style={{fontWeight: 300, fontFamily: 'Open Sans', marginRight: "10px"}} onClick={this.props.saveAndRecalculate.bind(null, this.state.editsBySku)}>SAVE CHANGES & RECALCULATE</button>
							<CSVLink data={this.props.aggregatedReport.rowsMissingBuyCostOrSupplier} filename={"skus_missing_information.csv"} headers={[{label: 'SellerSKU', key: 'sku'}, {label: 'Cost/Unit', key: 'buy_cost'}, {label: 'Supplier', key: 'supplier'}]}>
								<button className="btn btn-primary pull-right margin-right" style={{fontWeight: 300, fontFamily: 'Open Sans', marginLeft: "10px"}}>EXPORT TO CSV</button>
							</CSVLink>	
						</div>

					</div>
				</div>
			</div>
		)
	}
}
