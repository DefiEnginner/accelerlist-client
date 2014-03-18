import React, { Component } from "react";

import ViewContent from "../ViewContent";
import ViewHeader from "../ViewHeader";
import TransactionReportViewer from "./TransactionReportViewer";
import "./index.css";

class ProfitReportViewer extends Component {
  componentDidMount() {
    console.log(this.props.match.params.uuid);
  }
  render() {
    return (
      <div className="profit-report-viewer view">
        <ViewHeader />
        <ViewContent>
          <TransactionReportViewer uuid={this.props.match.params.uuid} />
        </ViewContent>
      </div>
    );
  }
}

export default ProfitReportViewer;
