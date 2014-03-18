import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Col,
  CardBody,
  Label,
  Form,
  FormGroup,
  Button,
} from "reactstrap";
import { testPrintLabel } from "../../../../../../helpers/print_service/utility";

class PrintNPSettingsView extends Component {
  getTextFromBoolean = value => {
    if (value === true) {
      return "Yes";
    } else if (value === false) {
      return "No";
    }
  };

  render() {
    const { printerDefaults, toggleEditMode, npPrinterConnectionStatus, print } = this.props;
    return (
      <CardBody>
        <Form>
          <FormGroup row>
            <Col sm={12} className="text-center">
              <Button
                color="primary"
                className="mb-2"
                onClick={toggleEditMode}
              >
                Edit Settings
              </Button>
            </Col>
          </FormGroup>
        </Form>
        <Form>
          <FormGroup row>
            <Label for="printerSelect" sm={3}>
              Active Printer
            </Label>
            <Col sm={9}>{printerDefaults.printer_name || "-"}</Col>
          </FormGroup>
          {printerDefaults.manufacturer === "Dymo" && (
            <FormGroup row>
              <Label for="suggestedLabels" sm={3}>
                Suggested Labels:
              </Label>
              <Col sm={9}>{printerDefaults.label_type || "-"}</Col>
            </FormGroup>
          )}
          {printerDefaults.manufacturer === "Zebra" && (
            <React.Fragment>
              <FormGroup row>
                <Label for="orientation" sm={3}>
                  Orientation:
                </Label>
                <Col sm={9}>
                  {printerDefaults.orientation || "-"}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="label_height" sm={3}>
                  Label Height:
                </Label>
                <Col sm={9}>
                  {printerDefaults.label_height || "-"}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="label_width" sm={3}>
                  Label Width:
                </Label>
                <Col sm={9}>
                  {printerDefaults.label_width || "-"}
                </Col>
              </FormGroup>
            </React.Fragment>
          )}
          <FormGroup row>
            <Label for="printOption" sm={3}>
              Print while scanning in batch:
            </Label>
            <Col sm={9}>
              {this.getTextFromBoolean(
                printerDefaults.print_while_scanning
              ) || "-"}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="printOption" sm={3}>
              Print while scanning in box contents:
            </Label>
            <Col sm={9}>
              {this.getTextFromBoolean(
                printerDefaults.print_while_scanning_box_contents
              ) || "-"}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <p>Connection Status</p>
              {npPrinterConnectionStatus ? (
                <div className="mb-2">
                  <div className="toggle-dot" />
                  <div>DETECTED</div>
                </div>
              ) : (
                <div>Not Connected</div>
              )}
            </Col>
            <Col className="d-flex flex-column justify-content-center align-items-center">
              {npPrinterConnectionStatus ? (
                <React.Fragment>
                  <p>Print Test Label</p>
                  <Button
                    color="primary"
                    className="mb-2"
                    onClick={() => {
                      print(testPrintLabel, 1);
                    }}
                  >
                    Label test
                  </Button>
                </React.Fragment>
              ) : ""}
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    );
  }
}

PrintNPSettingsView.propTypes = {
  toggleEditMode: PropTypes.func.isRequired,
  print: PropTypes.func.isRequired,
  printerDefaults: PropTypes.object.isRequired,
  npPrinterConnectionStatus:  PropTypes.bool.isRequired,
};

export default PrintNPSettingsView;
