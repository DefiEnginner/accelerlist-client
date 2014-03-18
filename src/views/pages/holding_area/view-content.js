import React from 'react';
import batchActions from "../../../redux/batch/actions";
import { connect } from "react-redux";
import HoldingAreaDisplay from "../batch/displays/holding_area/HoldingAreaDisplay";
import addressActions from "../../../redux/address/actions";
import BatchModals from "../batch/batchModals";
import SweetAlert from "sweetalert2-react";
import {
    openInNewTab
} from "../../../helpers/utility";

const { 
    getHoldings, 
    createShipmentPlans, 
    createHoldingAreaShipment, 
    clearBatch,
    setCurrentEditableListing,
    updateModalDisplay,
    closeModal,
    closeAlert,
    showAlert,
    cancelListingCreationFlow
} = batchActions;
const { fetchAdressList } = addressActions;

class ViewContent extends React.Component {
    state = {
    }
    componentDidMount = () => {
        this.props.clearBatch();
        this.props.fetchAdressList();
    }

    componentDidUpdate = (prevProps) => {
        
        // @TODO(jeffdh5): See if we can move this logic into the saga on createHoldingAreaShipmentSuccess. That way we
        // won't have to add this out-of-context hook here, which is confusing and hard to understand for a new developer.
        if(prevProps.holdingAreaShipmentBatch.created_batch_id !== this.props.holdingAreaShipmentBatch.created_batch_id) {
            let {internationalization_config} = this.props;
            let existingShipments = this.props.holdingAreaShipmentBatch.existing_shipments;
            let shipment = existingShipments[0];
            let shipmentId = shipment.ShipmentId;
            let url = `https://${internationalization_config.seller_central_url}/gp/fba/inbound-shipment-workflow/index.html/ref=ag_fbaisw_name_fbasqs#${shipmentId}/prepare`
            openInNewTab(url);
        }
    }

    render = () => {
        let {
            getHoldings,
            holdings,
            loadingHoldings,
            address,
            setCurrentEditableListing,
            createShipmentPlans,
            inboundShipmentPlans,
            createShipmentPlansRequestStatus,
            createHoldingAreaShipmentStatus,
            createHoldingAreaShipment,
            updateModalDisplay,
            showAlert
        } = this.props;

        let alert;

        if (this.props.currentAlert !== null) {
          alert = (
            <SweetAlert
              show={this.props.currentAlert !== null}
              title={this.props.currentAlert.title}
              html={this.props.currentAlert.text}
              confirmButtonColor={"#3085d6"}
              onConfirm={() => this.props.closeAlert()}
            />
          );
        }    

        return (
            <div>
                <BatchModals
                    cancelListingCreationFlow={cancelListingCreationFlow}
                />
                {alert}
                <HoldingAreaDisplay
                    getHoldings={getHoldings}
                    holdings={holdings}
                    loadingHoldings={loadingHoldings}
                    setCurrentEditableListing={setCurrentEditableListing}
                    updateModalDisplay={updateModalDisplay}
                    createShipmentPlans={createShipmentPlans}
                    address={address}
                    createShipmentPlansRequestStatus={createShipmentPlansRequestStatus}
                    inboundShipmentPlans={inboundShipmentPlans}
                    createHoldingAreaShipment={createHoldingAreaShipment}
                    createHoldingAreaShipmentStatus={createHoldingAreaShipmentStatus}
                    showAlert={showAlert}
                />
            </div>
        )
    }
}

export default connect(
  state => ({
    ...state.Batch.toJS(),
    createShipmentPlansRequestStatus: state.Batch.get(
        "createShipmentPlansRequestStatus"
    ),
    address: state.Address.toJS(),
    holdingAreaShipmentBatch: state.Batch.get("holdingAreaShipmentBatch"),
    currentEditableListingData: state.Batch.get("currentEditableListingData"),
    createHoldingAreaShipmentStatus: {
      loading: state.Batch.get("createHoldingAreaShipmentLoading"),
      loaded: state.Batch.get("createHoldingAreaShipmentLoaded"),
      error: state.Batch.get("createHoldingAreaShipmentError"),
    },
    internationalization_config: state.Auth.get("internationalization_config")
  }),
  {
    getHoldings,
    createHoldingAreaShipment,
    createShipmentPlans,
    fetchAdressList,
    clearBatch,
    setCurrentEditableListing,
    updateModalDisplay,
    closeModal,
    closeAlert,
    showAlert
  }
)(ViewContent);
