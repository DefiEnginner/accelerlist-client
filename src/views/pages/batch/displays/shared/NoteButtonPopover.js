import React from "react";
import { Popover, PopoverBody, Button } from "reactstrap";
import PropTypes from "prop-types";

class NoteButtonPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false
    };
  }

  opentoggle = () => {
    const { popoverOpen } = this.state;
    if (!popoverOpen){
      this.setState({
        popoverOpen: true
      });
    }
  }
  closetoggle = () => {
    this.setState({
      popoverOpen: false
    });
  }

  render() {
    const { content, id, action, placement, buttonText, buttonStyle } = this.props;
    return (
      <React.Fragment>
        <Button
          id={"Popover-" + id}
          onMouseOver={this.opentoggle}
          onMouseOut={this.closetoggle}
          onClick={action}
          className={buttonStyle}
        >
          {buttonText}
        </Button>

        <Popover
          placement={placement ? placement : "bottom"}
          isOpen={this.state.popoverOpen}
          target={"Popover-" + this.props.id}
          modifiers={{ preventOverflow: { enabled: false } }}
        >
          <PopoverBody>{content || "N/A"}</PopoverBody>
        </Popover>
      </React.Fragment>
    )     
  }
}

NoteButtonPopover.propTypes = {
  placement: PropTypes.string,
  content: PropTypes.string,
  id: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  buttonStyle: PropTypes.string.isRequired
};
export default NoteButtonPopover;
