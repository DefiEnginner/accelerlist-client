import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Tooltip from "../Tooltip";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Col
} from "reactstrap";
import Select from "react-select";
import {
  customSkuHelpDocsURL,
  creatingShippingTemplatesHelpDocsURL
} from "../../../config/mediaLinks";

import batchActions from "../../../redux/batch/actions";
import settingsActions from "../../../redux/settings/actions";
import {
	momentDateToISOFormatConversioniWithFormat,
} from '../../../helpers/utility';

import {
  useSkuTemplateOptions,
  workflowTypeOptions,
  mfWorkflowOptions,
  labelingPreferenceOptions
} from "./constants";

import "./style.css";

const { showBatchModal, hideBatchModal, createNewBatch } = batchActions;
const { fetchListingDefaults } = settingsActions

class CreateBatchModal extends Component {
  constructor() {
    super();
	const batchName = this.createNameForBatch();

    this.state = {
      modal: true,
      modalClass: "modal-createBatch",
	  batchName: batchName,
      skuPrefix: "",
      skuPrefixDisabled: false,
      shippingTemplate: "",
      shippingTemplateIsRequired: false,
	  workflowTypeOptions: workflowTypeOptions,

      //selected option states
      labelingPreference: null,
      showLabelPreference: false,
      selectedShippingFromAddress: null,
      selectedUseSkuTemplate: null,
      selectedChannel: null,
      selectedWorkflowType: null,

      //input validation states
      batchNameValidation: true,
      shippingTemplateValidation: true,
      skuPrefixValidation: true,
      selectedUseSkuTemplateValidation: true,
      selectedShippingFromAddressValidation: true,
      selectedWorkflowTypeValidation: true,
      selectedChannelValidation: true,
      labelingPreferenceValidation: true
    };
  }

	createNameForBatch(){
		let date = momentDateToISOFormatConversioniWithFormat(
				null, "MM/DD/YYYY HH:mmA");
		return date;
	}

  UNSAFE_componentWillMount() {
    this.props.fetchListingDefaults();
  }

