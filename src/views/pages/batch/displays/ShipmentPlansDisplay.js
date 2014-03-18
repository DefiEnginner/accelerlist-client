import React from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import ShipmentPlansTable from "./shipment_plans_display/ShipmentPlansTable";
import ShipmentPlansNotExist from "./shipment_plans_display/ShipmentPlansNotExist";
import BatchToolBoxRow from "./shared/BatchToolBoxRow";
import PropTypes from "prop-types";
import { PulseLoader } from "react-spinners";
//import IconWarning from "react-icons/lib/md/warning";
/*
This display is shown when they have already finished scanning in all their items
and are creating inbound shipments and letting the user approve them.
*/

const ShipmentPlansDisplay = (props) => {
  let {
    createShipmentPlans,
	  //completeBatch,
    createShipmentPlansRequestStatus,
	  //existingShipments,
	  //inboundShipmentPlans
  } = props;

	/*
  const getStatusBatchWarningMessage = () => {
    if ( createShipmentPlansRequestStatus === "complete" &&
    existingShipments &&
    inboundShipmentPlans &&
    existingShipments.length !== existingShipments.length + inboundShipmentPlans.length ) {
      return true;
    }
    return false;
  }*/

  return (
    <Row>
      <Col lg="12" className="col">
        <Card>
          <CardBody>
            <BatchToolBoxRow
              hideSearch={true}
            />
            <div>
              <hr />
              {
                (createShipmentPlansRequestStatus !== "complete") ? (
                  <React.Fragment>
                    <div style={{height: "20px"}} />
                    <ShipmentPlansNotExist />
                    <div style={{height: "20px"}} />
                    <hr />
                    <Button
                      color="success"
                      onClick={createShipmentPlans}
                      disabled={createShipmentPlansRequestStatus === "execution"}
                      style={{width: "220px", float: "right"}}
                    >{
                      createShipmentPlansRequestStatus === "execution" ?
                      (
                        <div className="sweet-loading">
                          <PulseLoader
                            sizeUnit={"px"}
                            size={9}
                            color={"white"}
                            loading={true}
                          />
                        </div>
                      ) : "Preview Shipment Plans"
                      }
                    </Button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <h4>Shipment Plans</h4>
                    <ShipmentPlansTable />
					{/*
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
					<Alert color="danger" className="d-flex">
					  <IconWarning size="26" className="mr-3"/>
					  <span>This is where we could display info on this new workflow pushed by amazon. Just for this transition?.</span>
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
                        <Button
                          color="danger"
                        >
                          Reject shipment plan and add more items
                        </Button>
                        <Button
                          color="success"
                          onClick={()=>{completeBatch()}}
                        >
                          Create Shipments And Complete Batch
                        </Button>

                    </div>
					  */}
                  </React.Fragment>
                )
              }
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

ShipmentPlansDisplay.propTypes = {
  createShipmentPlans: PropTypes.func.isRequired,
  batchMetadata: PropTypes.object.isRequired,
  completeBatch: PropTypes.func.isRequired,
  createShipmentPlansRequestStatus: PropTypes.string.isRequired,
  inboundShipmentPlans: PropTypes.array.isRequired,
  existingShipments: PropTypes.array.isRequired

}

export default ShipmentPlansDisplay
