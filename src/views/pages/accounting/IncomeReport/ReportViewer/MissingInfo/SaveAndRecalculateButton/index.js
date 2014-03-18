import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PropTypes from "prop-types";
import FaSpinner from "react-icons/lib/fa/spinner";

class SaveAndRecalculateButton extends Component {
  render() {
    const {
      saveAndRecalculateMissingInfo,
      recalculateIsProcessing,
      reuploadByInventoryItems
    } = this.props;
    return (
      <Button
        color="success ml-2"
        onClick={saveAndRecalculateMissingInfo}
        style={recalculateIsProcessing ? { cursor: "progress" } : {}}
        disabled={recalculateIsProcessing}
      >
        {!reuploadByInventoryItems && recalculateIsProcessing ? (
          <span>
            <FaSpinner className="fa-spin" />
            &nbsp;
          </span>
        ) : ""
        }
        {"Save & Recalculate"}   
      </Button>
    )
  }
}

SaveAndRecalculateButton.propTypes = {
  saveAndRecalculateMissingInfo: PropTypes.func.isRequired,
  recalculateIsProcessing: PropTypes.bool,
  reuploadByInventoryItems: PropTypes.bool,
};

export default SaveAndRecalculateButton;
