import { Map } from "immutable/dist/immutable";
import actions from "./actions";

const initState = new Map({
  conditionNoteList: null,
  conditionNoteListError: null,
  conditionNoteSaveError: null,
  conditionNoteDeleteError: null,
  loadingList: false,
  savingConditionNote: false,
  editingId: null,
  deletingId: null,
  conditionNoteLocalPriorityList: []
});

export default function conditionNoteReducer(state = initState, action) {
  switch (action.type) {
    case actions.CONDITION_NOTE_LIST_REQUEST:
      return state.set("conditionNoteListError", null).set("loadingList", true);
    case actions.CONDITION_NOTE_LIST_SUCCESS:
      return state
        .set("conditionNoteList", action.conditionNoteList)
        .set("conditionNoteListError", false)
        .set("loadingList", false);
    case actions.CONDITION_NOTE_LIST_ERROR:
      return state
        .set("conditionNoteListError", true)
        .set("loadingList", false);
    case actions.CONDITION_NOTE_SAVE_REQUEST:
      return state
        .set("conditionNoteSaveError", null)
        .set("savingConditionNote", true);
    case actions.CONDITION_NOTE_SAVE_SUCCESS:
      return state
        .update("conditionNoteList", conditionNoteList => {
          const newConditionNote = [action.conditionNote];
          if (conditionNoteList === null) {
            return newConditionNote;
          } else if (state.get("editingId")) {
            const updateIndex = conditionNoteList.findIndex(conditionNote => {
              return conditionNote.id === state.get("editingId");
            });
            if (updateIndex > -1) {
              return [
                ...conditionNoteList.slice(0, updateIndex),
                action.conditionNote,
                ...conditionNoteList.slice(updateIndex + 1)
              ];
            }
          }

          return newConditionNote.concat(conditionNoteList);
        })
        .set("conditionNoteSaveError", false)
        .set("savingConditionNote", false)
        .set("editingId", null);
    case actions.CONDITION_NOTE_SAVE_ERROR:
      return state
        .set("conditionNoteSaveError", true)
        .set("savingConditionNote", false)
        .set("editingId", null);
    case actions.CONDITION_NOTE_DELETE_REQUEST:
      return state
        .set("conditionNoteDeleteError", null)
        .set("deletingId", action.conditionNoteId);
    case actions.CONDITION_NOTE_DELETE_SUCCESS:
      return state
        .update("conditionNoteList", conditionNoteList => {
          const deleteIndex = conditionNoteList.findIndex(conditionNote => {
            return conditionNote.id === state.get("deletingId");
          });
          if (deleteIndex > -1) {
            return [
              ...conditionNoteList.slice(0, deleteIndex),
              ...conditionNoteList.slice(deleteIndex + 1)
            ];
          }
          return conditionNoteList;
        })
        .set("conditionNoteDeleteError", false)
        .set("deletingId", null);
    case actions.CONDITION_NOTE_DELETE_ERROR:
      return state
        .set("conditionNoteDeleteError", true)
        .set("deletingId", null);
    case actions.CONDITION_NOTE_EDIT_MODE:
      return state.set("editingId", action.conditionNoteId);
    case actions.CONDITION_NOTE_UPDATE_LOCAL_PRIORITY:
      return state
        .update("conditionNoteLocalPriorityList", conditionNoteLocalPriorityList => {
          const updateIds = conditionNoteLocalPriorityList.map(note => note.id)
          return [...action.updatedNoteList, ...conditionNoteLocalPriorityList.filter(
              note => {
                return updateIds.indexOf(note.id) === -1;
              }
            )];
        })
    case actions.CONDITION_NOTE_LOCAL_PRIORITY_CLEAR:
      return state
        .update("conditionNoteLocalPriorityList", conditionNoteLocalPriorityList => {
          const priorityList = conditionNoteLocalPriorityList.slice();
          action.updatedNoteList.forEach(note => {
            const existingIndex = priorityList.lastIndexOf(note);
            if (existingIndex > -1) {
              priorityList.splice(existingIndex, 1);
            }
          });
          return priorityList
        })
    default:
      return state;
  }
}
