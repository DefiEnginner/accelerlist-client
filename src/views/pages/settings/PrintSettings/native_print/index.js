import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, Card, Row } from "reactstrap";

import PrintNPSettingsView from "./PrintNPSettingsView";
import PrintNPSettingsEditForm from "./PrintNPSettingsEditForm";
import { native_print } from "../../../../../helpers/print_service/print_systems";

class NativePrintSettingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.printerDefaults.printer_system !== native_print && prevState.editMode === null) {
      return {
        editMode: true
      }
    }
    return null;
  }

  toggleEditMode = () => {
    const { editMode } = this.state;

    this.setState({
      editMode: !editMode
    });
  };
  
  render() {
    const { print, printerDefaults, npPrinterConnectionStatus, savePrinterDefaults } = this.props;
    return (
      <Row>
        <Col xs="6">
          <Card>
            {this.state.editMode
              ? <PrintNPSettingsEditForm
                  toggleEditMode={this.toggleEditMode}
                  printerDefaults={printerDefaults}
                  savePrinterDefaults={savePrinterDefaults}
                />
              : <PrintNPSettingsView
                  toggleEditMode={this.toggleEditMode}
                  print={print}
                  printerDefaults={printerDefaults}
                  npPrinterConnectionStatus={npPrinterConnectionStatus}
              />}
          </Card>
        </Col>
      </Row>
    );
  }
}

NativePrintSettingPage.propTypes = {
  printerDefaults: PropTypes.object.isRequired,
  savePrinterDefaults: PropTypes.func.isRequired,
  print: PropTypes.func.isRequired,
  npPrinterConnectionStatus: PropTypes.bool.isRequired,
};

export default NativePrintSettingPage;
