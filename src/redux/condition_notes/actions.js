const conditionNoteActons = {
  CONDITION_NOTE_LIST_REQUEST: "CONDITION_NOTE_LIST_REQUEST",
  CONDITION_NOTE_LIST_SUCCESS: "CONDITION_NOTE_LIST_SUCCESS",
  CONDITION_NOTE_LIST_ERROR: "CONDITION_NOTE_LIST_ERROR",

  CONDITION_NOTE_SAVE_REQUEST: "CONDITION_NOTE_SAVE_REQUEST",
  CONDITION_NOTE_SAVE_SUCCESS: "CONDITION_NOTE_SAVE_SUCCESS",
  CONDITION_NOTE_SAVE_ERROR: "CONDITION_NOTE_SAVE_ERROR",

  CONDITION_NOTE_DELETE_REQUEST: "CONDITION_NOTE_DELETE_REQUEST",
  CONDITION_NOTE_DELETE_SUCCESS: "CONDITION_NOTE_DELETE_SUCCESS",
  CONDITION_NOTE_DELETE_ERROR: "CONDITION_NOTE_DELETE_ERROR",

  CONDITION_NOTE_EDIT_MODE: "CONDITION_NOTE_EDIT_MODE",

  CONDITION_NOTE_REORDER: "CONDITION_NOTE_REORDER",
  CONDITION_NOTE_UPDATE_LOCAL_PRIORITY: "CONDITION_NOTE_UPDATE_LOCAL_PRIORITY",
  CONDITION_NOTE_SYNC_LOCAL_PRIORITY: "CONDITION_NOTE_SYNC_LOCAL_PRIORITY",
  CONDITION_NOTE_LOCAL_PRIORITY_CLEAR: "CONDITION_NOTE_LOCAL_PRIORITY_CLEAR",

  fetchConditionNoteList: () => ({
    type: conditionNoteActons.CONDITION_NOTE_LIST_REQUEST
  }),

  fetchConditionNoteListSuccess: conditionNoteList => ({
    type: conditionNoteActons.CONDITION_NOTE_LIST_SUCCESS,
    conditionNoteList
  }),

  fetchConditionNoteListError: () => ({
    type: conditionNoteActons.CONDITION_NOTE_LIST_ERROR
  }),

  saveConditionNote: (conditionNotePayload, formId, conditionNoteId) => ({
    type: conditionNoteActons.CONDITION_NOTE_SAVE_REQUEST,
    conditionNotePayload,
    formId,
    conditionNoteId
  }),

  saveConditionNoteSuccess: conditionNote => ({
    type: conditionNoteActons.CONDITION_NOTE_SAVE_SUCCESS,
    conditionNote
  }),

  saveConditionNoteError: () => ({
    type: conditionNoteActons.CONDITION_NOTE_DELETE_ERROR
  }),

  deleteConditionNote: conditionNoteId => ({
    type: conditionNoteActons.CONDITION_NOTE_DELETE_REQUEST,
    conditionNoteId
  }),

  deleteConditionNoteSuccess: conditionNoteId => ({
    type: conditionNoteActons.CONDITION_NOTE_DELETE_SUCCESS,
    conditionNoteId: conditionNoteId
  }),

  deleteConditionNoteError: () => ({
    type: conditionNoteActons.CONDITION_NOTE_DELETE_ERROR
  }),

  startConditionEdit: conditionNoteId => ({
    type: conditionNoteActons.CONDITION_NOTE_EDIT_MODE,
    conditionNoteId
  }),

  syncLocalConditionNotePriority: updateConditionNotes => ({
    type: conditionNoteActons.CONDITION_NOTE_REORDER,
    updateConditionNotes
  }),

  updateLocalConditionPriority: updatedNoteList => ({
    type: conditionNoteActons.CONDITION_NOTE_UPDATE_LOCAL_PRIORITY,
    updatedNoteList
  }),

  syncLocalConditionNotePriorityClear: updatedNoteList => ({
    type: conditionNoteActons.CONDITION_NOTE_LOCAL_PRIORITY_CLEAR,
    updatedNoteList
  })
};
export default conditionNoteActons;
