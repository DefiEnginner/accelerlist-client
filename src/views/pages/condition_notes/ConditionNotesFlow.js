import React from "react";
import ConditionNote from "./ConditionNote";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { CardBody } from "reactstrap";
import PropTypes from 'prop-types';

class ConditionNotesFlow extends React.Component {
  state = {
    noteList: []
  }
  static getDerivedStateFromProps(newProps, state) {
    let noteList = newProps.filteredconditionNoteList;

    if (noteList.length > 0){
      noteList.sort((a, b) => {
        return (a.priority > b.priority) ? -1 : (a.priority < b.priority) ? 1 : 0;
      })
    }

    return {
      noteList: noteList
    }
  }
  switchPriority = (targetIndex, sourceIndex) => {
    let updatedNoteList = this.state.noteList.slice();
    let priorityList = this.state.noteList.map(a=>a.priority).sort().reverse();

    updatedNoteList.splice(targetIndex, 0, ...updatedNoteList.splice(sourceIndex, 1))

    updatedNoteList = updatedNoteList.map((note, index) => {
      note.priority = priorityList[index];
      return {
        id: note.id,
        priority: note.priority
      };
    });
    if (this.timeoutReference) {
      clearTimeout(this.timeoutReference)
    }
    this.timeoutReference = setTimeout(this.props.syncLocalConditionNotePriority, 1500);
    this.props.updateLocalConditionPriority(updatedNoteList);
  }
  delayPrioritySync = () => {
    if (this.timeoutReference) {
      clearTimeout(this.timeoutReference)
    }
    this.timeoutReference = setTimeout(this.props.syncLocalConditionNotePriority, 1500);
  }
  render() {
    const { noteList } = this.state;

    return (
      <CardBody>
        <div className="row">
            {noteList.map((note, idx) => {
                return (                        
                  <ConditionNote
                    key={note.id}
                    note={note}
                    index={idx}
                    editingId={this.props.editingId}
                    deletingId={this.props.deletingId}
                    removeNote={this.props.removeNote}
                    editNote={this.props.editNote}
                    switchPriority={this.switchPriority}
                    delayPrioritySync={this.delayPrioritySync}
                  />
                )
            })}
        </div>
      </CardBody>
    )
  }
}

ConditionNotesFlow.propTypes = {
  filteredConditionNoteList: PropTypes.array,
  syncLocalConditionNotePriority: PropTypes.func,
  updateLocalConditionPriority: PropTypes.func,
};

export default DragDropContext(HTML5Backend)(ConditionNotesFlow);