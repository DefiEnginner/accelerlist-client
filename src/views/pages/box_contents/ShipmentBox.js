import React, {Component} from "react";
import PropTypes from "prop-types";
import ShipmentBoxDialog from './ShipmentBoxDialog';
import { Button } from 'reactstrap';
import PrinterIcon from 'react-icons/lib/md/print';

class ShipmentBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showBoxDetails: false
        }
    }

    togglePopover = () => {
        this.setState({ showBoxDetails: !this.state.showBoxDetails });
    }

    render() {
        const { boxData, ShipmentId, updateCurrentBox, isSelected, printQr, shipment, changeLimit, changePage, page, limit } = this.props;
        return (

            <div
                onClick={() => {
                    updateCurrentBox(ShipmentId, boxData);
                }}
                id={`shipment-box-${boxData.id}`}
                className={`shipment-box ${isSelected ? 'box-selected' : ''} ${
                    boxData.weight === 0
                        ? ""
                        : boxData.weight > 50
                            ? "box-danger"
                            : ""
                    }`}
            >

                    <Button
                        color="success"
                        size="sm"
                        className="btn-block mb-2"
                        id={`view-box-${boxData.id}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            this.togglePopover()}
                        }
                    >
                        <PrinterIcon size="18" color="#ffffff"/>
                    </Button>

                <svg
                    width="32"
                    height="31"
                    viewBox="-1 0 32 31"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M29.8535156 10.8164063L26.8886719 1.921875C26.5078125.7734375 25.4355469 0 24.2226562 0H15.9375v11.25h13.9863281c-.0234375-.1464844-.0234375-.2929687-.0703125-.4335937zM14.0625 0H5.77734375C4.56445312 0 3.4921875.7734375 3.11132812 1.921875L.14648437 10.8164063c-.046875.140625-.046875.2871093-.0703125.4335937H14.0625V0zM0 13.125v14.0625C0 28.7402344 1.25976562 30 2.8125 30h24.375C28.7402344 30 30 28.7402344 30 27.1875V13.125H0z"
                        fill="#858C82"
                        fillRule="evenodd"
                    />
                </svg>
                <span className="box-number">{boxData.boxNumber}</span>
                <span className="box-weight">
                    {boxData.weight.toFixed(2)}
                    lbs
                </span>
                <ShipmentBoxDialog
                    key={`shipment-box-${boxData.id}-dialog`}
                    shipment={shipment}
                    printQr={printQr}
                    boxData={boxData.box}
                    isOpen={this.state.showBoxDetails}
                    target={`view-box-${boxData.id}`}
                    isSelected={isSelected}
                    changeLimit={changeLimit}
                    changePage={changePage}
                    page={page}
                    limit={limit}
                    toggle={this.togglePopover}>
                </ShipmentBoxDialog>
            </div>
        );
    }
}

ShipmentBox.propTypes = {
  boxData: PropTypes.object,
  ShipmentId: PropTypes.string,
  updateCurrentBox: PropTypes.func,
  isSelected: PropTypes.bool,
  printQr: PropTypes.func,
  shipment: PropTypes.object,
  changeLimit: PropTypes.func,
  changePage: PropTypes.func,
  page: PropTypes.number,
  limit: PropTypes.number
};

export default ShipmentBox;
