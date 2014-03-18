import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const CustomSKUInputForm = props => {
  const { onChange, value } = props;
  const optionList = [
    { label: "Yes", value: true },
    { label: "No", value: false },
    { label: "Modify Template", value: "modify" }
  ];

  return (
    <Select
      value={value}
      onChange={onChange}
      options={optionList}
      clearable={false}
    />
  );
};

CustomSKUInputForm.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onChange: PropTypes.func.isRequired
};

export default CustomSKUInputForm;
