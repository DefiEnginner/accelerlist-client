import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col, Collapse } from "reactstrap";
import TableGenerator from "../../../../shared/components/TableGenerator";
import Tooltip from "../../../../shared/components/Tooltip";
import "./style.css";

import SideBar from "./sidebar/SideBar";
import BatchToolBoxRow from "./shared/BatchToolBoxRow";
import BatchMetricsRow from "./shared/BatchMetricsRow";
import BatchMetadataBadges from "./shared/BatchMetadataBadges";
import ListingsTableDetail from "./shared/ListingsTableDetail";
import PropTypes from "prop-types";
import { setFocusToAmazonSearchBar } from "../../../../helpers/batch/utility";
import { digitСonversion, secureProtocolImgURL, momentDateTimeToLocalFormatConversion } from "../../../../helpers/utility";

import BoxIcon from "../../../../shared/components/SVGIcons/Box";
import EditIcon from "../../../../shared/components/SVGIcons/Edit";
import PrintIcon from "../../../../shared/components/SVGIcons/PrintIcon";
import DeleteIcon from "../../../../shared/components/SVGIcons/Delete";
import PopoverCustomElementAndContent from "../../../../shared/components/PopoverCustomElementAndContent";
import PrintPopoverListingItem from "./shared/PrintPopoverListingItem";
import printerActions from "../../../../redux/print_service/actions";
import SkuLabelConfirm from "../batchModals/SkuLabelConfirm";
import authActions from '../../../../redux/auth/actions';
import settingActions from '../../../../redux/settings/actions';
import { conditionMappingForPrinterLabels } from '../../../../helpers/batch/mapping_data';

const { updateUserSettings } = settingActions;
const { updateUserData } = authActions;
/*
This display is shown when they have not started scanning an item yet, and after the
previous item has been added successfully to the batch and you're ready to start
listing a new item.
*/
const { print } = printerActions;

class CreatedListingsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		display_products: [],
		display_sku_label_warning: false,
    };
  }

	UNSAFE_componentWillMount() {
		let { products } = this.props;
		if(products){
			this.setState({display_products: products});
		}
	}

	UNSAFE_componentWillReceiveProps(newProps) {
		const { userData } = this.props;
		let { products } = newProps;
		this.setState({display_products: products});
		if(userData){
			if(!userData.settings.batch_sku_label_warning && products.length > 0){
				this.setState({ display_sku_label_warning: true });
			} else {
				this.setState({ display_sku_label_warning: false });
			}
		}
	}

	closeSkuLabelAlert = () => {
		this.setState({ display_sku_label_warning: false});
	}

  render() {
  let {
    handleSearchSubmit,
    handleSearchChange,
    displayCustomSKUTemplateModal,
    currentModal,
    batchMetadata,
    batchListingDefaults,
    updateListingDefaultsData,
    existingShipments,
    setCurrentEditableListing,
    sidebarTabId,
    setSidebarTabId,
    closeModal,
    createNewSupplier,
    suppliers,
	scouts,
    collapse,
    internationalConfig,
    updateModalDisplay,
    batchLoaded,
    internationalization_config,
    setAllBatchListingRowsExpanded,
    allBatchListingRowsExpanded,
    print
  } = this.props;

  console.log("is batch loaded", batchLoaded);

  const openEditModal = listing => {
    let isHoldingAreaListing = false;
    setCurrentEditableListing(listing, isHoldingAreaListing);
    updateModalDisplay("edit_listing_item");
  };

  const openEditModalForClosed = listing => {
    let isHoldingAreaListing = false;
    setCurrentEditableListing(listing, isHoldingAreaListing);
    updateModalDisplay("edit_listing_item_for_closed");
  };

  const openDeleteModal = listing => {
    let isHoldingAreaListing = false;
    setCurrentEditableListing(listing, isHoldingAreaListing);
    updateModalDisplay("delete_listing_item");
  };

  const openEditBoxContentModal = listing => {
    let isHoldingAreaListing = false;
    setCurrentEditableListing(listing, isHoldingAreaListing);
    updateModalDisplay("edit_box_content_listing_item");
  };

  const printListItem = (listing, qty) => {
    print(listing, qty);
    setFocusToAmazonSearchBar();
  };

  const listingTableHeaders = [
    { className: "title", name: "TITLE", value: "name", sortable: false },
    { name: "RANK", value: "salesrank", sortable: true },
    { name: "PRICE", value: "price", sortable: true },
    { name: "QTY", value: "qty", sortable: false },
    { name: "CONDITION", value: "condition", sortable: false },
    { name: "ACTIONS", sortable: false }
  ];

  const listingTableOptionMapper = option => {
    const { amazon_url } = internationalConfig;
    const amazonUrl =
      "https://" +
      (amazon_url || "www.amazon.com") +
      "/gp/offer-listing/" +
      option.asin +
      "/ref=olp_fsf?ie=UTF8&f_primeEligible=true";
    return (
      <Fragment>
        <td style={{ width: '48%' }}>
          <Fragment>
            <div className="d-flex align-items-center text-left">
              <div className="media">
                <img src={secureProtocolImgURL(option.imageUrl)} alt="" />
              </div>
              <div style={{ fontSize: '12px', width: '100%' }}>
                <a
                  className="book-title title-link"
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {option.name}
                </a>
                <Row className="mt-1">
                  <Col sm="6">
                    <p className="mb-0"><strong>SKU:</strong> {!!option.sku ? option.sku : 'N/A'}</p>
                    <p className="mb-0"><strong>ASIN:</strong> {option.asin}</p>
                    <p className="mb-0">
                      <strong>PREP:</strong>
                      {option.prepInstructions ?
                        <span className="text-danger"> {option.prepInstructions}</span>
                      : null}
                    </p>
                  </Col>
                  <Col sm="6">
                    <p className="mb-0"><strong>Exp Date:</strong> {!!option.expDate ? momentDateTimeToLocalFormatConversion(option.expDate) : 'N/A'}</p>
                    <p className="mb-0">
                      <strong>Buy Cost:</strong>
                      {digitСonversion(
                        option.buyCost,
                        "currency",
                        internationalConfig.currency_code
                      )}
                    </p>
                    <p className="mb-0"><strong>Supplier:</strong> {!!option.supplier ? option.supplier : 'N/A'}</p>
                  </Col>
                </Row>
                <div>
                  <span className="warehouse-group">
                    {!!option.fulfillmentCenters &&
                      option.fulfillmentCenters.map((fulfillmentCenter, j) =>
                        Object.keys(
                          option.boxContents[fulfillmentCenter.ShipmentId]
                        ).map((boxNumber, k) => (
                          <span
                            key={`listing-table-warehouse-group-${option.sku}-${fulfillmentCenter.ShipmentId}-box_number-${boxNumber}`}
                            className={`badge warehouse-badge ${
                              fulfillmentCenter.DestinationFulfillmentCenterId
                            }`}
                          >{`${
                            fulfillmentCenter.DestinationFulfillmentCenterId
                          } - Box ${boxNumber}: ${
                            option.boxContents[fulfillmentCenter.ShipmentId][
                              boxNumber
                            ]
                          }`}</span>
                        ))
                      )}
                  </span>
                </div>
              </div>
            </div>
          </Fragment>
        </td>
        <td>{digitСonversion(option.salesrank, "rank")}</td>
        <td>
          {digitСonversion(
            option.price,
            "currency",
            internationalization_config.currency_code
          )}
        </td>
        <td>{option.qty}</td>
		<td>{
				conditionMappingForPrinterLabels[option.condition] ?
					conditionMappingForPrinterLabels[option.condition] :
					option.condition
			}
		</td>
        <td>
          <div className="action-controls">
		  {batchMetadata.status !== "Completed" ?
			<Fragment>
              <EditIcon onClick={() => openEditModal(option)} title="Edit" />
              <DeleteIcon
                onClick={() => openDeleteModal(option)}
                title="Delete"
              />
		  </Fragment> :
		  <Fragment>
              <EditIcon onClick={() => openEditModalForClosed(option)} title="Edit" />
		  </Fragment>
		  }
            <PopoverCustomElementAndContent
              userStyle={{ marginRight: "5px", cursor: "pointer" }}
              tooltipId={`PrintIcon${option.id}`}
              TooltipContent={(props) => (
                <PrintPopoverListingItem
                  option={option}
                  printListItem={printListItem}
                  togglePopover={props.togglePopover}
                />
              )}
              customElement={
                <PrintIcon />
              }
            />
            <BoxIcon
              onClick={() => openEditBoxContentModal(option)}
              title="Edit Box"
            />
          </div>
        </td>
      </Fragment>
    );
  };

  const BatchStatusBadge = ({ status }) => {
      const classMapping = {
          "Deleted": "badge-deleted",
          "In Progress": "badge-inprogress",
          "Completed": "badge-completed"
      }
      return (
        <span className={`badge badge-status ${classMapping[status]}`}>{status}</span>
      )
  }

  const searchBatch = (search) => {
	if(!search){
		this.setState({display_products: this.props.products});
		return;
	}
	  let products_to_display = [];
	  search = search.toUpperCase();
	  this.props.products.forEach((row) => {
		let key = [row.name, row.suplier, row.sku, row.price.toString()]
		key = key.join(' ').toUpperCase();
		if(key.includes(search)){
			products_to_display.push(row);
		}
	  }
	);
	this.setState({display_products: products_to_display});
  }


  return (
    <Row>
      <Col className="batch-core">
        <BatchToolBoxRow
          handleSearchSubmit={handleSearchSubmit}
          handleSearchChange={handleSearchChange}
        />
        <div className="batch-header">
			<Row>
				<Col xs={6}>
		          <h2 className="batch-name">{batchMetadata.batchName}</h2>
			          {!!batchMetadata.status && <BatchStatusBadge status={batchMetadata.status} /> }
		          <Tooltip
					tooltipId="BatchInfo"
		            tooltipText={`
				      This is your batch name and also a breadcrumb
		              trail beneath it to remind you of the batch
				      settings you set for this batch`}
				  />
			  </Col>
			  <Col xs={6}>
				  <BatchMetadataBadges batchMetadata={batchMetadata} />
			  </Col>
		  </Row>
        </div>

        <div className="medium-top-margin medium-bottom-margin">
			<BatchMetricsRow
				existingShipments={existingShipments}
				batchLoaded={batchLoaded}
				searchBatch={searchBatch}
			/>
        </div>

		<div>
		</div>

        <TableGenerator
          rootClassName="table batch-table"
          headerTitles={listingTableHeaders}
          optionMapper={listingTableOptionMapper}
          expandableMapper={ListingsTableDetail}
          expandableAdditionalProps={{ internationalConfig }}
          isExpandable
          isLoading={!batchLoaded}
          options={this.state.display_products}
          defaultLoadingText={"Pulling your batch up... hang tight for a minute ️🏄‍"}
          defaultText={
            "Make sure all your batch settings are correct before scanning your first product and starting your batch."
          }
          setAllBatchListingRowsExpanded={setAllBatchListingRowsExpanded}
          allBatchListingRowsExpanded={allBatchListingRowsExpanded}
        />
      </Col>

      <Collapse className="batch-sidebar" isOpen={collapse}>
        <SideBar
          batchListingDefaults={batchListingDefaults}
          updateListingDefaultsData={updateListingDefaultsData}
          displayCustomSKUTemplateModal={displayCustomSKUTemplateModal}
          sidebarTabId={sidebarTabId}
          setSidebarTabId={setSidebarTabId}
          createNewSupplier={createNewSupplier}
          suppliers={suppliers}
          scouts={scouts}
          currentModal={currentModal}
          closeModal={closeModal}
        />
      </Collapse>
	  <SkuLabelConfirm
		toggle={this.closeSkuLabelAlert}
		isOpen={this.state.display_sku_label_warning}
		updateUserData={this.props.updateUserData}
		userData={this.props.userData}
		updateUserSettings={this.props.updateUserSettings}
	  />
    </Row>
  );
}
};

CreatedListingsDisplay.propTypes = {
  internationalConfig: PropTypes.object.isRequired,
  handleSearchSubmit: PropTypes.func.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  batchMetadata: PropTypes.object.isRequired,
  batchListingDefaults: PropTypes.object.isRequired,
  updateListingDefaultsData: PropTypes.func.isRequired,
  existingShipments: PropTypes.array,
  updateModalDisplay: PropTypes.func.isRequired,
  setCurrentEditableListing: PropTypes.func.isRequired,
  sidebarTabId: PropTypes.string.isRequired,
  setSidebarTabId: PropTypes.func.isRequired,
  createNewSupplier: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
  scouts: PropTypes.array.isRequired,
  collapse: PropTypes.bool.isRequired,
  batchLoaded: PropTypes.bool.isRequired,
  setAllBatchListingRowsExpanded: PropTypes.func,
  allBatchListingRowsExpanded: PropTypes.bool
};

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config"),
    userData: state.Auth.get("userData")
  }),
  {
	  print,
	  updateUserData,
	  updateUserSettings,
  }
)(CreatedListingsDisplay);
