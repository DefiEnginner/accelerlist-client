import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, CardTitle, Button  } from 'reactstrap';
import PropTypes from "prop-types";
import Dropzone from 'react-dropzone';
import accountingActions from "../../../../../redux/accounting/actions";
import { incomeReportUrl } from "../../../../../config/mediaLinks";

import { upload_icon, report_image, excelImage } from '../../../../../assets/images';
import IconExternalLink from 'react-icons/lib/fa/external-link';
import IconLoading from 'react-icons/lib/md/cached';

import { StyledDropzoneContainer, StyledFileView } from "./styles";

const {
  uploadTransactionReport,
  getStatusOfUploadingTransactionReport,
  clearUploadedTransactionReportData,
  clearUploadReportJobData
} = accountingActions;

class TransactionUploader extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {
      dropZoneIsDisabled: false,
      accepted: [],
      rejected: [],
      showFailureMessage: false,
      error_message: "",
      modalOpen: false
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const {
        uploadFileStatus,
        getStatusOfUploadingTransactionReport,
        batchUploadJobStatus,
        clearUploadReportJobData
      } = this.props;

      const { accepted } = this.state;
      if (uploadFileStatus && uploadFileStatus.batch_upload_id && uploadFileStatus.file_data) {
        accepted.forEach((file) => {
          if (uploadFileStatus.file_data.hasOwnProperty(file.name) && uploadFileStatus.file_data[file.name].job_status === "error") {
            const errorMessage = uploadFileStatus.file_data[file.name].error_message;
            this.setState({
              accepted: [],
              showFailureMessage: true,
              error_message: errorMessage,
              dropZoneIsDisabled: false
            })
            clearUploadReportJobData();
          }
        })
        
        if (batchUploadJobStatus && batchUploadJobStatus.hasOwnProperty("status")
          && batchUploadJobStatus.hasOwnProperty("generated_report_id")) {
            const { status, generated_report_id } = batchUploadJobStatus;
            const { accepted } = this.state;
            accepted.forEach((file, index) => {
              if (uploadFileStatus.file_data.hasOwnProperty(file.name)) {
                let buffAccepted = accepted;
                buffAccepted[index].jobStatus = status;
                this.setState({
                  accepted: buffAccepted
                });
                return null;
              }
            })
            if (status && generated_report_id && status === "processed") {
              this.props.history.push(
                `${incomeReportUrl}/${generated_report_id}`
              );
              clearUploadedTransactionReportData();
              this.setState({
                dropZoneIsDisabled: false
              });
            }
            if (status && status === "failed") {
              this.setState({
                showFailureMessage: true,
                dropZoneIsDisabled: false
              });
              clearUploadedTransactionReportData();
            }
        }
        getStatusOfUploadingTransactionReport(uploadFileStatus.batch_upload_id);
      }
    }, 3 * 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }


  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    let accepted = [];
    let rejected = [];
    if(acceptedFiles.length > 0) {
      const { uploadTransactionReport } = this.props;
      acceptedFiles.forEach(file => {
        accepted.push({
          name: file.name,
          jobStatus: 'Uploading...'
        });
        this.setState({
          accepted: accepted,
          rejected: rejected,
          showFailureMessage: false,
          dropZoneIsDisabled: true
        });
        uploadTransactionReport(file);
      })
    } else {
      rejected.push(rejectedFiles)
      this.setState({
        accepted: accepted,
        rejected: rejected,
        showFailureMessage: false
      })
    }
  }

  generateFileView = (file) => (
    <Fragment>
      <div><img src={excelImage} className="img-fluid img-file-icon" alt="excel_image" /></div>
      <div className="upload-info">
        <h5 className="filename">{file.name}</h5>
        <p className="text-muted">
          {file.jobStatus} <IconLoading className="animate-spin animate-reverse" />
        </p>
      </div>
    </Fragment>
  );

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  render() {
    const { internationalization_config } = this.props;
    const { dropZoneIsDisabled, error_message, modalOpen } = this.state;
    return (
      <Fragment>
        <CardTitle>Upload Report</CardTitle>
        <ol className="pl-4">
          <li>
            Generate a new transaction report from within Seller Central
            <Button color="link" onClick={this.toggleModal}>Not sure how? Click here to learn</Button>
          </li>
          <li>Upload that report into AccelerList</li>
        </ol>    
        <StyledDropzoneContainer className="mt-5">
          <Dropzone
            className="dropzone-component"
            activeClassName="dropzone-component-active"
            onDrop={this.onDrop}
            multiple={false}
            disabled={dropZoneIsDisabled}
          >
            <img
              src={upload_icon}
              style={{ opacity: 0.5, width: "100px" }}
              alt="upload_icon"
            />
            <h1>Drag &amp; Drop</h1>
            <p className="font-weight-bold text-muted">
              YOUR TRANSACTION REPORT FILE HERE (.CSV)
            </p>
          </Dropzone>
        </StyledDropzoneContainer>
          {
            this.state.showFailureMessage ? 

            <Fragment>
              {
                error_message === "Invalid file extension." && (
                  <div className="alert alert-danger">
                    Please only upload file with extension .csv
                  </div>
                )
              }
              {
                error_message === "Headers were unexpected. Please upload correct transaction report from Amazon." && (
                  <div className="alert alert-danger">
                    <strong>Uh Oh!</strong> We could not visualize your uploaded
                    reports correctly. Most likely, you uploaded the incorrect
                    transaction reports, the CSV headers are incorrect,
                    or there is no data in the file to use to
                    generate the report.<br /><br />
                    If the problem persists, please message support.
                  </div>
                )
              }
              {
                error_message === "Failed to upload." && (
                  <div className="alert alert-danger">
                    We failed to upload the file successfully. Please try again in a few minutes.<br /><br />
                    If the problem persists, please message support.
                  </div>
                )
              }
              {
                error_message !== "Failed to upload." && 
                error_message !== "Invalid file extension." &&
                error_message !== "Headers were unexpected. Please upload correct transaction report from Amazon." && (
                  <div className="alert alert-danger">
                    {error_message}
                  </div>
                )
              }
            </Fragment>
            
            :
            
            this.state.accepted.length > 0 ?

              this.state.accepted.map((file, idx) =>
                <StyledFileView key={idx}>
                  {this.generateFileView(file)}
                </StyledFileView>
              )

            :
            
            this.state.rejected.length > 0 ?
            <StyledFileView>
              <p className="alert alert-danger">Please only upload file with extension .csv</p>
            </StyledFileView>
            : ""
          }
          

        <Modal isOpen={modalOpen} toggle={this.toggleModal} size="lg">
          <ModalHeader toggle={this.toggleModal}>Generate Transaction Report from Amazon</ModalHeader>
          <ModalBody>          
            <ol>
              <li className="pl-3 mb-3">
                <a className="btn btn-primary"
                  href={`https://${
                    internationalization_config.seller_central_url
                  }/gp/payments-account/date-range-reports.html/ref=ag_xx_cont_payments`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Seller Central <IconExternalLink className="ml-2" />
                </a>
              </li>
              <li className="pl-3">
                Click on "Generate a report" and select the "Transaction" option, as pictured below: <br/>
                <img className="mt-3 img-fluid" src={report_image} alt="report_image" />
              </li>
            </ol>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.toggleModal}>Close</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

TransactionUploader.propTypes = {
  internationalization_config: PropTypes.object,
  uploadFileStatus: PropTypes.object,
  batchUploadJobStatus: PropTypes.object,
  uploadTransactionReport: PropTypes.func.isRequired,
  getStatusOfUploadingTransactionReport: PropTypes.func.isRequired,
  clearUploadedTransactionReportData: PropTypes.func.isRequired,
};

export default withRouter(connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config"),
    uploadFileStatus: state.Accounting.get("uploadFileStatus"),
    batchUploadJobStatus: state.Accounting.get("batchUploadJobStatus"),
  }),
  {
    uploadTransactionReport,
    getStatusOfUploadingTransactionReport,
    clearUploadedTransactionReportData,
    clearUploadReportJobData,
  }
)(TransactionUploader));