import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button, Alert } from "reactstrap";
import PropTypes from "prop-types";
import {getProductsBySku} from "../../../../../helpers/batch/utility";
import batchActions from "../../../../../redux/batch/actions";
import IconWarning from "react-icons/lib/md/warning";
import { PulseLoader } from "react-spinners";

const {
  createShipment,
  setCurrentFlow,
  setCurrentShipmentPlans,
  updateModalDisplay,
  bulkSendToHoldingArea,
  completeBatch,
  rejectShipmentPlans,
} = batchActions;

class ShipmentPlansTable extends Component {
	shipmentsList = [];
	completingShipmentID = null;
	state = {
		disabled_buttons: false,
		completingShipments: false,
		completedALLShipments: false,
		intervalID: null,
		createShipmentButtonDisabled: false,
	}

	componentWillUnmount() {
		if(this.state.intervalID){
			clearInterval(this.state.intervalID);
		}
	}

  handleClickViewItems = shipmentPlans => {
    const { setCurrentShipmentPlans, updateModalDisplay } = this.props;
    if (shipmentPlans.created){
      const plans = [{
        Items: shipmentPlans.items
      }];
      setCurrentShipmentPlans(plans);
    } else {
      setCurrentShipmentPlans(shipmentPlans.plans);
    }
    updateModalDisplay("ship_view_items");
  };

	UNSAFE_componentWillReceiveProps(newProps){
		const { existingShipments } = this.props;
		if(this.state.disabled_buttons
				&& newProps.existingShipments !== existingShipments){
			this.setState({ completingShipmentID: null });
			this.setState({ disabled_buttons: false });
		}
	}

	rejectShipmentPlan(){
		const { batchMetadata } = this.props;
		this.setState({ createShipmentButtonDisabled: true });
		this.props.rejectShipmentPlans(batchMetadata.id);
		this.props.setCurrentFlow("created_listings_display");
	}

	completeBatchFull(rows){
		this.setState({ createShipmentButtonDisabled: true });
		const intervalID = setInterval(
	      () => this.loopAllShipments(rows),
		  1000
		);
		this.setState({ intervalID: intervalID });
	}

	loopAllShipments = (rows) => {
		const { shipmentsList } = this;
		let newID = null;
		let completing_row = null;
		let currentShipmentFinished = false;
		let newIds = null;
		shipmentsList.forEach(row => {
			if(!row.created){
				if(!this.completingShipmentID){
					newID = row.destination;
					completing_row = row;
					const ids = row.shipmentIds;
					this.completingShipmentID = ids;
				}
			} else {
				if(this.completingShipmentID){
					newIds = this.completingShipmentID.filter(
						id => id !== row.shipmentIds[0]);
					if(newIds.length === this.completingShipmentID.length){
						this.completingShipmentID = newIds;
					} else {
						this.completingShipmentID =  null;
						currentShipmentFinished = true;
					}
				}
			}
		});
		if(!newID
			&& !this.completingShipmentID
			&& currentShipmentFinished === false){
			clearInterval(this.state.intervalID);
			this.completingShipmentID = null;
			this.props.completeBatch();
		} else {
			//if shipment is still completing
			if(completing_row){
				this.props.createShipment(completing_row.plans)
			} else {
				if(currentShipmentFinished){
					this.completingShipmentID = null;
				}
			}
		}
	}

