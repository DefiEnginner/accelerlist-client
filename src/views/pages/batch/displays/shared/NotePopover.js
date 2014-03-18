import React from "react";
import { Button, Popover, PopoverBody } from "reactstrap";

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.opentoggle = this.opentoggle.bind(this);
    this.closetoggle = this.closetoggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  opentoggle() {
    this.setState({
      popoverOpen: true
    });
  }
  closetoggle() {
    this.setState({
      popoverOpen: false
    });
  }

  render() {
    const { listingNote } = this.props;
    let viewMore;
    if (!!listingNote && listingNote.length > 50) {
      viewMore = (
        <div>
          <Button
            id={"Popover-" + this.props.id}
            onMouseEnter={this.opentoggle}
            onMouseOut={this.closetoggle}
          >
            View Note
          </Button>
          <Popover
            placement="bottom"
            isOpen={this.state.popoverOpen}
            target={"Popover-" + this.props.id}
          >
            <PopoverBody>{this.props.listingNote}</PopoverBody>
          </Popover>
        </div>
      );
    } else {
      viewMore =
        !!listingNote && listingNote.length > 0
          ? listingNote
          : "N/A";
    }
    return <div>{viewMore}</div>;
  }
}
