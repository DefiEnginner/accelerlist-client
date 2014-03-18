import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactToPrint from "react-to-print";
import PrintTemplate from "react-print";
import BoxManagerPrintViewItems from "./BoxManagerPrintViewItems";

class ButtonPrintItems extends Component {
    
    render() {
        const { shipment } = this.props;
        const { inboundShipmentItems } = shipment;
        return (
            <React.Fragment>
                <ReactToPrint
                    trigger={() => (
                        <button
                            type="button"
                            style={{ width: "75px"}}
                            className="btn btn-sm btn-primary btn-export mr-1"
                            disabled={inboundShipmentItems && inboundShipmentItems.length > 0 ? false : true}
                        >
                            Print
                        </button>
                    )}
                    content={() => this.componentRef}
                />
                <PrintTemplate>
                    <BoxManagerPrintViewItems
                        className="printable"
                        ref={el => (this.componentRef = el)}
                        shipment={shipment}
                    />
                </PrintTemplate>
            </React.Fragment>
        );
    }
};

ButtonPrintItems.propTypes = {
    shipment: PropTypes.object.isRequired
};

export default ButtonPrintItems;