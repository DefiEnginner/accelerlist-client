import React from "react";
import { Card, CardBody } from "reactstrap";
import { object, number, func } from "prop-types";
import IconTrash from "react-icons/lib/fa/trash-o";
import IconPencil from "react-icons/lib/fa/pencil";
import { DropTarget, DragSource } from "react-dnd";
import flow from 'lodash/flow';

const Types = {
  NOTE: 'note'
};

const conditionNoteSource = {
  beginDrag(props) {
    return {
      index: props.index,
      category: props.note.category
    };
  }
};

const conditionNoteTarget = {
  hover(props, monitor) {
    const targetIndex = props.index;
    const sourceIndex = monitor.getItem().index;

    if (props.isDragging) {
      props.delayPrioritySync()
    }

    if (targetIndex === sourceIndex) {
      return;
    }
    props.switchPriority(targetIndex, sourceIndex);
    monitor.getItem().index = targetIndex;
  }
};

const collectSource = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const collectTarget = (connect) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class ConditionNote extends React.Component {
  static propTypes = {
    note: object,
    index: number,
    editingId: number,
    deletingId: number,
    removeNote: func,
    editNote: func,
    switchPriority: func,
    delayPrioritySync: func
  }
  render() {
    const { 
      isDragging,
      connectDragSource,
      connectDropTarget,
      note,
      editingId,
      deletingId,
      removeNote,
      editNote
    } = this.props;
   
    const editMode = (note.id === editingId || deletingId === note.id);
    const editClass = (editMode) ? 'edit-mode' : '';
    const opacity = isDragging ? 0 : 1;

    return (			
      connectDragSource &&
      connectDropTarget && 
      connectDragSource(
        connectDropTarget(
          <div style={{ width: '48%', marginLeft: '1%', marginRight: '1%', opacity }}>
              <Card className={"mb-4 condition-note " + editClass}>
                  <CardBody>
                      <span className="icon-btn pr-10 " onClick={() => {
                          (editingId !== note.id || deletingId !== note.id) && removeNote(note.id)
                      }}>
                          {(editingId !== note.id || deletingId !== note.id) && (<IconTrash size="18" />)}
                      </span>
                      <span className="icon-btn pr-10" onClick={() => {
                          !editMode && editNote(note)
                      }}>
                          {(editingId !== note.id) && (<IconPencil size="18" />)}
                      </span>
                      {note.nickname}
                  </CardBody>
              </Card>
          </div>
        )
      )
    )
  }                 
}

export default flow(
  DropTarget(Types.NOTE, conditionNoteTarget, collectTarget),
  DragSource(Types.NOTE, conditionNoteSource, collectSource)
)(ConditionNote);
