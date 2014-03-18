import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Col,
  Row,
  Badge,
  Input
} from "reactstrap";
import PropTypes from "prop-types";
import moment from "moment";
//import DatePicker from "react-datepicker";
//import DatePickerCustomInput from "../displays/shared/DatePickerCustomInput";
import PriceTrackersButtonGroup from "../displays/shared/PriceTrackersButtonGroup";
import TaxCodeInputForm from "../../../../shared/components/taxCodeInputForm";
import "./style.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  validateFloatInput,
  momentDateIsValid,
  momentDateToISOFormatConversion,
  secureProtocolImgURL,
  momentDateToLocalFormatConversion,
} from "../../../../helpers/utility";
import {
  checkPriceLimit
} from "../../../../helpers/batch/utility";
import MaskedInput from 'react-text-mask';

class EditListingItemModalForClosed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingItem: {
        qty: "",
        price: "",
        note: "",
        expDate: moment(),
        buyCost: "",
        supplier: "",
        datePurchased: moment(),
        taxCode: "",
		expDateStyle: {},
		expDateDisplay: "",
		datePurchasedStyle: {},
		datePurchasedDisplay: "",
      }
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      listingItem: Object.assign({}, newProps.listingItem)
    });
	this.setState({expDateStyle: {}});
	this.setState({datePurchasedStyle: {}});
	if(newProps.listingItem && newProps.listingItem.expDate){
		this.setState({expDateDisplay: momentDateToLocalFormatConversion(newProps.listingItem.expDate, false)});
	} else {
		this.setState({expDateDisplay: ""});
	}
	if(newProps.listingItem && newProps.listingItem.datePurchased){
		this.setState({datePurchasedDisplay: momentDateToLocalFormatConversion(newProps.listingItem.datePurchased, false)});
	} else {
		this.setState({datePurchasedDisplay: ""});
	}
  }

  handleChangeField = (field, e, isBlurEvent) => {
    let listingItem = this.state.listingItem;
    if (field === "qty") {
      listingItem.qty = Number(e.target.value);
      this.setState({
        listingItem
      });
    }
    if (field === "price") {
      const { batchListingDefaults } = this.props;
      listingItem.price = Number(e.target.value);
      this.setState({
        listingItem: checkPriceLimit(listingItem, batchListingDefaults)
      });
    }
    if (field === "note") {
      listingItem.note = e.target.value;
      this.setState({
        listingItem
      });
    }
    if (field === "expDate") {
      if (momentDateIsValid(e)) {
        listingItem.expDate = momentDateToISOFormatConversion(e);
      } else {
        listingItem.expDate = null;
      }
      this.setState({
        listingItem
      });
    }
	if (field === "expDateNew") {
      if (momentDateToISOFormatConversion(moment(e.target.value)) !== 'Invalid date') {
        listingItem.expDate = momentDateToISOFormatConversion(moment(e.target.value));
		this.setState({expDateStyle: {}});
		this.setState({expDateDisplay: momentDateToLocalFormatConversion(listingItem.expDate, false)});
      } else {
		if(e.target.value === ""){
			this.setState({expDateStyle: {}});
			this.setState({expDateDisplay: ""});
		} else {
			this.setState({expDateStyle: {border: "1px solid #ff0000"}});
			this.setState({expDateDisplay: e.target.value});
		}
        listingItem.expDate = null;
      }
	}
    if (field === "buyCost") {
      const validator = validateFloatInput(isBlurEvent, true);
      const value = validator(e);
      listingItem.buyCost = value;
      this.setState({
        listingItem
      });
    }
    if (field === "supplier") {
      listingItem.supplier = e.target.value;
      this.setState({
        listingItem
      });
    }
    if (field === "datePurchased") {
      if (momentDateIsValid(e)) {
        listingItem.datePurchased = momentDateToISOFormatConversion(e);
      } else {
        listingItem.datePurchased = null;
      }
      this.setState({
        listingItem
      });
    }
	if (field === "datePurchasedNew") {
      if (momentDateToISOFormatConversion(moment(e.target.value)) !== 'Invalid date') {
        listingItem.datePurchased = momentDateToISOFormatConversion(moment(e.target.value));
		this.setState({datePurchasedStyle: {}});
		this.setState({datePurchasedDisplay: momentDateToLocalFormatConversion(listingItem.datePurchased, false)});
      } else {
		if(e.target.value === ""){
			this.setState({datePurchasedStyle: {}});
			this.setState({datePurchasedDisplay: ""});
		} else {
			this.setState({datePurchasedStyle: {border: "1px solid #ff0000"}});
			this.setState({datePurchasedDisplay: e.target.value});
		}
        listingItem.datePurchased = null;
      }
      this.setState({
        listingItem
      });
    }
    if (field === "taxCode") {
      listingItem.taxCode = e.value;
      this.setState({
        listingItem
      });
    }
  };

  checkNumFields = (value, allowEmpty) => {
    if (!allowEmpty && (value <= 0 || value === null)) {
      return true;
    } else {
      return false;
    }
  };

  saveChanges = () => {
    this.props.editListingItem(this.state.listingItem);
    this.props.close();
  };

  render() {
    const { isOpen, close, internationalConfig } = this.props;
    const { listingItem } = this.state;
    const {
      imageUrl,
      name,
      salesrank,
      asin,
      qty,
      price,
      buyCost,
      supplier,
		//expDate,
		//datePurchased,
      taxCode,
    } = listingItem;
    return (
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader>
          <strong>Edit Listing</strong>
          <br />
          <div>
            Here, you will be able to make specific edits to the listing.
          </div>
        </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <Row>
                <Col xs="2" className="col-align-center">
                  <img
                    style={{ width: "80%" }}
                    src={secureProtocolImgURL(imageUrl)}
                    alt="Product Listing"
                  />
                </Col>
                <Col xs="10">
                  <Row>
                    <strong>{`${name}`}</strong>
                  </Row>
                  <br />
                  <Row>
                    <Badge color="primary">{`Rank: ${salesrank}`}</Badge>
                    <Badge
                      style={{ marginLeft: "10px" }}
                      color="info"
                    >{`ASIN: ${asin}`}</Badge>
                  </Row>
                  <br />
                  <Row>
                    <PriceTrackersButtonGroup
                      ASIN={asin}
                      itemName={name}
                      amazonUrl={internationalConfig.amazon_url}
                      keepaBaseUrl={internationalConfig.keepa_url}
                      camelCamelCamelBaseUrl={internationalConfig.camelcamelcamel_url}
                    />
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <br />
          <br />
          <Row>
            <Col xs="6">
			  {/*
              <Row>
                <Col xs="3" className="col-align-center">
                  <strong className="text-center">Exp Date</strong>
                </Col>
                <Col xs="9">
                  <DatePicker
                    customInput={<DatePickerCustomInput />}
                    isClearable={true}
                    dateFormat="L"
                    selected={
                      momentDateIsValid(expDate)
                      ? moment(expDate)
                      : null
                    }
                    onChange={e => this.handleChangeField("expDate", e)}
                  />
                </Col>
			  </Row>
			  */}
              <Row>
                <Col xs="3" className="col-align-center">
                  <strong className="text-center">Exp Date</strong>
                </Col>
                <Col xs="9">
					<MaskedInput
						mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
						guide={true}
						onChange={e => this.handleChangeField("expDateNew", e)}
						style={this.state.expDateStyle}
						className="form-control"
						value={this.state.expDateDisplay}
					/>
                </Col>
              </Row>
			  <br />
			  {/*
              <Row>
                <Col xs="3" className="col-align-center">
                  <strong className="text-center">Date Purchased</strong>
                </Col>
                <Col xs="9">
                  <DatePicker
                    customInput={<DatePickerCustomInput />}
                    isClearable={true}
                    dateFormat="L"
                    selected={
                      momentDateIsValid(datePurchased)
                        ? moment(datePurchased)
                        : null
                    }
                    onChange={e => this.handleChangeField("datePurchased", e)}
                  />
                </Col>
              </Row>
			  */}
              <Row>
                <Col xs="3" className="col-align-center">
                  <strong className="text-center">Date Purchased</strong>
                </Col>
                <Col xs="9">
					<MaskedInput
						mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
						guide={true}
						onChange={e => this.handleChangeField("datePurchasedNew", e)}
						style={this.state.datePurchasedStyle}
						className="form-control"
						value={this.state.datePurchasedDisplay}
					/>
                </Col>
              </Row>
            </Col>
            <Col xs="6">
              <Row>
                <Col xs="3" className="col-align-center">
                  <strong className="text-center">Buy Cost</strong>
                </Col>
                <Col xs="9">
                  <Input
                    type="number"
                    onChange={e => this.handleChangeField("buyCost", e)}
                    onBlur={e => this.handleChangeField("buyCost", e, true)}
                    defaultValue={buyCost === 0 ? "0" : buyCost || ""}
                    className={`${
                      this.checkNumFields(buyCost, true) ? "is-invalid" : ""
                    }`}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs="3" className="col-align-center">
                  <strong className="text-center">Supplier</strong>
                </Col>
                <Col xs="9">
                  <Input
                    onChange={e => this.handleChangeField("supplier", e)}
                    defaultValue={supplier}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs="3" className="col-align-center">
                  <strong className="text-center">Tax Code</strong>
                </Col>
                <Col xs="9">
                  <TaxCodeInputForm
                    onChange={e => this.handleChangeField("taxCode", e)}
                    value={taxCode}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={this.saveChanges}
            disabled={
              this.checkNumFields(buyCost, true) ||
              this.checkNumFields(price) ||
              this.checkNumFields(qty)
            }
          >
            Save Changes
          </Button>
          <Button color="secondary" onClick={close}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

EditListingItemModalForClosed.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  listingItem: PropTypes.object,
  editListingItem: PropTypes.func.isRequired,
  internationalConfig: PropTypes.object.isRequired,
  batchListingDefaults: PropTypes.object.isRequired
};

export default EditListingItemModalForClosed;
