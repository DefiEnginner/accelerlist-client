import React from "react";

export default class IncomeStatement extends React.Component {

  render() {
    var openInNewTab = function(url) {
      window.open(url, "_blank");
      window.focus();
    };

    var data = JSON.parse(JSON.stringify(this.props.data || {}));
    var excludeTransformation = new Set(["dateStart", "dateEnd"]);
    var keys = Object.keys(data);
    for (var c = 0; c < keys.length; c++) {
      var key = keys[c];
      if (!excludeTransformation.has(key)) {
        data[key] = Number(data[key]).toLocaleString("en");
      }
    }

    var url = "/transaction_report/" + this.props.uploadUuid + "/printable/";

    return (
      <div
        className="hpanel"
        style={{ marginBottom: "20px" }}
        id="income-statement"
      >
        <div className="panel-body">
          <div className="panel-header-text text-center">
            <button
              onClick={openInNewTab.bind(null, url)}
              className="pull-right btn btn-primary"
              style={{ marginTop: "-10px" }}
            >
              PRINT
            </button>
            Income Statement ({data.dateStart} - {data.dateEnd})
          </div>
          <div className="divider" />
          <h2
            className="font-light m-b-xs"
            style={{ fontWeight: 300, fontFamily: "Open Sans" }}
          > </h2>
          <div className="row">
            <div className="col-lg-5 offset-lg-1">
              <div>
                <table className="table table-striped">
                  <tbody>
                    <tr />
                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Orders
                        </h4>
                      </td>
                      <td />
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Units Sold (FBA)</span>
                        </div>
                      </td>
                      <td>{data.fbaOrderCount} Units</td>
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Order Revenue (FBA)</span>
                        </div>
                      </td>
                      <td>${data.fbaOrderRevenue}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Units Sold (MF)</span>
                        </div>
                      </td>
                      <td>{data.mfOrderCount} Units</td>
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Order Revenue (MF)</span>
                        </div>
                      </td>
                      <td>${data.mfOrderRevenue}</td>
                    </tr>
                    <tr />

                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Refunds
                        </h4>
                      </td>
                      <td />
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Refunded Units</span>
                        </div>
                      </td>
                      <td>{data.totalRefunds} Units</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total Refund Amount</span>
                        </div>
                      </td>

                      <td>
                        <span>${data.totalRefundCost}</span>
                      </td>
                    </tr>
                    <tr />

                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          FBA Inventory Credits
                        </h4>
                      </td>
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Lost - Warehouse</span>
                        </div>
                      </td>
                      <td>
                        ${data.lostWarehouseTotal}{" "}
                        <small>({data.lostWarehouseQty} Units)</small>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Lost - Inbound</span>
                        </div>
                      </td>
                      <td>
                        ${data.lostInboundTotal}{" "}
                        <small>({data.lostInboundQty} Units)</small>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Damaged - Warehouse</span>
                        </div>
                      </td>
                      <td>
                        ${data.damagedWarehouseTotal}{" "}
                        <small>({data.damagedWarehouseQty} Units)</small>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Customer Returns</span>
                        </div>
                      </td>
                      <td>
                        ${data.customerReturnTotal}{" "}
                        <small>({data.customerReturnQty} Units)</small>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Other Adjustments</span>
                        </div>
                      </td>
                      <td>
                        ${data.otherTotal}{" "}
                        <small>({data.otherQty} Units)</small>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total FBA Inventory Credits</span>
                        </div>
                      </td>
                      <td>
                        ${data.totalInventoryCredits}{" "}
                        <small>({data.otherQty} Units)</small>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Miscellaneous
                        </h4>
                      </td>
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Shipping Credits</span>
                        </div>
                      </td>
                      <td>${data.shippingCredits}</td>
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Shipping Credit Refunds</span>
                        </div>
                      </td>
                      <td>${data.shippingCreditRefunds}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Gift Wrap Credits</span>
                        </div>
                      </td>
                      <td>${data.giftWrapCredits}</td>
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Gift Wrap Credit Refunds</span>
                        </div>
                      </td>
                      <td>${data.giftWrapCreditRefunds}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Promotional Rebates</span>
                        </div>
                      </td>
                      <td>${data.promotionalRebates}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Promotional Rebate Refunds</span>
                        </div>
                      </td>
                      <td>${data.promotionalRebateRefunds}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>A-to-z Guarantee Claims</span>
                        </div>
                      </td>
                      <td>${data.guaranteeClaimsTotal}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Chargebacks</span>
                        </div>
                      </td>
                      <td>${data.chargebackTotal}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total Miscellaneous</span>
                        </div>
                      </td>
                      <td>${data.totalMiscellaneous}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table className="table table-striped text-right">
                <tbody>
                  <tr>
                    <td>
                      <h3>
                        <span>GROSS INCOME</span> :
                      </h3>
                    </td>
                    <td>
                      <h3>${data.grossIncome}</h3>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-5 offset-lg-right-1">
              <div className="table-responsive">
                <table className="table table-striped">
                  <tbody>
                    <tr />
                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Cost of Goods Sold
                        </h4>
                      </td>
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total cost of goods sold</span>
                        </div>
                      </td>
                      <td>${data.cogs}</td>
                    </tr>
                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Selling Fees
                        </h4>
                      </td>
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>FBA Selling Fees</span>
                        </div>
                      </td>
                      <td>${data.fbaSellingFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>MF Selling Fees</span>
                        </div>
                      </td>
                      <td>${data.mfSellingFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Selling Fee Refunds</span>
                        </div>
                      </td>
                      <td>${data.sellingFeeRefunds}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total Selling Fees</span>
                        </div>
                      </td>
                      <td>${data.totalSellingFees}</td>
                    </tr>
                    <tr />
                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Transaction Fees
                        </h4>
                      </td>
                      <td />
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>FBA Transaction Fees</span>
                        </div>
                      </td>
                      <td>${data.fbaTransactionFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>FBA Transaction Fee Refunds</span>
                        </div>
                      </td>
                      <td>${data.fbaTransactionFeeRefunds}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Other Transaction Fees</span>
                        </div>
                      </td>
                      <td>${data.otherTransactionFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Other Transaction Fee Refunds</span>
                        </div>
                      </td>
                      <td>${data.otherTransactionFeeRefunds}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total Transaction Fees</span>
                        </div>
                      </td>
                      <td>${data.totalTransactionFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Shipping Fees
                        </h4>
                      </td>
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>FBA Inbound Shipping</span>
                        </div>
                      </td>
                      <td>${data.inboundShippingFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Merchant Fulfilled Label Purchases</span>
                        </div>
                      </td>
                      <td>${data.mfLabelPurchases}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Merchant Fulfilled Label Refunds</span>
                        </div>
                      </td>
                      <td>${data.mfLabelRefunds}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total Shipping Fees</span>
                        </div>
                      </td>
                      <td>${data.totalShippingFees}</td>
                    </tr>
                    <tr />
                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Inventory Fees
                        </h4>
                      </td>
                      <td />
                    </tr>

                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Inventory Storage Fees</span>
                        </div>
                      </td>
                      <td>${data.inventoryStorageFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Long-Term Storage Fees</span>
                        </div>
                      </td>
                      <td>${data.longTermStorageFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>FBA Disposal Fees</span>
                        </div>
                      </td>
                      <td>${data.fbaDisposalFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>FBA Return Fees</span>
                        </div>
                      </td>
                      <td>${data.fbaReturnFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>FBA Labeling Prep Fees</span>
                        </div>
                      </td>
                      <td>${data.fbaLabelingPrepFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Other Inventory Fees</span>
                        </div>
                      </td>
                      <td>${data.otherInventoryFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total Inventory Fees</span>
                        </div>
                      </td>
                      <td>${data.totalInventoryFees}</td>
                    </tr>

                    <tr>
                      <td>
                        <h4
                          style={{ marginBottom: "0px", paddingLeft: "15px" }}
                        >
                          Service Fees
                        </h4>
                      </td>
                      <td />
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Subscription Fees</span>
                        </div>
                      </td>
                      <td>${data.subscriptionFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Other Service Fees</span>
                        </div>
                      </td>
                      <td>${data.otherServiceFees}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="margin-left-lg">
                          <span>Total Service Fees</span>
                        </div>
                      </td>
                      <td>${data.totalServiceFees}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table className="table table-striped text-right">
                <tbody>
                  <tr>
                    <td>
                      <h3>
                        <span>TOTAL EXPENSES</span> :
                      </h3>
                    </td>
                    <td>
                      <h3>${data.totalExpenses}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3>
                        <span>NET PROFIT</span> :
                      </h3>
                    </td>
                    <td>
                      <h3>${data.netProfit}</h3>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
