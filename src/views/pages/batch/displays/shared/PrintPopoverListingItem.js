import React, { Component } from "react";
import {
  Input,
  Button
} from "reactstrap";
import PropTypes from "prop-types";

class PrintPopoverListingItem extends Component {
  state = {
      selectedPrintCount: 1
  };

  handleChangeSelectedPrintCount = (e) => {
    this.setState({
      selectedPrintCount: Number(e.target.value)
    })
  }

  render() {
    const { option, printListItem, togglePopover } = this.props;
    const { selectedPrintCount } = this.state;
    const printPopoverSelectItems = [];

    for (let i = 1; i <= option.qty; i++) {
      printPopoverSelectItems.push(
        <option key={`option${i}${Math.floor(Math.random() * (1000))}`}>{i}</option>
      )
    }

    return (
      <div>
        <strong style={{ fontSize: "16px" }}>Select label count:</strong>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Input
            className="m-2"
            type="select"
            onChange={this.handleChangeSelectedPrintCount}
            value={selectedPrintCount}
          >
            {printPopoverSelectItems}
          </Input>
          <Button
            className="m-2"
            color="primary"
            onClick={() => {
              printListItem(option, selectedPrintCount);
              togglePopover();
            }}
          >
            Print labels
          </Button>
        </div>
      </div>
    );
  }
}          

PrintPopoverListingItem.propTypes = {
  option: PropTypes.object.isRequired,
  printListItem: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default PrintPopoverListingItem;

