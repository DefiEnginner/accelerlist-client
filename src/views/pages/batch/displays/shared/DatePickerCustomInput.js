import React, { Component } from 'react';
import {
  Input
} from 'reactstrap'
import PropTypes from 'prop-types'
class DatePickerCustomInput extends Component {

  render () {
    return (
      <Input
        style={{ backgroundColor: 'white', display: 'inline-block'}}
        readOnly
        value={this.props.value}
        onClick={this.props.onClick}
      />
    )
  }
}

DatePickerCustomInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string
};
export default DatePickerCustomInput;
