import React from "react";
import PropTypes from "prop-types";
import CreatableSelect from "react-select/lib/Creatable";

const ScoutInputForm = props => {
  const { onChange, value, scouts, isValid } = props;
  let optionList;
  if (scouts) {
    optionList = scouts.map(element => {
      return {
        value: element.scout_name,
        label: element.scout_name
      };
    });
  }
  return (
    <CreatableSelect
      name="scout-name"
      value={value}
      onChange={onChange}
      options={optionList}
      style={isValid ? { border: "1px solid red" } : {}}
    />
  );
};

ScoutInputForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  scouts: PropTypes.array.isRequired,
  isValid: PropTypes.bool
};

export default ScoutInputForm;
