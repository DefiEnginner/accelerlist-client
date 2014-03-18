import React, { Component } from "react";
import PropTypes from "prop-types";
import { EditableCell, EditableCellInput } from "./styles";

class EditableQtyField extends Component {
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

  render() {
    const { cellInfo, onChangeValue } = this.props;
    const { value, column, original } = cellInfo;
    const { isEditable } = this.state;
    return (
      <EditableCell>
        {isEditable ? (
          <EditableCellInput
            min="1"
            type="number"
            className="form-control"
            innerRef={this.checkNewData}
            onBlur={e => {
              let buffRow = original;
              buffRow[column.id] = Number(e.target.value);
              onChangeValue(buffRow);
              this.setEditModeOff();
            }}
            defaultValue={value === 0 ? 1 : value}
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
    );
  }
}

EditableQtyField.propTypes = {
  cellInfo: PropTypes.object.isRequired,
  onChangeValue: PropTypes.func.isRequired
};

export default EditableQtyField;
