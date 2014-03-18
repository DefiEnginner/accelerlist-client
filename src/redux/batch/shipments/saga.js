import { delay } from 'redux-saga';
import {
  all,
  takeEvery,
  takeLatest,
  put,
  fork,
  call,
  select,
} from "redux-saga/effects";
import { push } from "react-router-redux";
import assign from 'lodash/assign';
import { logError } from "../../../helpers/utility";
import {
  createShipmentPlansAPI,
  getShipmentPlanCreationStatusAPI,
} from "../../../helpers/batch/apis";
import { batchIdSelector } from "../selector";
import actions from "../actions";

export function* createShipmentPlans() {
  yield takeEvery(actions.CREATE_SHIPMENT_PLANS, function*(payload) {
    try {
      let { products, params } = payload;
      let data = {
        products
      };
      data = assign(data, params);

      yield put(actions.setCreateShipmentPlansRequestStatusToExecution());
      const response = yield call(createShipmentPlansAPI, data);
      if (!response.status === 200 || response.data.error) {
        yield put(actions.createShipmentPlansFailure());
        yield put(actions.resetCreateShipmentPlansRequestStatus());
        yield put(
          actions.showAlert(
            "Error!",
            "Failed to create inbound shipment plans. Error: " +
              response.data.error
          )
        );
      } else {
        yield put(actions.createShipmentPlansStatus(response.data.job_id));
      }
    } catch (err) {
      yield put(actions.resetCreateShipmentPlansRequestStatus());
      yield put(actions.createShipmentPlansFailure());
      yield put(actions.showAlert("Error!", "Unable to Preview Shipment Plans"));
      logError(err, {
        tags: {
          exceptionType: actions.CREATE_SHIPMENT_PLANS_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* pollShipmentCreationStatus() {
  yield takeEvery(actions.CREATE_SHIPMENT_PLANS_STATUS, function*(payload) {
    try {
      let { jobId } = payload;
      let data = {
        job_id: jobId
      };
      const response = yield call(getShipmentPlanCreationStatusAPI, data);
      if (!response.status === 200 || response.data.error) {
        if (response.data.error === "Job has not finished processing") {
          yield call(delay, 1000);
          yield put(actions.createShipmentPlansStatus(jobId))
        } else {
          yield put(actions.createShipmentPlansFailure());
          yield put(actions.resetCreateShipmentPlansRequestStatus());
          yield put(
            actions.showAlert(
              "Error!",
              "Failed to retrieve inbound shipment creation status. Error: " +
                response.data.error
            )
          );
        }
      } else {
        yield put(
          actions.createShipmentPlansSuccess(
            response.data.output.inbound_shipment_plans
          )
        );
        yield put(actions.setCreateShipmentPlansRequestStatusToComplete());
        yield put(actions.setCurrentFlow('shipment_plans_display'));
      }
    } catch (err) {
      yield put(actions.resetCreateShipmentPlansRequestStatus());
      yield put(actions.createShipmentPlansFailure());
      yield put(actions.showAlert("Error!", "Failed to retrieve inbound shipment creation status."));
      logError(err, {
        tags: {
          exceptionType: "CREATE_SHIPMENT_PLANS_STATUS_ERROR",
          batchId: yield select(batchIdSelector),
        }
      });
    }
  });
}

export function* rejectShipmentPlans() {
  yield takeLatest(actions.REJECT_SHIPMENT_PLANS, function*(payload) {
      let { batchId } = payload;
      yield put(actions.rejectShipmentPlansSuccess());
	  yield put(push("/dashboard/batch/" + batchId));
  });
}

export default function* rootSaga() {
  yield all([
    fork(createShipmentPlans),
    fork(pollShipmentCreationStatus),
    fork(rejectShipmentPlans),
  ]);
}
