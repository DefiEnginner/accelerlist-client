import React, { Component } from "react";
import ToastNotification from "./ToastNotification";
import AlertNotification from "./AlertNotification";
import SoundNotification from "./SoundNotification";

class Notification extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastNotification />
        <AlertNotification />
        <SoundNotification />
      </React.Fragment>
    )
  }
}
export default Notification;