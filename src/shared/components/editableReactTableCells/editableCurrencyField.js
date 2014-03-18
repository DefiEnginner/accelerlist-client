import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { digitСonversion } from "../../../helpers/utility";

import { EditableCell, EditableCellInput } from "./styles";

class EditableCurrencyField extends Component {
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
    const { cellInfo, onChangeValue, internationalization_config } = this.props;
    const { value, column, original } = cellInfo;
    const { isEditable } = this.state;
    return (
      <EditableCell>
        {isEditable ? (
          <EditableCellInput
            type="number"
            className="form-control"
            innerRef={this.checkNewData}
            onBlur={e => {
              let buffRow = original;
              buffRow[column.id] = Number(e.target.value);
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
            {digitСonversion(
              value,
              "currency",
              internationalization_config.currency_code
            )}
          </button>
        )}
      </EditableCell>
    );
  }
}

EditableCurrencyField.propTypes = {
  cellInfo: PropTypes.object.isRequired,
  onChangeValue: PropTypes.func.isRequired
};

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config")
  }),
  {}
)(EditableCurrencyField);
