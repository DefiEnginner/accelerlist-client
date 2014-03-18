import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Papa from 'papaparse'
import {
  Card,
  CardBody,
  CardTitle,
  Input,
  Button,
  FormGroup,
  Label
} from "reactstrap";
import inventoryActions from "../../../redux/inventory/actions";
import InventoryTable from "./components/InventoryTable";
import StrandedTable from "./components/StrandedTable";
import InventoryUploadLoader from "./components/inventoryUploadLoader";
import InventoryUploader from "./components/InventoryUploader";
import InventoryFileMapping from "./components/InventoryFileMapping";
import UploadIcon from "react-icons/lib/fa/cloud-upload";
import settingActions from "../../../redux/settings/actions";
import UpdateWarningModal from "./components/UpdateWarningModal";

import { getConditionMappingInventoryPrintLabels } from "../../../helpers/inventory/utility";
import { columnMappingForInventoryPrintLabel } from "../../../helpers/inventory/mapping_data";
import PrintIcon from "react-icons/lib/md/print";
import { backendHost, request } from "../../../helpers/apiConfig";
import printerActions from "../../../redux/print_service/actions";
import { generateStrandedItemsFileExport } from "./exportCSV";
import authActions from "../../../redux/auth/actions";

const {
	setUploadInventoryItemsFileJobId,
	fetchInventoryItems,
	fetchStrandedItems,
	uploadInventoryItemsFile,
	changeInventoryTableFieldData } = inventoryActions;
const { print } = printerActions;
const { fetchPrinterDefaults, updateUserSettings } = settingActions;
const { updateUserData } = authActions;

const ViewHeader = () => (
  <div className="view-header">
    <header className="text-white">
      <h1 className="h5 title text-uppercase"> </h1>
    </header>
  </div>
);

const ViewContent = ({ children }) => (
  <div className="view-content view-components">
    <Card>
      <CardBody>{children}</CardBody>
    </Card>
  </div>
);



const ourHeaderColumns = [
  "SellerSKU" ,"Cost/Unit" ,"Supplier","Date Purchased",
];

const otherHeaderColumns = [
  'Title', 'MSKU' ,'ASIN' ,'FNSKU' ,'On Hand' ,'Total In Stock Buy Cost' ,'Replens', 'List Price', 'Active Cost/Unit' ,'Active Supplier' ,'Active Date Purchased', 'Notes'
]

const default_page_size = 10;

class Inventory extends Component {
  state = {
    selectInventoryValue: "",
    isOpenInventoryUploaderModal: false,
    inventoryChannel: "fba",
    inventoryCurrentlyViewingStatus: "all",
    fileHeaders: null,
    file: null,
    openFileMappingModal: false,
    loading: false,
	  inventoryLoaded: false,
	  strandedLoaded: false,
	  activeTable: 'inventory',
	  showExportStranded: false,
	searchText: "",
	display_stranded: [],
	display_inventory: [],
	searchPlaceholder: "SEARCH TITLE / ASIN / SKU...",
	showUpdateWarning: false,
  };

  handleSearchChange(event) {
	this.handleSearch(event.target.value);
	this.setState({searchText: event.target.value});
  }

  handleExportStranded = () => {
	generateStrandedItemsFileExport(this.props.strandedItemsExport, []);
  };

  handleSearch(search){
	if(this.state.inventoryCurrentlyViewingStatus === 'stranded_closed'
		|| this.state.inventoryCurrentlyViewingStatus === 'stranded_active'){
		this.searchStranded(search);
	} else {
		this.searchInventory(search);
	}
  }

  searchInventory(search){
    const { inventoryChannel, inventoryCurrentlyViewingStatus } = this.state;
	let sort = 'seller_sku';
	let sort_order = 'asc';
	this.props.fetchInventoryItems(
	  inventoryChannel,
	  inventoryCurrentlyViewingStatus,
	  1,
	  default_page_size,
	  sort,
	  sort_order,
	  search,
	);
	this.setState({
		activeTable: 'inventory',
		inventoryLoaded: true,
	});
	this.setSearchPlaceholder('inventory');
	this.setState({display_inventory: this.props.inventoryItems});
  }

  searchStranded(search){
	if(!search){
		this.setState({display_stranded: this.props.strandedItems});
		return;
	}
	  let stranded_to_display = [];
	  search = search.toUpperCase();
	  this.props.strandedItems.forEach((row) => {
		let key = [row.asin, row.sku, row.fnsku]
		key = key.join(' ').toUpperCase();
		if(key.includes(search)){
			stranded_to_display.push(row);
		}
	  }
	);
	this.setState({display_stranded: stranded_to_display});
  }

