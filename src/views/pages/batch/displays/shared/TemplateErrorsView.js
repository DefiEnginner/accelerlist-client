import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader
} from 'reactstrap'

const TemplateErrorsView = (props) => {
  const { feedErrors } = props;
  let templateErrors = [];

  feedErrors.forEach(element => {
    const { sku } = element;
    if (sku === '') {
      templateErrors.push(
        <React.Fragment key={Math.random()}>
          <Card>
            <CardBody>
              <CardTitle>
                <strong>{element['error-type']}</strong>
              </CardTitle>
              <div>{`Code:  ${element['error-code']}`}</div>
              <div>{`Message:  ${element['error-message']}`}</div>
            </CardBody>
          </Card>
          <br />
        </React.Fragment>
      )
    }
  })
  return (templateErrors.length > 0 ? 
    (
      <Card>
        <CardHeader>
          <strong>Template errors</strong>
        </CardHeader>
        <CardBody>
          {templateErrors}
        </CardBody>
      </Card>
    ) : null)
}

TemplateErrorsView.propTypes = {
  feedErrors: PropTypes.array.isRequired
}

export default TemplateErrorsView;