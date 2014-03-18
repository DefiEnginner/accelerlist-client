import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import {
  Card, CardBody, CardTitle, Row, Col, Button
} from 'reactstrap';
import styled from 'styled-components';
import IconPrinter from 'react-icons/lib/md/print';
import { digitСonversion } from '../../../../../../helpers/utility';
import ReactToPrint from "react-to-print";
import PrintTemplate from "react-print";

const StyledTable = styled.table`
  > tbody > tr > td {
    + td {
      text-align: right;
    }

    .title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .total {
    font-weight: 700;
    font-size: 22px;
  }
`;

class IncomeStatementTable extends Component {

  formatNumber = (value) => {
    return digitСonversion(value, "currency", "USD");
  }

  render() {
    const {
      data,
		printPreview,
    } = this.props;

    const firstReportPart = (
      <StyledTable className="table table-striped">
        <tbody>
          <tr>
            <td colSpan="2"><h4 className="title">Orders</h4></td>
          </tr>
          <tr>
            <td>Units Sold (FBA)</td>
            <td>{data.fbaOrderCount} Units</td>
          </tr>
          <tr>
            <td>Order Revenue (FBA)</td>
            <td>{this.formatNumber(data.fbaOrderRevenue)}</td>
          </tr>
          <tr>
            <td>Units Sold (MF)</td>
            <td>{data.mfOrderCount} Units</td>
          </tr>
          <tr>
            <td>Order Revenue (MF)</td>
            <td>{this.formatNumber(data.mfOrderRevenue)}</td>
          </tr>
          <tr>
            <td colSpan="2"><h4 className="title">Refunds</h4></td>
          </tr>
          <tr>
            <td>Refunded Units</td>
            <td>{data.totalRefunds} Units</td>
          </tr>
          <tr className="font-weight-bold">
            <td>Total Refund Amount</td>
            <td>{this.formatNumber(data.totalRefundCost)}</td>
          </tr>
          <tr>
            <td colSpan="2"><h4 className="title">FBA Inventory Credits</h4></td>
          </tr>
          <tr>
            <td>Lost - Warehouse</td>
            <td>{this.formatNumber(data.lostWarehouseTotal)} <small>({data.lostWarehouseQty} Units)</small></td>
          </tr>
          <tr>
            <td>Lost - Inbound</td>
            <td>{this.formatNumber(data.lostInboundTotal)} <small>({data.lostInboundQty} Units)</small></td>
          </tr>
          <tr>
            <td>Damaged - Warehouse</td>
            <td>{this.formatNumber(data.damagedWarehouseTotal)} <small>({data.damagedWarehouseQty} Units)</small></td>
          </tr>
          <tr>
            <td>Customer Returns</td>
            <td>{this.formatNumber(data.customerReturnTotal)} <small>({data.customerReturnQty} Units)</small></td>
          </tr>
          <tr>
            <td>Other Adjustments</td>
            <td>{this.formatNumber(data.otherTotal)} <small>({data.otherQty} Units)</small></td>
          </tr>
          <tr className="font-weight-bold">
            <td>Total FBA Inventory Credits</td>
            <td>{this.formatNumber(data.totalInventoryCredits)} <small>({data.otherQty} Units)</small></td>
          </tr>
          <tr>
            <td colSpan="2"><h4 className="title">Miscellaneous</h4></td>
          </tr>
          <tr>
            <td>Shipping Credits</td>
            <td>{this.formatNumber(data.shippingCredits)}</td>
          </tr>
          <tr>
            <td>Shipping Credit Refunds</td>
            <td>{this.formatNumber(data.shippingCreditRefunds)}</td>
          </tr>
          <tr>
            <td>Gift Wrap Credits</td>
            <td>{this.formatNumber(data.giftWrapCredits)}</td>
          </tr>
          <tr>
            <td>Gift Wrap Credit Refunds</td>
            <td>{this.formatNumber(data.giftWrapCreditRefunds)}</td>
          </tr>
          <tr>
            <td>Promotional Rebates</td>
            <td>{this.formatNumber(data.promotionalRebates)}</td>
          </tr>
          <tr>
            <td>Promotional Rebate Refunds</td>
            <td>{this.formatNumber(data.promotionalRebateRefunds)}</td>
          </tr>
          <tr>
            <td>A-to-z Guarantee Claims</td>
            <td>{this.formatNumber(data.guaranteeClaimsTotal)}</td>
          </tr>
          <tr>
            <td>Chargebacks</td>
            <td>{this.formatNumber(data.chargebackTotal)}</td>
          </tr>
          <tr className="font-weight-bold">
            <td>Total Miscellaneous</td>
            <td>{this.formatNumber(data.totalMiscellaneous)}</td>
          </tr>
          <tr className="total">
            <td>GROSS INCOME</td>
            <td className="text-success">{this.formatNumber(data.grossIncome)}</td>
          </tr>
        </tbody>
      </StyledTable>
    );

    const secondReportPart = (
      <StyledTable className="table table-striped">
        <tbody>
          <tr>
            <td colSpan="2"><h4 className="title">Cost of Goods Sold</h4></td>
          </tr>
          <tr className="font-weight-bold">
            <td>Total cost of goods sold</td>
            <td>{this.formatNumber(data.cogs)}</td>
          </tr>
		  {data.miscExpenses ? (
          <tr className="font-weight-bold">
            <td>Misc expenses</td>
            <td>{this.formatNumber(data.miscExpenses)}</td>
		  </tr>
		  ) : (null)}
          <tr>
            <td colSpan="2"><h4 className="title">Selling Fees</h4></td>
          </tr>
          <tr>
            <td>FBA Selling Fees</td>
            <td>{this.formatNumber(data.fbaSellingFees)}</td>
          </tr>
          <tr>
            <td>MF Selling Fees</td>
            <td>{this.formatNumber(data.mfSellingFees)}</td>
          </tr>
          <tr>
            <td>Selling Fee Refunds</td>
            <td>{this.formatNumber(data.sellingFeeRefunds)}</td>
          </tr>

          <tr className="font-weight-bold">
            <td>Total Selling Fees</td>
            <td>{this.formatNumber(data.totalSellingFees)}</td>
          </tr>
          <tr>
            <td colSpan="2"><h4 className="title">Transaction Fees</h4></td>
          </tr>
          <tr>
            <td>FBA Transaction Fees</td>
            <td>{this.formatNumber(data.fbaTransactionFees)}</td>
          </tr>
          <tr>
            <td>FBA Transaction Fees Refunds</td>
            <td>{this.formatNumber(data.fbaTransactionFeeRefunds)}</td>
          </tr>
          <tr>
            <td>Other Transaction Fees</td>
            <td>{this.formatNumber(data.otherTransactionFees)}</td>
          </tr>
          <tr>
            <td>Other Transaction Fees Refunds</td>
            <td>{this.formatNumber(data.otherTransactionFeeRefunds)}</td>
          </tr>
          <tr className="font-weight-bold">
            <td>Total Transaction Fees</td>
            <td>{this.formatNumber(data.totalTransactionFees)}</td>
          </tr>
          <tr>
            <td colSpan="2"><h4 className="title">Shipping Fees</h4></td>
          </tr>
          <tr>
            <td>FBA Inbound Shipping</td>
            <td>{this.formatNumber(data.inboundShippingFees)}</td>
          </tr>
          <tr>
            <td>Merchant Fulfilled Label Purchases</td>
            <td>{this.formatNumber(data.mfLabelPurchases)}</td>
          </tr>
          <tr>
            <td>Merchant Fulfilled Label Refunds</td>
            <td>{this.formatNumber(data.mfLabelRefunds)}</td>
          </tr>
          <tr className="font-weight-bold">
            <td>Total Shipping Fees</td>
            <td>{this.formatNumber(data.totalShippingFees)}</td>
          </tr>
          <tr>
            <td colSpan="2"><h4 className="title">Inventory Fees</h4></td>
          </tr>
          <tr>
            <td>Inventory Storage Fees</td>
            <td>{this.formatNumber(data.inventoryStorageFees)}</td>
          </tr>
          <tr>
            <td>Long-Term Storage Fees</td>
            <td>{this.formatNumber(data.longTermStorageFees)}</td>
          </tr>
          <tr>
            <td>FBA Disposal Fees</td>
            <td>{this.formatNumber(data.fbaDisposalFees)}</td>
          </tr>
          <tr>
            <td>FBA Return Fees</td>
            <td>{this.formatNumber(data.fbaReturnFees)}</td>
          </tr>
          <tr>
            <td>FBA Labeling Prep Fees</td>
            <td>{this.formatNumber(data.fbaLabelingPrepFees)}</td>
          </tr>
          <tr>
            <td>Other Inventory Fees</td>
            <td>{this.formatNumber(data.otherInventoryFees)}</td>
          </tr>
          <tr className="font-weight-bold">
            <td>Total Inventory Fees</td>
            <td>{this.formatNumber(data.totalInventoryFees)}</td>
          </tr>
          <tr>
            <td colSpan="2"><h4 className="title">Service Fees</h4></td>
          </tr>
          <tr>
            <td>Subscription Fees</td>
            <td>{this.formatNumber(data.subscriptionFees)}</td>
          </tr>
          <tr>
            <td>Other Service Fees</td>
            <td>{this.formatNumber(data.otherServiceFees)}</td>
          </tr>
          <tr className="font-weight-bold">
            <td>Total Service Fees</td>
            <td>{this.formatNumber(data.totalServiceFees)}</td>
          </tr>
          <tr className="total">
            <td>TOTAL EXPENSES</td>
			<td className="text-danger">
				{this.formatNumber(data.totalExpenses + data.miscExpenses )}
			</td>
          </tr>
          <tr className="total">
            <td>NET PROFIT</td>
			<td className="text-success">
				{this.formatNumber(data.netProfit - data.miscExpenses)}
			</td>
          </tr>
        </tbody>
      </StyledTable>
    );

    if (printPreview) {
      return (
        <Row className="income-statement-print">
          <Col xs="6">
            {firstReportPart}
          </Col>
          <Col xs="6">
            {secondReportPart}
          </Col>
        </Row>
      )
    }
    return (
      <Row>
        <Col lg="6">
          {firstReportPart}
        </Col>
        <Col lg="6">
          {secondReportPart}
        </Col>
      </Row>
    );
  }
}

