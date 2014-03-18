import {
    Map
} from 'immutable/dist/immutable'
import actions from './actions'

const initialState = new Map({
  bugReportingModalVisible: false,
  systemInformation: {},
  bugReportingImages: [],
  sendTicketStatus: null
})

export default function bugReportingReducer(state = initialState, action) {
    switch (action.type) {
      case actions.SHOW_BUG_REPORTING_MODAL:
        return state
          .set('bugReportingModalVisible', true)

      case actions.HIDE_BUG_REPORTING_MODAL_AND_REMOVE_DATA:
        return initialState;

      case actions.UPDATE_SYSTEM_INFORMATION:
        return state
          .set('systemInformation', action.systemInformationData)

      case actions.UPLOAD_BUG_REPORTING_IMG_REQUEST_SUCCESS:{
        return state.update("bugReportingImages", (bugReportingImages) => {
          const fileData = {
            fileName: action.fileName,
            url: action.imgURL,
            status: "loaded"
          };
          const fileIndex = bugReportingImages.findIndex(element => {
            return element.fileName === action.fileName;
          })
          if (fileIndex > -1) {
            return [
              ...bugReportingImages.slice(0, fileIndex),
              fileData,
              ...bugReportingImages.slice(fileIndex + 1)
            ]
          }
          return bugReportingImages;
        });
      }

      case actions.ADD_BUG_REPORTING_IMG_REQUEST_TO_ARRAY:{
        return state.update("bugReportingImages", (bugReportingImages) => {
          let sameFile = false;
          const fileData = {
            fileName: action.fileName,
            url: null,
            status: 'loading'
          };
          
          bugReportingImages.forEach( element => {
            if (element.fileName === action.fileName) {
              sameFile = true;
              return true;
            }
          })
          if (!sameFile) {
            return [...bugReportingImages, fileData]
          } else {
            return bugReportingImages;
          }
        });
      }
      
      case actions.UPLOAD_BUG_REPORTING_IMG_REQUEST_FAILURE:{
        return state.update("bugReportingImages", (bugReportingImages) => {
          const fileData = {
            fileName: action.fileName,
            url: null,
            status: "failure"
          };
          const fileIndex = bugReportingImages.findIndex(element => {
            return element.fileName === action.fileName;
          })
          if (fileIndex > -1) {
            return [
              ...bugReportingImages.slice(0, fileIndex),
              fileData,
              ...bugReportingImages.slice(fileIndex + 1)
            ]
          }
          return bugReportingImages;
        });
      }

      case actions.CHANGE_SEND_TICKET_REQUEST_STATUS:
        return state
          .set('sendTicketStatus', action.sendTicketStatus)

      default:
        return state
    }
}