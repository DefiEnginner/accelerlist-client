
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { digitСonversion, secureProtocolImgURL } from "../../../../../helpers/utility";
import "./holding-area.css";
import sum from 'lodash/sum';
import map from 'lodash/map';
import assign from 'lodash/assign';
import React, { Fragment, Component }  from 'react';
import TableGenerator from "../../../../../shared/components/TableGenerator";
import cloneDeep from 'lodash/cloneDeep';
import {momentDateToLocalFormatConversion} from '../../../../../helpers/utility';
import {generateInventoryLoaderData} from '../../../../../helpers/batch/utility';
import {
  labelingPreferenceOptions
} from "../../../../../shared/components/createBatchModal/constants";
import Papa from "papaparse";
import RetryIcon from "../../../../../shared/components/SVGIcons/Retry";
import DeleteIcon from "../../../../../shared/components/SVGIcons/Delete";
import DeleteListingsItemsInBulkModal from "../../../holding_area/DeleteListingsItemsInBulkModal";
import holdingAreaActions from "../../../../../redux/holding_area/actions";

const {
	deleteHoldingAreaInBulk,
	deleteHoldingAreaInBulkSuccessRefreshed,
} = holdingAreaActions;

class ScannedProducts extends Component {

  state = {
      selectedBatches: [],
      shipmentName: "Holding Area " + momentDateToLocalFormatConversion(),
      labelingPreference: "",
      addressId: "",
      selectedInboundShipmentPlan: null,
      clickedRetryButton: null,
      retrySelectedError: false,

      addressIdInvalid: false,
      labelingPreferenceInvalid: false,
	  shipmentNameInvalid: false,

	  deleteSelectedModalShow: false,
  };

  UNSAFE_componentWillReceiveProps(newProps){
	if(newProps.batchDeleteExecuted){
		this.props.getHoldings();
		this.props.deleteHoldingAreaInBulkSuccessRefreshed();
	}
  }

  closeDeleteSelectedModal = () => {
	this.setState({deleteSelectedModalShow: false});
  }

  deleteSelectedDialog = ()  => {
	this.setState({deleteSelectedModalShow: true});
  }

  deleteSelected = () => {
	const { selectedBatches }  = this.state;
	this.props.deleteHoldingAreaInBulk({"skus": selectedBatches});
  }

  selectBatches = (e, option) => {
      const { selectedBatches } = this.state;
      let newSelectedBatches = cloneDeep(selectedBatches);
      if(e.target.checked) {
          newSelectedBatches.push(option);
          this.setState({ selectedBatches: newSelectedBatches });
      } else {
          newSelectedBatches = newSelectedBatches.filter(o => o !== option);
          this.setState({ selectedBatches: newSelectedBatches });
      }
  }


  selectAllBatches = (e, options) => {
      if(e.target.checked) {
          this.setState({ selectedBatches: options });
      } else {
          this.setState({ selectedBatches: [] });
      }
  }

  createHoldingAreaShipmentValidator = (functionName) => {
    const { showAlert } = this.props;
    const { shipmentName, addressId, labelingPreference, selectedInboundShipmentPlan } = this.state;
    let errorsArray = [];

    if (!shipmentName || shipmentName.trim().length === 0) {
        this.setState({
            shipmentNameInvalid: true
        })
        errorsArray.push(
            `<div>${errorsArray.length + 1} - Shipment Name is empty!</div>
            <div>Please fill Shipment Name field to continue with automatically creating your batch and shipment.</div>`
        );
    }

    if (functionName === "create" && !selectedInboundShipmentPlan) {
        errorsArray.push(
            `<div>${errorsArray.length + 1} - No shipment plan selected!</div>
            <div>Please choose one of the inbound shipment plans created to continue with automatically creating your batch and shipment.</div>`
        );
    }

    if (!addressId || addressId.length === 0) {
        this.setState({
            addressIdInvalid: true
        })
        errorsArray.push(
            `<div>${errorsArray.length + 1} - No shipment address selected!</div>
            <div>Please choose one of the shipment address to continue with automatically creating your batch and shipment.</div>`
        );
    }

    if (!labelingPreference || labelingPreference.length === 0) {
        this.setState({
            labelingPreferenceInvalid: true
        })
        errorsArray.push(
            `<div>${errorsArray.length + 1} - No labeling preference selected!</div>
            <div>Please choose one of the labeling preference to continue with automatically creating your batch and shipment.</div>`
        );
    }

    if (errorsArray.length > 0) {
        showAlert(
            "Some fields are not filled!",
            errorsArray.join("")
        )
        return true;
    }
    return false;
  }

