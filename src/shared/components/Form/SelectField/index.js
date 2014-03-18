/**
*
* SelectField
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import {
  Input
} from 'reactstrap';

class SelectField extends React.Component { // eslint-disable-line react/prefer-stateless-function


  handleChange = (e) => {
    const { name } = this.props;
    const value = e.target.value;
    this.props.handleChange(name, value||"");
  }
  render() {
    const { placeholder, name, value, options } = this.props;
    return (
        <Input
            type="select"
            placeholder={placeholder}
            value={value}
            name={name}
            onChange={this.handleChange}
            options={options}
        >
            {
                !!options && options.map((opt, i) => <option key={`opt_${i}`} value={opt.value}>{opt.label}</option>)
            }
        </Input>								
    );
  }
}

SelectField.defaultProps = {
  placeholder: "Select ...",
};

SelectField.propTypes = {
    placeholder: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired
};

export default SelectField;
