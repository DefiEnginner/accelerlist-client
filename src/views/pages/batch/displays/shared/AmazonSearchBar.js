import React, { Component } from "react";
import FaAmazon from "react-icons/lib/fa/amazon";
import { Input, Form } from "reactstrap";
import PropTypes from "prop-types";
//import Tooltip from "../../../../../shared/components/Tooltip";
import { setFocusToAmazonSearchBar } from "../../../../../helpers/batch/utility";
import { searchBarcode } from "../../../../../assets/images";

let keyDownTimer = null;

class AmazonSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstCharTime: 0,
      lastCharTime: 0,
      currStringToAnalyze: "",
      callIsScanner: false,
      options: {
        onComplete: false, // Callback after detection of a successfull scanning (scanned string in parameter)
        onError: false, // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
        onReceive: false, // Callback after receive a char (scanned char in parameter)
        timeBeforeScanTest: 100, // Wait duration (ms) after keypress event to check if scanning is finished
        avgTimeByChar: 30, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
        minLength: 6, // Minimum length for a scanning
        endChar: [9, 13], // Chars to remove and means end of scanning
        stopPropagation: false, // Stop immediate propagation on keypress event
        preventDefault: false // Prevent default action on keypress event
      }
    };
  }

  componentDidMount() {
    this.initScannerDetection();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isLoading && prevProps.isLoading) {
      setFocusToAmazonSearchBar();
    }
  }

  initScannerDetection() {
    this.setState({
      firstCharTime: 0,
      currStringToAnalyze: ""
    });
  }

  onKeyDown(e) {
    let newState = {};
    const inputSymbol = String.fromCharCode(e.which);

    // regexp for filtered keypress like space backspace.
    // Because when you delete input content by backspace (just holding it) an application can define this as a change with a scanner.
    const regexp = /[a-zA-Z0-9]+/gm;

    if (keyDownTimer) {
      // Clear timer for correct detection of the end of data entry
      // Also makes sure that only one instance of the timer is working
      clearTimeout(keyDownTimer);
    }
    if (!inputSymbol.match(regexp)) {
      return;
    }

    if (!this.state.firstCharTime) {
      newState.firstCharTime = e.timeStamp;
    }
    newState.lastCharTime = e.timeStamp;
    newState.currStringToAnalyze =
      this.state.currStringToAnalyze + inputSymbol;
    keyDownTimer = setTimeout(
      this.scannerDetectionTest.bind(this, this.props.handleSearchSubmit.bind(this)),
      this.state.options.timeBeforeScanTest
    );
    this.setState(newState);
  }

  scannerDetectionTest(callback) {
    // If all condition are good (length, time...), call the callback
    // and re-initialize the plugin for next scanning
    // Else, just re-initialize

    let currStringToAnalyze = this.state.currStringToAnalyze,
      firstCharTime = this.state.firstCharTime,
      lastCharTime = this.state.lastCharTime,
      options = this.state.options,
      greaterThanMinLength = currStringToAnalyze.length >= options.minLength;

    let timeSpent = lastCharTime - firstCharTime,
      timeThreshold = currStringToAnalyze.length * options.avgTimeByChar,
      fasterThanMinSpeed = timeSpent < timeThreshold;

    if (greaterThanMinLength && fasterThanMinSpeed) {
      callback(this.props.query);
      this.initScannerDetection();
    } else {
      this.initScannerDetection();
    }
  }

  handleSearchChange(event) {
    this.props.handleSearchChange(event.target.value);
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    this.props.handleSearchSubmit(this.props.query);
  }

  render() {
    let { style, query, isLoading } = this.props;
    return (
      <div style={{ display: "flex" }}>
        <Form
          className="site-search"
          onSubmit={this.handleSearchSubmit.bind(this)}
          style={style || {}}
        >
          <FaAmazon size="22" />
          <Input
            autoFocus
            autoComplete="off"
            type="text"
            placeholder="SCAN ITEM / ASIN / UPC..."
            className="form-control"
            style={isLoading ? { cursor: "progress" } : {}}
            value={query}
            onChange={this.handleSearchChange.bind(this)}
            id="barcode-scanner"
            onKeyDown={this.onKeyDown.bind(this)}
            ref={input => {
              this.textInput = input;
            }}
            disabled={isLoading} // please set disabled true for completed batch
          />
          {isLoading ? <span className="toggle-dot" /> : ""}
        </Form>
		{/*
        <Tooltip
          tooltipId="AmazonSearchBar"
          tooltipText={`
            Scan your products here or hand type them in to
            perform a search and match the correct product
            on the Amazon catalog.`}
		/>
		*/}
		<img
            src={searchBarcode}
            alt="searchBarcode"
            width="45"
		/>
      </div>
    );
  }
}

AmazonSearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  style: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  scannerDetectedCallback: PropTypes.func.isRequired,
  handleSearchSubmit: PropTypes.func.isRequired,
  handleSearchChange: PropTypes.func.isRequired
};

export default AmazonSearchBar;
