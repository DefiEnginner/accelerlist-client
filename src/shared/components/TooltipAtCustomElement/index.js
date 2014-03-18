import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { Popover, PopoverBody } from "reactstrap";

class TooltipAtCustomElement extends Component {
  static propTypes = {
    tooltipText: string.isRequired,
    tooltipId: string.isRequired,
    CustomElement: func.isRequired
  };
  state = {
    showPopover: false
  };

  togglePopover = (newState) => {
    const { showPopover } = this.props;
    if (showPopover === newState) {
      return;
    }
    this.setState({
      showPopover: newState
    })
  }
  render() {
    const { tooltipText, tooltipId, CustomElement } = this.props;
    const { showPopover } = this.state;
    return (
      <div
        id={tooltipId}
        style={{ display: "inline-flex"}}
        onMouseOver={() => this.togglePopover(true)}
        onMouseOut={() => this.togglePopover(false)}>
        <CustomElement />
        <Popover
          isOpen={showPopover}
          placement="top-start"
          target={tooltipId}
          style={{ textAlign: "center" }}
          toggle={this.togglePopover}
          offset="100"
        >
          <PopoverBody>
            {tooltipText}
          </PopoverBody>
        </Popover>
      </div>
    )
  }
}
export default TooltipAtCustomElement
