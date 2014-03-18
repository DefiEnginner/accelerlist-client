import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  Table,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  ButtonGroup,
  FormGroup,
} from 'reactstrap';
import Select from "react-select";
import {checkConditionIsUsedOrNew, checkNumberIsPositive} from '../../../helpers/batch/utility';
import {rangeGraphOptions} from '../../../helpers/settings/graph_options';
import TaxCodeInputForm from "../../../shared/components/taxCodeInputForm";
import Toggle from "../../../shared/components/Toggle";
import './index.css';
import './style.css';
import settingsActions from '../../../redux/settings/actions';
import {
	ListPriceRuleOptions,
	ListPriceDirectionRuleOptions,
	ListBatchItemConditions } from "../../../helpers/settings/list_price_data";

class ListingDefaults extends Component {
  constructor (props) {
    super(props);
    const {
      list_price,
      buy_cost,
      quantity,
      min_price,
      max_price,
      tax_code,
      list_price_rule_type,
      list_price_rule_amount,
      price_rule_type,
      price_rule_direction,
	  sku_prefx,
      default_list_price,
      pricing_options,
      grading_options,
      keepa_date_range,
	  condition,
    } = props.listingDefaults;

    this.state = {
      list_price: list_price,
      buy_cost: buy_cost,
      quantity: quantity,
      min_price: min_price,
      max_price: max_price,
      tax_code: tax_code,
      list_price_rule_type: list_price_rule_type,
      list_price_rule_amount: list_price_rule_amount,
      price_rule_type: price_rule_type,
      price_rule_direction: price_rule_direction,
      default_list_price: default_list_price,
      keepa_date_range: keepa_date_range,
	  sku_prefix: sku_prefx,
	  pricing_options,
	  grading_options,
		condition: condition,
		saveMessageFlashing: false,
    }
  }

