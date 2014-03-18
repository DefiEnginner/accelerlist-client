import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, CardBody, Form, FormGroup, Button, Collapse } from "reactstrap";
import { labelsTypeList } from "../../../../../../helpers/print_service/labelsTypeList";
import { al_print } from "../../../../../../helpers/print_service/print_systems";
import { barCodeTypesOptions, fontSizeCoefficientOptions } from "../../../../../../helpers/print_service/settings_options";
import printerDriverConfigPreset from "../../../../../../helpers/print_service/printer_driver_conf_AL";
import Toggle from "../../../../../../shared/components/Toggle";

class PrintALSettingsEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: null,
      isConnected: false,
      advancedSetup: false,
      isValid_printer_driver_config: true,
      printerDriverConfigList: [],
    };
  }

  componentDidMount() {
    const { setPrinterServiceIsProcessing, qzTrayConnectionStatus } = this.props;
    if (!qzTrayConnectionStatus) {
      setPrinterServiceIsProcessing(true);
      setTimeout(() => {
        setPrinterServiceIsProcessing(false);
      }, 2000);
    }
  }

  static getDerivedStateFromProps(newProps, prevState) {
    const { formValues } = prevState;
    let printerDriverConfigList = [];
    const printerName = formValues && formValues.hasOwnProperty("printer_name")
      ? formValues.printer_name
      : newProps.printerDefaults.printer_name;

    Object.keys(printerDriverConfigPreset).forEach(el => {
      if (printerName.toLowerCase().indexOf(printerDriverConfigPreset[el].tag) > -1) {
        printerDriverConfigList.push({
          value: el,
          name: printerDriverConfigPreset[el].name
        })
      }
    });

    let printerDriverConfigIndex = null;

    if (!!prevState.formValues) {
      printerDriverConfigIndex = printerDriverConfigList.findIndex(
        el => el.value === prevState.formValues.printer_driver_config
      );
    }

    if (!!prevState.formValues && (printerDriverConfigIndex === -1)) {
      return {
        formValues: {
          ...prevState.formValues,
          printer_driver_config: '',
        },
        printerDriverConfigList
      }
    }

    if (!prevState.formValues) {
      return {
        formValues: {
          printer_name: newProps.printerDefaults.printer_name,
          manufacturer: newProps.printerDefaults.manufacturer,
          label_type: newProps.printerDefaults.label_type,
          label_width: newProps.printerDefaults.label_width,
          label_height: newProps.printerDefaults.label_height,
          orientation: newProps.printerDefaults.orientation,
          print_while_scanning: newProps.printerDefaults.print_while_scanning,
          print_while_scanning_box_contents: newProps.printerDefaults.print_while_scanning_box_contents,
          font_size_coefficient: newProps.printerDefaults.font_size_coefficient,
          barcode_type: newProps.printerDefaults.barcode_type,
          printer_driver_config: newProps.printerDefaults.printer_driver_config
        },
        printerDriverConfigList
      }
    }
    return {
      printerDriverConfigList
    };
  }

  saveNewDefaults = () => {
      const { printerDriverConfigList } = this.state;
      const isValid_printer_driver_config = !!this.state.formValues.printer_driver_config;

      if (!isValid_printer_driver_config && printerDriverConfigList.length !== 0) {
        this.setState({
          isValid_printer_driver_config: false,
        })
      } else {
        this.props.savePrinterDefaults({
          printer_system: al_print,
          manufacturer: this.state.formValues.manufacturer,
          printer_name: this.state.formValues.printer_name,
          print_while_scanning: this.state.formValues.print_while_scanning,
          print_while_scanning_box_contents: this.state.formValues.print_while_scannsing_box_contents,
          orientation: this.state.formValues.orientation,
          label_height: this.state.formValues.label_height,
          label_width: this.state.formValues.label_width,
          label_type: this.state.formValues.label_type,
          font_size_coefficient: this.state.formValues.font_size_coefficient,
          barcode_type: this.state.formValues.barcode_type,
          printer_driver_config: printerDriverConfigList.length > 0
            ? this.state.formValues.printer_driver_config
            : '',
        });
        this.props.toggleEditMode();
      }
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    const labelFindIndex = labelsTypeList.findIndex(el => el.lableName === value);
    let orientation = null;
    let labelWidth = null;
    let labelHeight = null;
    let barcodeType = null;
    let fontSizeCoefficient = null;
    let isValid_printer_driver_config = this.state.isValid_printer_driver_config;
    //clear validation

	  /*
    switch (name) {
      case 'printer_driver_config':
        isValid_printer_driver_config = true;
      break;
      default: null;
	}
	*/
	  if(name === 'printer_driver_config'){
		isValid_printer_driver_config = true;
	  }

    if (name === "label_type" && labelFindIndex !== -1) {
      orientation = labelsTypeList[labelFindIndex].orientation;
      labelWidth = labelsTypeList[labelFindIndex].width;
      labelHeight = labelsTypeList[labelFindIndex].height;
      barcodeType = labelsTypeList[labelFindIndex].barcode_type;
      fontSizeCoefficient = labelsTypeList[labelFindIndex].fontSizeCoefficient;
    }
    let finalValue = value;
    if (name === "print_while_scanning" || name === "print_while_scanning_box_contents") {
      if (value === "false") {
        finalValue = false;
      } else {
        finalValue = true;
      }
    }
    if (labelFindIndex !== -1 && orientation && labelWidth && labelHeight) {
      this.setState(prevState => {
        return {
          ...prevState,
          formValues: {
            ...prevState.formValues,
            [name]: finalValue,
            orientation: orientation,
            label_width: labelWidth,
            label_height: labelHeight,
            barcode_type: barcodeType,
            font_size_coefficient: fontSizeCoefficient,
          },
          isValid_printer_driver_config,
        };
      });
    } else {
      this.setState(prevState => {
        return {
          ...prevState,
          formValues: {
            ...prevState.formValues,
            [name]: finalValue,
          },
          isValid_printer_driver_config,
        };
      });
    }
  };

  renderNoConnection = () => {
    return (
      <div className="row">
        <div className="col-sm-12">
          <h4>There is no connection Acceler Print.</h4>
          <h4>Easy Setup in 4 Steps!</h4>
          <p>
            1){" "}
            <strong>
              Download the Acceler Print desktop application{" "}
              <a
                href="https://accelerlist.helpdocs.io/article/fovcv5x20q-installing-acceler-print"
                target="_blank"
                rel="noopener noreferrer"
                style={{color: "black"}}
              >
                here
              </a>
              .
            </strong>{" "}
          </p>
          <p>
            2) <strong>Install the Acceler Print application</strong> onto your system.
          </p>
          <p>
            3) <strong>Run Acceler Print application</strong>
          </p>
          <p>
            4) <strong>Refresh the page</strong>, and Acceler Print application will be connected
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { qzAvaliblePrinters, toggleEditMode, qzTrayConnectionStatus } = this.props;
    const { formValues, advancedSetup, isValid_printer_driver_config, printerDriverConfigList } = this.state;
    let printers = qzAvaliblePrinters || [];
    const labelFindIndex = labelsTypeList.findIndex(el => formValues
        && formValues.hasOwnProperty("label_type")
        && el.lableName === formValues.label_type
      );
    const printerName = formValues && formValues.hasOwnProperty("printer_name") ? formValues.printer_name : (printers.length > 0 ? printers[0] : "");
    const orientation = formValues && formValues.hasOwnProperty("orientation") ? formValues.orientation : "landscape";
    const labelType = formValues && formValues.hasOwnProperty("label_type") ? formValues.label_type : "";
    const labelWidth = formValues && formValues.hasOwnProperty("label_width") ? formValues.label_width : "0";
    const labelHeight = formValues && formValues.hasOwnProperty("label_height") ? parseInt(formValues.label_height, 10)-0.15 : "0";
    const printWhileScanning = formValues && formValues.hasOwnProperty("print_while_scanning") ? formValues.print_while_scanning : false;
    const printWhileScanningBoxContents = formValues && formValues.hasOwnProperty("print_while_scanning_box_contents") ? formValues.print_while_scanning_box_contents : false;
    const barcodeType = formValues && formValues.hasOwnProperty("barcode_type") ? formValues.barcode_type : "CODE39";
    const fontSizeCoefficient = formValues && formValues.hasOwnProperty("font_size_coefficient") ? formValues.font_size_coefficient : 0.9;
    const printerDriverConfig = formValues && formValues.hasOwnProperty("printer_driver_config") ? formValues.printer_driver_config : "";

    return (
      <CardBody>
        <Form>
          <FormGroup row>
            <Col sm={12} className="text-center">
              <Button
                color="primary"
                className="mb-2"
                onClick={toggleEditMode}
              >
                Cancel
              </Button>
            </Col>
          </FormGroup>
        </Form>
          {!qzTrayConnectionStatus ? (
            <React.Fragment>
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-3 label">Printer</div>
                  <div className="col-sm-9">
                    <select
                      className="form-control m-b"
                      name="printer_name"
                      id="printer_name"
                      defaultValue={printerName}
                      onChange={this.handleChange}
                    >
                      <option value="">
                        Choose a Printer
                      </option>
                      {printers.map(printer => {
                        return (
                          <option key={"p-" + printer} value={printer}>
                            {printer}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              {
                printerDriverConfigList.length > 0 && !!printerName ? (
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-3 label">Printer driver config</div>
                      <div className="col-sm-9">
                        <select
                          className="form-control m-b"
                          name="printer_driver_config"
                          id="printer_driver_config"
                          value={printerDriverConfig}
                          onChange={this.handleChange}
                          style={!isValid_printer_driver_config ? { border: "1px solid red" } : {}}
                        >
                          <option value="">
                            Choose a Printer
                          </option>
                          {printerDriverConfigList.map(printerConfig => {
                            return (
                              <option key={"p-" + printerConfig.name} value={printerConfig.value}>
                                {printerConfig.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : ""
              }
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-3 label">Orientation</div>
                  <div className="col-sm-9">
                    <select
                      className="form-control m-b"
                      name="orientation"
                      id="orientation"
                      value={orientation}
                      onChange={this.handleChange}
                    >
                      <option disabled value="">
                        Choose orientation
                      </option>
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-3 label">Label Type</div>
                  <div className="col-sm-9">
                    <select
                      className="form-control m-b"
                      name="label_type"
                      id="label_type"
                      value={labelType}
                      onChange={this.handleChange}
                    >
                      <option disabled value="">
                        Choose a Label
                      </option>
                      {
                        labelsTypeList.map(el => <option key={el.lableName} value={el.lableName}>{el.lableName}</option>)
                      }
                      <option value={"Manual set label size"}>{"Manual set label size"}</option>
                    </select>
                  </div>
                </div>
              </div>
              { labelFindIndex === -1 && (
                  <React.Fragment>
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
                            value={labelWidth}
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
                            value={labelHeight}
                          />
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              }
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-3 label">Print While Scanning in Batch?</div>
                  <div className="col-sm-9">
                    <select
                      className="form-control m-b"
                      name="print_while_scanning"
                      id="print_while_scanning"
                      value={printWhileScanning}
                      onChange={this.handleChange}
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
                      value={printWhileScanningBoxContents}
                      onChange={this.handleChange}
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
              <div className="advanced_setup_container">
                <Toggle
                  label={(<h3 className="separator-heading">Advanced setup</h3>)}
                  checked={advancedSetup}
                  onChange={() => {this.setState({ advancedSetup: !advancedSetup })}}
                />
                <hr />
                <Collapse isOpen={advancedSetup}>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-8 label">Barcode type</div>
                      <div className="col-sm-4">
                        <select
                          className="form-control m-b"
                          name="barcode_type"
                          id="barcode_type"
                          value={barcodeType}
                          onChange={this.handleChange}
                        >
                          <option disabled value="">
                            Choose an option
                          </option>
                          {barCodeTypesOptions.map(el => (
                            <option key={el + Math.random()} value={el}>{el}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-sm-8 label">Label font size coefficient</div>
                      <div className="col-sm-4">
                        <select
                          className="form-control m-b"
                          name="font_size_coefficient"
                          id="font_size_coefficient"
                          value={fontSizeCoefficient}
                          onChange={this.handleChange}
                        >
                          <option disabled value="">
                            Choose an option
                          </option>
                          {fontSizeCoefficientOptions.map(el => (
                            <option key={el + Math.random()} value={el}>{el}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Collapse>
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
          ) : (
            <React.Fragment>
              {this.renderNoConnection()}
            </React.Fragment>
          )}
      </CardBody>
    );
  }
}

PrintALSettingsEditForm.propTypes = {
  toggleEditMode: PropTypes.func.isRequired,
  printerDefaults: PropTypes.object.isRequired,
  savePrinterDefaults: PropTypes.func.isRequired,
  qzAvaliblePrinters: PropTypes.array.isRequired,
  qzTrayConnectionStatus: PropTypes.bool.isRequired,
  setPrinterServiceIsProcessing: PropTypes.func.isRequired,
};

export default PrintALSettingsEditForm;