  fetchInventoryData = (page, per_page, sorted) => {
    const { inventoryChannel, inventoryCurrentlyViewingStatus } = this.state;
    this.setState({inventoryLoaded: true});
    let sort = 'seller_sku';
    let sort_order = 'asc';
    if(sorted.length > 0) {
      sort = sorted[0].id;
      sort_order = sorted[0].desc ? 'desc' : 'asc';
    }
    this.props.fetchInventoryItems(
      inventoryChannel,
      inventoryCurrentlyViewingStatus,
      page,
      per_page,
      sort,
	  sort_order,
	  this.state.searchText,
    );
    this.props.fetchPrinterDefaults();
  }

  updateLoadingFlag = (flag) => {
    this.setState({loading: flag});
  }

  setSearchPlaceholder(state){
	if(state === 'stranded'){
		this.setState({searchPlaceholder: 'SEARCH ASIN / SKU / FNSKU...'});
	} else {
		this.setState({searchPlaceholder: 'SEARCH TITLE / ASIN / SKU...'});
	}
  }

  handleChangeInventoryChannelFilter = e => {
    const inventoryChannel = e.target.value;
	const { inventoryCurrentlyViewingStatus } = this.state;
    this.setState({
      inventoryChannel: inventoryChannel
    });
	if(inventoryCurrentlyViewingStatus === 'stranded_closed' ||
			inventoryCurrentlyViewingStatus === 'stranded_active'){
		this.setState({showExportStranded: true});
		this.props.fetchStrandedItems(inventoryChannel);
		this.setState({
			activeTable: 'stranded',
			strandedLoaded: true,
		});
		this.setSearchPlaceholder('stranded');
	} else {
		this.setState({showExportStranded: false});
		let sort = 'seller_sku';
		let sort_order = 'asc';
		this.props.fetchInventoryItems(
		  inventoryChannel,
		  inventoryCurrentlyViewingStatus,
		  1,
		  default_page_size,
		  sort,
		  sort_order,
		  this.state.searchText,
		);
		this.setState({
			activeTable: 'inventory',
			inventoryLoaded: true,
		});
		this.setSearchPlaceholder('inventory');
	}
	this.setState({searchText: ""});
  };

  handleChangeInventoryViewingStatusFilter = e => {
    const inventoryCurrentlyViewingStatus = e.target.value;
	const { inventoryChannel } = this.state;
    this.setState({
      inventoryCurrentlyViewingStatus: inventoryCurrentlyViewingStatus,
    });
	if(inventoryCurrentlyViewingStatus === 'stranded_closed' ||
			inventoryCurrentlyViewingStatus === 'stranded_active'){
		this.setState({showExportStranded: true});
		this.props.fetchStrandedItems(inventoryChannel);
		this.setState({
			activeTable: 'stranded',
			strandedLoaded: true,
		});
		this.setSearchPlaceholder('stranded');
	} else {
		this.setState({showExportStranded: false});
		let sort = 'seller_sku';
		let sort_order = 'asc';
		this.props.fetchInventoryItems(
		  inventoryChannel,
		  inventoryCurrentlyViewingStatus,
		  1,
		  default_page_size,
		  sort,
		  sort_order,
		  this.state.searchText,
		);
		this.setState({
			activeTable: 'inventory',
			inventoryLoaded: true,
		});
		this.setSearchPlaceholder('inventory');
	}
	this.setState({searchText: ""});
  };

  closeUploadModal = () => {
    this.setState({
      loading: false
    });
  };

  closeInventoryFileMappingModal = () => {
    this.setState({
      openFileMappingModal: false
    });
  };

  closeInventoryUploaderModal = () => {
    this.setState({
      isOpenInventoryUploaderModal: false
    });
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    let jobId = newProps.uploadJobId;
    if(!!jobId) {
      this.pollUploadProcessingStatus(jobId);
    }
    if(!!newProps.inventoryItems && this.props.inventoryItems !== newProps.inventoryItems) {
      this.setState({inventoryLoaded: false});
	  this.setState({display_inventory: newProps.inventoryItems});
    }
    if(!!newProps.strandedItems && this.props.strandedItems !== newProps.strandedItems) {
      this.setState({strandedLoaded: false});
	  this.setState({display_stranded: newProps.strandedItems});
    }
	if(!this.props.strandedItems){
		this.props.fetchStrandedItems(this.state.inventoryChannel);
	}
  }

	closeShowUpdateWarning = () => {
		let data = {inventory_warning: "true"};
		this.props.updateUserSettings(data);
		this.setState({ showUpdateWarning: false});
	}

