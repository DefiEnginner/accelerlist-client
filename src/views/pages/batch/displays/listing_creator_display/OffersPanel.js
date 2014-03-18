import React, { Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { digitСonversion } from "../../../../../helpers/utility";

const OffersPanel = (props) => {
  let {
    offersFilterLabel,
    pricingData,
    rootClassName,
    updateCurrentWorkingListingData,
    internationalization_config
  } = props;

  let offerNodes, offersFilter
  if (offersFilterLabel === "Used") {
    offersFilter = (offer) => {
      return offer.IsFulfilledByAmazon !== "true" && offer.SubCondition.toLowerCase() !== "new"
    }
  } else if (offersFilterLabel === "New") {
    offersFilter = (offer) => {
      return offer.IsFulfilledByAmazon !== "true" && offer.SubCondition.toLowerCase() === "new"
    }
  } else if (offersFilterLabel === "FBA") {
    offersFilter = (offer) => {
      return offer.IsFulfilledByAmazon === "true"
    }
  }

  let numberOfOffers = 0
  if (pricingData && pricingData.numberOfOffers) {
    for (var c=0; c<pricingData.numberOfOffers.length; c++) {
      var obj = pricingData.numberOfOffers[c];
      if (offersFilterLabel === "New" && obj.condition === "new" && obj.fulfillmentChannel !== "Amazon") {
        numberOfOffers = Number(obj.OfferCount)
        break
      } else if (offersFilterLabel === "Used" && obj.condition === "used" && obj.fulfillmentChannel !== "Amazon") {
        numberOfOffers = Number(obj.OfferCount)
        break
      } else if (offersFilterLabel === "FBA" && obj.fulfillmentChannel === "Amazon") {
        numberOfOffers = Number(obj.OfferCount)
        break
      }
    }
  }


  if (pricingData) {
    let filteredOffers = pricingData.offers.filter(
      offer => offersFilter(offer)
    )

    offerNodes = filteredOffers.map((offer, i) => {
      if (offer.ListingPrice && offer.Shipping) {
        var subcondition = offer.SubCondition.toUpperCase();
        var tmp = subcondition.split('_')
        var acronym = tmp.map(function (elem) {
          return elem[0]
        }).join('')
        var landedPrice = parseFloat(offer.ListingPrice.Amount) + parseFloat(offer.Shipping.Amount)
		landedPrice = landedPrice.toFixed(2)

        return (
          <a
            href="#a"
            className="price-item"
            key={`competing-offers-${subcondition}-${landedPrice}-${i}`}
            onClick={updateCurrentWorkingListingData.bind(null, "price", landedPrice, true)}>
            <Fragment>
              {digitСonversion(
                landedPrice,
                "currency",
                internationalization_config.currency_code
              )}
              <span> {acronym} </span>
              {offer.IsBuyBoxWinner === "true" ?
                <span
                  className="badge badge-warning"> (BB) </span> :
                ""}
            </Fragment>
          </a>
        )
      } else {
        return ""
      }
    })
  }

  return (
    <div className={`prices-box ${rootClassName}`}>
        <h3 className="prices-header">{offersFilterLabel} <span>({numberOfOffers})</span></h3>
        <div className="scrollable">
          {offerNodes}
        </div>
    </div>
  )
}

OffersPanel.propTypes = {
  offersFilterLabel: PropTypes.string.isRequired,
  pricingData: PropTypes.object,
  updateCurrentWorkingListingData: PropTypes.func.isRequired,
  style: PropTypes.object
}

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config")
  }),
  {}
)(OffersPanel);
