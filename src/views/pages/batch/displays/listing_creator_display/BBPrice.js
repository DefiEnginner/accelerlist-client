import React, { Component, Fragment } from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  Row,
  Col
} from "reactstrap";
import styled from 'styled-components';
import { digitСonversion } from "../../../../../helpers/utility";

const StyledBBPriceRow = styled(Row)`
  margin-bottom: 2em;

  .price {
    margin-left: .5em;
    border-bottom: 1px dashed #777;
    cursor: pointer;
  }
`;

const mappingConditionName = {
  new_buy_box: "New",
  used_buy_box: "Used"
}

class BBPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: []
    }
  }

  toggle = (idx) => {
    let open = Object.assign({}, this.state.open);
    open[idx] = !this.state.open[idx]
    this.setState({
      open: open
    })
  }

  mouseOut = (idx) => {
	if(idx in this.state.open){
	if(this.state.open[idx]){
		this.toggle(idx);
	}
	}
  }

  formatNumber(amount, currencyCode) {
    return digitСonversion(amount, "currency", currencyCode);
  }

  render() {
    const {
      bbPricingData,
	  updateCurrentWorkingListingData
    } = this.props;

    return (
      <Fragment>
        <StyledBBPriceRow className="no-gutters">
          {
            Object.keys(bbPricingData).map((item,idx) => {
              const itemConditon = mappingConditionName[item];

              const landedPrice = bbPricingData[item].landed_price;
              const listingPrice = bbPricingData[item].listing_price;
              const shippingPrice = bbPricingData[item].shipping_price;

              const landedPriceCurrencyCode = bbPricingData[item].landed_price_currency;
              const listingPriceCurrencyCode = bbPricingData[item].listing_price_currency;
              const shippingPriceCurrencyCode = bbPricingData[item].shipping_price_currency;

              return (
              <Col md="6 mb-3">
                <strong>{`${itemConditon} BB`}:
                  <span
                    className={`price price-${itemConditon}`}
                    id={itemConditon}
                    onMouseOver={() => this.toggle(idx)}
					onMouseOut={() => this.mouseOut(idx)}
					onClick={updateCurrentWorkingListingData.bind(null, "price", landedPrice, true)}>
                    {this.formatNumber(landedPrice, landedPriceCurrencyCode)}
                  </span>
                </strong>
                <Popover className="popover-bbprice" isOpen={this.state.open[idx]} target={itemConditon} toggle={() => this.toggle(idx)}>
                  <PopoverHeader>Price Breakdown</PopoverHeader>
                  <PopoverBody>
                    <p className="row-item">
                      <strong>Landed Price:</strong>
                      <strong className={`price-${item.condition}`}>
                        {this.formatNumber(landedPrice, landedPriceCurrencyCode)}
                      </strong>
                    </p>
                    <p className="row-item">
                      <strong>Listing Price:</strong>
                      <span>
                        {this.formatNumber(listingPrice, listingPriceCurrencyCode)}
                      </span>
                    </p>
                    <p className="row-item">
                      <strong>Shipping Price:</strong>
                      <span>
                        {this.formatNumber(shippingPrice, shippingPriceCurrencyCode)}
                      </span>
                    </p>
                  </PopoverBody>
                </Popover>
              </Col>
              )
            })
          }
        </StyledBBPriceRow>
      </Fragment>
    );
  }
}

export default BBPrice;
