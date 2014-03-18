import React from 'react'
import OffersPanel from './OffersPanel'
import PropTypes from 'prop-types'

const CompetingOffersView = (props) => (
  <div>
    <div className="prices-box-group">
    <OffersPanel
      offersFilterLabel="New"
      rootClassName="new"
      pricingData={props.pricingData}
      updateCurrentWorkingListingData={props.updateCurrentWorkingListingData}   
    />
    <OffersPanel
      offersFilterLabel="Used"
      rootClassName="used"
      pricingData={props.pricingData}     
      updateCurrentWorkingListingData={props.updateCurrentWorkingListingData}
    />
    <OffersPanel
      offersFilterLabel="FBA"
      rootClassName="fba"
      pricingData={props.pricingData}
      updateCurrentWorkingListingData={props.updateCurrentWorkingListingData}
    />
    </div>
    <p className="text-muted mt-3">Scroll over the column for more prices</p>
  </div>
)

CompetingOffersView.propTypes = {
  pricingData: PropTypes.object,
  updateCurrentWorkingListingData: PropTypes.func.isRequired
}

export default CompetingOffersView;