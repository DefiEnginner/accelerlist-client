import React from "react";
import PropTypes from "prop-types";
import CreatableSelect from "react-select/lib/Creatable";

const SupplierInputForm = props => {
  const { onChange, value, suppliers, isValid } = props;
  let optionList;
  if (suppliers) {
    optionList = suppliers.map(element => {
      return {
        value: element.supplier_name,
        label: element.supplier_name
      };
    });
  }
  return (
    <CreatableSelect
      name="supplier-name"
      value={value}
      onChange={onChange}
      options={optionList}
      style={isValid ? { border: "1px solid red" } : {}}
    />
  );
};

SupplierInputForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
  isValid: PropTypes.bool
};

export default SupplierInputForm;
