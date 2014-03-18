import React, { Component } from 'react'

class ShipmentPlansNotExist extends Component {
  render() {
    return (
      <div>
        <div className="text-center">
          <strong>
            Shipment Plans not created yet!
          </strong>
        </div>
        <div className="text-center">
          Once you click button 'Preview Shipment Plans' for this batch, we will display to you Amazon's destinations to send your products to. 
        </div>
        <div className="text-center">
          You can choose to accept the shipments or move them to the holding area.
        </div>
      </div>
    )
  }
}

export default ShipmentPlansNotExist;
