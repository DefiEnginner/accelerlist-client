import React, { Component } from "react";
import PropTypes from "prop-types";
import ScannedProducts from "./ScannedProducts";

class HoldingAreaDisplay extends Component {
  UNSAFE_componentWillMount() {
    this.props.getHoldings();
  }
  openDeleteModal = (listing) => {
    let isHoldingAreaListing = true;
    this.props.setCurrentEditableListing(listing, isHoldingAreaListing);
    this.props.updateModalDisplay("delete_listing_item");
  };
  render() {
    const {
      holdings,
      loadingHoldings,
      batchMetadata,
      createShipmentPlans,
      address,
      createShipmentPlansRequestStatus,
      inboundShipmentPlans,
      createHoldingAreaShipment,
      createHoldingAreaShipmentStatus,
    } = this.props;

    if (loadingHoldings || !holdings) {
      return <div>Loading Holdings...</div>;
    }

    return (
      <React.Fragment>
        <ScannedProducts
          holdings={holdings}
          loadingHoldings={loadingHoldings}
          batchMetadata={batchMetadata}
          createShipmentPlans={createShipmentPlans}
          address={address}
          createShipmentPlansRequestStatus={createShipmentPlansRequestStatus}
          inboundShipmentPlans={inboundShipmentPlans}
          createHoldingAreaShipment={createHoldingAreaShipment}
          createHoldingAreaShipmentStatus={createHoldingAreaShipmentStatus}
          openDeleteModal={this.openDeleteModal.bind(this)}
          showAlert={this.props.showAlert}
		  getHoldings={this.props.getHoldings}
        />
      </React.Fragment>
    );
  }
}

HoldingAreaDisplay.propTypes = {
  setCurrentEditableListing: PropTypes.func.isRequired,
  updateModalDisplay: PropTypes.func.isRequired,
  holdings: PropTypes.array,
  loadingHoldings: PropTypes.bool.isRequired,
  batchMetadata: PropTypes.object.isRequired,
  createShipmentPlans: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  createShipmentPlansRequestStatus: PropTypes.string.isRequired,
  inboundShipmentPlans: PropTypes.array.isRequired,
  createHoldingAreaShipment: PropTypes.func.isRequired,
  createHoldingAreaShipmentStatus: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired
};

export default HoldingAreaDisplay;
