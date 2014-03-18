import React, { Component } from "react";
import { connect } from "react-redux";
import { object, func } from "prop-types";
import UAParser from "ua-parser-js";
import bugReportingActions from "../../../redux/bug_reporting/actions";
import { momentDateTimeToLocalFormatConversion, momentDateToISOFormatConversion } from "../../../helpers/utility";
import {
  Input,
  Row,
  Col
} from "reactstrap";

class SystemInformation extends Component {
  static props = {
    userData: object,
    printerDefaults: object,
    updateSystemInformation: func,
    systemInformation: object
  }

  componentDidMount() {
    const sys_info_parser = new UAParser();
    const sys_info = sys_info_parser.getResult();
    const { 
      userData,
      printerDefaults,
      updateSystemInformation
    } = this.props;

    updateSystemInformation({
      operating_system: sys_info.os.name || "N/A",
      os_version: sys_info.os.version || "N/A",
      browser: sys_info.browser.name || "N/A",
      browser_version: sys_info.browser.version || "N/A",
      ticket_time: momentDateToISOFormatConversion() || "N/A",
      printer_type: printerDefaults.manufacturer || "N/A",
      printer_model: printerDefaults.printer_name || "N/A",
      user_email: userData.email || "N/A",
      user_name: userData.userName || "N/A"
    })
  }

  informationField = (title, inf) => {
    return (
      <React.Fragment>
          <Col xs="2" className="form-inline">
            {title}
          </Col>
          <Col xs="2">
            <Input 
              disabled={true}
              value={inf}
            />
          </Col>
      </React.Fragment>
    )
  }
  render() {
    const { systemInformation } = this.props;

    return (
      <div>
        <Row>
          {this.informationField("Operating System", systemInformation.operating_system || "N/A")}
          {this.informationField("OS Version", systemInformation.os_version || "N/A")}
          {this.informationField("Ticket Time", momentDateTimeToLocalFormatConversion(systemInformation.ticket_time) || "N/A")}
        </Row>
        <br />
        <Row>
          {this.informationField("Browser", systemInformation.browser || "N/A")}
          {this.informationField("Browser Version", systemInformation.browser_version || "N/A")}
          {this.informationField("Printer Type", systemInformation.printer_type || "N/A")}
        </Row>
        <br />
        <Row>
          {this.informationField("User Email", systemInformation.user_email || "N/A")}
          {this.informationField("User Name", systemInformation.user_name || "N/A")}
          {this.informationField("Printer Model", systemInformation.printer_model || "N/A")}
        </Row>
      </div>
    );
  }
}

export default connect(
  state => ({
    userData: state.Auth.get("userData"),
    printerDefaults: state.Settings.get("printerDefaults"),
    systemInformation: state.BugReporting.get("systemInformation")
  }),
  bugReportingActions
)(SystemInformation);
