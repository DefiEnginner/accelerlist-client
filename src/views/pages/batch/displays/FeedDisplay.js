import React from 'react'
import { Row, Col, Card, CardBody } from 'reactstrap'
import FeedTable from './feed_display/FeedTable'
import BatchToolBoxRow from './shared/BatchToolBoxRow'
import PropTypes from 'prop-types'

/*
This display is shown when they have already finished scanning in all their items
and are looking at the submission result to Amazon.
*/

const FeedDisplay = (props) => {
  let { productFeedSubmissions } = props
  return (
    <Row>
      <Col lg="12" className="col">
        <Card>
          <CardBody>
            <BatchToolBoxRow 
              hideSearch={true}
            />
            <div>
              <hr />
              <h4>Submitted Product Feeds</h4>
              <FeedTable
                productFeedSubmissions={productFeedSubmissions}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

FeedDisplay.propTypes = {
  productFeedSubmissions: PropTypes.array.isRequired, 
}

export default FeedDisplay