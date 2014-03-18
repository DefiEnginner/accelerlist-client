import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import inventoryActions from "../../../../../../../redux/inventory/actions";
import accountingActions from "../../../../../../../redux/accounting/actions";
import { backendHost, request } from "../../../../../../../helpers/apiConfig";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import InventoryUploader from '../../../../../inventory/components/InventoryUploader';
import InventoryUploadLoader from "../../../../../inventory/components/inventoryUploadLoader";
import InventoryFileMapping from "../../../../../inventory/components/InventoryFileMapping";
import Papa from 'papaparse';

const { 
  setUploadInventoryItemsFileJobId, 
  fetchInventoryItems, 
  uploadInventoryItemsFile,
} = inventoryActions;

const { 
  setReuploadTransactionReportByInventoryItems,
} = accountingActions;

const ourHeaderColumns = [
  "SellerSKU" ,"Cost/Unit" ,"Supplier","Date Purchased",
];

const otherHeaderColumns = [
  'Title', 'MSKU' ,'ASIN' ,'FNSKU' ,'On Hand' ,'Total In Stock Buy Cost' ,'Replens', 'List Price', 'Active Cost/Unit' ,'Active Supplier' ,'Active Date Purchased', 'Notes'
]

class UploaderModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      fileHeaders: null,
      loading: false,
      isOpenInventoryUploader: true,
      openFileMapping: false,
    }
  }

  shouldComponentUpdate(nextProps) {
    const { isOpen } = this.props;
    if (!isOpen && nextProps.isOpen) {
      this.setState({
        file: null,
        fileHeaders: null,
        loading: false,
        isOpenInventoryUploader: true,
        openFileMapping: false,
      })
    }
    return true;
  }

  validateUploadedFile = (file) => {
    this.setState({file: file});
    Papa.parse(file, {
      complete: this.validateParsedFile
    });
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
      }

      let data = {
        mapping: JSON.stringify(mapping),
        file: this.state.file
      }
      this.props.uploadInventoryItemsFile(data);
      this.setState({
        loading: true
      });

    } else if(this.isPartnerHeader(headers)) {
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
    } else {
      let options = this.mapHeaderToLabelAndValue(headers);
      this.setState({ 
        fileHeaders: options, 
        openFileMapping: true 
      });
    }

    this.setState({
      isOpenInventoryUploader: false
    });
  }

  isOurHeader = (headers) => {
    let check = false;
    if(headers.indexOf('SellerSKU') > -1 && headers.indexOf('Cost/Unit') > -1) {
      check = true;
      headers.forEach((header) => {
        if(ourHeaderColumns.indexOf(header) < 0) {
          console.log("Failing at: ", header);
          check = false;
        }
      })
    }
    return check;
  }

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
  }

  mapHeaderToLabelAndValue = (headers) => {
    let optionsArray = [];
    headers.forEach((header) => {
      optionsArray.push({ label: header, value: header});
    })
    return optionsArray;
  }

  closeUploadModal = () => {
    this.setState({
      loading: false
    });

    this.props.closeModal();
  }

  closeInventoryFileMapping = () => {
    this.setState({
      openFileMapping: false
    });
  }

  updateLoadingFlag = (flag) => {
    this.setState({
      loading: flag
    });
  }

  pollUploadProcessingStatus = (jobId) => {
    let self = this;
    let {
      setUploadInventoryItemsFileJobId,
      saveAndRecalculateMissingInfo,
      setReuploadTransactionReportByInventoryItems
    } = this.props;
    request
      .get(
        backendHost +
        "/api/v1/inventory_item/upload/" +
        jobId
      )
      .then(res => {
        let response = res.body;
        setReuploadTransactionReportByInventoryItems(true);
        if (response.status !== "failed" && response.status !== "processed") {
          setTimeout(function () {
            self.pollUploadProcessingStatus(jobId);
          }, 1000);
          console.log("not done, still wokrin on it....");
        } else {
          if (response.status === "processed") {
            console.log("processed", jobId);
            self.setState({loading: false});
            setUploadInventoryItemsFileJobId(null);
            saveAndRecalculateMissingInfo();
          }
          if (response.status === "failed") {
            self.setState({loading: false});
            setReuploadTransactionReportByInventoryItems(false);
          }

          self.props.closeModal();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    let jobId = newProps.uploadJobId;
    if(!!jobId) {
      console.log('JOBID: ', jobId);
      this.pollUploadProcessingStatus(jobId);
    }
  }

  render() {
    const {
      isOpen,
      toggle,
      uploadInventoryItemsFile,
      closeModal,
    } = this.props;

    return(
      <Modal size="lg" isOpen={isOpen} toggle={toggle} >
        <ModalHeader toggle={toggle}>Upload Inventory Data</ModalHeader>
        <ModalBody>
          {
            this.state.isOpenInventoryUploader && 
            <InventoryUploader 
              isOpen={this.state.isOpenInventoryUploader} 
              close={closeModal} 
              uploadInventoryItemsFile={this.validateUploadedFile}
            />
          }
          {
            this.state.loading &&  
            <InventoryUploadLoader
              close={this.closeUploadModal}
            />
          }
          {
            this.state.openFileMapping &&
            <Fragment>
              <p>Select the corresponding columns from your CSV</p>
              <InventoryFileMapping
                close={closeModal}
                options={this.state.fileHeaders}
                file={this.state.file}
                uploadInventoryItemsFile={uploadInventoryItemsFile}
                updateLoadingFlag={this.updateLoadingFlag}
              />
            </Fragment>
          }
        </ModalBody>
      </Modal>
    );
  }
}

UploaderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  uploadInventoryItemsFile: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  saveAndRecalculateMissingInfo: PropTypes.func.isRequired,
  setReuploadTransactionReportByInventoryItems: PropTypes.func.isRequired,
  uploadJobId: PropTypes.number
};

export default connect(
  state => ({
    inventoryItems: state.Inventory.get("inventoryItems"),
    uploadJobId: state.Inventory.get("uploadJobId"),
  }),
  {
    setUploadInventoryItemsFileJobId,
    fetchInventoryItems,
    uploadInventoryItemsFile,
    setReuploadTransactionReportByInventoryItems
  }
)(UploaderModal);