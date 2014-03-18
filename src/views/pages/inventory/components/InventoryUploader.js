import React, { Component, Fragment } from 'react';
import {
  Button,
  Row
} from 'reactstrap'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import fileDownload from 'react-file-download'

import UploadIcon from "react-icons/lib/ti/upload-outline";

import {
  DropZoneArea
} from '../modals/styles';

const FileTemplate = [
  'SellerSKU',
  'Cost/Unit',
  'Supplier',
  'Date Purchased'
]

class InventoryUploader extends Component {
  gettemplateFile = () => {
    fileDownload(FileTemplate, 'Inventory_MSKU_Information_Template.csv')
  }
  onDrop = (files) => {
    const { uploadInventoryItemsFile } = this.props;
    files.forEach(file => {
      uploadInventoryItemsFile(file);
  });

}
  render() {
    const { close } = this.props;
    return (
      <Fragment>
          <div className="text-center">Set a buy cost and supplier for each MSKU here easily. Please upload a CSV file with three columns: SellerSKU, Cost/Unit, and Supplier.</div>
          <div className="text-center">New values will override values already in the system.</div>
          <br />
          <Row style={{justifyContent: 'center'}}>
            <Button color="info" onClick={this.gettemplateFile}>
              GET THE TEMPLATE
            </Button>
          </Row>
          <br />
          <Row>
            <DropZoneArea>
              <Dropzone
              	className="dropzone-component"
                activeClassName="dropzone-component-active"
                onDrop={this.onDrop} 
              >
                <UploadIcon style={{width:"400px", height: "100px"}}/>
                <h1 
                  style={{marginBottom: "0px"}}
                  className="text-center"
                >
                  {`Drag & Drop`}
                </h1>
                <br />
                <p 
                  style={{fontWeight: 600, color: "#aaa"}}
                  className="text-center"
                >
                  YOUR FILES HERE TO UPLOAD
                </p>
                <p 
                  style={{fontWeight: 600, color: "#21323b", fontStyle: 'italic'}}
                  className="text-center"
                >
                  (Compatible with InventoryLab's Inventory Report)
                </p>
              </Dropzone>
            </DropZoneArea>
          </Row>
          <Row style={{justifyContent: 'center'}}>
            <Button className="text-center" color="secondary" onClick={close}>Cancel</Button>
          </Row>
        </Fragment>
    );
  }
}

InventoryUploader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  uploadInventoryItemsFile: PropTypes.func.isRequired
}

export default InventoryUploader;