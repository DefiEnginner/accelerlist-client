import React, { Component } from "react";
import PropTypes from "prop-types";
import { generatePackListFileAndExport } from  "../../../../helpers/box_contents/utility";
import SweetAlert from "sweetalert2-react";


class ButtonExportShipmentToTsv extends Component {
    state = {
        warningMessage: ""
    }

    generateFileAndExport = () => {
        const { shipment } = this.props;

        generatePackListFileAndExport(shipment);
    }

    onClickExportButton = () => {
        const { shipment } = this.props;
        const { warning } = shipment;

        if (warning) {
            this.setState({ warningMessage: warning })
        } else {
            this.generateFileAndExport()
        }
    }

    clearWarningMessage = () => {
        this.setState({
            warningMessage: ""
        })
    }

    render() {
        const { warningMessage } = this.state;
        return (
            <React.Fragment>
                <button
                    type="button"
                    style={{ width: "75px"}}
                    className="btn btn-sm btn-secondary btn-export"
                    onClick={this.onClickExportButton}
                >
                    {'Export .tsv'}
                </button>
                <SweetAlert
                    show={warningMessage.length > 0}
                    type={"warning"}
                    title={"Warning!"}
                    text={warningMessage}
                    confirmButtonColor={"#3085d6"}
                    onConfirm={() => {
                        this.generateFileAndExport();
                        this.clearWarningMessage();
                    }}
                    onCancel={this.clearWarningMessage}
                    showCancelButton={true}
                />
            </React.Fragment>
        );
    }
};

ButtonExportShipmentToTsv.propTypes = {
    shipment: PropTypes.object.isRequired
};

export default ButtonExportShipmentToTsv;
