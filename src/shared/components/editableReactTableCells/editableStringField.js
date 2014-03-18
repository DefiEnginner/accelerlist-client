import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
  EditableCell,
  EditableCellInput
} from './styles';

class EditableStringField extends Component {
  state = {
    isEditable: false
  };

  checkNewData = e => {
    const { cellInfo } = this.props;
    const { value } = cellInfo;
    const { isEditable } = this.state;
    if (e) {
      if (value !== e.value) {
        e.value = value;
      }
      if (isEditable) {
        e.focus();
      }
    }
  };

  setEditModeOn = () => {
    this.setState({
      isEditable: true
    });
  };

  setEditModeOff = () => {
    this.setState({
      isEditable: false
    });
  };
  
  render(){
    const { cellInfo, onChangeValue } = this.props;
    const { value, column, original } = cellInfo;
    const { isEditable } = this.state;
    return(
      <EditableCell>
        {isEditable ? (
          <EditableCellInput
            className="form-control"
            innerRef={this.checkNewData}
            onBlur = {e => {
              let buffRow = original;
              buffRow[column.id] = String(e.target.value);
              onChangeValue(buffRow);
              this.setEditModeOff();
            }}
            defaultValue={value}
          />
        ) : (
          <button
            style={{ backgroundColor: "transparent", border: "none", width: "100%" }}
            onClick={this.setEditModeOn}
          >
            {value}
          </button>
        )}
      </EditableCell>
    )
  }
}

EditableStringField.propTypes = {
  cellInfo: PropTypes.object.isRequired,
  onChangeValue: PropTypes.func.isRequired
};

export default EditableStringField;