	componentDidMount(){
		const { userData } = this.props;
		//get data for export
		this.props.fetchStrandedItems('all');
		if(userData){
			if(!userData.settings["inventory_warning"]){
				let ud = userData;
				ud.settings["inventory_warning"] = "true";
				this.props.updateUserData(ud);
				this.setState({ showUpdateWarning: true});
			}
		}
	}

  handleClickUploadButton = () => {
    this.setState({
      isOpenInventoryUploaderModal: true
    });
  };

  printLabel = (listing) => {
    const { print } = this.props;
    let printlabelListing = {};

    Object.keys(listing).forEach(el => {
      const mappingKey = Object.keys(columnMappingForInventoryPrintLabel).indexOf(el);
      if (mappingKey !== -1) {
        const mappingFieldName = columnMappingForInventoryPrintLabel[el];
        if (mappingFieldName === "condition") {
          printlabelListing[mappingFieldName] = getConditionMappingInventoryPrintLabels(listing[el]);
        } else {
          printlabelListing[mappingFieldName] = listing[el];
        }
      }
    });

    print(printlabelListing, listing.quantity || 1);
  }

  isOurHeader = (headers) => {
    let check = false;
    if(headers.indexOf('SellerSKU') > -1 && headers.indexOf('Cost/Unit') > -1) {
      check = true;
      headers.forEach((header) => {
        if(ourHeaderColumns.indexOf(header) < 0) {
          check = false;
        }
      })
    }
    return check;
  };

  isPartnerHeader = (headers) => {
    let check = false;
    if(headers.indexOf('MSKU') > -1 && headers.indexOf('Active Cost/Unit') > -1) {
      check = true;
      headers.forEach((header) => {
        if(otherHeaderColumns.indexOf(header) < 0) {
          check = false;
        }
      })
    }
    return check;
  };

  mapHeaderToLabelAndValue = (headers) => {
    let optionsArray = [];
    headers.forEach((header) => {
      optionsArray.push({ label: header, value: header});
    })
    return optionsArray;
  }

  validateParsedFile = (results) => {
    let header = results.data[0].toString();
    let headers = header.split(",");
    if(this.isOurHeader(headers)) {
      let mapping = {
        "seller_sku": 'SellerSKU',
        "buy_cost": 'Cost/Unit',
        "supplier": 'Supplier',
        "date_purchased": 'Date Purchased'
      };
      let data = {
        mapping: JSON.stringify(mapping),
        file: this.state.file
      };
      this.props.uploadInventoryItemsFile(data);
      this.closeInventoryUploaderModal();
      this.setState({loading: true});
    }
    else if (this.isPartnerHeader(headers))
    {
      let mapping = {
        "seller_sku": 'MSKU',
        "buy_cost": 'Active Cost/Unit',
        "supplier": 'Active Supplier',
        "date_purchased": 'Active Date Purchased'
      }
      let data = {
        mapping: JSON.stringify(mapping),
        file: this.state.file
      }
      this.props.uploadInventoryItemsFile(data);
      this.closeInventoryUploaderModal();
      this.setState({loading: true});
    }
    else {
      let options = this.mapHeaderToLabelAndValue(headers);
      this.setState({ fileHeaders: options, openFileMappingModal: true });
      this.closeInventoryUploaderModal();
    }
  };

  validateUploadedFile = (file) => {
    this.setState({file: file});
    Papa.parse(file, {
      complete: this.validateParsedFile
    });
  };

