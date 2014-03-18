import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Card,
  Row
} from "reactstrap";
import PrintALPreview from "./PrintALPreview";
import PrintALSettingsView from "./PrintALSettingsView";
import PrintALSettingsEditForm from "./PrintALSettingsEditForm";
import { al_print } from "../../../../../helpers/print_service/print_systems";

class ALPrintSettingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: null,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.printerDefaults.printer_system !== al_print && prevState.editMode === null) {
      nextProps.setALPrintSystemEditMode(true);
      return {
        editMode: true
      }
    }
    return null;
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { editMode } = nextState;
    const { printerDefaults, setALPrintSystemEditMode } = nextProps;
    if (editMode && printerDefaults.printer_system !== al_print) {
      setALPrintSystemEditMode(true);
    } else {
      setALPrintSystemEditMode(false);
    }
    return true;
  }

  toggleEditMode = () => {
    const { editMode } = this.state;
    this.setState({
      editMode: !editMode,
    });
  };

  render() {
    return (
      <Row>
        <Col xs="6">
          <Card>
            {this.state.editMode
              ? (
                <PrintALSettingsEditForm
                  printerDefaults={this.props.printerDefaults}
                  toggleEditMode={this.toggleEditMode}
                  savePrinterDefaults={this.props.savePrinterDefaults}
                  qzAvaliblePrinters={this.props.qzAvaliblePrinters}
                  qzTrayConnectionStatus={this.props.qzTrayConnectionStatus}
                  setPrinterServiceIsProcessing={this.props.setPrinterServiceIsProcessing}
                />
              )
              : (
                <PrintALSettingsView
                  printerDefaults={this.props.printerDefaults}
                  toggleEditMode={this.toggleEditMode}
                  print={this.props.print}
                  qzTrayConnectionStatus={this.props.qzTrayConnectionStatus}
                />
              )
            }
          </Card>
        </Col>
        <Col xs="6">
          <PrintALPreview printerDefaults={this.props.printerDefaults}/>
        </Col>
      </Row>
    );
  }
}

ALPrintSettingPage.propTypes = {
  printerDefaults: PropTypes.object.isRequired,
  savePrinterDefaults: PropTypes.func.isRequired,
  print: PropTypes.func.isRequired,
  qzAvaliblePrinters: PropTypes.array.isRequired,
  setALPrintSystemEditMode: PropTypes.func.isRequired,
  setPrinterServiceIsProcessing: PropTypes.func.isRequired,
};

export default ALPrintSettingPage;
