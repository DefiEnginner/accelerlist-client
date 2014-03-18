import { all, takeEvery, takeLatest, put, fork, call } from "redux-saga/effects";
import { config } from "../../config/aws_s3_config";
import S3Client from 'aws-s3';
import actions from "./actions";
import appActions from "../app/actions";
import { postBugReportAPI } from "../../helpers/bug_reporting_apis";
import { logError } from "../../helpers/utility";

export function* UploadBugReportingImgRequest() {
  yield takeEvery(actions.UPLOAD_BUG_REPORTING_IMG_REQUEST, function*(payload) {
    const {
      file
    } = payload;
    try {
      yield put(actions.addBugReportingImgRequestToArray(file.name));

      const response = yield S3Client.uploadFile(file, config);
      if (response && response.result.ok) {
        yield put(actions.uploadBugReportingImgRequestSuccess(file.name, response.location));
      }
    } catch (error) {
      yield put(actions.uploadBugReportingImgRequestFailure(file.name));
      yield put(appActions.apiCallFailed(`Error! Upload image error: ${error.statusText}`));
      logError(error, {
        tags: {
          exceptionType: actions.UPLOAD_BUG_REPORTING_IMG_REQUEST_FAILURE
        }
      });
    }
  });
}

export function* SendTicketRequest() {
  yield takeEvery(actions.SEND_TICKET_REQUEST, function*(payload) {
    const { ticketData } = payload;
    const ticketBody = {
      operating_system: ticketData.systemInformation.operating_system,
      ticker_time: ticketData.systemInformation.ticket_time,
      bug_video_link: ticketData.bugVideoLink,
      description_of_bug: ticketData.descriptionOfBug,
      os_version: ticketData.systemInformation.os_version,
      browser_version: ticketData.systemInformation.browser_version,
      printer_type: ticketData.systemInformation.printer_type,
      images: ticketData.images,
      printer_model: ticketData.systemInformation.printer_model,
      user_email: ticketData.systemInformation.user_email,
      browser: ticketData.systemInformation.browser
    }
    try {
      yield put(actions.changeSendTicketRequestStatusToSending());
      const result = yield call(postBugReportAPI, ticketBody);
      if (result.status === 200 && result.data.msg) {
        yield put(actions.sendTicketRequestSuccess("The ticket successfully submitted!"));
      }
      if (result.status === 200 && result.data.error) {
        yield put(actions.sendTicketRequestFailure(result.data.error));
      }
    } catch (error) {
      yield put(actions.changeSendTicketRequestStatusToCompleted());
      yield put(actions.sendTicketRequestFailure(error));
      yield put(appActions.apiCallFailed(`Error! Send ticket error: ${error}`));
      logError(error, {
        tags: {
          exceptionType: actions.SEND_TICKET_REQUEST_FAILURE
        }
      });
    }
  });
}

export function* SendTicketRequestSuccess() {
  yield takeLatest(actions.SEND_TICKET_REQUEST_SUCCESS, function*(payload) {
    const { message } = payload;
    try {
      yield put(actions.hideBugReportingModalAndRemoveData());
      yield put(appActions.apiCallUserSuccess(message));
      yield put(actions.changeSendTicketRequestStatusToCompleted());
    } catch (error) {
      logError(error, {
        tags: {
          exceptionType: actions.SEND_TICKET_REQUEST_FAILURE
        }
      });
    }
  });
}

export function* SendTicketRequestFailure() {
  yield takeLatest(actions.SEND_TICKET_REQUEST_FAILURE, function*(payload) {
    const { message } = payload;
    try {
      yield put(actions.hideBugReportingModalAndRemoveData());
      yield put(appActions.apiCallUserError(message));
      yield put(actions.changeSendTicketRequestStatusToCompleted());
    } catch (error) {
      logError(error, {
        tags: {
          exceptionType: actions.SEND_TICKET_REQUEST_FAILURE
        }
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(UploadBugReportingImgRequest),
    fork(SendTicketRequest),
    fork(SendTicketRequestSuccess),
    fork(SendTicketRequestFailure)
  ]);
}