  retrySelectedBatches = () => {
    const { holdings } = this.props;
    const { selectedBatches, labelingPreference, shipmentName, addressId } = this.state;
    const selectedProducts = holdings.filter(prod =>selectedBatches.includes(prod.sku)).map(p => ({
        sku: p.sku,
        qty: p.qty
    }));
    const planCreationJobData = {
        labelingPreference,
        addressId,
        shipmentName,
    };
    const error = this.createHoldingAreaShipmentValidator("retry");

    if (error) {
        return;
    };

    if(selectedProducts.length === 0) this.setState({ retrySelectedError: true });
    else this.setState({
        clickedRetryButton: 'retrySelected',
        retrySelectedError: false,
        selectedInboundShipmentPlan: null
    }, () => this.props.createShipmentPlans(
        selectedProducts,
        planCreationJobData)
    );

  }

  retryAllBatches = () => {
    const { holdings } = this.props;
    const { labelingPreference, shipmentName, addressId } = this.state;

    const selectedProducts = holdings.map(prod => ({
        sku: prod.sku,
        qty: prod.qty
    }));
    const planCreationJobData = {
        labelingPreference,
        shipmentName,
        addressId,
    }
    const error = this.createHoldingAreaShipmentValidator("retry");

    if (error) {
        return;
    };

    this.setState({
        clickedRetryButton: 'retryAll',
        retrySelectedError: false,
        selectedInboundShipmentPlan: null
    }, () => this.props.createShipmentPlans(
        selectedProducts,
        planCreationJobData)
    );

  }

  createHoldingAreaShipment = () => {
    const {
        createHoldingAreaShipment,
        holdings,
        internationalization_config,
    } = this.props;
    const error = this.createHoldingAreaShipmentValidator("create");

    if (error) {
        return;
    };

    let holdingsBySku = {};
    holdings.forEach(holding => {
        holdingsBySku[holding.sku] = holding;
    })


    let shipmentProducts = this.state.selectedInboundShipmentPlan.Items.map(item => {
        return assign({}, holdingsBySku[item.SellerSKU], {
            qty: item.Quantity
        })
    })
    let exportableData = generateInventoryLoaderData(
        shipmentProducts,
        internationalization_config.fulfillment_channel_id_for_fba
    );
    let feedData = Papa.unparse(JSON.stringify(exportableData), {
        delimiter: "\t",
        header: true,
        skipEmptyLines: false
    });

    const params = {
        shipmentName: this.state.shipmentName,
        labelingPreference: this.state.labelingPreference,
        addressId: this.state.addressId,
        inboundShipmentPlans: [this.state.selectedInboundShipmentPlan],
        feedData: feedData
    };

    createHoldingAreaShipment(params);
  }
  scannedProductsTableOptionMapper = option => {
      const {
            internationalization_config,
            openDeleteModal,
        } = this.props;
      return (
      <Fragment>
          <td>
            <div className="d-flex align-items-center">
                <div className="media">
                    <img src={secureProtocolImgURL(option.imageUrl)} alt={option.name} />
                </div>
                <h4 className="book-title">{option.name}</h4>
            </div>
          </td>
          <td>{option.sku}</td>
          <td>{option.condition}</td>
          <td>{option.asin}</td>
          <td>
              {digitСonversion(
                option.price,
                "currency",
                internationalization_config.currency_code
              )}
          </td>
          <td>{option.qty}</td>
          {/*<td>{option.attempts || 5}</td>*/}
          <td>
            <div className="action-controls">
                {/*<RetryIcon onClick={() => addItemToBatch(option, true)} />*/}
                <DeleteIcon onClick={() => openDeleteModal(option)} />
            </div>
          </td>
      </Fragment>
      );
  };

