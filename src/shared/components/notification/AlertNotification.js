import React, { Component } from "react";
import { connect } from "react-redux";
import { func, string } from "prop-types";
import Sound from "react-sound";
import SweetAlert from "sweetalert2-react";

import appActions from "../../../redux/app/actions";
import errorSound from "../../../assets/error.mp3";
import successSound from "../../../assets/success.mp3";

class AlertNotification extends Component {
  static propTypes = {
    resetApiCallStatus: func,
    userErrorMessage: string,
    userSuccessMessage: string
  }

  render() {
    const { 
      userErrorMessage,
      userWarningMessage,
      resetApiCallStatus,
      userSuccessMessage,
    } = this.props;

    return (
      <React.Fragment>
        <SweetAlert
          show={userErrorMessage.length > 0}
          type={"error"}
          title={"Server Error"}
          text={userErrorMessage}
          confirmButtonColor={"#3085d6"}
          onConfirm={resetApiCallStatus}
        />
        <SweetAlert
          show={userWarningMessage.length > 0}
          type={"warning"}
          title={"Warning!"}
          text={userWarningMessage}
          confirmButtonColor={"#3085d6"}
          onConfirm={resetApiCallStatus}
        />
        <SweetAlert
          show={userSuccessMessage.length > 0}
          type={"success"}
          title={"Request Complete"}
          text={userSuccessMessage}
          confirmButtonColor={"#3085d6"}
          onConfirm={resetApiCallStatus}
        />
        <Sound
          url={(userErrorMessage.length > 0 || userWarningMessage.length > 0) ? errorSound : successSound}
          playStatus={(userErrorMessage.length > 0 || userWarningMessage.length > 0) ? 'PLAYING' : 'STOPPED'}
        /> 
      </React.Fragment>

    )
  }
}
export default connect(
  state => ({
    userErrorMessage: state.App.get('userErrorMessage'),
    userWarningMessage: state.App.get('userWarningMessage'),
    userSuccessMessage: state.App.get('userSuccessMessage'),
  }),
  appActions
)(AlertNotification);