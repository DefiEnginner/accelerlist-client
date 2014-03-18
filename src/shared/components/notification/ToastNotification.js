import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import Sound from 'react-sound'
import 'react-toastify/dist/ReactToastify.css'

import appActions from '../../../redux/app/actions'
import errorSound from '../../../assets/error.mp3'
import successSound from "../../../assets/success.mp3";

const { resetApiCallStatus } = appActions

class ToastNotification extends Component {
  state = {
    soundPlayStatus: 'STOPPED',
    sound: ""
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { resetApiCallStatus } = this.props

    if (nextProps.apiCallError) {
      toast(nextProps.apiErrorMessage, {
        type: 'error'
      })
      this.setState({
        soundPlayStatus: 'PLAYING',
        sound: errorSound
      })
      resetApiCallStatus()
    }
    if (nextProps.apiCallSuccess) {
      toast(nextProps.apiSuccessMessage, {
        type: 'success'
      })
      this.setState({
        soundPlayStatus: 'PLAYING',
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
        <ToastContainer autoClose={8000} />
        <Sound
          url={sound}
          playStatus={soundPlayStatus}
          onFinishedPlaying={() => { this.setState({ soundPlayStatus: 'STOPPED' }) }}
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    apiCallSuccess: state.App.get('apiCallSuccess'),
    apiSuccessMessage: state.App.get('apiSuccessMessage'),
    apiCallError: state.App.get('apiCallError'),
    apiErrorMessage: state.App.get('apiErrorMessage')
  }),
  { resetApiCallStatus }
)(ToastNotification)