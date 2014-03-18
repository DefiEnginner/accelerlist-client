import React, { Component } from "react";
import {
  Input,
  Button
} from "reactstrap";
import PropTypes from "prop-types";
import DeleteIco from "../../../../shared/components/SVGIcons/DeleteIco";

class DeleteItemsPopover extends Component {
  state = {
      selectedDelItemsCount: 1
  };

  handleChangeDelItemsCount = (e) => {
    this.setState({
      selectedDelItemsCount: Number(e.target.value)
    })
  }

  render() {
    const { shipment, shipmentBoxItem, delProductRequest, togglePopover } = this.props;
    const { selectedDelItemsCount } = this.state;
    const delPopoverSelectItems = [];

    for (let i = 1; i <= Number(shipmentBoxItem.QuantityShippedInBox); i++) {
      delPopoverSelectItems.push(
        <option key={`option${i}${Math.floor(Math.random() * (1000))}`}>{i}</option>
      )
    }

    if (shipmentBoxItem && shipmentBoxItem.QuantityShippedInBox && Number(shipmentBoxItem.QuantityShippedInBox) === 1) {
      togglePopover();
      delProductRequest(shipment, shipmentBoxItem.SellerSKU, shipmentBoxItem.BoxId, Number(shipmentBoxItem.QuantityShippedInBox));
      return null;
    }
    
    return (
      <div>
        <strong style={{ fontSize: "16px" }}>Select the number of items to be deleted:</strong>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Input
            className="m-2"
            type="select"
            onChange={this.handleChangeDelItemsCount}
            value={selectedDelItemsCount}
          >
            {delPopoverSelectItems}
          </Input>
          <Button
            className="m-2"
            color="primary"
            onClick={() => {
              delProductRequest(shipment, shipmentBoxItem.SellerSKU, shipmentBoxItem.BoxId, selectedDelItemsCount);
              togglePopover();
            }}
          > 
            <DeleteIco fill="white"/>
            <span style={{ marginLeft: "5px" }}>Delete items</span>
          </Button>
        </div>
      </div>
    );
  }
}          

DeleteItemsPopover.propTypes = {
  shipment: PropTypes.object.isRequired,
  shipmentBoxItem: PropTypes.object.isRequired,
  delProductRequest: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

export default DeleteItemsPopover;

