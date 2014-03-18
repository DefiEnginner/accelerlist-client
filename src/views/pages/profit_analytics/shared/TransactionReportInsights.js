import React from 'react';
import { connect } from "react-redux";
import request from 'superagent';
import {Pie, PieChart, ComposedChart, Area, AreaChart, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { OverlayTrigger, Popover} from 'react-bootstrap';
import { Modal, Button, 
    FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import { digitСonversion } from "../../../../helpers/utility";

class TransactionReportInsights extends React.Component {
	constructor() {
		super()
		this.state = {
			showModal: false,
			breakdownBy: "supplier"
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

	nameFormatter(cell, row) {
		return (
			<a href="#a" onClick={this.showModal.bind(this, cell)}>{cell}</a>
		)
	}

	render() {
    const { internationalization_config } = this.props;
		var jsUcFirst= function(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}

		// turn map into array
		if (this.state.breakdownBy === "supplier") {
			var reportsByBreakdown = this.props.reportsBySupplier;
			var reportsByBreakdownAndDate = this.props.reportsBySupplierAndDate;
		} else if (this.state.breakdownBy === "category") {
			var reportsByBreakdown = this.props.reportsByCategory;
			var reportsByBreakdownAndDate = this.props.reportsByCategoryAndDate;
		}

		var sortedBreakdownNames = Object.keys(reportsByBreakdown).sort(function(a, b) {
		  if (reportsByBreakdown[a].netProfit < reportsByBreakdown[b].netProfit) {
		  	return 1
		  } else if (reportsByBreakdown[a].netProfit > reportsByBreakdown[b].netProfit) {
		  	return -1
		  }
		  return 0
		})

		var sortedReportsList = [];
		for (var c=0; c<sortedBreakdownNames.length;c++) {
			var breakdownName = sortedBreakdownNames[c];
			var report = reportsByBreakdown[breakdownName];
			report.name = breakdownName
			report.netProfit = parseFloat((report.netProfit || 0).toFixed(2))
			report.grossIncome = parseFloat((report.grossIncome || 0).toFixed(2))
			report.totalExpenses = parseFloat((report.totalExpenses || 0).toFixed(2))

			sortedReportsList.push(report)
		}

		var breakdownReportsForPieChart = sortedReportsList;
		if (sortedReportsList.length > 3) {
			var truncatedReports = sortedReportsList.slice(0,2);
			var restOfReports = sortedReportsList.slice(2);
			var otherBreakdown = {name: "Other", netProfit: 0.0, grossIncome: 0.0, totalExpenses: 0.0};
			for (var c=0; c<restOfReports.slice(2).length; c++) {
				otherBreakdown.netProfit += restOfReports[c].netProfit || 0
				otherBreakdown.grossIncome += restOfReports[c].grossIncome || 0
				otherBreakdown.totalExpenses += restOfReports[c].totalExpenses || 0
			}
			truncatedReports.push(otherBreakdown)
			breakdownReportsForPieChart = truncatedReports;
		}

		var sumIncome = 0.0;
		for (var c=0; c<breakdownReportsForPieChart.length; c++) {
			sumIncome += breakdownReportsForPieChart[c].grossIncome;
		}

		for (var c=0; c<breakdownReportsForPieChart.length; c++) {
			breakdownReportsForPieChart[c].percentageOfIncome = parseFloat((100.*(breakdownReportsForPieChart[c].grossIncome / sumIncome)).toFixed(2));
			if (breakdownReportsForPieChart[c].percentageOfIncome < 1) {
				breakdownReportsForPieChart[c].percentageOfIncome = " < 1"
			} 
		}

		console.log(breakdownReportsForPieChart);

		var formatter = function(val) {
			return (digitСonversion(
        parseFloat(val),
        "currency",
        internationalization_config.currency_code
      ));
		}
        var pieChart = (
	    	<ResponsiveContainer width="100%" height={240}>
	    		<PieChart width={800} height={400}>
		        	<Pie data={breakdownReportsForPieChart} dataKey="grossIncome" innerRadius={40} outerRadius={80} fill="#82ca9d" label />
		        	<Tooltip/>
        		</PieChart>
        	</ResponsiveContainer>
        )

        var breakdownLabels = breakdownReportsForPieChart.map(function(report) {
        	var breakdownName = report.name;
        	var percentageOfIncome = report.percentageOfIncome;
        	return (
				<span className="label label-primary" style={{marginRight: "10px", fontWeight: 300, paddingTop: "8px", paddingBottom: "8px"}}>{breakdownName} <small style={{color: "white"}}>({percentageOfIncome}%)</small></span>
        	)
        })

        var bestBreakdownText;
        if (breakdownLabels.length < 1) {
        	bestBreakdownText = (<span>We don't have enough data to figure out who is your best {this.state.breakdownBy}.</span>)
        } else {
        	bestBreakdownText = (<span><strong>{breakdownReportsForPieChart[0].name}</strong> is your biggest {this.state.breakdownBy}, generating ${Number(breakdownReportsForPieChart[0].grossIncome).toLocaleString('en')} ({breakdownReportsForPieChart[0].percentageOfIncome}%) income during this time period.</span>)
        }

		var moneyValueFormatter = function(value) {
			// turn it into two decimal float, then convert to number and add commas
			return (digitСonversion(
        parseFloat(value),
        "currency",
        internationalization_config.currency_code
      ));
		}

		var percentageFormatter = function(value) {
			return (parseFloat(value) || 0).toFixed(2) + '%';
		}

		var breakdownTable = (
		  	<BootstrapTable
		  		data={sortedReportsList} 
		  		exportCSV={false} 
		  		striped={true} 
		  		bordered={false} 
		  		hover={true} 
		  		pagination={false} >
			  <TableHeaderColumn dataAlign="center" dataSort={true} dataField="name" editable={false} isKey={true} dataFormat={this.nameFormatter.bind(this)}>{jsUcFirst(this.state.breakdownBy)}</TableHeaderColumn>
			  <TableHeaderColumn dataAlign="center" dataSort={true} dataField="netProfit" editable={true} dataFormat={moneyValueFormatter}>Net Profit</TableHeaderColumn>
			  <TableHeaderColumn dataAlign="center" dataSort={true} dataField="grossIncome" editable={true} dataFormat={moneyValueFormatter}>Gross Income</TableHeaderColumn>
			  <TableHeaderColumn dataAlign="center" dataSort={true} dataField="totalExpenses" editable={true} dataFormat={moneyValueFormatter}>Total Expenses</TableHeaderColumn>
			  <TableHeaderColumn dataAlign="center" dataSort={true} dataField="roi" editable={true} dataFormat={percentageFormatter}>ROI</TableHeaderColumn>
		  	</BootstrapTable>
		)

		var compare = function(a,b) {
		  if (a.date < b.date)
		    return -1;
		  if (a.date > b.date)
		    return 1;
		  return 0;
		}


		// turn map into array
		var data = [];
		var reportsByBreakdownAndDate = reportsByBreakdownAndDate || {};
		var reportsByDate = reportsByBreakdownAndDate[this.state.keyForModal] || {};
		for (var date in reportsByDate) {
			var report = reportsByDate[date]
			report.totalExpenses = parseFloat(report.totalExpenses)
			report.grossIncome = parseFloat(report.grossIncome)
			report.date = date
			data.push(report)
		}

		data = data.sort(compare);

		var formatter = function(val) {
			return (digitСonversion(
        parseFloat(val),
        "currency",
        internationalization_config.currency_code
      ));
		}

		var breakdownModalAreaChart;

		if (data.length < 2) {
			breakdownModalAreaChart = <p style={{marginLeft: "15px"}}>There is not enough data to generate a visualization.</p>
		} else {
			breakdownModalAreaChart = (<ResponsiveContainer width="100%" height={240}>

		    	<ComposedChart data={data}
		            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
		        <XAxis dataKey="label"/>
		        <YAxis/>
		        <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
		        <Tooltip formatter={formatter} />
		        <Area type='monotone' dataKey='totalExpenses' stackId="1" stroke='#c0392b' fill='#c0392b' />
		        <Area type='monotone' dataKey='grossIncome' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
		      </ComposedChart>
		    </ResponsiveContainer>)
		}




		var breakdownModal = (
	        <Modal show={this.state.showModal} onHide={this.onHide.bind(this)} bsSize="lg">
	            <Modal.Header closeButton>
	                <h4 className="modal-title" style={{fontWeight:300, fontFamily:'Open Sans', fontSize: "20px"}}>Detailed Breakdown for {this.state.keyForModal}</h4>
	            </Modal.Header>
	            <Modal.Body>
	                <div className="row">
	                	{breakdownModalAreaChart}
	                </div>
	            </Modal.Body>
	        </Modal>
        )
		return (
			<div>
			    <div className="hpanel">
			    	{breakdownModal}
			        <div className="panel-body text-center">
			            <div className="panel-header-text">{jsUcFirst(this.state.breakdownBy)} Insights ({this.props.aggregatedReport.dateStart} - {this.props.aggregatedReport.dateEnd})</div>
			            <div className="divider"></div><br />  
			            <div className="row">
			            	<div className="col-lg-4">
				            	{pieChart}
				            </div>
				            <div className="col-lg-6 col-lg-offset-1" style={{marginTop: "70px"}}>
				            	<h4 style={{fontWeight: 300, fontFamily: 'Open Sans'}}>
				            		{breakdownLabels}
				            	</h4>
				            	<hr />
				            	<h4 style={{fontWeight: 300, fontFamily: 'Open Sans'}}>{bestBreakdownText}</h4>
				            </div>
			            </div>
			    	</div>
			    </div>
			    <br />
			    <div className="hpanel">
			        <div className="panel-body text-center">
			            <div className="panel-header-text">{jsUcFirst(this.state.breakdownBy)} Breakdown</div>
			            <div className="divider"></div><br />  
			            <div className="text-left">
			            	{breakdownTable}
			            </div>
			    	</div>
			    </div>
			</div>
		)
	}
}

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config")
  }),
  {}
)(TransactionReportInsights);