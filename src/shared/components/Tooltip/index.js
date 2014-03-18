import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { Popover, PopoverBody } from "reactstrap";
import HelpIcon from "react-icons/lib/io/help-circled";
import { TooltipBody } from "./styles";

class Tooltip extends Component {
  static propTypes = {
    tooltipText: string.isRequired,
    tooltipId: string.isRequired,
    tooltipStyle: object
  };
  state = {
    showPopover: false
  };

  togglePopover = () => {
    const { showPopover } = this.state;
    this.setState({
      showPopover: !showPopover
    })
  }
  render() {
    const { tooltipText, tooltipId, tooltipStyle } = this.props;
    const { showPopover } = this.state;
    const style = { color: "#a9a9a9", width: "20px"};
    return (
      <TooltipBody>
        <HelpIcon
          id={tooltipId}
          style={tooltipStyle ? Object.assign(style, tooltipStyle) : style}
          onClick={this.togglePopover}
        />
        <Popover
          isOpen={showPopover}
          placement="top-start"
          target={tooltipId}
          style={{ textAlign: "center" }}
          toggle={this.togglePopover}
        >
          <PopoverBody>
            {tooltipText}
          </PopoverBody>
        </Popover>
      </TooltipBody>
    )
  }
}
export default Tooltip
