import React from "react";
import LoadingIndicator from "./LoadingIndicator.jsx";
import { backendHost, request } from "../../../../helpers/apiConfig";
import TransactionReportSummary from "./TransactionReportSummary.jsx";
import TransactionReportInsights from "./TransactionReportInsights.js";
import TransactionReportMissingInformation from "./TransactionReportMissingInformation.jsx";
import IncomeStatement from "./IncomeStatement.jsx";

export default class TransactionReportViewer extends React.Component {
  constructor(props) {
    super(props);
    var uploadUuid = props.uuid;

    this.state = {
      aggregatedReport: {},
      reportsByDate: {},
      reportsBySupplier: {},
      reportsBySupplierAndDate: {},
      loaded: false,
      activeDashboard: "Summary",
      uploadUuid: uploadUuid
    };
  }

  componentDidMount() {
    // var currentUrl = window.location.href;
    // var urlSplit = currentUrl.split("/");
    var uploadUuid = this.props.uuid;
    this.serverRequest = request
      .get(`${backendHost}/api/v1/profit_analytics/?generated_report_id=${uploadUuid}`)
      .then(res => {
        console.log("this is job", res);
        var job = res.body;

        if (job.report) {
          var outputMetadata = JSON.parse(job.report);
          this.setState({
            aggregatedReport: outputMetadata.aggregated_report,
            reportsByDate: outputMetadata.reports_by_date,
            reportsBySupplier: outputMetadata.reports_by_supplier,
            reportsBySupplierAndDate:
              outputMetadata.reports_by_supplier_and_date,
            reportsByCategory: outputMetadata.reports_by_category,
            reportsByCategoryAndDate:
              outputMetadata.reports_by_category_and_date,
            loaded: true
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  setDashboard(dashboardName) {
    this.setState({
      activeDashboard: dashboardName
    });
  }

  saveAndRecalculate(editsBySku) {
    console.log("save and recalc", editsBySku);

    this.setState({
      loaded: false
    });
    // var currentUrl = window.location.href;
    // var urlSplit = currentUrl.split("/");
    // var uploadUuid = urlSplit[urlSplit.length - 2];
    // var data = {
    //   editsBySku: JSON.stringify(editsBySku)
    // };
    // this.serverRequest = $.post(
    //   "/transaction_report/v2/save_and_recalculate/" + uploadUuid + "/",
    //   data,
    //   function(result) {
    //     console.log(result);
    //     pollUploadProcessingStatus(uploadUuid);
    //   }.bind(this)
    // );
  }

  render() {
    if (!this.state.loaded) {
      return (
        <div className="hpanel">
          <div className="panel-body text-center">
            <LoadingIndicator />
          </div>
        </div>
      );
    }

    var currDisplay;
    if (this.state.activeDashboard === "Summary") {
      currDisplay = (
        <TransactionReportSummary
          aggregatedReport={this.state.aggregatedReport}
          reportsByDate={this.state.reportsByDate}
          setDashboard={this.setDashboard.bind(this)}
        />
      );
    } else if (this.state.activeDashboard === "Insights") {
      currDisplay = (
        <TransactionReportInsights
          aggregatedReport={this.state.aggregatedReport}
          reportsBySupplier={this.state.reportsBySupplier}
          reportsBySupplierAndDate={this.state.reportsBySupplierAndDate}
          reportsByCategory={this.state.reportsByCategory}
          reportsByCategoryAndDate={this.state.reportsByCategoryAndDate}
        />
      );
    } else if (this.state.activeDashboard === "Missing Info") {
      currDisplay = (
        <TransactionReportMissingInformation
          aggregatedReport={this.state.aggregatedReport}
          saveAndRecalculate={this.saveAndRecalculate.bind(this)}
        />
      );
    } else if (this.state.activeDashboard === "Statement") {
      console.log("well, i'm here - should be rendering");
      currDisplay = (
        <IncomeStatement
          data={this.state.aggregatedReport}
          uploadUuid={this.state.uploadUuid}
        />
      );
    }

    var missingInfoTab;
    if (
      this.state.aggregatedReport.rowsMissingBuyCostOrSupplier &&
      this.state.aggregatedReport.rowsMissingBuyCostOrSupplier.length > 0
    ) {
      missingInfoTab = (
        <a
          href="#a"
          className={
            this.state.activeDashboard === "Missing Info"
              ? "active-tab dashboard-tab"
              : "dashboard-tab"
          }
          onClick={this.setDashboard.bind(this, "Missing Info")}
        >
          <div>
            Missing Info
            <small
              style={{
                color: "#D64541",
                fontWeight: 300,
                fontSize: "11px",
                textTransform: "none",
                marginLeft: "5px"
              }}
            >
              (Needs Your Attention!)
            </small>
          </div>
        </a>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div className="dashboard-tab-container">
              <a
                href="#a"
                className={
                  this.state.activeDashboard === "Summary"
                    ? "active-tab dashboard-tab"
                    : "dashboard-tab"
                }
                onClick={this.setDashboard.bind(this, "Summary")}
              >
                <div>Summary</div>
              </a>
              <a
                href="#a"
                className={
                  this.state.activeDashboard === "Insights"
                    ? "active-tab dashboard-tab"
                    : "dashboard-tab"
                }
                onClick={this.setDashboard.bind(this, "Insights")}
              >
                <div>Insights</div>
              </a>
              <a
                href="#a"
                className={
                  this.state.activeDashboard === "Statement"
                    ? "active-tab dashboard-tab"
                    : "dashboard-tab"
                }
                onClick={this.setDashboard.bind(this, "Statement")}
              >
                <div>Statement</div>
              </a>
              {missingInfoTab}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">{currDisplay}</div>
        </div>
      </div>
    );
  }
}