	flashSaveMessage(kill=false) {
		//flash message on save
		if(kill){
			this.setState({	saveMessageFlashing: false });
			return;
		}
		setTimeout(() => {
		  this.flashSaveMessage(true);
		}, 2000);
	}

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      list_price: newProps.listingDefaults.list_price,
      buy_cost: newProps.listingDefaults.buy_cost,
      quantity: newProps.listingDefaults.quantity,
      min_price: newProps.listingDefaults.min_price,
      max_price: newProps.listingDefaults.max_price,
      tax_code: newProps.listingDefaults.tax_code,
      list_price_rule_type: newProps.listingDefaults.list_price_rule_type,
      list_price_rule_amount: newProps.listingDefaults.list_price_rule_amount,
      price_rule_type: newProps.listingDefaults.price_rule_type,
      price_rule_direction: newProps.listingDefaults.price_rule_direction,
      default_list_price: newProps.listingDefaults.default_list_price,
      pricing_options: newProps.listingDefaults.pricing_options,
      grading_options: newProps.listingDefaults.grading_options,
      sku_prefix: newProps.listingDefaults.sku_prefix,
	  keepa_date_range: newProps.listingDefaults.keepa_date_range,
	  condition: newProps.listingDefaults.condition,

    })
  }
  UNSAFE_componentWillMount() {
    this.props.fetchListingDefaults();
  }
  saveNewDefaults = () => {
	this.setState({	saveMessageFlashing: true });
    let defaults = {};
    Object.keys(this.state).forEach(fieldName => {
        defaults[fieldName] = this.state[fieldName];
    })
    this.props.saveListingDefaults(defaults);
	this.flashSaveMessage();
  }
  handleChangeBuyCostInput = (e) => {
    this.setState({
      buy_cost: Number(e.target.value)
    })
  }
  handleChangeQuantityInput = (e) => {
    this.setState({
      quantity: Number(e.target.value)
    })
  }
  handleChangeMinPriceInput = (e) => {
    this.setState({
      min_price: Number(e.target.value)
    })
  }
  handleChangeMaxPriceInput = (e) => {
    this.setState({
      max_price: Number(e.target.value)
    })
  }
  handleChangeTaxCodeInput = (e) => {
    this.setState({
      tax_code: e.value
    })
  }
  handleChangeListPriceInput = (e) => {
    this.setState({
      list_price: Number(e.target.value)
    })
  }
  handlePricingToggle = (e) => {
    const pricingOptions = e.target.checked;
    if (!pricingOptions && this.state.list_price_rule_type === "") {
      this.props.userError("Please set a price rule other than Own Value to disable pricing options");
      return;
    }
    this.setState({pricing_options: pricingOptions})
  }

  updateRule = (name, value) => {
    let { listingDefaults } = this.props;
    let conditionIsUsedOrNew = !!listingDefaults && !!listingDefaults.condition && checkConditionIsUsedOrNew(listingDefaults.condition);
    if(value === 'match_buy_box_price' && !conditionIsUsedOrNew) {
        this.props.userError("Change the condition in Notes tab to Used/New!");
        return;
    }
    if (value !== "fixed_value") {
        this.setState({list_price: ""});
    }
    this.setState({[name]: value});
    !!this.state.list_price_rule_amount && this.setState({list_price_rule_amount: ''});
    !!this.state.price_rule_type && this.setState({price_rule_type: ''});
    !!this.state.price_rule_direction && this.setState({price_rule_direction: ''});

    if (name === "list_price_rule_type" && (value === "" || value === "own-price")) {
      this.setState({
        pricing_options: true
      })
    }
  }

  handleChange = (name, value) => {
    let { userError, listingDefaults } = this.props;
    let conditionIsUsedOrNew = !!listingDefaults && !!listingDefaults.condition && checkConditionIsUsedOrNew(listingDefaults.condition);
    let buyCostIsPositive = !!this.state.buy_cost && checkNumberIsPositive(this.state.buy_cost);
    if(name === "price_rule_direction") {
      if(["higher_than_buy_box", "lower_than_buy_box"].indexOf(value) > -1 && !conditionIsUsedOrNew) {
        userError("Please change the default condition in Notes tab to Used/New to select this auto-price rule!");
        return;
      }
      if(value === 'roi' || value === 'profit_margin') {
        if (!buyCostIsPositive) {
          userError("Please change the buy cost to a number greater than zero, to select this auto-price rule!");
          return;
        }
        this.setState({price_rule_type: null});
      }
    }
    this.setState({[name]: value});
  }

  updateCondition = (name, value) => {
    this.setState({[name]: value});
  }

  getObjectOfGraphOptions = (rangeGraph) => {
    const rangeGraphObject = rangeGraphOptions.find(el => el.numberValue === rangeGraph);
    if (rangeGraphObject) {
      return rangeGraphObject;
    } else {
      return rangeGraphOptions[5];
    }
  }

  mskuToggleChanged = () => {
	  const { userData } = this.props;
		if(userData){
			let ud = userData;
			ud.settings["list_with_new_msku"] = !ud.settings["list_with_new_msku"];
			this.props.updateUserData(ud);
			let data = {list_with_new_msku: ud.settings["list_with_new_msku"]};
			this.props.updateUserSettings(data);
		}
  }

	render() {
    const {
      list_price,
      buy_cost,
      quantity,
      min_price,
      max_price,
      tax_code,
      list_price_rule_type,
      list_price_rule_amount,
      price_rule_type,
      price_rule_direction,
      default_list_price,
      grading_options,
      pricing_options,
      keepa_date_range,
	  condition,
    } = this.state;

		let {internationalConfig} = this.props;

		return (
      <Fragment>
        <Card style={{overflow: "inherit"}}>
		  <CardBody>
			  <Row>
            <p>
              These are the default settings for listing an items, whenever you create
              a new batch. If you make changes to listing presets INSIDE a specific
              batch, those changes will not propagate to other batches.
              <strong> This is the only place to make global changes to your default listing settings.</strong>
            </p>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardBody>
							<Table>
							  <tbody>
								{["match_buy_box_price", "price"].indexOf(list_price_rule_type) === -1 &&
								  <tr>
									<td className="presetsTableBorderLeft align-middle col-form-label">List Price</td>
									<td className="presetsTableBorderRight">
									  <InputGroup>
										<InputGroupAddon addonType="prepend">{internationalConfig.currency_identifier}</InputGroupAddon>
										<Input
										  type="number"
										  step="0.1"
										  onChange={this.handleChangeListPriceInput}
										  value={list_price || ""}
										/>
									  </InputGroup>
									</td>
								  </tr>
								}
								<tr>
								  <td className="presetsTableBorderLeft align-middle col-form-label">Buy Cost</td>
								  <td className="presetsTableBorderRight" >
									<InputGroup>
									  <InputGroupAddon addonType="prepend">{internationalConfig.currency_identifier}</InputGroupAddon>
									  <Input
										type="number"
										step="0.1"
										value={buy_cost || ""}
										onChange={this.handleChangeBuyCostInput}
									  />
									</InputGroup>
								  </td>
								</tr>
								<tr>
								  <td className="presetsTableBorderLeft align-middle col-form-label">Quantity</td>
								  <td className="presetsTableBorderRight" >
									<Input
									  type="number"
									  step="1"
									  value={quantity || ""}
									  onChange={this.handleChangeQuantityInput}
									/>
								  </td>
								</tr>
								<tr>
								  <td className="presetsTableBorderLeft align-middle col-form-label">Min Price</td>
								  <td className="presetsTableBorderRight" >
									<InputGroup>
									  <InputGroupAddon addonType="prepend">{internationalConfig.currency_identifier}</InputGroupAddon>
									  <Input
										type="number"
										step="0.1"
										value={min_price || ""}
										onChange={this.handleChangeMinPriceInput}
									  />
									</InputGroup>
								  </td>
								</tr>
								<tr>
								  <td className="presetsTableBorderLeft align-middle col-form-label">Max Price</td>
								  <td className="presetsTableBorderRight" >
									<InputGroup>
									  <InputGroupAddon addonType="prepend">{internationalConfig.currency_identifier}</InputGroupAddon>
									  <Input
										type="number"
										step="0.1"
										value={max_price || ""}
										onChange={this.handleChangeMaxPriceInput}
									  />
									</InputGroup>
								  </td>
								</tr>
								<tr>
								  <td  className="presetsTableBorderLeft align-middle col-form-label">Tax Code</td>
								  <td className="presetsTableBorderRight" >
									<TaxCodeInputForm
									  value={tax_code || ""}
									  onChange={this.handleChangeTaxCodeInput}
									/>
								  </td>
								</tr>
							  </tbody>
						  </Table>
					  </CardBody>
				</Card>
			</Col>
			<Col>
				<Card>
					<CardBody>
						  <FormGroup>
						<div className="text-center">
							<CardTitle>Item Options</CardTitle>
						</div>
						<FormGroup>
						  <Row>
							<Col xs="8" style={{ display: "flex", alignItems: "center" }}>
							  <label className="text-left full-width" style={{ marginBottom: "0 !important" }}>
								Default condition
							  </label>
							</Col>
							<Col xs="4">
							  <Select
								className="text-left"
								name="default_conditions"
								value={ condition }
								clearable={false}
								options={ListBatchItemConditions}
								onChange={ (option) => this.updateCondition('condition', !!option ? option.value : '')}
							  />
							</Col>
						  </Row>
						  <hr />
					  </FormGroup>
							<div className="text-center">
								<CardTitle>List Price Rule</CardTitle>
							</div>
							  <Select
								className="text-left"
								name="list_price_rule_type"
								value={ list_price_rule_type }
								options={ ListPriceRuleOptions }
								onChange={ (option) => this.updateRule('list_price_rule_type', !!option ? option.value : '')}
							  />
							  {
								(list_price_rule_type === 'lowest_fba_offer') &&
								<div className="child-controls" id="default-price">
								  <br />
								  <FormGroup>
								  <label className="text-left full-width">
									Price When Data is Unavailable:
								  </label>
									<InputGroup>
									  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
									  <Input
										className="form-control"
										placeholder="Default Price"
										name="default_list_price"
										type="number"
										value={default_list_price}
										onChange={(event) => this.setState({default_list_price: event.target.value})}
									  />
									</InputGroup>
								  </FormGroup>
								</div>
							  }
							  {
								(list_price_rule_type === 'fixed_value') &&
								<div className="child-controls" id="default-price">
								  <FormGroup className="mt-3">
									<InputGroup>
									  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
									  <Input
										className="form-control"
										placeholder="Enter Value"
										name="list_price"
										type="number"
										value={list_price}
										onChange={(event) => this.setState({list_price: event.target.value})}
									  />
									</InputGroup>
								  </FormGroup>
								</div>
							  }
							  {
								(list_price_rule_type === 'match_buy_box_price') &&
								<div className="child-controls" id="default-price">
								  <br />
								  <FormGroup>
								  <label className="text-left full-width">
									Price When Data is Unavailable:
								  </label>
									<InputGroup>
									  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
									  <Input
										className="form-control"
										placeholder="Default Price"
										name="default_list_price"
										type="number"
										value={default_list_price}
										onChange={(event) => this.setState({default_list_price: event.target.value})}
									  />
									</InputGroup>
								  </FormGroup>
								</div>
							  }
							  {
								list_price_rule_type === 'price' && (price_rule_direction === 'roi' || price_rule_direction === 'profit_margin') &&
								<div className="child-controls" id="price">
								  <FormGroup className="mt-3">
									  <Row>
										  <Col md="8">
											  <InputGroup>
												<Input
												  placeholder="Enter Value"
												  type="number"
												  name="list_price_rule_amount"
												  value={ list_price_rule_amount }
												  onChange={(event) => this.handleChange('list_price_rule_amount', event.target.value)}
												  className="form-control"
												/>
												<InputGroupAddon addonType="append">%</InputGroupAddon>
											  </InputGroup>
										  </Col>
									  </Row>
								  </FormGroup>

								  <FormGroup>
									<Select
									  className="text-left"
									  name="price_rule_direction"
									  value={  price_rule_direction }
									  options={ ListPriceDirectionRuleOptions }
									  onChange={ (option) => this.handleChange("price_rule_direction", !!option ? option.value : '')}
									/>
									<br />
									<label className="text-left full-width">
									  Price When Fees are Unavailable:
									</label>
									<InputGroup>
									  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
									  <Input
										className="form-control"
										name="default_list_price"
										type="number"
										value={default_list_price}
										onChange={(event) => this.setState({default_list_price: event.target.value})}
									  />
									</InputGroup>
								  </FormGroup>
								</div>
							  }
							  {
								list_price_rule_type === 'price' &&
								price_rule_direction !== 'roi' &&
								price_rule_direction !== 'profit_margin' &&
								<div className="child-controls" id="price">
								  <FormGroup className="mt-3">
									  <Row>
										  <Col md="8">
											  <Input
												placeholder="Enter Value"
												type="number"
												name="list_price_rule_amount"
												value={ list_price_rule_amount }
												onChange={(event) => this.handleChange('list_price_rule_amount', event.target.value)}
												className="form-control"
											  />
										  </Col>
										  <Col md="4" className="pl-0">
											<ButtonGroup>
											  <Button
												color="success"
												onClick={ () => this.handleChange("price_rule_type", true)}
												active={price_rule_type === true}>$</Button>
											  <Button
												color="success"
												onClick={ () => this.handleChange("price_rule_type", false)}
												active={price_rule_type === false}>%</Button>
											</ButtonGroup>
										  </Col>
									  </Row>
								  </FormGroup>

								  <FormGroup>
									<Select
									  className="text-left"
									  name="price_rule_direction"
									  value={  price_rule_direction }
									  options={ ListPriceDirectionRuleOptions }
									  onChange={ (option) => this.handleChange("price_rule_direction", !!option ? option.value : '')}
									/>
									<br />
									<label className="text-left full-width">
									  Price When Data is Unavailable:
									</label>
									<InputGroup>
									  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
									  <Input
										className="form-control"
										name="default_list_price"
										type="number"
										value={default_list_price}
										onChange={(event) => this.setState({default_list_price: event.target.value})}
									  />
									</InputGroup>
								  </FormGroup>
								</div>
							  }
							  <hr />
						  </FormGroup>
						<div className="text-center">
							<CardTitle>Batch Options</CardTitle>
						</div>
						<Toggle label={"Pricing Options"} checked={pricing_options} onChange={this.handlePricingToggle} />
						<Toggle label={"Grading Options"} checked={grading_options} onChange={(event) => this.setState({grading_options: event.target.checked})} />
						<FormGroup>
						  <Row>
							<Col xs="8" style={{ display: "flex", alignItems: "center" }}>
							  <label className="text-left full-width" style={{ marginBottom: "0 !important" }}>
								Keepa graph range
							  </label>
							</Col>
							<Col xs="4">
							  <Select
								className="text-left"
								name="keepa_date_range"
								clearable={false}
								value={this.getObjectOfGraphOptions(keepa_date_range)}
								options={rangeGraphOptions}
								onChange={ (option) => this.setState({ keepa_date_range: !!option ? option.numberValue : null})}
							  />
							</Col>
						  </Row>
					  </FormGroup>
						{this.props.userData && this.props.userData.settings ?
							<Toggle label={"Always list with new MSKU"} checked={this.props.userData.settings.list_with_new_msku} onChange={this.mskuToggleChanged} />
							: null
						}
					</CardBody>
				</Card>
			</Col>
		</Row>
        </CardBody>
      </Card>
	  <Col xs="12" className="mt-4" style={{ display: 'flex', justifyContent: 'center'}}>
		  <div>
		  <Button
			  onClick={this.saveNewDefaults}
			  color="success"
			  disabled={this.state.saveMessageFlashing}
		  >Save new defaults</Button>
		  <br />
			{ this.state.saveMessageFlashing
				? (
					<label>
						Listing defaults saved
					</label>
				  )
				: (null)
			}
		  </div>
      </Col>
    </Fragment>
		);
	}
}

ListingDefaults.propTypes = {
  fetchListingDefaults: PropTypes.func.isRequired,
  listingDefaults: PropTypes.object.isRequired,
  saveListingDefaults: PropTypes.func.isRequired,
  userError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    userData: state.Auth.get("userData"),
    listingDefaults: state.Settings.get('listingDefaults'),
    internationalConfig: state.Auth.get("internationalization_config")
})


export default connect(mapStateToProps, settingsActions)(ListingDefaults);
