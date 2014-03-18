import React, { Component } from "react";
import { connect } from "react-redux";
import { bool, func, array, object } from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import SystemInformation from "./SystemInformation";
import InputWebForm from "./InputWebForm";

import bugReportingActions from "../../../redux/bug_reporting/actions";

class BugReportingModal extends Component {
  state = {
    sendTicketConfirmation: false
  }
  static props = {
    bugReportingModalVisible: bool,
    hideBugReportingModalAndRemoveData: func,
    sendTicketRequest: func,
    bugReportingImages: array,
    systemInformation: object
  }

  closeModal = () => {
    this.setState({
      sendTicketConfirmation: false
    })
    this.props.hideBugReportingModalAndRemoveData();
  }

  sendTicketToExecution = (descriptionOfBug, bugVideoLink) => {
    const { sendTicketConfirmation } = this.state;
    const {
      systemInformation,
      bugReportingImages
    } = this.props;

    const imgArray = bugReportingImages.map(el => el.url);

    const ticketData = {
      systemInformation: systemInformation,
      descriptionOfBug: descriptionOfBug,
      bugVideoLink: bugVideoLink,
      images: imgArray
    };

    if (imgArray.length === 0 || bugVideoLink === "") {
      if (sendTicketConfirmation){
        this.sendTicketRequest(ticketData);
      } else {
        this.setState({
          sendTicketConfirmation: true
        })
      }
    } else {
      this.sendTicketRequest(ticketData);
    }
  }

  sendTicketRequest = (ticketData) => {
    this.props.sendTicketRequest(ticketData);
    this.setState({
      sendTicketConfirmation: false
    })
  } 

  render() {
    const { bugReportingModalVisible } = this.props;
    const { sendTicketConfirmation } = this.state;
    return (
      <Modal
        isOpen={bugReportingModalVisible}
        toggle={this.closeModal}
        size="lg"
        style={{ maxWidth:'1200px' }}
      >
        <ModalHeader toggle={this.closeModal}>
          Bug reporting form
        </ModalHeader>
        <ModalBody>
          <SystemInformation />
          <hr />
          <InputWebForm 
            sendTicketToExecution={this.sendTicketToExecution}
            sendTicketConfirmation={sendTicketConfirmation}
          />
        </ModalBody>
      </Modal>
    );
  }
}

export default connect(
  state => ({
    bugReportingModalVisible: state.BugReporting.get("bugReportingModalVisible"),
    bugReportingImages: state.BugReporting.get("bugReportingImages"),
    systemInformation: state.BugReporting.get("systemInformation")
  }),
  bugReportingActions
)(BugReportingModal);
