import { all, takeLatest, put, fork, call } from "redux-saga/effects";

import {
  getSavedConditionNotes,
  saveConditionNote,
  deleteConditionNote,
  reorderConditionNote
} from "../../helpers/apis";
import actions from "./actions";
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* conditionNoteListRequest() {
  yield takeLatest(actions.CONDITION_NOTE_LIST_REQUEST, function*() {
    try {
      const conditionNoteList = yield call(getSavedConditionNotes);
      yield put(actions.fetchConditionNoteListSuccess(conditionNoteList.notes));
    } catch (error) {
      yield put(actions.fetchConditionNoteListError());
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.CONDITION_NOTE_LIST_ERROR
        }
      });
    }
  });
}

export function* saveConditionNoteRequest() {
  yield takeLatest(actions.CONDITION_NOTE_SAVE_REQUEST, function*(payload) {
    const conditionNoteData = {
      ...payload.conditionNotePayload,
      id: payload.conditionNoteId
    };
    const formId = payload.formId;

    try {
      const conditionNoteResponse = yield call(
        saveConditionNote,
        conditionNoteData
      );
      yield put(
        actions.saveConditionNoteSuccess(
          conditionNoteResponse.data
        )
      );
      document.getElementById(formId).reset();
    } catch (error) {
      yield put(actions.saveConditionNoteError());
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.CONDITION_NOTE_SAVE_ERROR
        }
      });
    }
  });
}

export function* deleteConditionNoteRequest() {
  yield takeLatest(actions.CONDITION_NOTE_DELETE_REQUEST, function*(payload) {
    const { conditionNoteId } = payload;

    try {
      yield call(deleteConditionNote, conditionNoteId);
      yield put(actions.deleteConditionNoteSuccess(conditionNoteId));
    } catch (error) {
      yield put(actions.deleteConditionNoteError());
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: actions.CONDITION_NOTE_DELETE_ERROR
        }
      });
    }
  });
}

export function* startEditMode() {
  yield takeLatest(actions.CONDITION_NOTE_EDIT_MODE, function*(payload) {
    const { conditionNoteId } = payload;

    try {
      yield put(actions.startConditionEdit(conditionNoteId));
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "CONDITION_NOTE_EDIT_MODE_ERROR"
        }
      });
    }
  });
}

export function* reorderConditionNoteRequest() {
  yield takeLatest(actions.CONDITION_NOTE_REORDER, function*(payload) {
    try {
      const { error, notes } = yield call(reorderConditionNote, payload.updateConditionNotes);
      if (error) {
        yield put(appActions.apiCallFailed(`Error! ${error}`));
      } else {
        yield put(actions.fetchConditionNoteListSuccess(notes));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Fetching api error"));
      logError(error, {
        tags: {
          exceptionType: "CONDITION_NOTE_REORDER_ERROR"
        }
      });
    }
    yield put(actions.syncLocalConditionNotePriorityClear(payload.updateConditionNotes))
  });
}

export default function* rootSaga() {
  yield all([
    fork(conditionNoteListRequest),
    fork(saveConditionNoteRequest),
    fork(deleteConditionNoteRequest),
    fork(reorderConditionNoteRequest)
  ]);
}
