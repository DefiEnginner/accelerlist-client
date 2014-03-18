import React from 'react';
import {
	Row,
	Col,
	TabPane,
	Input,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PropTypes from 'prop-types';
import TaxCodeInputForm from '../../../../../shared/components/taxCodeInputForm';
import CustomSKUInputForm from '../shared/CustomSKUInputForm';
import CustomSKUTemplateModal from '../../modals/CustomSKUTemplateModal';
import SupplierInputForm from "./SupplierInputForm";
import ScoutInputForm from "./ScoutInputForm";
import { skuNumberConversion } from "../../../../../helpers/batch/utility";
import Tooltip from "../../../../../shared/components/Tooltip";
import AlertPill from "../../../../../shared/components/AlertPill";

/*
This component is used display the batch tab pane, with several input and datepicker
fields. User can set list price, buy cost, and several other standard listing field defaults
here. It is a child component used by the SideBar.

props field expects:
1) tabId: string corresponding to the tab number i.e. "1", "2"
2) batchListingDefaults data corresponding to defaults the user has selected
3) updateListingDefaultsData function that updates redux store with new form changes
*/

class BatchTabPane extends React.Component {
	state = {
		showWarning: false,
	}

	removeWarning = () => {
		this.setState({ showWarning: false });
	  const { userData } = this.props;
		if(userData){
			let ud = userData;
			if(!ud.settings["batch_warning_sku_local"]){
				ud.settings["batch_warning_sku_local"] = 0;
			}
			ud.settings["batch_warning_sku_local"] = ud.settings["batch_warning_sku_local"] + 1;
			this.props.updateUserData(ud);
			let data = {batch_warning_sku_local: ud.settings["batch_warning_sku_local"]};
			this.props.updateUserSettings(data);
		}
	}

	UNSAFE_componentWillMount(){
		if(this.props.userData){
			this.setState({ showWarning: this.props.userData.settings.batch_warning_sku_local < 6 });
		}
	}

  getFieldRequiredStatus = fieldName => {
    const { notValidFields } = this.props;
    if (notValidFields && notValidFields.indexOf(fieldName) !== -1) {
      return true;
    }
    return false;
  }
  render() {
    let {
      batchListingDefaults,
      updateListingDefaultsData,
      tabId,
      updateSKUPrefix,
      showCustomSKUsModal,
      suppliers,
      scouts,
      internationalConfig,
      batchChannel,
      onPriceWasChanged
    } = this.props;
    return (
      <TabPane tabId={tabId}>
        <br />
        {this.state.showWarning ?
        <AlertPill
          icon="warning"
          color="warning"
          outline
          size="sm"
          isOpen={this.state.showWarning}
          onDismiss={this.removeWarning}
        >
          Any changes made here only apply to this batch!
        </AlertPill>
        : null
        }
        <Row>
          <Col sm="12">
            {
              batchChannel === "DEFAULT"
              ? (
                <FormGroup id="shippingTemplate">
                  <Label>
                    <strong>Shipping Template</strong>
                    <Tooltip
                      tooltipId="Shipping_Template"
                      tooltipText="Shipping Template"
                    />
                  </Label>
                  <br />
                  <Input
                    className="form-control form-control-sm batch-tab-input"
                    type="text"
                    value={batchListingDefaults.shippingTemplate || ""}
                    onChange={updateListingDefaultsData.bind(this, "shippingTemplate")}
                    invalid={this.getFieldRequiredStatus("shippingTemplate")}
                  />
                </FormGroup>
              ) : ""
            }
            <FormGroup>
              <Label>
  			  <strong>Use/Edit Custom SKU template</strong>
                <Tooltip
                  tooltipId="Custom_SKU_Template"
                  tooltipText="Here you can edit your custom sku on the fly within the current batch you are working on. It will not affect your global sku settings and thus any changes made here will not be present at the start of your next batch."
                />
              </Label>
              <br />
              <CustomSKUInputForm
                value={batchListingDefaults.shouldUseCustomSkuTemplate}
                onChange={updateListingDefaultsData.bind(this, 'shouldUseCustomSkuTemplate')}
              />
            </FormGroup>
            {!batchListingDefaults.shouldUseCustomSkuTemplate && <FormGroup>
              <Label>
                <strong>{`SKU Prefix`}</strong>
                <strong
                  style={{
                    color: batchListingDefaults.skuPrefix.length >= 36
                    ? "red"
                    : "grey"
                  }}
                >
                  {` ${batchListingDefaults.skuPrefix.length || "0"}/40`}
                  <Tooltip
                    tooltipId="SKU_Prefix"
                    tooltipText="SKU Prefix"
                  />
                </strong>
              </Label>
              <br />
              <Input
                className="form-control form-control-sm batch-tab-input"
                type="text"
                disabled={batchListingDefaults.shouldUseCustomSkuTemplate}
                value={batchListingDefaults.skuPrefix}
                onChange={updateListingDefaultsData.bind(this, "skuPrefix")}
              />
            </FormGroup>}
            { showCustomSKUsModal ?
              <CustomSKUTemplateModal
                isOpen={true}
                skuPrefix={batchListingDefaults.skuPrefix}
                onSaveListingDefaults={(data) => updateSKUPrefix(data)}
                close={this.props.closeCustomSKUModal}
              /> : ""
            }
            <FormGroup>
              <Label>
                <strong>SKU Number</strong>
                <Tooltip
                  tooltipId="SKU_Number"
                  tooltipText="The SKU number helps identify the product within a batch and keeps products in order"
                />
              </Label>
              <br />
              <Input
                className="form-control form-control-sm batch-tab-input"
                min="0"
                type="number"
                value={skuNumberConversion(batchListingDefaults.skuNumber)}
                onChange={updateListingDefaultsData.bind(this, "skuNumber")}
              />
            </FormGroup>
            <FormGroup id="buyCost">
              <Label>
                <strong>Buy Cost</strong>
                <Tooltip
                  tooltipId="Buy_Cost"
                  tooltipText="Your buy costs should be recorded with every new scan of the product so that you can have detailed records for tax purposes"
                />
              </Label>
              <br />
              <Input
                className="form-control form-control-sm batch-tab-input"
                type="number"
                value={batchListingDefaults.buyCost}
                onChange={updateListingDefaultsData.bind(this, "buyCost")}
                invalid={this.getFieldRequiredStatus("buyCost")}
              />
            </FormGroup>
            <FormGroup id="supplier">
              <Label>
                <strong>Supplier</strong>
                <Tooltip
                  tooltipId="Supplier"
                  tooltipText="This field designates where you purchased the product from"
                />
              </Label>
              <br />
              <SupplierInputForm
                suppliers={suppliers}
                value={batchListingDefaults.supplier}
                onChange={updateListingDefaultsData.bind(this, "supplier")}
                isValid={this.getFieldRequiredStatus("supplier")}
              />
            </FormGroup>
            <FormGroup id="scout">
              <Label>
                <strong>Scout</strong>
                <Tooltip
                  tooltipId="Scout"
                  tooltipText="Which scout or employee sourced this product for you"
                />
              </Label>
              <br />
              <ScoutInputForm
                scouts={scouts}
                value={batchListingDefaults.scout}
                onChange={updateListingDefaultsData.bind(this, "scout")}
                isValid={this.getFieldRequiredStatus("scout")}
              />
            </FormGroup>
            {!!batchListingDefaults.listPriceRuleType &&
              batchListingDefaults.listPriceRuleType !== 'price' &&
              batchListingDefaults.listPriceRuleType !== 'match_buy_box_price' &&
              <FormGroup id="price">
                <Label>
                  <strong>List price</strong>
                  <Tooltip
                    tooltipId="List_Price"
                    tooltipText="List price"
                  />
                </Label>
                <br />
                <InputGroup>
                  <InputGroupAddon addonType="prepend">{internationalConfig.currency_identifier}</InputGroupAddon>
                  <Input
                    className="form-control form-control-sm batch-tab-input"
                    type="number"
                    value={batchListingDefaults.price}
                    onChange={updateListingDefaultsData.bind(this, "price")}
                    onBlur={onPriceWasChanged}
                    invalid={this.getFieldRequiredStatus("price")}
                  />
                </InputGroup>
              </FormGroup>
            }
            <FormGroup>
              <Label>
                <strong>Quantity</strong>
                <Tooltip
                  tooltipId="Quantity"
                  tooltipText="Quantity"
                />
              </Label>
              <br />
              <Input
                id="qty"
                className="form-control form-control-sm batch-tab-input"
                type="number"
                value={batchListingDefaults.qty}
                onChange={updateListingDefaultsData.bind(this, "qty")}
                invalid={!batchListingDefaults.qty || batchListingDefaults.qty === ""}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Date Purchased</strong>
                <Tooltip
                  tooltipId="Date_Purchased"
                  tooltipText="This is important to record, especially if you use the purchase date in your custom sku configuration"
                />
              </Label>
              <br />
              <DatePicker
                id="datePurchased"
                selected={
                  batchListingDefaults.datePurchased
                    ? moment(batchListingDefaults.datePurchased)
                    : null
                }
                onChange={updateListingDefaultsData.bind(this, "datePurchased")}
                className={`form-control ${this.getFieldRequiredStatus("datePurchased") ? "datePicker-not-valid" : ""}`}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Exp Date</strong>
                <Tooltip
                  tooltipId="Exp_Date"
                  tooltipText="This is needed for any products that have a shelf life or are perishable such as foods, etc. Amazon will require this field on certain products"
                />
              </Label>
              <br />
              <DatePicker
                id="expDate"
                selected={
                  batchListingDefaults.expDate
                    ? moment(batchListingDefaults.expDate)
                    : null
                }
                onChange={updateListingDefaultsData.bind(this, "expDate")}
                className={`form-control ${this.getFieldRequiredStatus("expDate") ? "datePicker-not-valid" : ""}`}
              />
            </FormGroup>
            <FormGroup id="taxCode">
              <Label>
                <strong>Tax Code</strong>
                <Tooltip
                  tooltipId="Tax_Code"
                  tooltipText="Tax Code"
                />
              </Label>
              <br />
              <TaxCodeInputForm
                value={batchListingDefaults.taxCode}
                onChange={updateListingDefaultsData.bind(this, "taxCode")}
                isValid={this.getFieldRequiredStatus("taxCode")}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Min Price</strong>
                <Tooltip
                  tooltipId="Min_Price"
                  tooltipText="Min Price"
                />
              </Label>
              <br />
              <InputGroup>
                <InputGroupAddon addonType="prepend">{internationalConfig.currency_identifier}</InputGroupAddon>
                <Input
                  className="form-control form-control-sm batch-tab-input"
                  type="number"
                  value={batchListingDefaults.minPrice}
                  onChange={updateListingDefaultsData.bind(this, "minPrice")}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label>
                <strong>Max Price</strong>
                <Tooltip
                  tooltipId="Max_Price"
                  tooltipText="Max Price"
                />
              </Label>
              <br />
              <InputGroup>
                <InputGroupAddon addonType="prepend">{internationalConfig.currency_identifier}</InputGroupAddon>
                <Input
                  className="form-control form-control-sm batch-tab-input"
                  type="number"
                  value={batchListingDefaults.maxPrice}
                  onChange={updateListingDefaultsData.bind(this, "maxPrice")}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </TabPane>
    );
  }
};

BatchTabPane.propTypes = {
  batchListingDefaults: PropTypes.object.isRequired,
  updateListingDefaultsData: PropTypes.func.isRequired,
  tabId: PropTypes.string.isRequired,
  suppliers: PropTypes.array.isRequired,
  scouts: PropTypes.array.isRequired,
  internationalConfig: PropTypes.object.isRequired,
  batchChannel: PropTypes.string,
  onPriceWasChanged: PropTypes.func.isRequired,
  notValidFields: PropTypes.array
};

export default BatchTabPane;