class IncomeStatement extends Component {

	UNSAFE_componentWillMount(){
		/*
		if(this.props.data){
			//var startDate = new Date(this.props.data.dateStart).toISOString();
			//var endDate = new Date(this.props.data.dateEnd).toISOString();
			/*
			const data = {
				startDate: startDate,
				endDate: endDate,
			}
			this.props.expensesGetForPeriod(data);
		}
		*/
	}

  render() {
    const {
		data,
    } = this.props;

    return (
      <Fragment>
        <Card>
          <CardBody>
            <CardTitle className="text-center mb-5" style={{ lineHeight: 2 }}>
              Income Statement ({data.dateStart} - {data.dateEnd})
              <ReactToPrint
                trigger={() => (
                  <a>
                    <Button color="secondary" className="float-right"><IconPrinter /> PRINT</Button>
                  </a>
                )}
                content={() => this.componentRef}
                />
            </CardTitle>
			<IncomeStatementTable
				data={data}
			/>
          </CardBody>
        </Card>
        <PrintTemplate>
          <div
            className="printable-accounting"
            ref={el => (this.componentRef = el)}
          >
            <h5 className="text-center card-title">
              Income Statement ({data.dateStart} - {data.dateEnd})
            </h5>
			<IncomeStatementTable
				data={data}
				printPreview={true}
			/>
          </div>
        </PrintTemplate>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
  }),
  {
  }
)(IncomeStatement);
