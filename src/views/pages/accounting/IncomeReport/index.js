import React, { Component } from 'react';
import { connect } from "react-redux";
import TransactionUploader from './TransactionUploader';
import AvailableReports from "./AvailableReports";
import accountingActions from "../../../../redux/accounting/actions";
import PropTypes from "prop-types";
import { Card, CardBody, Row, Col } from 'reactstrap';
import WistiaEmbed from '../../../../shared/components/WistiaEmbed';

const { clearUploadReportJobData } = accountingActions;

const ViewHeader = () => (
  <div className="view-header">
    <header className="title text-white">
      <h1 className="h4 text-uppercase">Profit &amp; Loss Report</h1>
    </header>
  </div>
);

const ViewContent = ({children}) => (
  <div className="view-content view-components">
      {children}
  </div>
);

class IncomeReport extends Component {
  componentDidMount() {
    this.props.clearUploadReportJobData();
  }

  render() {
     return (
      <div className="view">
        <ViewHeader />
        <ViewContent>
          <Card>
            <CardBody>
              <Row>
                <Col>
                  <WistiaEmbed 
                    hashedId="xa4040360p" 
                    playerColor="#00c853"
                  />
                </Col>
                <Col>
                  <TransactionUploader  />
                </Col>
              </Row>

              <hr className="my-5" />

              <AvailableReports />
            </CardBody>
          </Card>          
        </ViewContent>
    </div>
    )
  }
}

IncomeReport.propTypes = {
  clearUploadReportJobData: PropTypes.func.isRequired,
};

export default connect( null,{ clearUploadReportJobData })(IncomeReport);