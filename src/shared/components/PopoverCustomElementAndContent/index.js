import React, { Component } from 'react';
import { string, object, func } from 'prop-types';
import { Popover, PopoverBody } from "reactstrap";

class PopoverCustomElementAndContent extends Component {
  static propTypes = {
    TooltipContent: func.isRequired,
    tooltipId: string.isRequired,
    customElement: object.isRequired,
    userStyle: object
  };
  state = {
    showPopover: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.tooltipId !== this.props.tooltipId) {
      this.setState({
        showPopover: false
      })
    }
  }

  togglePopover = () => {
    const { showPopover } = this.state;
    this.setState({
      showPopover: !showPopover
    })
  }
  
  render() {
    const { TooltipContent, tooltipId, customElement, userStyle } = this.props;
    const { showPopover } = this.state;
    const bodyStyle = { display: "inline-flex"};
    return (
      <div
        id={tooltipId}
        style={ userStyle ? Object.assign(bodyStyle, userStyle) : bodyStyle }
        onClick={this.togglePopover}>
        {customElement}
        <Popover 
          isOpen={showPopover}
          placement="top"
          target={tooltipId}
          style={{ textAlign: "center" }}
          toggle={this.togglePopover}
        >
          <PopoverBody>
            <TooltipContent togglePopover={this.togglePopover}/>
          </PopoverBody>
        </Popover>
      </div>
    )
  }
}
export default PopoverCustomElementAndContent
