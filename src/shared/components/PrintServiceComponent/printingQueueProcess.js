import React from "react";
import PropTypes from "prop-types";
import { alPrint } from "./al_print/print_function";
import { nativePrint } from "./native_print/print_function";
import { native_print, al_print } from "../../../helpers/print_service/print_systems";

class PrintingQueueProcess extends React.Component {
  constructor(props) {
    super(props);
    this.currentJobId = null;
    this.state = {
      firstStart: true
    }
  }

  shouldComponentUpdate(nextProps) {
    const { qzTrayConnectionStatus, printQueue, clearPrintJobQueue, printerDefaults, npPrinterConnectionStatus } = nextProps;
    const { firstStart } = this.state;

    if (firstStart) {
      this.setState({
        firstStart: false
      });
      return false;
    }

    if (printerDefaults
      && printerDefaults.hasOwnProperty("printer_system")
      && printerDefaults.printer_system === al_print
      && !qzTrayConnectionStatus) {
        clearPrintJobQueue();
        return false;
    }

    if (printerDefaults
      && printerDefaults.hasOwnProperty("printer_system")
      && printerDefaults.printer_system === native_print
      && !npPrinterConnectionStatus) {
        clearPrintJobQueue();
        return false;
    }

    if ((printQueue && Array.isArray(printQueue) && printQueue.length > 0) && printQueue[0].id !== this.currentJobId) {
      return true;
    } else {
      return false;
    }

  }

  componentDidUpdate() {
    const { firstStart } = this.state;
    if (!firstStart) {
      this.print();
    }
  }

  setCurrentJobId = (id) => {
    this.currentJobId = id;
  }

  print = () => {
    const { printerDefaults, printQueue, clearPrintJobQueue, printJobSuccess, onError } = this.props;
    if (!!printerDefaults
      && printerDefaults.hasOwnProperty("printer_system")
      && printerDefaults.printer_system === al_print) {
        alPrint(
          printQueue,
          printerDefaults,
          clearPrintJobQueue,
          printJobSuccess,
          this.currentJobId,
          this.setCurrentJobId, onError
        );
    }
    if (!!printerDefaults
      && printerDefaults.hasOwnProperty("printer_system")
      && printerDefaults.printer_system === native_print) {
        nativePrint(
          printQueue,
          printerDefaults,
          clearPrintJobQueue,
          printJobSuccess,
          this.currentJobId,
          this.setCurrentJobId,
          onError
        );
    }
  }

  render() {
    return null;
  }
}

PrintingQueueProcess.propTypes = {
  printJobSuccess: PropTypes.func.isRequired,
  clearPrintJobQueue: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,

  qzTrayConnectionStatus: PropTypes.bool.isRequired,
  npPrinterConnectionStatus: PropTypes.bool.isRequired,
  printQueue: PropTypes.array.isRequired,
  printerDefaults: PropTypes.object.isRequired,
};

export default PrintingQueueProcess;
