import React from 'react'
import PropTypes from 'prop-types'
import taxCodeList from '../../../helpers/batch/tax_code_list'
import Select from 'react-select'

const TaxCodeInputForm = (props) => {
  const { onChange, value, isValid } = props;
  const currentSelectedOption = { value: value, label: value };
  const optionList = taxCodeList.map(element => {
    return ({
      value: element,
      label: element
    })
  })

  return (
    <Select
      value={currentSelectedOption}
      onChange={onChange}
      options={optionList}
      clearable={false}
      style={isValid ? { border: "1px solid red" } : {}}
  />
  )
}

TaxCodeInputForm.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool
}

export default TaxCodeInputForm;