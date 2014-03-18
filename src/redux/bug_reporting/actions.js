const bugReportingActions = {
    
  SHOW_BUG_REPORTING_MODAL: "SHOW_BUG_REPORTING_MODAL",
  HIDE_BUG_REPORTING_MODAL_AND_REMOVE_DATA: "HIDE_BUG_REPORTING_MODAL_AND_REMOVE_DATA",

  UPDATE_SYSTEM_INFORMATION: "UPDATE_SYSTEM_INFORMATION",

  UPLOAD_BUG_REPORTING_IMG_REQUEST: "UPLOAD_BUG_REPORTING_IMG_REQUEST",
  ADD_BUG_REPORTING_IMG_REQUEST_TO_ARRAY: "ADD_BUG_REPORTING_IMG_REQUEST_TO_ARRAY",
  UPLOAD_BUG_REPORTING_IMG_REQUEST_SUCCESS: "UPLOAD_BUG_REPORTING_IMG_REQUEST_SUCCESS",
  UPLOAD_BUG_REPORTING_IMG_REQUEST_FAILURE: "UPLOAD_BUG_REPORTING_IMG_REQUEST_FAILURE",

  SEND_TICKET_REQUEST: "SEND_TICKET_REQUEST",
  SEND_TICKET_REQUEST_SUCCESS: "SEND_TICKET_REQUEST_SUCCESS",
  SEND_TICKET_REQUEST_FAILURE: "SEND_TICKET_REQUEST_FAILURE",
  CHANGE_SEND_TICKET_REQUEST_STATUS: "CHANGE_SEND_TICKET_REQUEST_STATUS",

  showBugReportingModal: () => ({
    type: bugReportingActions.SHOW_BUG_REPORTING_MODAL,
  }),

  hideBugReportingModalAndRemoveData: () => ({
    type: bugReportingActions.HIDE_BUG_REPORTING_MODAL_AND_REMOVE_DATA,
  }),

  updateSystemInformation: systemInformationData => ({
    type: bugReportingActions.UPDATE_SYSTEM_INFORMATION,
    systemInformationData
  }),

  addBugReportingImgRequestToArray: (fileName) => ({
    type: bugReportingActions.ADD_BUG_REPORTING_IMG_REQUEST_TO_ARRAY,
    fileName
  }),

  uploadBugReportingImgRequest: file => ({
    type: bugReportingActions.UPLOAD_BUG_REPORTING_IMG_REQUEST,
    file
  }),

  uploadBugReportingImgRequestSuccess: (fileName, imgURL) => ({
    type: bugReportingActions.UPLOAD_BUG_REPORTING_IMG_REQUEST_SUCCESS,
    fileName,
    imgURL
  }),

  uploadBugReportingImgRequestFailure: fileName => ({
    type: bugReportingActions.UPLOAD_BUG_REPORTING_IMG_REQUEST_FAILURE,
    fileName
  }),

  sendTicketRequest: ticketData => ({
    type: bugReportingActions.SEND_TICKET_REQUEST,
    ticketData
  }),

  sendTicketRequestSuccess: message => ({
    type: bugReportingActions.SEND_TICKET_REQUEST_SUCCESS,
    message
  }),

  sendTicketRequestFailure: message => ({
    type: bugReportingActions.SEND_TICKET_REQUEST_FAILURE,
    message
  }),

  changeSendTicketRequestStatusToSending: () => ({
    type: bugReportingActions.CHANGE_SEND_TICKET_REQUEST_STATUS,
    sendTicketStatus: "execution"
  }),

  changeSendTicketRequestStatusToCompleted: () => ({
    type: bugReportingActions.CHANGE_SEND_TICKET_REQUEST_STATUS,
    sendTicketStatus: "completed"
  }),
}

export default bugReportingActions
  