  componentDidMount() {
    this.setState({
      selectedWorkflowType: {
        label: "Private",
        value: "private"
      },
		labelingPreference: null,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.mwsAuthValues !== this.props.mwsAuthValues) {
      this.getChannelOptions(nextProps.mwsAuthValues);
    }
    if (nextProps.batchModalVisible === true
      && this.props.batchModalVisible === false ) {
        const { selectedUseSkuTemplate } = this.state;
        if (selectedUseSkuTemplate && selectedUseSkuTemplate.value === "yes") {
          this.setState({
            skuPrefix: this.props.listingDefaults.sku_prefix
          })
		}
		const batchName = this.createNameForBatch();
		this.setState({batchName: batchName});
    }
    return true;
  }

  onInputChange = (inputName, event) => {
    this.setState({
      [inputName]: event.target.value,
      [inputName + "Validation"]: true
    });
  };

  handleSelect = (selectName, selectedOption) => {
    this.setState(
      {
        [selectName]: selectedOption,
        [selectName + "Validation"]: true
      },
      () => {
        if (selectName === "selectedUseSkuTemplate") {
          if (selectedOption && selectedOption.value === "no") {
            this.setState({
              skuPrefix: "",
              skuPrefixDisabled: false,
              skuPrefixValidation: true
            });
          }
          if (selectedOption && selectedOption.value === "yes") {
            this.setState({
              skuPrefix: this.props.listingDefaults.sku_prefix,
              skuPrefixDisabled: true,
              skuPrefixValidation: true
            });
          }
        } else if (selectName === "selectedChannel") {
          const { selectedWorkflowType } = this.state;
          const workflowOptions = this.workflowOptions(selectedOption);
          let newSelectedWorkflowType = selectedWorkflowType;
          if (workflowOptions && selectedWorkflowType) {
            if (workflowOptions.findIndex(el => el.label === selectedWorkflowType.label) === -1) {
              newSelectedWorkflowType = workflowOptions[0]
            }
          }
          if (selectedOption && selectedOption.value === "DEFAULT") {
            this.setState({
              selectedWorkflowType: newSelectedWorkflowType,
              showLabelPreference: false,
              labelingPreference: null,
              shippingTemplateIsRequired: true
            });
          }
          if (selectedOption && selectedOption.value.startsWith("AMAZON_")) {
            this.setState({
              selectedWorkflowType: newSelectedWorkflowType,
              showLabelPreference: true,
              shippingTemplate: "",
              shippingTemplateIsRequired: false,
              shippingTemplateValidation: true,
              labelingPreference: {
                label: "I want to label my products",
                value: "SELLER_LABEL"
              }
            });
          }
        }
      }
    );
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  getChannelOptions = mwsAuthValues => {
    let fbaValue;

    switch (mwsAuthValues.marketplaceId) {
      case "ATVPDKIKX0DER":
        fbaValue = "AMAZON_NA";
        break;
      case "A1F83G8C2ARO7P":
        fbaValue = "AMAZON_EU";
        break;
      case "A2EUQ1WTGCTBG2":
        fbaValue = "AMAZON_NA";
        break;
      default:
        break;
    }

    this.setState({
      selectedChannel: {
        label: "FBA",
        value: fbaValue
      },
      channelOptions: [
        {
          label: "MF",
          value: "DEFAULT"
        },
        {
          label: "FBA",
          value: fbaValue
        }
      ],
      shippingTemplateIsRequired: false,
      showLabelPreference: true,
      labelingPreference: {
        label: "I want to label my products",
        value: "SELLER_LABEL"
      }
    });
  };

  getAddresses = () => {
    const { addressList } = this.props;
    let addresses = [];

    addressList.forEach(function(address) {
      addresses.push({
        label: address.addressName,
        value: address.id
      });
    });

    return addresses;
  };

  handleSubmit = event => {
    const {
      batchName,
      selectedUseSkuTemplate,
      selectedWorkflowType,
      selectedShippingFromAddress,
      selectedChannel,
      skuPrefix,
      labelingPreference,
      shippingTemplate,
	  shippingTemplateIsRequired,
    } = this.state;

    this.setState(
      {
        batchNameValidation: !!batchName && batchName !== "",
        selectedUseSkuTemplateValidation: selectedUseSkuTemplate !== null,
        selectedShippingFromAddressValidation:
          selectedShippingFromAddress !== null,
        selectedWorkflowTypeValidation: selectedWorkflowType !== null,
        selectedChannelValidation: selectedChannel !== null,
        // labelingPreferenceValidation: (selectedChannel !== null && selectedChannel.value === 'DEFAULT') ||  (selectedChannel !== null && selectedChannel.value !== 'DEFAULT' && labelingPreference !== null)
        labelingPreferenceValidation: (!!selectedChannel) && ((selectedChannel.value === 'DEFAULT' && !labelingPreference) || (selectedChannel.value !== 'DEFAULT' && !!labelingPreference)),
        shippingTemplateValidation: (!shippingTemplateIsRequired) || (shippingTemplateIsRequired && !!shippingTemplate),
        skuPrefixValidation: skuPrefix !== ""
      },
      () => {
        const {
          batchNameValidation,
          selectedUseSkuTemplateValidation,
          selectedShippingFromAddressValidation,
          selectedWorkflowTypeValidation,
          selectedChannelValidation,
          labelingPreference,
          labelingPreferenceValidation,
          shippingTemplateValidation,
          skuPrefixValidation
        } = this.state;

        if (
          batchNameValidation &&
          selectedUseSkuTemplateValidation &&
          selectedWorkflowTypeValidation &&
          selectedShippingFromAddressValidation &&
          selectedChannelValidation &&
          labelingPreferenceValidation &&
          shippingTemplateValidation &&
          skuPrefixValidation
        ) {
          let payload = {
            shouldUseCustomSkuTemplate:
              selectedUseSkuTemplate.value === "no" ? false : true,
            workflowType: selectedWorkflowType.value,
            addressId: selectedShippingFromAddress.value,
            channel: selectedChannel.value,
            batchName: batchName,
            skuPrefix: skuPrefix,
            labelingPreference: !!labelingPreference ? labelingPreference.value : labelingPreference,
            shippingTemplate : shippingTemplate
          };
          this.props.createNewBatch(payload);
        }
      }
    );
  };

  toggle = (e, str) => {
    this.setState({
      modal: !this.state.modal,
      modalClass: str
    });
  };

  workflowOptions = (selChannelParam) => {
    if (!selChannelParam) {
      return null;
    }
    switch (selChannelParam.label)
    {
        case "MF": return mfWorkflowOptions;
        default: return workflowTypeOptions;
    }
  }

  hideBatchModal = () => {
    const { hideBatchModal } = this.props;

    this.setState({
      batchNameValidation: true,
      shippingTemplateValidation: true,
      skuPrefixValidation: true,
      selectedUseSkuTemplateValidation: true,
      selectedShippingFromAddressValidation: true,
      selectedWorkflowTypeValidation: true,
      selectedChannelValidation: true,
      labelingPreferenceValidation: true
    });

    hideBatchModal();
  }
  redirectToCustomSKUTemplateSettings = () => {
    this.props.history.push({
      pathname: "/dashboard/settings",
      state: { screenPosition: "SKU_Settings" }
    });
    this.hideBatchModal();
  }
  render() {
    const { batchModalVisible, addressList } = this.props;
    const {
      selectedShippingFromAddress,
      selectedUseSkuTemplate,
      selectedChannel,
      selectedWorkflowType,
      skuPrefix,
      shippingTemplate,
      skuPrefixDisabled,
      showLabelPreference,
      labelingPreference,
      channelOptions,
      batchNameValidation,
      shippingTemplateValidation,
      skuPrefixValidation,
      selectedUseSkuTemplateValidation,
      selectedShippingFromAddressValidation,
      selectedWorkflowTypeValidation,
      selectedChannelValidation,
      labelingPreferenceValidation,
      shippingTemplateIsRequired,
		batchName,
    } = this.state;

    const shippingFromAddresses = addressList ? this.getAddresses() : null;
    return (
      <Modal
        isOpen={batchModalVisible}
        toggle={this.hideBatchModal}
        className={this.state.modalClass}
      >
        <ModalHeader>
          Create a New Batch
          <span>Please enter a new, unique name for your batch.</span>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label for="batchName" sm={3}>
                Batch Name
              </Label>
              <Col
                sm={1}
                className="createBatch-tooltip-contaiter"
              >
                <Tooltip
                    tooltipId="batch_Name"
                    tooltipText={
                      `Best practice is to name the batch with today's date and if you do more than
                      one batch you can use (DATE)1, then (DATE)2, etc`
                    }
                  />
              </Col>
              <Col sm={8}>
                <Input
                  type="text"
                  name="Batch Name"
                  id="batchName"
                  placeholder="Enter a batch name!"
				  value={batchName}
                  onChange={e => this.onInputChange("batchName", e)}
                  invalid={!batchNameValidation}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="skuTemplate" sm={3}>
                Use Custom Template SKU?
              </Label>
              <Col
                sm={1}
                className="createBatch-tooltip-contaiter"
              >
                <Tooltip
                    tooltipId="use_custom_template"
                    tooltipText="Use Custom Template"
                  />
              </Col>
              <Col sm={8}>
                <Select
                  value={selectedUseSkuTemplate}
                  onChange={e => this.handleSelect("selectedUseSkuTemplate", e)}
                  options={useSkuTemplateOptions}
                  style={!selectedUseSkuTemplateValidation
                    || (!skuPrefixValidation && selectedUseSkuTemplate.value === "yes")
                    ? { border: "1px solid red" }
                    : {}}
                  clearable={false}
                />
                <span style={{ color: "red", fontWeight: "bold" }}>
                  We really recommend using a custom sku
                </span>
                <a
                  style={{ fontWeight: "bold", marginLeft: "10px" }}
                  href={customSkuHelpDocsURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find out why here!
                </a>
                { !skuPrefixValidation && selectedUseSkuTemplate && selectedUseSkuTemplate.value === "yes"
                  ? (
                    <span
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={this.redirectToCustomSKUTemplateSettings}
                    >
                      You need a custom SKU template! Click here to set one up.
                    </span>
                  ) : ""
                }

              </Col>
            </FormGroup>
            {
              !skuPrefixDisabled &&
              <FormGroup row>
                <Label for="skuPrefix" sm={3}>
                  SKU Prefix
                </Label>
                <Col
                  sm={1}
                  className="createBatch-tooltip-contaiter"
                >
                  <Tooltip
                      tooltipId="SKU_Prefix"
                      tooltipText={`
                        We don't recommend creating your MSKU but if you must, keep in mind you
                        can't use it again in the same batch for a different product (ASIN)
                      `}
                    />
                </Col>
                <Col sm={8}>
                  <Input
                    type="text"
                    name="SKU Prefix"
                    id="skuPrefix"
                    value={skuPrefix}
                    onChange={e => this.onInputChange("skuPrefix", e)}
                    disabled={skuPrefixDisabled}
                    invalid={!skuPrefixValidation}
                  />
                </Col>
              </FormGroup>
            }
            <FormGroup row>
              <Label for="shippingFrom" sm={3}>
                Shipping From
              </Label>
              <Col
                sm={1}
                className="createBatch-tooltip-contaiter"
              >
                <Tooltip
                    tooltipId="shipping_from"
                    tooltipText={`
                      You can maintain several "shipping from" address in the settings area but
                      choose the one you are sitting at currently
                    `}
                  />
              </Col>
              <Col sm={8}>
                <Select
                  value={selectedShippingFromAddress}
                  onChange={e =>
                    this.handleSelect("selectedShippingFromAddress", e)
                  }
                  options={shippingFromAddresses}
                  style={!selectedShippingFromAddressValidation ? { border: "1px solid red" } : {}}
                  clearable={false}
                />
                <Link
                  style={{ color: "black" }}
                  to="/dashboard/settings"
                  onClick={this.hideBatchModal}
                >
                  Add new SHIP FROM address in settings
                </Link>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="channel" sm={3}>
                Channel
              </Label>
              <Col
                sm={1}
                className="createBatch-tooltip-contaiter"
              >
                <Tooltip
                    tooltipId="channel"
                    tooltipText={`
                      Are you going to be sending in product for Amazon's FBA program or are you
                      going to hold the items with you and wait until they sell and then ship yourself?
                    `}
                  />
              </Col>
              <Col sm={8}>
                <Select
                  value={selectedChannel}
                  onChange={e => this.handleSelect("selectedChannel", e)}
                  options={channelOptions}
                  style={!selectedChannelValidation ? { border: "1px solid red" } : {}}
                  clearable={false}
                />
              </Col>
            </FormGroup>
            {
              shippingTemplateIsRequired
              ? (
                <FormGroup row>
                  <Label for="shippingTemplate" sm={3}>
                    Shipping Template
                  </Label>
                  <Col
                    sm={1}
                    className="createBatch-tooltip-contaiter"
                  >
                    <Tooltip
                        tooltipId="create_batch_channel"
                        tooltipText="Channel"
                      />
                  </Col>
                  <Col sm={8}>
                    <Input
                      value={shippingTemplate || ""}
                      placeholder="Enter a shipping template!"
                      onChange={e => this.onInputChange("shippingTemplate", e)}
                      invalid={!shippingTemplateValidation}
                    />
                    <a
                      href={creatingShippingTemplatesHelpDocsURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn about MF shipping templates
                    </a>
                  </Col>
                </FormGroup>
              ) : ""
            }
            {
              showLabelPreference &&
              <FormGroup row>
                <Label for="labelingPreference" sm={3}>
                Labeling Preference
                </Label>
                <Col
                  sm={1}
                  className="createBatch-tooltip-contaiter"
                >
                  <Tooltip
                      tooltipId="labeling_preference"
                      tooltipText={`
                        Would you like to label the items yourself or pay to have Amazon do it for a
                        small fee per item?
                      `}
                    />
                </Col>
                <Col sm={8}>
                  <Select
                    value={labelingPreference}
                    onChange={e => this.handleSelect("labelingPreference", e)}
                    options={labelingPreferenceOptions}
                    style={!labelingPreferenceValidation ? { border: "1px solid red" } : {}}
                    clearable={false}
                  />
                </Col>
              </FormGroup>
            }
            <FormGroup row>
              <Label for="workflowType" sm={3}>
                Workflow Type
              </Label>
              <Col
                sm={1}
                className="createBatch-tooltip-contaiter"
              >
                <Tooltip
                    tooltipId="workflow_type"
                    tooltipText={`
                      Private is what most people choose and LIVE is for more advanced sellers
                    `}
                  />
              </Col>
              <Col sm={8}>
                <Select
                  value={selectedWorkflowType}
                  onChange={e => this.handleSelect("selectedWorkflowType", e)}
                  options={this.workflowOptions(selectedChannel)}
                  style={!selectedWorkflowTypeValidation ? { border: "1px solid red" } : {}}
                  clearable={false}
                />
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.hideBatchModal}>
            Nevermind
          </Button>
          <Button color="success" onClick={this.handleSubmit}>
            Create Batch
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(
  state => ({
    batchModalVisible: state.Batch.get("batchModalVisible"),
    mwsAuthValues: state.Auth.get("mwsAuthValues"),
    addressList: state.Address.get("addressList"),
    listingDefaults: state.Settings.get("listingDefaults")
  }),
  { showBatchModal, hideBatchModal, createNewBatch, fetchListingDefaults }
)(CreateBatchModal);
