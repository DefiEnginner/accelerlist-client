import React from "react";
import { connect } from "react-redux";
import request from "superagent";
import {
  ComposedChart,
  Area,
  AreaChart,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import LoadingIndicator from "./../LoadingIndicator.jsx";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { digitСonversion } from "../../../../helpers/utility";

class TransactionReportSummary extends React.Component {
  constructor() {
    super();
  }

  formatNumber(value) {
    return Number(parseFloat(value || 0).toFixed(2)).toLocaleString("en");
  }

  render() {
    const { internationalization_config } = this.props;
    var compare = function(a, b) {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    };

    // turn map into array
    var data = [];
    var reportsByDate = this.props.reportsByDate;
    for (var date in reportsByDate) {
      var report = reportsByDate[date];
      report.totalExpenses = parseFloat(report.totalExpenses);
      report.grossIncome = parseFloat(report.grossIncome);
      report.date = date;
      data.push(report);
    }

    data = data.sort(compare);

    var formatter = function(val) {
      return (digitСonversion(
        parseFloat(val),
        "currency",
        internationalization_config.currency_code
      ));
    }.bind(this);

    var areaChart = (
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="label" />
          <YAxis />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            horizontal={false}
          />
          <Tooltip formatter={formatter} />
          <Area
            type="monotone"
            dataKey="totalExpenses"
            stackId="1"
            stroke="#c0392b"
            fill="#c0392b"
          />
          <Area
            type="monotone"
            dataKey="grossIncome"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );

    var profitChart = (
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="label" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip formatter={formatter} />

          <Line
            type="monotone"
            dataKey="netProfit"
            stroke="#2c3e50"
            fill="#2c3e50"
          />
        </LineChart>
      </ResponsiveContainer>
    );

    var incomePopover = (
      <Popover id="popover-trigger-hover-focus" title="Income Breakdown">
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>Total FBA Sales</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.fbaOrderRevenue || 0
                )}
              </td>
            </tr>
            <tr>
              <td>Total MF Sales</td>
              <td>
                {this.formatNumber(this.props.aggregatedReport.mfOrderRevenue)}
              </td>
            </tr>
            <tr>
              <td>Total Refunds</td>
              <td>
                {this.formatNumber(this.props.aggregatedReport.totalRefundCost)}
              </td>
            </tr>
            <tr>
              <td>Total Inventory Credits</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.totalInventoryCredits
                )}
              </td>
            </tr>
            <tr>
              <td>Total Miscellaneous Income</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.totalMiscellaneous
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Popover>
    );

    var feesAndExpensesPopover = (
      <Popover
        id="popover-trigger-hover-focus"
        title="Fees and Expenses Breakdown"
      >
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>Total Transaction Fees</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.totalTransactionFees
                )}
              </td>
            </tr>
            <tr>
              <td>Total Selling Fees</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.totalSellingFees
                )}
              </td>
            </tr>
            <tr>
              <td>Total Service Fees</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.totalServiceFees
                )}
              </td>
            </tr>
            <tr>
              <td>Total Shipping Fees</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.totalShippingFees
                )}
              </td>
            </tr>
            <tr>
              <td>Total Inventory Fees</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.totalInventoryFees
                )}
              </td>
            </tr>
            <tr>
              <td>Guarantee Claims Total</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.guaranteeClaimsTotal
                )}
              </td>
            </tr>
            <tr>
              <td>Chargeback Total</td>
              <td>
                {this.formatNumber(this.props.aggregatedReport.chargebackTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </Popover>
    );

    var costOfGoodsSoldPopover = (
      <Popover
        id="popover-trigger-hover-focus"
        title="Fees and Expenses Breakdown"
      >
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>Cost of Goods Delivered</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.costOfGoodsDelivered
                )}
              </td>
            </tr>
            <tr>
              <td>Cost of Goods Adjusted</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.costOfGoodsAdjusted
                )}
              </td>
            </tr>
            <tr>
              <td>Cost of Goods Refunded</td>
              <td>
                {this.formatNumber(
                  this.props.aggregatedReport.costOfGoodsReturned
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Popover>
    );

    return (
      <div>
        <div className="hpanel">
          <div className="panel-body text-center">
            <div className="panel-header-text">
              Profit Breakdown ({this.props.aggregatedReport.dateStart} -{" "}
              {this.props.aggregatedReport.dateEnd})
            </div>
            <div className="divider" />
            <br />
            <div className="row">
              <div className="calculation-container">
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="bottom"
                  overlay={incomePopover}
                >
                  <div className="calculation-header">
                    <a href="#a">
                      {this.formatNumber(
                        this.props.aggregatedReport.grossIncome
                      )}
                    </a>
                  </div>
                </OverlayTrigger>
                <div className="calculation-body">
                  <span className="calculation-footer">
                    <small>Gross Income</small>
                  </span>
                </div>
              </div>
              <div className="calculation-container">
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="bottom"
                  overlay={costOfGoodsSoldPopover}
                >
                  <div className="calculation-header">
                    <a href="#a">
                      - 
                      {this.formatNumber(-1 * this.props.aggregatedReport.cogs)}
                    </a>
                  </div>
                </OverlayTrigger>
                <div className="calculation-body">
                  <span className="calculation-footer">
                    <small>Cost of Goods Sold</small>
                  </span>
                </div>
              </div>
              <div className="calculation-container">
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="bottom"
                  overlay={feesAndExpensesPopover}
                >
                  <div className="calculation-header">
                    <a href="#a">
                      - 
                      {this.formatNumber(
                        -1 *
                          this.props.aggregatedReport.totalExpensesWithoutCogs
                      )}
                    </a>
                  </div>
                </OverlayTrigger>
                <div className="calculation-body">
                  <span className="calculation-footer">
                    <small>Fees & Other Expenses</small>
                  </span>
                </div>
              </div>

              <div className="equals">=</div>
              <div style={{ display: "inline-block" }}>
                <div className="profit">
                  <span style={{ fontWeight: 600 }}>
                    {this.formatNumber(this.props.aggregatedReport.netProfit)}
                  </span>
                </div>
                <div className="profit-footer">NET</div>
              </div>
            </div>
            <br />
            <hr />
            <br />
            <div className="row">
              <div className="col-lg-2">
                <h2 style={{ marginTop: "50px" }}>INCOME & EXPENSES</h2>
                <p>
                  During this time period, your average ROI was{" "}
                  <strong
                    className={
                      this.props.aggregatedReport.roi > 0
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {this.formatNumber(this.props.aggregatedReport.roi)}%
                  </strong>
                  .
                </p>
              </div>
              <div className="col-lg-10">{areaChart}</div>
            </div>
            <br />
            <br />
            <div className="row">
              <div className="col-lg-2">
                <h2 style={{ marginTop: "50px" }}>NET PROFIT</h2>
                <p>
                  During this time period, you averaged a net profit of{" "}
                  <strong
                    className={
                      this.props.aggregatedReport.dailyNetProfit > 0
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {parseInt(this.props.aggregatedReport.dailyNetProfit)}
                    /day
                  </strong>
                  .
                </p>
              </div>
              <div className="col-lg-10">{profitChart}</div>
            </div>
            <hr />
            <div className="row">
              <div className="col-lg-12">
                <h4>
                  <span
                    style={{
                      fontWeight: 300,
                      marginRight: "50px",
                      fontFamily: "Open Sans"
                    }}
                  >
                    Want to dig further?{" "}
                  </span>
                  <a
                    href="#"
                    style={{ marginRight: "10px" }}
                    onClick={this.props.setDashboard.bind(null, "Insights")}
                  >
                    DEEPER INSIGHTS
                  </a>{" "}
                  |{" "}
                  <a
                    href="#"
                    style={{ marginLeft: "10px" }}
                    onClick={this.props.setDashboard.bind(null, "Statement")}
                  >
                    INCOME STATEMENT
                  </a>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config")
  }),
  {}
)(TransactionReportSummary)
