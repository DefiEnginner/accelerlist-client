import React, { Component } from "react";
import { TabPane, FormGroup, Row, Col, InputGroup, InputGroupAddon, Input, ButtonGroup, Button } from "reactstrap";
import {checkConditionIsUsedOrNew, checkNumberIsPositive} from '../../../../../helpers/batch/utility';
import Select from "react-select";
import PropTypes from "prop-types";
import Toggle from "../../../../../shared/components/Toggle";
import Tooltip from "../../../../../shared/components/Tooltip";
import './style.css';
import { ListPriceRuleOptions, ListPriceDirectionRuleOptions } from "../../../../../helpers/settings/list_price_data";
import { amazonLogoSmall, ebayLogo } from '../../../../../assets/images';

class WorkflowTabPane extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newPrice: null,
      usedPrice: null
    };
  }

  updateRule = (name, value) => {
    let { batchListingDefaults, updateListingDefaultsData } = this.props;
    let conditionIsUsedOrNew = !!batchListingDefaults && !!batchListingDefaults.condition && checkConditionIsUsedOrNew(batchListingDefaults.condition);
    if(value === 'match_buy_box_price' && !conditionIsUsedOrNew) {
      this.props.userError("Change the condition in Notes tab to Used/New!");
      return;
    }
    if (value !== "fixed_value") {
      updateListingDefaultsData('price', "");
    }

    updateListingDefaultsData(name, value);
    !!batchListingDefaults.listPriceRuleAmount && updateListingDefaultsData("listPriceRuleAmount", '');
    !!batchListingDefaults.priceRuleType && updateListingDefaultsData("priceRuleType", '');
    !!batchListingDefaults.priceRuleDirection && updateListingDefaultsData("priceRuleDirection", '');
  }

  handleChange = (name, value) => {
    let { updateListingDefaultsData, userError, batchListingDefaults } = this.props;
    let conditionIsUsedOrNew = !!batchListingDefaults && !!batchListingDefaults.condition && checkConditionIsUsedOrNew(batchListingDefaults.condition);
    let buyCostIsPositive = !!batchListingDefaults  && !!batchListingDefaults.buyCost && checkNumberIsPositive(batchListingDefaults.buyCost);
    if(name === "priceRuleDirection") {
      if(["higher_than_buy_box", "lower_than_buy_box"].indexOf(value) > -1 && !conditionIsUsedOrNew) {
        userError("Please change the default condition in Notes tab to Used/New to select this auto-price rule!");
        return;
      }
      if(value === 'roi' || value === 'profit_margin') {
        if (!buyCostIsPositive) {
          userError("Please change the buy cost to a number greater than zero, to select this auto-price rule!");
          return;
        }
        updateListingDefaultsData('priceRuleType', null);
      }
    } else if (name === "gradingOptions" && value === false && (batchListingDefaults.condition === null || batchListingDefaults.condition === "NoDefault")) {
      userError("To disable the grading options please change batch default condition to value other than NoDefault");
      return;
    } else if (name === "pricingOptions" && value === false && (batchListingDefaults.listPriceRuleType === "" || batchListingDefaults.listPriceRuleType === "own-price")) {
      userError("To disable the pricing options please change batch default price rule to value other than Own Value");
      return;
    }
    updateListingDefaultsData(name, value);
  }

  handleChangeBatchMetadata = (name, value) => {
	if(name === 'printWhileScan'){
		var data = this.props.batchMetadata;
		data[name] = value;
		this.props.batchMetadataUpdate(data);
	}
  }

  render(){
    let {
      tabId,
		batchListingDefaults,
    } = this.props;

    console.log("Batch Defaults: ", batchListingDefaults);

    return (
      <TabPane tabId={tabId}>
        <br />
        <div style={{textAlign: "center", color: "grey"}}>
          <div className="content-section">
            <FormGroup>
                <h3 className="separator-heading"><span>List Price Rule</span><hr /></h3>
                <div style={{ position: "relative" }}>
                  <Select
                    className="text-left"
                    style={{ width: "90%" }}
                    name="listPriceRuleType"
                    value={ batchListingDefaults.listPriceRuleType }
                    options={ ListPriceRuleOptions }
                    onChange={ (option) => this.updateRule('listPriceRuleType', !!option ? option.value : '')}
                  />
                  <Tooltip
                    tooltipStyle={{ position: "absolute", top: "10px", right: "-5px" }}
                    tooltipId="WorkflowTabPane_List_Price"
                    tooltipText="Select a default pricing option from the drop down to speed up your workflow."
                  />
                </div>
                {
                  (batchListingDefaults.listPriceRuleType === 'lowest_fba_offer') &&
                  <div className="child-controls" id="default-price">

                    <FormGroup>
                    <label className="text-left full-width">
                      Price When Data is Unavailable:
                    </label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        <Input
                          className="form-control"
                          placeholder="Default Price"
                          name="defaultListPrice"
                          type="number"
                          value={batchListingDefaults.defaultListPrice}
                          onChange={(event) => this.props.updateListingDefaultsData('defaultListPrice', event.target.value)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </div>
                }
                {
                  (batchListingDefaults.listPriceRuleType === 'fixed_value') &&
                  <div className="child-controls" id="default-price">
                    <FormGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        <Input
                          className="form-control"
                          placeholder="Enter Value"
                          name="price"
                          type="number"
                          value={batchListingDefaults.price}
                          onChange={(event) => this.props.updateListingDefaultsData('price', event.target.value)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </div>
                }
                {
                  (batchListingDefaults.listPriceRuleType === 'match_buy_box_price') &&
                  <div className="child-controls" id="default-price">

                    <FormGroup>
                    <label className="text-left full-width">
                      Price When Data is Unavailable:
                    </label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        <Input
                          className="form-control"
                          placeholder="Default Price"
                          name="defaultListPrice"
                          type="number"
                          value={batchListingDefaults.defaultListPrice}
                          onChange={(event) => this.props.updateListingDefaultsData('defaultListPrice', event.target.value)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </div>
                }
                {
                  batchListingDefaults.listPriceRuleType === 'price' && (batchListingDefaults.priceRuleDirection === 'roi' || batchListingDefaults.priceRuleDirection === 'profit_margin') &&
                  <div className="child-controls" id="price">
                    <FormGroup>
                        <Row>
                            <Col md="8">
                                <InputGroup>
                                  <Input
                                    placeholder="Enter Value"
                                    type="number"
                                    name="listPriceRuleAmount"
                                    value={ batchListingDefaults.listPriceRuleAmount }
                                    onChange={(event) => this.handleChange('listPriceRuleAmount', event.target.value)}
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
                        name="priceRuleDirection"
                        value={  batchListingDefaults.priceRuleDirection }
                        options={ ListPriceDirectionRuleOptions }
                        onChange={ (option) => this.handleChange("priceRuleDirection", !!option ? option.value : '')}
                      />
                      <br />
                      <label className="text-left full-width">
                        Price When Fees are Unavailable:
                      </label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        <Input
                          className="form-control"
                          name="defaultListPrice"
                          type="number"
                          value={batchListingDefaults.defaultListPrice}
                          onChange={(event) => this.props.updateListingDefaultsData('defaultListPrice', event.target.value)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </div>
                }
                {
                  batchListingDefaults.listPriceRuleType === 'price' &&
                  batchListingDefaults.priceRuleDirection !== 'roi' &&
                  batchListingDefaults.priceRuleDirection !== 'profit_margin' &&
                  <div className="child-controls" id="price">
                    <FormGroup>
                        <Row>
                            <Col md="8">
                                <Input
                                  placeholder="Enter Value"
                                  type="number"
                                  name="listPriceRuleAmount"
                                  value={ batchListingDefaults.listPriceRuleAmount }
                                  onChange={(event) => this.handleChange('listPriceRuleAmount', event.target.value)}
                                  className="form-control"
                                />
                            </Col>
                            <Col md="4" className="pl-0">
                              <ButtonGroup>
                                <Button
                                  color="success"
                                  onClick={ () => this.handleChange("priceRuleType", true)}
                                  active={batchListingDefaults.priceRuleType === true}>$</Button>
                                <Button
                                  color="success"
                                  onClick={ () => this.handleChange("priceRuleType", false)}
                                  active={batchListingDefaults.priceRuleType === false}>%</Button>
                              </ButtonGroup>
                            </Col>
                        </Row>
                    </FormGroup>

                    <FormGroup>
                      <Select
                        className="text-left"
                        name="priceRuleDirection"
                        value={  batchListingDefaults.priceRuleDirection }
                        options={ ListPriceDirectionRuleOptions }
                        onChange={ (option) => this.handleChange("priceRuleDirection", !!option ? option.value : '')}
                      />
                      <br />
                      <label className="text-left full-width">
                        Price When Data is Unavailable:
                      </label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        <Input
                          className="form-control"
                          name="defaultListPrice"
                          type="number"
                          value={batchListingDefaults.defaultListPrice}
                          onChange={(event) => this.props.updateListingDefaultsData('defaultListPrice', event.target.value)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </div>
                }
            </FormGroup>
          </div>
          <div className="content-section">
            <div style={{ position: "relative" }}>
              <h3 className="separator-heading">
                <span>Batch Options</span>
                <Tooltip
                  tooltipId="WorkflowTabPane_Batch_Options"
                  tooltipText="Here you can turn off pricing and grading options to speed list your products quickly."
                />
                <hr />
              </h3>
            </div>
			<Toggle
				label={"Pricing Options"}
				checked={batchListingDefaults.pricingOptions}
				onChange={(event) => this.handleChange('pricingOptions', event.target.checked)}
			/>
			<Toggle
				label={"Grading Options"}
				checked={batchListingDefaults.gradingOptions}
				onChange={(event) => this.handleChange('gradingOptions', event.target.checked)}
			/>
          </div>
          <div className="content-section">
            <div style={{ position: "relative" }}>
              <h3 className="separator-heading">
                <span>Research</span>
                <Tooltip
                  tooltipId="WorkflowTabPane_Research"
                  tooltipText="Here you can determine to auto populate research in new tab."
                />
                <hr />
              </h3>
            </div>
            <FormGroup>
              <label className="text-left full-width">
                Auto populate research in new tab
              </label>
              <div className="d-flex justify-content-between">
                <div className="pt-1">
                  <img src={amazonLogoSmall} alt="" width="20" />
                </div>
				<Toggle
					checked={batchListingDefaults.showInNewTabAmazon}
					onChange={(event) => this.handleChange('showInNewTabAmazon', event.target.checked)}
				/>
              </div>
              <div className="d-flex justify-content-between">
                <div className="pt-1">
                  <img src={ebayLogo} alt="" width="20" />
                </div>
				<Toggle
					checked={batchListingDefaults.showInNewTabEbay}
					onChange={(event) => this.handleChange('showInNewTabEbay', event.target.checked)}
				/>
              </div>
            </FormGroup>
          </div>
          <div className="content-section">
            <div style={{ position: "relative" }}>
              <h3 className="separator-heading">
                <span>Print while scanning</span>
                <Tooltip
                  tooltipId="WorkflowTabPane_PrintWhileScaning"
                  tooltipText="Print while scanning items to batch"
                />
                <hr />
              </h3>
            </div>
			<Toggle
				label={"Print labels on each scan"}
				checked={this.props.batchMetadata.printWhileScan}
				onChange={(e) => this.handleChangeBatchMetadata('printWhileScan', e.target.checked)}
			/>
          </div>
        </div>
        <br />
      </TabPane>
    );
  }
}

WorkflowTabPane.propTypes = {
  tabId: PropTypes.string.isRequired,
  batchListingDefaults: PropTypes.object.isRequired,
  currentWorkingListingData: PropTypes.object,
  updateListingDefaultsData: PropTypes.func.isRequired,
  updateCurrentWorkingListingData: PropTypes.func.isRequired,
  updateKeyValue: PropTypes.func.isRequired,
  userError: PropTypes.func.isRequired,
  batchMetadataUpdate: PropTypes.func.isRequired,
  batchMetadata: PropTypes.object.isRequired,
};

export default WorkflowTabPane;
