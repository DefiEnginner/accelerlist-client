import React, { Component } from "react";
import { connect } from "react-redux";
import Sound from "react-sound";
import "react-toastify/dist/ReactToastify.css";

import appActions from "../../../redux/app/actions";
import successSound from "../../../assets/success.mp3";

const { resetApiCallStatus } = appActions

class SoundNotification extends Component {
  state = {
    soundPlayStatus: "STOPPED",
    sound: ""
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { resetApiCallStatus } = this.props

    if (nextProps.apiCallUserSoundNotificationSuccess) {
      this.setState({
        soundPlayStatus: "PLAYING",
        sound: successSound
      })
      resetApiCallStatus()
    }
    return true
  }

  render() {
    const { soundPlayStatus, sound } = this.state

    return (
      <div>
        <Sound
          url={sound}
          playStatus={soundPlayStatus}
          onFinishedPlaying={() => { this.setState({ soundPlayStatus: "STOPPED" }) }}
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    apiCallUserSoundNotificationSuccess: state.App.get("apiCallUserSoundNotificationSuccess")
  }),
  { resetApiCallStatus }
)(SoundNotification)