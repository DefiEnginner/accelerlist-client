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
import { labelsTypeList } from "../../../../../../helpers/print_service/labelsTypeList";
import { testPrintLabel } from "../../../../../../helpers/print_service/utility";
import { accelerPrintIcon } from "../../../../../../assets/images";

class PrintALSettingsView extends Component {
  getTextFromBoolean = value => {
    if (value === true) {
      return "Yes";
    } else if (value === false) {
      return "No";
    }
  };

  render() {
    const { printerDefaults, toggleEditMode, qzTrayConnectionStatus, print } = this.props;
    const labelFindIndex = labelsTypeList.findIndex(el => printerDefaults
      && printerDefaults.hasOwnProperty("label_type")
      && el.lableName === printerDefaults.label_type
    );
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
                <Label for="suggestedLabels" sm={3}>
                  Suggested Labels:
                </Label>
                <Col sm={9}>{printerDefaults.label_type || "-"}</Col>
              </FormGroup>
              { labelFindIndex === -1 && (
                  <React.Fragment>
                    <FormGroup row>
                      <Label for="label_width" sm={3}>
                        Label Width:
                      </Label>
                      <Col sm={9}>
                        {printerDefaults.label_width || "-"}
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
                  </React.Fragment>
                )
              }
            </React.Fragment>
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
          <hr />
          <FormGroup row>
            <Col
              className="d-flex flex-column justify-content-center align-items-center"
              style={{ marginTop: 0 }}
            >
              {/* Here showing the Printer Connection Status */}
              <strong>AccelerPrint connection status</strong>
            </Col>
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <img src={accelerPrintIcon} alt="accelerPrintIcon" width="50" />
              {qzTrayConnectionStatus ? (
                <div className="mb-2">
                  <div className="toggle-dot" />
                  <div>DETECTED</div>
                </div>
              ) : (
                <div>Not Connected</div>
              )}
            </Col>
            <Col className="d-flex flex-column justify-content-center align-items-center">
                <React.Fragment>
                  <p>Print Test Label</p>
                  <Button
                    color="primary"
                    className="mb-2"
                    onClick={() => {
                      print(testPrintLabel, 1);
                    }}
                    disabled={!qzTrayConnectionStatus}
                  >
                    Label test
                  </Button>
                </React.Fragment>
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    );
  }
}

PrintALSettingsView.propTypes = {
  toggleEditMode: PropTypes.func.isRequired,
  print: PropTypes.func.isRequired,
  printerDefaults: PropTypes.object.isRequired,
  qzTrayConnectionStatus:  PropTypes.bool.isRequired,
};

export default PrintALSettingsView;
