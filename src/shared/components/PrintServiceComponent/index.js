import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PrintingQueueProcess from "./printingQueueProcess";
import ALPrint from "./al_print";
import NPPrint from "./native_print";
import printerActions from "../../../redux/print_service/actions";
import settingsActions from "../../../redux/settings/actions";
import appActions from "../../../redux//app/actions";
import { native_print, al_print } from "../../../helpers/print_service/print_systems";
import { logError } from "../../../helpers/utility";

const { fetchPrinterDefaults } = settingsActions;
const { printJobSuccess, clearPrintJobQueue } = printerActions;
const { apiCallFailed } = appActions;

class PrintServiceComponent extends React.Component {
  componentDidMount() {
    this.props.fetchPrinterDefaults();
  }

  onError = (err, msg) => {
    const { apiCallFailed } = this.props;
    apiCallFailed(msg);
    if (err) {
      logError(err, {
        tags: {
          exceptionType: "PRINTING_SYSTEM_ACTION",
          exceptionMSG: msg,
        } 
      })
    }
  }

  render() {
    const {
      qzTrayConnectionStatus,
      npPrinterConnectionStatus,
      printQueue,
      printerDefaults,
      alPrintSystemEditMode,

      printJobSuccess,
      clearPrintJobQueue,
    } = this.props;

    return (
      <React.Fragment>
        {
          (printerDefaults
          && printerDefaults.hasOwnProperty("printer_system")
          && printerDefaults.printer_system === al_print)
          || alPrintSystemEditMode
            ? <ALPrint />
            : ""
        }
        {
          printerDefaults
          && printerDefaults.hasOwnProperty("printer_system")
          && printerDefaults.printer_system === native_print
            ? <NPPrint />
            : ""
        }
        <PrintingQueueProcess
          printJobSuccess={printJobSuccess}
          clearPrintJobQueue={clearPrintJobQueue}
          onError={this.onError}

          qzTrayConnectionStatus={qzTrayConnectionStatus}
          npPrinterConnectionStatus={npPrinterConnectionStatus}
          printQueue={printQueue}
          printerDefaults={printerDefaults}
        />
      </React.Fragment>
    );
  }
}

PrintServiceComponent.propTypes = {
  fetchPrinterDefaults: PropTypes.func.isRequired,
  printJobSuccess: PropTypes.func.isRequired,
  clearPrintJobQueue: PropTypes.func.isRequired,

  qzTrayConnectionStatus: PropTypes.bool.isRequired,
  npPrinterConnectionStatus: PropTypes.bool.isRequired,
  printQueue: PropTypes.array.isRequired,
  printerDefaults: PropTypes.object.isRequired,
};

export default connect(
    state => ({
      qzTrayConnectionStatus: state.PrintService.get("qzTrayConnectionStatus"),
      npPrinterConnectionStatus: state.PrintService.get("npPrinterConnectionStatus"),
      printQueue: state.PrintService.get("printQueue"),
      printerDefaults: state.Settings.get("printerDefaults"),
      alPrintSystemEditMode: state.PrintService.get("alPrintSystemEditMode"),
    }),
    {
      fetchPrinterDefaults,
      printJobSuccess,
      clearPrintJobQueue,
      apiCallFailed
    }
  )(PrintServiceComponent);
