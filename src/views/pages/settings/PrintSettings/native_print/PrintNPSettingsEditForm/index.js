import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, CardBody, Form, FormGroup, Button } from "reactstrap";
import { getDymoPrinters, getZebraPrinters } from "../../../../../../helpers/print_service/utility";
import { native_print } from "../../../../../../helpers/print_service/print_systems";
import { dymo_printer, zebra_printer } from "../../../../../../assets/images";

class PrintNPSettingsEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      step: 1
    };
    this.ref = {};
  }
  UNSAFE_componentWillReceiveProps() {
    this.setState({
      formValues: {
        ...this.state.formValues,
        printer_name: this.props.printerDefaults.printer_name,
        manufacturer: this.props.printerDefaults.manufacturer,
        label_type: this.props.printerDefaults.label_type,
        label_width: this.props.printerDefaults.label_width,
        label_height: this.props.printerDefaults.label_height,
        orientation: this.props.printerDefaults.orientation,
        print_while_scanning: this.props.printerDefaults.print_while_scanning,
        print_while_scanning_box_contents: this.props.printerDefaults.print_while_scanning_box_contents
      }
    });
  }

  saveNewDefaults = () => {
    if (this.state.formValues.manufacturer === "Dymo") {
      this.props.savePrinterDefaults({
        printer_system: native_print,
        manufacturer: this.state.formValues.manufacturer,
        printer_name: this.state.formValues.printer_name,
        print_while_scanning: this.state.formValues.print_while_scanning,
        print_while_scanning_box_contents: this.state.formValues.print_while_scanning_box_contents,
        label_type: this.state.formValues.label_type
      });
    } else {
      this.props.savePrinterDefaults({
        printer_system: native_print,
        manufacturer: this.state.formValues.manufacturer,
        printer_name: this.state.formValues.printer_name,
        print_while_scanning: this.state.formValues.print_while_scanning,
        print_while_scanning_box_contents: this.state.formValues.print_while_scanning_box_contents,
        orientation: this.state.formValues.orientation,
        label_height: this.state.formValues.label_height,
        label_width: this.state.formValues.label_width
      });
    }
    this.props.toggleEditMode();
  };
  handleChange = e => {
    this.setValue(e.target);
  };
  setValue = target => {
    if (!target) {
      return;
    }
    const { name, value } = target;
    let finalValue = value;
    if (name === "print_while_scanning" || name === "print_while_scanning_box_contents") {
      if (value === "false") {
        finalValue = false;
      } else {
        finalValue = true;
      }
    }
    this.setState(prevState => {
      return {
        ...prevState,
        formValues: {
          ...prevState.formValues,
          [name]: finalValue
        }
      };
    });
  };

  selectManufacturer(manufacturer) {
    if (manufacturer) {
      this.setState({
        formValues: {
          ...this.state.formValues,
          manufacturer
        },
        step: 2
      });
    }
  }
 
  renderDymoFields() {
    if (this.state.formValues.manufacturer === "Dymo") {
      return (
        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 label">Label Type</div>
            <div className="col-sm-9">
              <select
                className="form-control m-b"
                name="label_type"
                id="label_type"
                defaultValue={this.state.formValues.label_type || ""}
                onChange={this.handleChange}
                ref={this.setValue}
              >
                <option disabled value="">
                  Choose a Label
                </option>
                <option value="30252">30252</option>
                <option value="30334">30334</option>
                <option value="30336">30336</option>
              </select>
            </div>
          </div>
        </div>
      );
    }
  }
  renderZebraFields() {
    if (this.state.formValues.manufacturer === "Zebra") {
      return (
        <React.Fragment>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-3 label">Orientation</div>
              <div className="col-sm-9">
                <select
                  className="form-control m-b"
                  name="orientation"
                  id="orientation"
                  defaultValue={
                    this.props.printerDefaults.orientation || "Landscape"
                  }
                  onChange={this.handleChange}
                  ref={this.setValue}
                >
                  <option disabled value="">
                    Choose orientation
                  </option>
                  <option value="Landscape">Landscape</option>
                  <option value="Portrait">Portrait</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-3 label">Label Width</div>
              <div className="col-sm-9">
                <input
                  name="label_width"
                  id="label_width"
                  placeholder="in inches"
                  type="number"
                  className="form-control"
                  onChange={this.handleChange}
                  ref={this.setValue}
                  defaultValue={this.props.printerDefaults.label_width || "0"}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-3 label">Label Height</div>
              <div className="col-sm-9">
                <input
                  name="label_height"
                  id="label_height"
                  placeholder="in inches"
                  type="number"
                  className="form-control"
                  onChange={this.handleChange}
                  ref={this.setValue}
                  defaultValue={this.props.printerDefaults.label_height || "0"}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
  renderManufacturerForm() {
    let printers = [];
    if (this.state.formValues.manufacturer === "Dymo") {
      printers = getDymoPrinters();
      if (!printers || printers.length === 0) {
        return (
          <div className="row">
            <div className="col-sm-12">
              <h4>No Printers Found. Easy Setup in 3 Steps!</h4>
              <p>
                1){" "}
                <strong>
                  Re-Download the DYMO drivers{" "}
                  <a href="https://www.dymo.com/en-US/dymo-user-guides" style={{color: "black"}}>here</a>
                  .
                </strong>{" "}
                They frequently change and make printers incompatible, so
                double-check to make sure you have the newest version..
              </p>
              <p>
                2) <strong>Install the printer</strong> onto your system.
              </p>
              <p>
                3) <strong>Refresh the page</strong>, and the printer will be
                available! (Sometimes, you may need to restart your computer or
                browser for the driver updates to take effect.)
              </p>
            </div>
          </div>
        );
      }
    } else if (this.state.formValues.manufacturer === "Zebra") {
      printers = getZebraPrinters();
      if (!printers || printers.length === 0) {
        return (
          <div className="row">
            <div className="col-sm-12">
              <h4>No Printers Found. Easy Setup in 3 Steps!</h4>
              <p>
                1){" "}
                <strong>
                  Re-Download the Zebra drivers{" "}
                  <a style={{color: "black"}} href="https://www.zebra.com/us/en/support-downloads.html">
                    here
                  </a>
                  .
                </strong>{" "}
                They frequently change and make printers incompatible, so
                double-check to make sure you have the newest version..
              </p>
              <p>
                2) <strong>Install the printer</strong> onto your system.
              </p>
              <p>
                3) <strong>Refresh the page</strong>, and the printer will be
                available! (Sometimes, you may need to restart your computer or
                browser for the driver updates to take effect.)
              </p>
              <p>
                4) <strong>jsPrintSetup</strong> addon needs to be installed for
                Zebra Printer (requires{" "}
                <a href="https://www.mozilla.org/en-US/firefox/organizations/all/#legacy">
                  Firefox ESR 52
                </a>
                )
              </p>
            </div>
          </div>
        );
      }
    }
    return (
      <React.Fragment>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 label">Printer</div>
            <div className="col-sm-9">
              <select
                className="form-control m-b"
                name="printer_name"
                id="printer_name"
                defaultValue={
                  this.props.printerDefaults.printer_name ||
                  (printers.length > 0 ? printers[0].name : "")
                }
                onInput={this.handleChange}
                ref={this.setValue}
              >
                <option disabled value="">
                  Choose a Printer
                </option>
                {printers.map(printer => {
                  return (
                    <option key={"p-" + printer.name} value={printer.name}>
                      {printer.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        {this.renderDymoFields()}
        {this.renderZebraFields()}
        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 label">Print While Scanning in Batch?</div>
            <div className="col-sm-9">
              <select
                className="form-control m-b"
                name="print_while_scanning"
                id="print_while_scanning"
                defaultValue={this.props.printerDefaults.print_while_scanning}
                onChange={this.handleChange}
                ref={this.setValue}
              >
                <option disabled value="">
                  Choose an option
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 label">Print While Scanning in Box Contents?</div>
            <div className="col-sm-9">
              <select
                className="form-control m-b"
                name="print_while_scanning_box_contents"
                id="print_while_scanning_box_contents"
                defaultValue={this.props.printerDefaults.print_while_scanning_box_contents}
                onChange={this.handleChange}
                ref={this.setValue}
              >
                <option disabled value="">
                  Choose an option
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-group text-center">
          <button
            type="button"
            className="mb-2 btn btn-success"
            onClick={this.saveNewDefaults}
          >
            Save
          </button>
        </div>
      </React.Fragment>
    );
  }
  renderSettingsForm() {
    let formStep = null;
    switch (this.state.step) {
      case 1:
        formStep = (
          <FormGroup row>
            <Col sm={12} className="text-center">
              Choose manufacturer
            </Col>
            <Col sm={6} className="text-center logo logo-padding">
              <img
                src={dymo_printer}
                alt="Dymo"
                onClick={() => {
                  this.selectManufacturer("Dymo");
                }}
              />
            </Col>
            <Col sm={6} className="text-center logo">
              <img
                className="zebra"
                src={zebra_printer}
                alt="Zebra"
                onClick={() => {
                  this.selectManufacturer("Zebra");
                }}
              />
            </Col>
          </FormGroup>
        );
        break;
      case 2:
        formStep = this.renderManufacturerForm();
        break;
      default:
        break;
    }
    return (
      <CardBody>
        <Form>
          <FormGroup row>
            <Col sm={12} className="text-center">
              <Button
                color="primary"
                className="mb-2"
                onClick={this.props.toggleEditMode}
              >
                Cancel
              </Button>
            </Col>
          </FormGroup>
        </Form>
        {formStep}
      </CardBody>
    );
  }
  render() {
    return (
      <React.Fragment>
        {this.renderSettingsForm()}
      </React.Fragment>
    );
  }
}

PrintNPSettingsEditForm.propTypes = {
  toggleEditMode: PropTypes.func.isRequired,
  printerDefaults: PropTypes.object.isRequired,
  savePrinterDefaults: PropTypes.func.isRequired,
};

export default PrintNPSettingsEditForm;