  render() {
    const {
      inboundShipmentPlans,
      existingShipments,
		//createShipment,
		//setCurrentFlow,
		//bulkSendToHoldingArea,
      products
    } = this.props;

    let planByDestId = {};
    inboundShipmentPlans.forEach(plan => {
      if (!planByDestId[plan.DestinationFulfillmentCenterId]) {
        planByDestId[plan.DestinationFulfillmentCenterId] = {};
        planByDestId[plan.DestinationFulfillmentCenterId][plan.LabelPrepType] = [plan];
      } else {
        if (!planByDestId[plan.DestinationFulfillmentCenterId][plan.LabelPrepType]) {
          planByDestId[plan.DestinationFulfillmentCenterId][plan.LabelPrepType] = [plan];
        } else {
          planByDestId[plan.DestinationFulfillmentCenterId][plan.LabelPrepType].push(plan);
        }
      }
    });

    let rows = [];
    Object.keys(planByDestId).forEach(destId => {
      Object.keys(planByDestId[destId]).forEach(labelPrepType => {
        let plans = planByDestId[destId][labelPrepType];
        let num_skus = 0;
        let quantity = 0;
        let shipmentIds = [];
        let items = [];
        let productsInDestId = [];
        let productsBySku = getProductsBySku(products);
        let destination = destId;
        plans.forEach(plan => {
          (plan.Items || []).forEach(item => {
            quantity += Number(item.Quantity);
            if (!productsBySku[item.SellerSKU]) {
              console.log(`Products not found for sku ${item.SellerSKU}`, {
				  products,
                destId,
                sku: item.SellerSKU,
              });
            }
            let product = Object.assign({}, productsBySku[item.SellerSKU], {
              qty: Number(item.Quantity)
            });
            productsInDestId.push(product);
          });
          num_skus += (plan.Items || []).length;
          shipmentIds.push(plan.ShipmentId);
          items.concat(plan.Items || []);
        });

        rows.push({
          destination,
          num_skus,
          quantity,
          shipmentIds,
          items,
          plans,
          created: false,
          productsInDestId,
          labelPrepType
        });
      });
	});


    existingShipments.forEach(shipment => {
      let quantity = 0;
      shipment.Items.forEach(item => {
        quantity += Number(item.QuantityShipped);
      });
      rows.push({
        destination: shipment.DestinationFulfillmentCenterId,
        shipmentIds: [shipment.ShipmentId],
        num_skus: shipment.Items.length,
        items: shipment.Items,
        quantity: quantity,
        labelPrepType: shipment.LabelPrepType,
        created: true
      });
	});

	this.shipmentsList = rows;

    return (
		<React.Fragment>
      <Table>
        <thead>
          <tr>
            <th className="align-middle text-center"># SKUs</th>
            <th className="align-middle text-center">Quantity Shipped</th>
            <th className="align-middle text-center">Shipment ID(s)</th>
            <th className="align-middle text-center">Destination</th>
            <th className="align-middle text-center">Labeling Preference</th>
            <th className="align-middle text-center">View Items</th>
            <th className="align-middle text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="align-middle text-center">{row.num_skus}</td>
              <td className="align-middle text-center">{row.quantity}</td>
              <td className="align-middle text-center">
                {row.shipmentIds.join(",")}
              </td>
              <td className="align-middle text-center">{row.destination}</td>
              <td className="align-middle text-center">{row.labelPrepType}</td>
              <td className="align-middle text-center">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => this.handleClickViewItems(row)}
                >
                  View Items
                </Button>
              </td>
              {row.created ? (
                <td className="align-middle text-center">
                    Shipment Created + Feed Submitted
                </td>
              ) : (
                <td className="align-middle text-center">
                    Accept Shipment
                </td>
			  )}
			  {/*
              {row.created ? (
                <td className="align-middle text-center">
                  <Button
                    color="success"
                    size="sm"
                    disabled={true}
                    className="light-right-margin"
                  >
                    Shipment Created + Feed Submitted
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={setCurrentFlow.bind(null, "product_feed_display")}
                  >
                    View Feed
                  </Button>
                </td>
              ) : (
                <td className="align-middle text-center">
                  <Button
                    color="success"
                    size="sm"
                    className="light-right-margin"
                    onClick={() => {
						this.setState(oldState => {
						    return {
							  disabled_buttons: true,
							}
						});
						createShipment(row.plans)
					}}
					disabled={this.state.disabled_buttons}
                  >
                    Accept Shipment
                  </Button>

                  <Button
                    color="primary"
                    size="sm"
                    onClick={() =>
                      bulkSendToHoldingArea(row.productsInDestId, row.shipmentIds)
                    }
                  >
                    Move to Holding Area
                  </Button>
                </td>
			  )}
			  */}
            </tr>
          ))}
        </tbody>
      </Table>
                    <div style={{height: "50px"}} />
					{/*
                    { getStatusBatchWarningMessage() ? (
                        <Alert color="danger" className="d-flex">
                          <IconWarning size="26" className="mr-3"/>
                          <span>You should accept the rest of the warehouse shipments or move undecided items into the holding area.
                          Not doing so may result in duplicate shipments on the same items going to different warehouses.</span>
                        </Alert>
                      ) : ""
					}
					*/}
					<Alert color="danger" className="d-flex">
					  <IconWarning size="26" className="mr-3"/>
					  <span>As of June 1st, 2019, Amazon no longer allows sellers to modify or delete individual shipments from a shipment plan so you will either need to accept this shipment or cancel and try again later.</span>
					</Alert>
                    <hr />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{/*
                      { getStatusBatchWarningMessage() ? (
                          <Badge color="danger" className="p-2 mr-3">
                            {`${existingShipments.length}/${existingShipments.length + inboundShipmentPlans.length} warehouses accepted`}
                          </Badge>
                        ) : ""
					  }
					  */}
					  {/*
                      {
                        <Button
                          color="success"
                          className={inboundShipmentPlans && inboundShipmentPlans.length === 0 ? "shaking-button" : ""}
                          disabled={inboundShipmentPlans && inboundShipmentPlans.length > 0}
                          onClick={()=>{
                            completeBatch()
                          }}
                        >
                          Complete Batch
                        </Button>
					  }
					  */}
                        <Button
                          color="danger"
						  onClick={() => this.rejectShipmentPlan()}
						  disabled={this.state.createShipmentButtonDisabled}
                        >
                          Reject shipment plan and add more items
                        </Button>
						<div style={{width: "20px"}} />
                        <Button
                          color="success"
						  onClick={() => this.completeBatchFull(rows)}
						  disabled={this.state.createShipmentButtonDisabled}
						  >{
							 this.state.createShipmentButtonDisabled ?
							(
							  <div className='sweet-loading'>
								<PulseLoader
								  sizeUnit={"px"}
								  size={9}
								  color={'white'}
								  loading={true}
								/>
							  </div>
							) : 'Create Shipments And Complete Batch'
							}
                        </Button>

                    </div>
		</React.Fragment>
    );
  }
}

ShipmentPlansTable.propTypes = {
  inboundShipmentPlans: PropTypes.array.isRequired,
  existingShipments: PropTypes.array.isRequired,
  batchMetadata: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  acceptAllWarehouses: PropTypes.func,
};

export default connect(
  state => ({
    inboundShipmentPlans: state.Batch.get("inboundShipmentPlans"),
    existingShipments: state.Batch.get("existingShipments"),
    batchMetadata: state.Batch.get("batchMetadata"),
    products: state.Batch.get("products")
  }),
  {
    createShipment,
    setCurrentFlow,
    setCurrentShipmentPlans,
    updateModalDisplay,
	bulkSendToHoldingArea,
	completeBatch,
	rejectShipmentPlans,
  }
)(ShipmentPlansTable);
