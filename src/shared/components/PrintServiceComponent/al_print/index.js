import React from "react";
import PropTypes from "prop-types";
import qz from "qz-tray";
import * as sha256 from 'js-sha256';
import { KEYUTIL, KJUR, stob64, hextorstr } from "jsrsasign";
import { connect } from "react-redux";
import { qzDigitalCertificate, qzPrivateKey } from "../../../../config/qz_tray";
import printerActions from "../../../../redux/print_service/actions";

const { setQzTrayConnectionStatus, setQzAvaliblePrintersList } = printerActions;

class ALPrint extends React.Component {
  constructor(props) {
    super(props);
    this.stopInterval = false;
  }
  componentWillUnmount(){
    this.stopInterval = true;
  }

  checkConnectionStatus = () => {
    const { qzTrayConnectionStatus, setQzTrayConnectionStatus } = this.props;
    const connectionStatus = qz.websocket.isActive();

    if (!connectionStatus) {
      if (qzTrayConnectionStatus) {
        setQzTrayConnectionStatus(false);
      }
      this.initialize();
    }
    let timeout = 10000;
    if (!qzTrayConnectionStatus) {
      timeout = 1000;
    }
    if (!this.stopInterval) {setTimeout(this.checkConnectionStatus, timeout);}
  };

  initialize = () => {
    const {
      setQzTrayConnectionStatus,
      setQzAvaliblePrintersList,
     } = this.props;
    const connectionStatus = qz.websocket.isActive();

    if (connectionStatus) {
      return;
    } else {
      qz.api.setSha256Type(function(data) { return sha256(data); });
      qz.security.setCertificatePromise((resolve) => {
        resolve(qzDigitalCertificate);
      });
      qz.security.setSignaturePromise((toSign) => {
          return (resolve) => {
            const pk = KEYUTIL.getKey(qzPrivateKey);
            const sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
            sig.init(pk); 
            sig.updateString(toSign);
            var hex = sig.sign();
            resolve(stob64(hextorstr(hex)));
          };
      });
      qz.websocket.connect({retries: 0}).then(() => {
        setQzTrayConnectionStatus(true);
        qz.printers.find().then((printersArray) => {
          setQzAvaliblePrintersList(printersArray);
        });
      });
    }
  };

  componentDidMount() {
    this.initialize();
    this.checkConnectionStatus();
  }

  render() {
    return null;
  }
}

ALPrint.propTypes = {
  setQzTrayConnectionStatus: PropTypes.func.isRequired,
  setQzAvaliblePrintersList: PropTypes.func.isRequired,

  qzTrayConnectionStatus: PropTypes.bool.isRequired,
  printerDefaults: PropTypes.object.isRequired,
};

export default connect(
    state => ({
      qzTrayConnectionStatus: state.PrintService.get("qzTrayConnectionStatus"),
      printerDefaults: state.Settings.get("printerDefaults"),
    }),
    {
      setQzTrayConnectionStatus,
      setQzAvaliblePrintersList,
    }
  )(ALPrint);
