import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Col,
  Card,
  CardBody,
  CardTitle,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import classnames from "classnames";
import FaSpinner from "react-icons/lib/fa/spinner";
import ALPrintSettingPage from "./al_print";
import NativePrintSettingPage from "./native_print";
import settingsActions from "../../../../redux/settings/actions";
import printerActions from "../../../../redux/print_service/actions";
import { native_print, al_print } from "../../../../helpers/print_service/print_systems";

const {
  fetchPrinterDefaults,
  savePrinterDefaults,
} = settingsActions;

const {
  print,
  setALPrintSystemEditMode,
  setPrinterServiceIsProcessing
} = printerActions;

class PrinterDefaultsQz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "",
    };
  }
  componentDidMount() {
    this.props.fetchPrinterDefaults();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let activeTab = prevState.activeTab;

    if (nextProps.printerDefaults
        && nextProps.printerDefaults.hasOwnProperty("printer_system")
        && nextProps.printerDefaults.printer_system
        && !prevState.activeTab) {
          activeTab = nextProps.printerDefaults.printer_system;
    }
    return {
      activeTab
    };
  }

  toggle(tab) {
    this.setState({
      activeTab: tab
    })
  }
  loadingSpinner = () => {
    return (
      <div className="spinner-container"><span><FaSpinner className="fa-spin" size="50px"/>&nbsp;</span></div>
    );
  }
  render() {
    const {
      savePrinterDefaults,
      print,
      setALPrintSystemEditMode,
      setPrinterServiceIsProcessing,

      printerDefaults,
      qzAvaliblePrinters,
      printerDefaultsAreProcessing,
      qzTrayConnectionStatus,
      npPrinterConnectionStatus,
      printerServiceIsProcessing,
    } = this.props;
    const { activeTab } = this.state;
    return (
      <Row className="mb-4 printer-settings">
        <Col>
          <Card>
            {(printerDefaultsAreProcessing || printerServiceIsProcessing) && this.loadingSpinner()}
            <CardBody>
              <CardTitle>Printer Settings</CardTitle>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === native_print })}
                    onClick={() => { this.toggle(native_print); }}
                  >
                    Native Print
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === al_print })}
                    onClick={() => { this.toggle(al_print); }}
                  >
                    Acceler Print
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId={native_print}>
                  <br />
                  {activeTab === native_print && (
                    <NativePrintSettingPage
                      printerDefaults={printerDefaults}
                      savePrinterDefaults={savePrinterDefaults}
                      print={print}
                      npPrinterConnectionStatus={npPrinterConnectionStatus}
                    />
                  )}
                </TabPane>
                <TabPane tabId={al_print}>
                  <br />
                  {activeTab === al_print && (
                    <ALPrintSettingPage
                      printerDefaults={printerDefaults}
                      savePrinterDefaults={savePrinterDefaults}
                      print={print}
                      qzAvaliblePrinters={qzAvaliblePrinters}
                      qzTrayConnectionStatus={qzTrayConnectionStatus}
                      setALPrintSystemEditMode={setALPrintSystemEditMode}
                      setPrinterServiceIsProcessing={setPrinterServiceIsProcessing}
                    />
                  )}
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

PrinterDefaultsQz.propTypes = {
  fetchPrinterDefaults: PropTypes.func.isRequired,
  printerDefaults: PropTypes.object.isRequired,
  savePrinterDefaults: PropTypes.func.isRequired,
  print: PropTypes.func.isRequired,
  qzAvaliblePrinters: PropTypes.array.isRequired,
  printerDefaultsAreProcessing: PropTypes.bool.isRequired,
  npPrinterConnectionStatus: PropTypes.bool.isRequired,
  setALPrintSystemEditMode: PropTypes.func.isRequired,
  printerServiceIsProcessing: PropTypes.bool.isRequired,
  setPrinterServiceIsProcessing: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  printerDefaults: state.Settings.get("printerDefaults"),
  printerDefaultsAreProcessing: state.Settings.get("printerDefaultsAreProcessing"),
  qzAvaliblePrinters: state.PrintService.get("qzAvaliblePrinters"),
  qzTrayConnectionStatus: state.PrintService.get("qzTrayConnectionStatus"),
  npPrinterConnectionStatus: state.PrintService.get("npPrinterConnectionStatus"),
  printerServiceIsProcessing: state.PrintService.get("printerServiceIsProcessing"),
});

export default connect(
  mapStateToProps,
  {
    fetchPrinterDefaults,
    savePrinterDefaults,
    print,
    setALPrintSystemEditMode,
    setPrinterServiceIsProcessing
  }
  
)(PrinterDefaultsQz);
