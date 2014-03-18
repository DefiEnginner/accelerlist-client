import React from "react";
import { connect } from "react-redux";
import CompetingOffersView from "./CompetingOffersView";
import BBPrice from './BBPrice';
import KeepaChartPriceHistory from "../../../../../shared/components/KeepaChartPriceHistory";
import {
  FormGroup,
  Row,
  Col,
  Input,
  Button
} from "reactstrap";

import {
  getNewConditionOptions,
  getCategoryOptions,
} from "../../../../../helpers/batch/utility";
import PropTypes from "prop-types";
import $ from 'jquery';
import { validateFloatInput, digitСonversion } from "../../../../../helpers/utility";
import ConditionSelector from './ConditionNotes/ConditionSelector';
import NoteSelector from './ConditionNotes/NoteSelector';
import GraphIcon from '../../../../../shared/components/SVGIcons/Graph';
import CalendarIcon from '../../../../../shared/components/SVGIcons/Calendar';
import NoteIcon from '../../../../../shared/components/SVGIcons/Note';
import SelectField from "../../../../../shared/components/Form/SelectField";
import PriceTrackersButtonGroup from "../shared/PriceTrackersButtonGroup";
import batchActions from "../../../../../redux/batch/actions";
import appActions from "../../../../../redux/app/actions";
import FaSpinner from "react-icons/lib/fa/spinner";
import './listing-details.css';

const {
  updateListingDefaultsData
} = batchActions;

const {
  userError
} = appActions;


class PricingPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      listPrice: 0,
      buyCost: 0,
      fees: 0,
      netProfit: '-',
      roi: 0,
      profitMargin: 0,
      notes_description: "",
      newPrice: null,
		usedPrice: null,
		conditionButtonColor: ""
    };
  }

  componentDidMount() {
    $('#toggle-profit-details').on('click', function(e) {
        e.preventDefault();
        $('#popover-details').toggleClass('show');
    });

    $('body').on('click', function (e) {
      if ($(e.target).prop('id') !== 'toggle-profit-details') {
          $('#popover-details').removeClass('show');
      }
    });
  }
  updateProfitPopoverStats(currentWorkingListingData) {
    if (!!currentWorkingListingData.pricingData) {
      const data = currentWorkingListingData.pricingData;
      const listPrice = currentWorkingListingData.price;
      const buyCost = currentWorkingListingData.buyCost;
      var fees = 0;
      if (!data.error && data.totalFeeEstimate) {
        fees =
          (
            parseFloat(data.totalFeeEstimate) +
            0.15 * parseFloat(listPrice)
          ).toFixed(2) || 0.0;
      }

      var netProfit = (
        parseFloat(listPrice) -
        parseFloat(buyCost) -
        fees
      ).toFixed(2);
      var roi = ((netProfit * 100) / parseFloat(buyCost)).toFixed(2);

      var profitMargin = ((netProfit * 100) / parseFloat(listPrice)).toFixed(2);
      this.setState({
        listPrice,
        buyCost,
        fees,
        netProfit,
        roi,
        profitMargin
      });
    }
  }

  UNSAFE_componentWillMount() {
    const { currentWorkingListingData } = this.props;
    this.updateProfitPopoverStats(currentWorkingListingData);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { currentWorkingListingData } = newProps;
	const { conditionButtonColor } = this.state;
	if(conditionButtonColor === '' && newProps.batchListingDefaults){
		if(newProps.batchListingDefaults.condition === 'NoDefault'){
			this.setState({conditionButtonColor: 'danger'});
		} else {
			this.setState({conditionButtonColor: 'primary'});
		}
	}
    this.updateProfitPopoverStats(currentWorkingListingData);
  }

  togglePopover(state) {
    this.setState({
      popoverOpen: state
    });
  }

  updateData = (event, name, isApplyConverter = true) => {
    const validator = validateFloatInput(true);
    let value = event.target.value;
    if (isApplyConverter) value = validator(event);
    this.props.updateCurrentWorkingListingData(
      name,
      value,
      isApplyConverter
    );
  };

  notesHandler = (name, value) => {
    const { note } = this.props.currentWorkingListingData;
    if (!note) {
      this.props.updateCurrentWorkingListingData("note", `${value}`);
    } else {
      this.props.updateCurrentWorkingListingData("note", `${note} ${value}`);
    }
  }

  getBuyBoxPricingData = (currentWorkingListingData) => {
    const { asin, pricingData } = currentWorkingListingData;
    let buyBoxPricingData = null;
    if (!!pricingData && !!pricingData.competitive_pricing && !!pricingData.competitive_pricing[asin]) {
      buyBoxPricingData = pricingData.competitive_pricing[asin]
    }
    return buyBoxPricingData
  }

  renderPricingOptions() {
    let {
      currentWorkingListingData,
      updateCurrentWorkingListingData,
      internationalConfig,
      batchListingDefaults,
      currentListingWorkflowOptions,
      addItemToBatch,
      addToBatchStatus,
      cancel
    } = this.props;
    let {
      listPrice,
      buyCost,
      fees,
      netProfit,
      roi,
      profitMargin
    } = this.state;

    const buyBoxPricingData = this.getBuyBoxPricingData(currentWorkingListingData);

    if (batchListingDefaults.pricingOptions || currentListingWorkflowOptions.showPricing) {
      return (
        <React.Fragment>
          <div className="section">
            <h2 className="section-title">
                <CalendarIcon />
                Pricing Data
            </h2>
            <div className="section-content">
              <div className="col-lg-5 px-0">
                {buyBoxPricingData &&
				<BBPrice
					bbPricingData={buyBoxPricingData}
                    updateCurrentWorkingListingData={updateCurrentWorkingListingData}
					/>
                }
                <CompetingOffersView
                  pricingData={currentWorkingListingData.pricingData}
                  updateCurrentWorkingListingData={updateCurrentWorkingListingData}
                />
              </div>
              <div className="col-lg-7">
                <KeepaChartPriceHistory
                  className="chart"
                  asin={currentWorkingListingData.asin}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="d-inline-block">
                <PriceTrackersButtonGroup
                  ASIN={currentWorkingListingData.asin}
                  itemName={currentWorkingListingData.name}
                  amazonUrl={internationalConfig.amazon_url}
				  eBayUrl={internationalConfig.ebay_url}
                  keepaBaseUrl={internationalConfig.keepa_url}
                  camelCamelCamelBaseUrl={internationalConfig.camelcamelcamel_url}
                  amazonSellerCentralUrl={internationalConfig.seller_central_url}
				  auto_show_amazon={batchListingDefaults.showInNewTabAmazon}
				  auto_show_ebay={batchListingDefaults.showInNewTabEbay}
                />
              </div>
              <div className="d-inline-block ml-3">
                <Button
                  color="success"
                  disabled={!!addToBatchStatus}
                  onClick={() => {
                    addItemToBatch(null, false)
                  }}
                >
                  {
                  !!addToBatchStatus &&
                    <FaSpinner className="fa-spin mr-1" />
                  }
                  ADD TO BATCH
                </Button>{" "}
                <Button
                  color="danger"
                  onClick={cancel}
                >
                  CANCEL
                </Button>
              </div>

            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              <GraphIcon />
              Calculate your profit
            </h2>
            <div className="section-content">
            <FormGroup className="profit-calculator">
                  <div className="form-group">
                      <label>Your Price</label>
                      <div className="input-group input-group-lg">
                          <span className="input-group-addon">{internationalConfig.currency_identifier}</span>
                          <Input
                            type="number"
                            className="form-control"
                            value={
                              !isNaN(currentWorkingListingData.price)
                                ? currentWorkingListingData.price
                                : ""
                            }
                            onChange={e => this.updateData(e, "price", false)}
                            onBlur={(e) => this.updateData(e, "price")}
                            invalid={Number(currentWorkingListingData.price) <= 0}
                          />
                      </div>
                  </div>
                  <div className="form-group">
                      <label>Buy Cost</label>
                      <div className="input-group input-group-lg">
                          <span className="input-group-addon">{internationalConfig.currency_identifier}</span>
                          <Input
                            min="0"
                            type="number"
                            className="form-control"
                            value={
                              !isNaN(currentWorkingListingData.buyCost)
                                ? currentWorkingListingData.buyCost
                                : ""
                            }
                            onChange={(e) => this.updateData(e, "buyCost", false)}
                            onBlur={(e) => this.updateData(e, "buyCost")}
                          />
                      </div>
                  </div>
                  <div className="form-group result">
                      <label>Profit</label>
                      <span className="value">
                        {isNaN(netProfit) ? "-" : `${digitСonversion(netProfit, "currency", internationalConfig.currency_code)}`}
                      </span>
                      <a href="#see-details" onClick={(e) => e.preventDefault()} id="toggle-profit-details">Click to see details</a>

                      <div id="popover-details" className="popover  popover-bottom profit-details">
                          <h3 className="popover-title">Profit Details</h3>
                          <div className="popover-content">
                              <p className="row-item">
                                <strong>List Price:</strong>
                                <span>{digitСonversion(listPrice, "currency", internationalConfig.currency_code) || 0}</span>
                              </p>
                              <p className="row-item">
                                <strong>Buy Cost:</strong>
                                <span>{digitСonversion(buyCost, "currency", internationalConfig.currency_code) || 0}</span>
                              </p>
                              <p className="row-item">
                                <strong>Est. Fees:</strong>
                                <span>{digitСonversion(fees, "currency", internationalConfig.currency_code) || 0}</span>
                              </p>
                              <hr />
                              <p className="row-item">
                                <strong>Net Profit:</strong>
                                <span className="text-success">
                                  {digitСonversion(netProfit, "currency", internationalConfig.currency_code)}
                                </span>
                              </p>
                              <p className="row-item mb-0">
                                <strong>ROI/Profit Margin:</strong>
                                <span>{digitСonversion(roi, "percent")} / {digitСonversion(profitMargin, "percent")}</span>
                              </p>
                          </div>
                      </div>
                  </div>
                </FormGroup>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }


	updateCurrentWorkingListingData(name, value){
		this.setState({conditionButtonColor: 'primary'});
        this.props.updateCurrentWorkingListingData(name, value);
	}

  renderGradingOptions() {
    let {
      currentWorkingListingData,
      conditionNotes,
		batchListingDefaults,
    } = this.props;

	const { conditionButtonColor } = this.state;

    if (batchListingDefaults.gradingOptions || batchListingDefaults.condition === "NoDefault") {
      return (
        <div className="section">
          <h2 className="section-title">
            <NoteIcon />
              Condition Notes
          </h2>
          <FormGroup className="condition-notes">
            <Row>
              <Col md="5">
                <ConditionSelector
                  name="condition"
                  conditions={getNewConditionOptions()}
                  selectedCondition={currentWorkingListingData.condition||""}
                  onChangeCondition={(name, value) => this.updateCurrentWorkingListingData(name, value)}
				  buttonColor={conditionButtonColor}
                />
              </Col>

              <Col md="4">
                <div className="form-group">
                  <label>Filter</label>
                  <SelectField
                    options={getCategoryOptions()}
                    placeholder="Select Category"
                    name="noteCategory"
                    value={currentWorkingListingData.noteCategory}
                    handleChange={(name, value) => this.props.updateCurrentWorkingListingData(name, value)}
                  />
                </div>
              </Col>
            </Row>
            <NoteSelector
              options={conditionNotes}
              category={currentWorkingListingData.noteCategory}
              onChangeNote={this.notesHandler}
            />
            <div className="form-group">
                <textarea
                  cols="30"
                  rows="5"
                  className="form-control"
                  value={currentWorkingListingData.note}
                  onChange={(e) => this.props.updateCurrentWorkingListingData(
                    "note",
                    e.target.value
                  )}
                />
            </div>
          </FormGroup>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderPricingOptions()}
        {this.renderGradingOptions()}
      </div>
    );
  }
}

PricingPanel.propTypes = {
  currentWorkingListingData: PropTypes.object.isRequired,
  updateCurrentWorkingListingData: PropTypes.func.isRequired,
  internationalConfig: PropTypes.object.isRequired,
  batchListingDefaults: PropTypes.object.isRequired
};

export default connect(
  state => ({
  }),
  {
    updateListingDefaultsData,
    userError
  }
)(PricingPanel);