  selectWarehouse = (e, plan) => {
      this.setState({ selectedInboundShipmentPlan: plan });
  }
  render() {

    const scannedProductsTableHeaders = [
        { className: "title", name: "TITLE", value: "name" },
        { name: "SKU", value: "sku" },
        { name: "CONDITION", value: "condition" },
        { name: "ASIN", value: "asin" },
        { name: "PRICE", value: "price" },
        { name: "COUNT", value: "qty" },
        //{ name: "ATTEMPTS", value: "attempts" },
        { name: "ACTIONS", sortable: false }
    ];

    const {
        holdings,
        address,
        createShipmentPlansRequestStatus,
        inboundShipmentPlans,
        createHoldingAreaShipmentStatus,
    } = this.props;
    const {
        selectedBatches,
        shipmentName,
        labelingPreference,
        addressId,
        selectedInboundShipmentPlan,
        clickedRetryButton,
        retrySelectedError,
        addressIdInvalid,
        labelingPreferenceInvalid,
		shipmentNameInvalid,
		closeDeleteSelectedModal,
		deleteSelectedModalShow,
    } = this.state;
    return(
      <div className="card">
        <div className="card-block">
            <h3 className="h5 card-title">Holding Area</h3>

            <div className="table-top-controls">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label><strong>Shipment Name</strong></label>
                        <input
                            type="text"
                            className={`form-control ${shipmentNameInvalid ? "input-not-valid" : ""}`}
                            name="shipmentName"
                            value={shipmentName}
                            onChange={(e) => this.setState({  [e.target.name]: e.target.value, [`${e.target.name}Invalid`]: false })}
                            placeholder="Enter shipment name"
                        />
                        <div className="message message-shipping">
                            <p className="mt-1 error-message">Please enter shipment name</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                    <label><strong>Labeling Preference</strong></label>
                        <select
                            className={`form-control ${labelingPreferenceInvalid ? "input-not-valid" : ""}`}
                            name="labelingPreference"
                            onChange={(e) => this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Invalid`]: false })}
                        >
                            <option key={`labelling_reference_0_NULL`} value="" selected={labelingPreference === ""}>Select Labeling Preference</option>
                            {
                              labelingPreferenceOptions.map((labelingPreference, i) => (
                                  <option key={`labelling_reference_1_${labelingPreference.value}`} value={labelingPreference.value} selected={labelingPreference.value === labelingPreference}>{labelingPreference.label}</option>
                              ))
                            }
                        </select>
                        <div className="message message-ship-from">
                            <p className="mt-1 error-message">Please select Labeling preference</p>
                        </div>
                    </div>

                    {
                        !!address.addressList && <div className="col-md-4">
                            <label><strong>Address</strong></label>
                            <select
                                className={`form-control ${addressIdInvalid ? "input-not-valid" : ""}`}
                                name="addressId"
                                onChange={(e) => this.setState({ [e.target.name]: e.target.value, [`${e.target.name}Invalid`]: false })}
                            >
                                <option key={`address_-1_NULL`} value="" selected={addressId === ""}>Select Shipment Address</option>
                                {
                                    address.addressList.map((address, i) => (
                                        <option key={`address_${i}_${address.id}`} value={address.id} selected={addressId === address.id}>{address.addressName}</option>
                                    ))
                                }
                            </select>
                            <div className="message message-ship-from">
                                <p className="mt-1 error-message">Please select Ship-from Address</p>
                            </div>
                        </div>
                    }
                </div>

                <div className="btn-link-group">
                    <button onClick={this.retrySelectedBatches} type="button" className="btn btn-link btn-success" id="btn-retry">
                        <RetryIcon
                            title="Retry Selected"
                            isLoading={createShipmentPlansRequestStatus === 'execution' && clickedRetryButton === 'retrySelected'}
                        />
                    <span>Retry Selected</span>
                    </button>
                    <button onClick={this.retryAllBatches} type="button" className="btn btn-link btn-success" id="btn-retry-all">
                        <RetryIcon
                            title="Retry All"
                            isLoading={createShipmentPlansRequestStatus === 'execution' && clickedRetryButton === 'retryAll'}
                        />
                    <span>Retry All</span>
                    </button>
					<button
						type="button"
						className="btn btn-link btn-danger"
						onClick={this.deleteSelectedDialog}
					>
                    <svg className="icon" width="13" height="16" viewBox="14 10 13 16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5714286 23.3928571c0 .9035715.7392857 1.6428572 1.6428571 1.6428572h6.5714286c.9035714 0 1.6428571-.7392857 1.6428571-1.6428572v-9.8571428h-9.8571428v9.8571428zM26.25 11.0714286h-2.875L22.5535714 10.25h-4.1071428l-.8214286.8214286H14.75v1.6428571h11.5v-1.6428571z" fill="#F22F2F" fillRule="evenodd"/>
                    </svg>
                    <span>Delete selected</span>
                    </button>
                </div>

                {createShipmentPlansRequestStatus === 'complete' && inboundShipmentPlans.length > 0 && <div className="mt-3">
                    <strong>Select Warehouse:</strong>
                    {
                        !!inboundShipmentPlans && inboundShipmentPlans.map((plan, i) => (
                            <label key={`inboundment_shipment_plan-holding_area-${i}`} className={`radio-warehouse ${!!selectedInboundShipmentPlan && plan.ShipmentId === selectedInboundShipmentPlan.ShipmentId ? 'active' : ''}`}>
                                <input
                                    onClick={(e) => this.selectWarehouse(e, plan)}
                                    type="radio"
                                    name="warehouse"
                                    value={plan.DestinationFulfillmentCenterId}
                                    checked={!!selectedInboundShipmentPlan && plan.ShipmentId === selectedInboundShipmentPlan.ShipmentId}
                                />
                                <span className={`badge warehouse-badge outline-badge ${plan.DestinationFulfillmentCenterId}`}>
                                    {plan.DestinationFulfillmentCenterId} ({sum(map(plan.Items, item => Number(item.Quantity)))||0})
                                </span>
                            </label>
                        ))
                    }
                    <button onClick={this.createHoldingAreaShipment} type="button" className="btn btn-primary btn-add-new-batch">
                        {createHoldingAreaShipmentStatus.loading && <svg className="icon animate-spin" width="14" height="15" viewBox="365 10 14 15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M368.509267 20.7870471c.205248.1998463.307872.4429028.307872.7291699 0 .2862661-.101274.5306723-.30382.7332206-.202547.2025469-.446954.30382-.733221.30382-.280865 0-.523921-.1026239-.72917-.3078711-.205247-.2052473-.307871-.4483043-.307871-.72917 0-.2862661.101273-.5306723.30382-.7332206.202547-.2025468.446953-.30382.73322-.30382s.529323.1026239.72917.3078712zm4.034729 1.6689846c.205248.1998464.307872.4429029.307872.72917 0 .2862661-.101274.5306723-.30382.7332206-.202547.2025468-.446954.30382-.733221.30382-.286266 0-.530672-.1012732-.733221-.30382-.202546-.2025468-.30382-.4469535-.30382-.7332206 0-.2862661.101274-.5306723.30382-.7332206.202547-.2025469.446954-.30382.733221-.30382.286266 0 .529322.1026238.72917.3078711l-.000001-5e-7zm-5.703708-5.7037089c.205247.1998464.307871.4429029.307871.72917 0 .2862661-.101273.5306723-.30382.7332206-.202547.2025468-.446954.30382-.733221.30382-.286266 0-.530672-.1012732-.733221-.30382-.202546-.2025468-.30382-.4469535-.30382-.7332206 0-.2862661.101274-.5306724.30382-.7332206.202547-.2025469.446954-.30382.733221-.30382.286266 0 .529322.1026238.72917.3078711v-5e-7zm10.046303 4.763899c0 .2808648-.102624.5239213-.307871.72917-.205247.2052473-.448304.3078712-.72917.3078712-.286266 0-.530672-.1012732-.73322-.3038201-.202547-.2025468-.30382-.4469535-.30382-.7332206 0-.2862661.101273-.5306723.30382-.7332206.202546-.2025468.446953-.30382.73322-.30382.286266 0 .530673.1012732.733221.30382.202547.2025468.30382.4469536.30382.7332206v-5e-7zm-8.190978-8.9849494c.253858.2538583.380788.5590271.380788.9155107 0 .3564822-.12693.6616538-.380788.9155107-.253858.2538583-.559027.3807876-.915511.3807876-.356482 0-.661654-.1269293-.91551-.3807876-.253859-.2538583-.380788-.5590271-.380788-.9155107 0-.3564822.126929-.6616539.380788-.9155107.253858-.2538583.559027-.3807877.91551-.3807877.356482 0 .661654.1269294.915511.3807877zm9.552092 4.2210746c.205248.1998464.307871.4429029.307871.72917 0 .2862661-.101273.5306723-.30382.7332206-.202546.2025468-.446953.30382-.73322.30382-.286266 0-.530672-.1012732-.733221-.30382-.202547-.2025468-.30382-.4469535-.30382-.7332206 0-.2862661.101273-.5306724.30382-.7332206.202547-.2025469.446954-.30382.733221-.30382.286266 0 .529322.1026238.72917.3078711l-.000001-5e-7zm-5.331017-6.0764c.302469.3024698.453704.6697552.453704 1.1018562 0 .4321011-.151235.7993865-.453704 1.1018563-.30247.3024698-.669756.4537047-1.101857.4537047-.432101 0-.799386-.1512349-1.101856-.4537047-.30247-.3024698-.453705-.6697552-.453705-1.1018563 0-.432101.151235-.7993864.453705-1.1018562s.669755-.4537047 1.101856-.4537047c.432101 0 .799387.1512349 1.101857.4537047zm4.747696 2.7708409c0 .5023176-.178241.9303632-.534723 1.2841464-.356482.3537817-.783179.5306723-1.280096.5306723-.502317 0-.930363-.1768906-1.284146-.5306723-.353782-.3537818-.530672-.7818288-.530672-1.2841464 0-.4969167.17689-.923612.530672-1.2800956.353782-.3564822.781829-.534723 1.284146-.534723.496917 0 .923612.1782408 1.280096.534723.356482.3564821.534723.7831789.534723 1.2800956z" fill="#FFF" fillRule="evenodd"/>
                        </svg>}
                    <span>Create new batch with these items</span>
                    </button>
                </div>}
                <div className={`message message-table ${retrySelectedError ? 'd-block': ''}`}>
                    <p className="error-message">Please select item(s) to retry</p>
                </div>
            </div>
            <TableGenerator
                rootClassName="table acc-table"
                headerTitles={scannedProductsTableHeaders}
                optionMapper={this.scannedProductsTableOptionMapper}
                isCheckable
                sortable={false}
                options={holdings}
                selectedRows={selectedBatches}
                selectRow={this.selectBatches}
                selectAllRows={this.selectAllBatches}
                checkedRowName="sku"
            />
        </div>
		<DeleteListingsItemsInBulkModal
          isOpen={deleteSelectedModalShow}
          close={this.closeDeleteSelectedModal}
          deleteListingItems={this.deleteSelected}
		/>
    </div>
    );
  }
}

ScannedProducts.propTypes = {
  openDeleteModal: PropTypes.func.isRequired,
  holdings: PropTypes.array,
  loadingHoldings: PropTypes.bool.isRequired,
  batchMetadata: PropTypes.object.isRequired,
  createShipmentPlans: PropTypes.func.isRequired,
  address: PropTypes.object.isRequired,
  createShipmentPlansRequestStatus: PropTypes.string.isRequired,
  inboundShipmentPlans: PropTypes.array.isRequired,
  createHoldingAreaShipment: PropTypes.func.isRequired,
  createHoldingAreaShipmentStatus: PropTypes.object.isRequired,
  internationalization_config: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired
};

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config"),
    batchDeleteExecuted: state.HoldingArea.get("batchDeleteExecuted"),
  }),
  { deleteHoldingAreaInBulk, deleteHoldingAreaInBulkSuccessRefreshed }
)(ScannedProducts);