  pollUploadProcessingStatus = (jobId) => {
    let self = this;
    let {setUploadInventoryItemsFileJobId} = this.props;
    request
      .get(
        backendHost +
        "/api/v1/inventory_item/upload/" +
        jobId
      )
      .then(res => {
        let response = res.body;

        if (response.status !== "failed" && response.status !== "processed") {
          setTimeout(function () {
            self.pollUploadProcessingStatus(jobId);
          }, 1000);
        } else {
          if (response.status === "processed") {
            self.setState({loading: false});
            setUploadInventoryItemsFileJobId(null);
            self.setState({inventoryLoaded: true});
          }
          if (response.status === "failed") {
            self.setState({loading: false});
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

	render() {
    const {
      uploadInventoryItemsFile,
      changeInventoryTableFieldData
    } = this.props;
	  const {
		  isOpenInventoryUploaderModal,
		  inventoryChannel,
		  openFileMappingModal,
		  fileHeaders,
		  file,
		  loading,
		  inventoryLoaded,
		  showUpdateWarning,
		  showExportStranded
	  } = this.state;
    return (
      <div className="view">
        <ViewHeader />
        <ViewContent>
          {
            openFileMappingModal &&
            <Fragment>
              <CardTitle>
                <strong>Select the corresponding columns from your CSV</strong>
              </CardTitle>
              <InventoryFileMapping
                close={this.closeInventoryFileMappingModal}
                options={fileHeaders}
                file={file}
                uploadInventoryItemsFile={uploadInventoryItemsFile}
                updateLoadingFlag={this.updateLoadingFlag}
              />
            </Fragment>
          }
          {
            isOpenInventoryUploaderModal &&
            <Fragment>
              <CardTitle>
                <strong>Upload Inventory MSKU Buy Costs/Supplier</strong>
              </CardTitle>
              <InventoryUploader
                isOpen={isOpenInventoryUploaderModal}
                close={this.closeInventoryUploaderModal}
                uploadInventoryItemsFile={this.validateUploadedFile}
              />
            </Fragment>
          }
          {
            loading &&
            <InventoryUploadLoader
              close={this.closeUploadModal}
            />
          }
          {
            !isOpenInventoryUploaderModal &&  !loading && !openFileMappingModal &&
            <Fragment>
              <CardTitle>
                <strong>Inventory</strong>
              </CardTitle>
              <div>
                These are the items in your actual Amazon inventory. Here, you can
                print labels for items.
              </div>
              <div>
                Very soon, you will be able to search for items, modify list price,
                replenish items and update buy cost/supplier/purchased date for
                accounting purposes.
              </div>
              <br />
              <div className="d-flex align-items-end">
                <FormGroup className="mr-3">
                  <Label>Inventory :</Label>
                  <Input
                    type="select"
                    onChange={this.handleChangeInventoryChannelFilter}
                    value={inventoryChannel}
                  >
                    <option value="mf">MF</option>
                    <option value="fba">FBA</option>
                  </Input>
                </FormGroup>
                <FormGroup className="mr-3">
                  <Label>Currently Viewing Items :</Label>
                  <Input
                    type="select"
                    onChange={this.handleChangeInventoryViewingStatusFilter}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                    <option value="stranded_active">Stranded Active</option>
                    <option value="stranded_closed">Stranded Inactive</option>
                  </Input>
                </FormGroup>
                <FormGroup className="mr-3">
                  <Button color="secondary"><PrintIcon /> Printer Settings</Button>
                </FormGroup>
                <FormGroup className="mr-3">
                  <Button color="primary" onClick={this.handleClickUploadButton}><UploadIcon /> Upload</Button>
                </FormGroup>
				{ showExportStranded ? (
                <FormGroup className="mr-3">
                  <Button color="primary" onClick={this.handleExportStranded}>Export Stranded</Button>
				</FormGroup>
				) : (null)
				}
                <FormGroup className="mr-3">
					<Input
						value={this.state.searchText}
						onChange={this.handleSearchChange.bind(this)}
						autoComplete="off"
						type="text"
						placeholder={this.state.searchPlaceholder}
						id="inventory-search"
					/>
				</FormGroup>
              </div>
              <br />
			  {this.state.activeTable === "inventory" ?  (
                <InventoryTable
                  inventoryItems={this.state.display_inventory}
                  fetchInventoryData={this.fetchInventoryData}
                  changeInventoryTableFieldData={changeInventoryTableFieldData}
                  showLabelsColumn={inventoryChannel === "fba" ? true : false}
                  loading={inventoryLoaded}
                  print={this.printLabel}
			  />
			  ) : (
				  <StrandedTable
					strandedItems={this.state.display_stranded}
					viewStatus={this.state.inventoryCurrentlyViewingStatus}
				  />
			  )
			  }
              </Fragment>
          }
        </ViewContent>
		<UpdateWarningModal
			isOpen={showUpdateWarning}
			close={this.closeShowUpdateWarning}
		/>
      </div>
    );
  }
}

Inventory.propTypes = {
  fetchInventoryItems: PropTypes.func.isRequired,
  uploadInventoryItemsFile: PropTypes.func.isRequired,
  inventoryItems: PropTypes.object,
  changeInventoryTableFieldData: PropTypes.func.isRequired,
  setUploadInventoryItemsFileJobId: PropTypes.func.isRequired
};

export default connect(
  state => ({
    inventoryItems: state.Inventory.get("inventoryItems"),
    strandedItems: state.Inventory.get("strandedItems"),
    strandedItemsExport: state.Inventory.get("strandedItemsExport"),
    uploadJobId: state.Inventory.get("uploadJobId"),
    userData: state.Auth.get("userData"),
  }),
  {
    setUploadInventoryItemsFileJobId,
    fetchInventoryItems,
    uploadInventoryItemsFile,
    changeInventoryTableFieldData,
    fetchPrinterDefaults,
    print,
	  fetchStrandedItems,
	  updateUserData,
	  updateUserSettings,
  }
)(Inventory);
