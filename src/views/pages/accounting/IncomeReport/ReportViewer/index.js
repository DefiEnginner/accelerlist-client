import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import {
  Navbar, Nav, NavItem, NavbarToggler,
  Button
} from 'reactstrap';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import IconMenu from 'react-icons/lib/md/menu';
import Summary from './Summary';
import SupplierInsights from './Insights/SupplierInsights';
import IncomeStatement from './IncomeStatement';
import MissingInfo from './MissingInfo';
import LoadingIndicator from '../../../../../shared/components/LoadingIndicator';
import accountingActions from "../../../../../redux/accounting/actions";
import { StyledCollapse } from "./styles";
import { incomeReportUrl } from "../../../../../config/mediaLinks";
import SweetAlert from "sweetalert2-react";
import moment from "moment";

const {
  getGeneratedReport,
  addMissingInfoData,
  reuploadTransactionReport,
  getStatusOfReuploadingTransactionReport,
  clearUploadedTransactionReportData
} = accountingActions;

const ViewHeader = () => (
  <div className="view-header">
    <header className="title text-white">
      <h1 className="h4 text-uppercase">Analytics Report</h1>
    </header>
  </div>
);

const ViewContent = ({children}) => (
  <div className="view-content view-components">
      {children}
  </div>
);

const uploadUrl = '/dashboard/accounting/income_report';

class ReportViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aggregatedReport: {},
      reportsByDate: {},
      reportsBySupplier: {},
      reportsBySupplierAndDate: {},
      loaded: false,
      activeLink: 'Summary',
      uploadUuid: "",
      activeReport: 'Q12018',
      isDropdownOpen: false,
      isOpen: false,
      uploadBatchId: null,
      warningModalMissingInfo: false,
    };
  }

  componentDidMount() {
    let uuid = this.props.match.params.uuid;
    const { getGeneratedReport } = this.props;
    getGeneratedReport(uuid);

    this.interval = setInterval(() => {
      const {
        getStatusOfReuploadingTransactionReport,
        batchReuploadJobStatus,
        clearUploadedTransactionReportData,
        reuploadFileStatus
      } = this.props;
      if (reuploadFileStatus && reuploadFileStatus.batch_upload_id ) {
        if (batchReuploadJobStatus && batchReuploadJobStatus.hasOwnProperty("status")
          && batchReuploadJobStatus.hasOwnProperty("generated_report_id")) {
            const { status, generated_report_id } = batchReuploadJobStatus;
            if (status && generated_report_id && status === "processed") {
              this.props.history.push(
                `${incomeReportUrl}/${generated_report_id}`
              );
              clearUploadedTransactionReportData();
              window.location.reload();
            }
            if (status && status === "failed") {
              clearUploadedTransactionReportData();
            }
        }
        getStatusOfReuploadingTransactionReport(reuploadFileStatus.batch_upload_id);
      }
    }, 3 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let uuid = nextProps.match.params.uuid;
    const sortAndValidReportsByDate = ReportViewer.sortAndValidReportsByDate;
    if ((nextProps.generatedReport && uuid !== prevState.uploadUuid)
        || (prevState.uploadBatchId && nextProps.generatedReport && nextProps.generatedReport.upload_ids[0])) {
      return {
        aggregatedReport: nextProps.generatedReport.aggregated_report,
        reportsByDate: sortAndValidReportsByDate(nextProps.generatedReport.reports_by_date),
        reportsBySupplier: nextProps.generatedReport.reports_by_supplier,
        reportsBySupplierAndDate: nextProps.generatedReport.reports_by_supplier_and_date,
        reportsByCategory: nextProps.generatedReport.reports_by_category,
        reportsByCategoryAndDate: nextProps.generatedReport.reports_by_category_and_date,
        loaded: true,
        uploadUuid: uuid,
        uploadBatchId: nextProps.generatedReport.upload_ids[0]
      }
    }
    return null;
  }

  static sortAndValidReportsByDate(data) {
    let reports = Object.assign({}, data);
    let sortedReports = {};
    if (Object.keys(reports).length > 0) {
      let reportsByDateArray = Object.keys(reports);
      let sortedDateArray = reportsByDateArray.sort((a, b) => {
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
      })
      sortedDateArray.forEach(element => {
        sortedReports[moment(element).format("YYYY-MM-DD")] = reports[element];
        sortedReports[moment(element).format("YYYY-MM-DD")].date = moment(element).format();
      });
    }
    return sortedReports;
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleDropdown = () => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    });
  }

  toggleReport = (reportId) => {
    this.setState({
      activeReport: reportId
    });
    this.toggleDropdown();
  }

  navLinkClick = (linkName) => {
    this.setState({
      activeLink: linkName
    });
  }

  saveAndRecalculateMissingInfo = () => {
    const {
      missingInfoData,
      reuploadTransactionReport,
      reuploadByInventoryItems
    } = this.props;
    const { uploadUuid } = this.state;

    if (reuploadByInventoryItems) {
      if (uploadUuid) {
          if (missingInfoData && missingInfoData.length > 0) {
            this.setState({
              warningModalMissingInfo: true
            })
          } else {
            reuploadTransactionReport(uploadUuid)
          }
      }
    } else {
      if (uploadUuid
        && missingInfoData
        && missingInfoData.length > 0) {
          reuploadTransactionReport(uploadUuid, missingInfoData)
        }
    }
  }

  render() {
    const {
      addMissingInfoData,
      recalculateIsProcessing,
      reuploadByInventoryItems,
      missingInfoData,
      reuploadTransactionReport,
      clearUploadedTransactionReportData
    } = this.props;
    const {
      warningModalMissingInfo,
      uploadUuid,
      activeLink
    } = this.state;

    let analytics;

    if(activeLink === 'Summary') {
      analytics = <Summary
                    data={this.state.aggregatedReport}
                    dataByDate={this.state.reportsByDate}
                  />
    } else if(activeLink === 'Insights') {
      analytics = <SupplierInsights
                    dataBySupplier={this.state.reportsBySupplier}
                    from={this.state.aggregatedReport.dateStart}
                    to={this.state.aggregatedReport.dateEnd}
                  />;
    } else if(activeLink === 'Statement') {
      analytics = <IncomeStatement
                    data={this.state.aggregatedReport}
                    uploadUuid={this.state.uploadUuid}
                  />
    } else if(activeLink === 'MissingInfo') {
      analytics = <MissingInfo
                    data={this.state.aggregatedReport.rowsMissingBuyCostOrSupplier}
                    addMissingInfoData={addMissingInfoData}
                    saveAndRecalculateMissingInfo={this.saveAndRecalculateMissingInfo}
                    recalculateIsProcessing={recalculateIsProcessing}
                    reuploadByInventoryItems={reuploadByInventoryItems}
                  />
    }

    return (
      <Fragment>
        <div className="view">
          <ViewHeader />
          <ViewContent>
            <Navbar color="dark" expand="md">
              <NavbarToggler onClick={this.toggle}><IconMenu size="24" color="#fff"/></NavbarToggler>
              <StyledCollapse isOpen={this.state.isOpen} navbar>
                <Nav navbar>
                  <NavItem>
                    <a role="button" className={`nav-link ${activeLink === 'Summary' ? 'active' : ''}`} onClick={() => this.navLinkClick("Summary")}>Summary</a>
                  </NavItem>
                  <NavItem>
                    <a role="button" className={`nav-link ${activeLink === 'Insights' ? 'active' : ''}`} onClick={() => this.navLinkClick("Insights")}>Insights</a>
                  </NavItem>
                  <NavItem>
                    <a role="button" className={`nav-link ${activeLink === 'Statement' ? 'active' : ''}`} onClick={() => this.navLinkClick("Statement")}>Statement</a>
                  </NavItem>
                  <NavItem>
                    { this.state.aggregatedReport.rowsMissingBuyCostOrSupplier &&
                      this.state.aggregatedReport.rowsMissingBuyCostOrSupplier.length > 0 &&
                      <span className="badge badge-danger">Needs your attention</span>
                    }
                    <a role="button" id="missingInfo" className={`nav-link ${activeLink === 'MissingInfo' ? 'active' : ''}`} onClick={() => this.navLinkClick("MissingInfo")}>Missing Info</a>
                  </NavItem>
                </Nav>
                <Button
                  color="primary"
                  onClick={() => {
                    clearUploadedTransactionReportData();
                    this.props.history.push(uploadUrl);
                  }}
                >
                  Upload New Report
                </Button>

              </StyledCollapse>
            </Navbar>

            <div className="mt-5">
              {!this.state.loaded ? <LoadingIndicator title="Loading Reports..." /> : analytics}
            </div>
          </ViewContent>
        </div>
        <SweetAlert
          show={warningModalMissingInfo}
          type={"warning"}
          title={"Warning!"}
          text={"Do you want to submit the changes what you made manually as well?"}
          confirmButtonColor={"#3085d6"}
          onConfirm={() => {
            reuploadTransactionReport(uploadUuid, missingInfoData);
            this.setState({
              warningModalMissingInfo: false
            });
          }}
          onCancel={() => {
            reuploadTransactionReport(uploadUuid);
            this.setState({
              warningModalMissingInfo: false
            });
          }}
          showCancelButton={true}
        />
      </Fragment>
    );
  }
}

ReportViewer.propTypes = {
  reuploadTransactionReport: PropTypes.func.isRequired,
  generatedReport: PropTypes.object,
  missingInfoData: PropTypes.array,
  getGeneratedReport: PropTypes.func.isRequired,
  recalculateIsProcessing: PropTypes.bool,
  reuploadByInventoryItems: PropTypes.bool,
};

export default withRouter(connect(
  state => ({
    generatedReport: state.Accounting.get("generatedReport"),
    missingInfoData: state.Accounting.get("missingInfoData"),
    batchReuploadJobStatus: state.Accounting.get("batchReuploadJobStatus"),
    reuploadFileStatus: state.Accounting.get("reuploadFileStatus"),
    recalculateIsProcessing: state.Accounting.get("recalculateIsProcessing"),
    reuploadByInventoryItems: state.Accounting.get("reuploadByInventoryItems"),
  }),
  {
    getGeneratedReport,
    addMissingInfoData,
    reuploadTransactionReport,
    getStatusOfReuploadingTransactionReport,
    clearUploadedTransactionReportData
  }
)(ReportViewer));
