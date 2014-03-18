import React, { Component } from 'react';
import {
   Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Label, Input, FormGroup, Form, Col, InputGroup, InputGroupAddon, InputGroupText
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import { generateTrackingSpreadsheetAndExport } from '../exportCSV';
import moment from "moment";
import {
  momentDateToLocalFormatConversion,
  momentDateToISOFormatConversion,
  momentDateIsValid
} from "../../../../helpers/utility";
import '../style.css';

class ExportTrackingSpreadsheetModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: momentDateToISOFormatConversion(),
      exportTypeSelected: 1,
      shippingCost: '',
      validShippingCost: true,
      validDateShipped: true
    }
  }

  handleChange(date) {
    this.setState({
      startDate: momentDateToISOFormatConversion(date),
      validDateShipped: true
    });

  }
  handleShippingCostChange = (e) => {
    this.setState({
      shippingCost: e.target.value,
      validShippingCost: true
    })
  }
  trackingSpreadsheetAndExport = () => {
    if (this.state.shippingCost.length === 0 || !parseFloat(this.state.shippingCost) || parseFloat(this.state.shippingCost) === 0){
      this.setState({
        validShippingCost: false
      })
    } else {
      if (this.state.startDate === null){
        this.setState({
          validDateShipped: false
        })
      } else {
        generateTrackingSpreadsheetAndExport(
          this.props.products,
          parseFloat(this.state.shippingCost),
			momentDateToLocalFormatConversion(this.state.startDate),
			this.props.batchMetadata.batchName,
		);
        this.props.close();
      }
    }
  }
  render() {
    let { isOpen, close } = this.props;
    const { validDateShipped, validShippingCost }= this.state;
    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>
          <div>Tracking Spreadsheet</div>
          <small className="font-bold">
            We're integrated with
            <a href="https://thebookflipper.com/track/">
              <strong>TheBookFlipper</strong>'s tracking spreadsheet
            </a>.
            Export our data to easily handle your FBA accounting needs.
          </small>
        </ModalHeader>
        <ModalBody>
            <Form className="form-horizontal">
              <FormGroup>
                <Label className="col-4">Shipping Cost</Label>
                <Col lg="6">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="number"
                      step="0.1"
                      style={{ "display": "block" }}
                      onChange={this.handleShippingCostChange}
                      value={this.state.shippingCost}
                      invalid = {!validShippingCost}
                      />
                  </InputGroup>
                </Col>
              </FormGroup>
              <div className="form-group">
                <Label className="col-4">Date Shipped</Label>
                <Col lg="6">
                  <DatePicker
                    selected={momentDateIsValid(this.state.startDate)
                      ? moment(this.state.startDate)
                    : null}
                    onChange={this.handleChange.bind(this)}
                    className={`form-control ${!validDateShipped && 'is-invalid'}`}
                  />
                </Col>
              </div>
            </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={close}>Cancel</Button>
          <Button color="primary" onClick={this.trackingSpreadsheetAndExport}>Export to Tracking Spreadsheet</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ExportTrackingSpreadsheetModal.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
	products: PropTypes.instanceOf(Array).isRequired,
	batchMetadata: PropTypes.instanceOf(Array).isRequired,
}
export default ExportTrackingSpreadsheetModal;
