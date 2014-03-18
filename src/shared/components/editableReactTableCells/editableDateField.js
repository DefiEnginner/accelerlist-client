import React, { Component } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { 
  momentDateIsValid,
  momentDateToISOFormatConversion,
  momentDateToLocalFormatConversion,
  momentDateTimeToLocalFormatConversion
} from "../../../helpers/utility";
import { EditableCell } from "./styles";

class EditableDateField extends Component {
  state = {
    isEditable: false
  };

  componentDidUpdate() {
    const { isEditable } = this.state;
    if (isEditable) {
      const element = document.getElementById("date-picker");
      if (element) {
        element.focus();
      }
    }
  }

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
    const {
      cellInfo,
      onChangeValue,
      showTimeSelect
    } = this.props;
    const { value, column, original } = cellInfo;
    const { isEditable } = this.state;
    return(
      <EditableCell>
        {isEditable ? (
          <DatePicker
            className="date-picker-editeble-cell"
            dateFormat={ showTimeSelect ? "L LT" : "L"}
            showTimeSelect={showTimeSelect}
            id="date-picker"
            popperPlacement="left-end"
            selected={momentDateIsValid(value) 
              ? moment(value) 
              : null}
            onChange={(e) => {
              let buffRow = original;
              buffRow[column.id] = (e === null ? null : momentDateToISOFormatConversion(e));
              onChangeValue(buffRow);
            }}
            onBlur={this.setEditModeOff}
          />
        ) : (
          <button
            style={{ backgroundColor: "transparent", border: "none", width: "100%" }}
            onClick={() => {
              this.setEditModeOn();
            }}
          >
            {momentDateIsValid(value) ? (
              showTimeSelect
              ? momentDateTimeToLocalFormatConversion(value)
              : momentDateToLocalFormatConversion(value)
              ) : ""}
          </button>
        )}
      </EditableCell>
    )
  }
}

EditableDateField.propTypes = {
  cellInfo: PropTypes.object.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  showTimeSelect: PropTypes.bool,
};

export default EditableDateField;