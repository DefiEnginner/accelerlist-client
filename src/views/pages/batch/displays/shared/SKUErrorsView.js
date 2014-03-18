import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardBody,
  CardHeader
} from 'reactstrap'
import BatchProductCard from './BatchProductCard'

const SKUErrorsView = (props) => {
  const { feedErrors, products } = props;
  let skuErrors = [];

  feedErrors.forEach(element => {
    const { sku } = element;
    if (sku !== '') {
    const errorInfo = (
        <React.Fragment>
          <hr />
          <strong>{element['error-type']}</strong>
          <br />
          <div>{`SKU:  ${element.sku}`}</div>
          <div>{`Code:  ${element['error-code']}`}</div>
          <div>{`Message:  ${element['error-message']}`}</div>
          <br />
        </React.Fragment>
      )
      skuErrors.push(
        <React.Fragment key={Math.random()}>
          <BatchProductCard 
            products={products}
            sku={sku}
            additionalContent={errorInfo}
          />
        </React.Fragment>
      )
    }
  })

  return (skuErrors.length > 0 ? 
    (
      <Card>
        <CardHeader>
          <strong>SKU errors</strong>
        </CardHeader>
        <CardBody>
          {skuErrors}
        </CardBody>
      </Card>
    )
     : null)
}

SKUErrorsView.propTypes = {
  feedErrors: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired
}

export default SKUErrorsView;