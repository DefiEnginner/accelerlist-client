import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import printerActions from "../../../../redux/print_service/actions";
import { getDymoPrinters, getZebraPrinters } from "../../../../helpers/print_service/utility";

const { setNPPrinterConnectionStatus } = printerActions;

class NativePrint extends React.Component {
  constructor(props) {
    super(props);
    this.stopInterval = false;
    this.state = {
      initialized: false
    };
  };
  componentWillUnmount() {
    this.stopInterval = true;
  }
  checkConnectionStatus = () => {
    const { setNPPrinterConnectionStatus, printerDefaults, npPrinterConnectionStatus } = this.props;
    let printers = null;

    if (printerDefaults && printerDefaults.manufacturer) {
      if (printerDefaults.manufacturer === "Dymo") {
        printers = getDymoPrinters();
      } else if (printerDefaults.manufacturer === "Zebra") {
        printers = getZebraPrinters();
      }
      if (printers) {
        const currentPrinter = printers.find(printer => printer.name === printerDefaults.printer_name);
        if (currentPrinter && currentPrinter.isConnected) {
          if (!npPrinterConnectionStatus) {
            setNPPrinterConnectionStatus(true);
          }
        } else {
          setNPPrinterConnectionStatus(false);
        }
      } else {
        setNPPrinterConnectionStatus(false);
      }
    }
    let timeout = 10000;
    if (printers === null) {
      timeout = 1000;
    }
    if (!this.stopInterval) {setTimeout(this.checkConnectionStatus, timeout);}
  };

  initialize = () => {
    if (!this.props.printerDefaults) {
      return;
    }
    this.setState({
      initialized: false
    })
    if (this.props.printerDefaults.manufacturer === "Zebra") {
      if (!window.jsPrintSetup) {
        // alert("Need Firefox ESR with jsPrintSetup");
        return;
      }
      window.jsPrintSetup.setOption("marginTop", 0);
      window.jsPrintSetup.setOption("marginBottom", 0);
      window.jsPrintSetup.setOption("marginLeft", 0);
      window.jsPrintSetup.setOption("marginRight", 0);

      window.jsPrintSetup.setOption("headerStrLeft", "");
      window.jsPrintSetup.setOption("headerStrCenter", "");
      window.jsPrintSetup.setOption("headerStrRight", "");

      window.jsPrintSetup.setOption("footerStrLeft", "");
      window.jsPrintSetup.setOption("footerStrCenter", "");
      window.jsPrintSetup.setOption("footerStrRight", "");

      window.jsPrintSetup.setOption("scaling", 100);
      window.jsPrintSetup.setOption("shrinkToFit", 1);

      window.jsPrintSetup.definePaperSize(
        99,
        null,
        "customLabel",
        "customLabel",
        "customLabel",
        this.props.printerDefaults.label_width,
        this.props.printerDefaults.label_height,
        "kPaperSizeInches"
      );
      window.jsPrintSetup.setPaperSizeData(99);
    }
    this.setState({
      initialized: true
    })
  };

  componentDidMount() {
    this.initialize();
    this.checkConnectionStatus();
  }

  render() {
    if (
      this.props.printerDefaults &&
      this.props.printerDefaults.manufacturer === "Zebra"
    ) {
      return (
        <iframe
          title="print_helper"
          id="print_helper"
          name="print_helper"
          width="0"
          height="0"
          frameBorder="0"
          src="about:blank"
        />
      );
    }
    return null;
  }
}

NativePrint.propTypes = {
  setNPPrinterConnectionStatus: PropTypes.func.isRequired,
  npPrinterConnectionStatus: PropTypes.bool.isRequired,
  printerDefaults: PropTypes.object.isRequired,
};

export default connect(
    state => ({
      printerDefaults: state.Settings.get("printerDefaults"),
      npPrinterConnectionStatus: state.PrintService.get("npPrinterConnectionStatus"),
    }),
    {
      setNPPrinterConnectionStatus,
    }
  )(NativePrint);
