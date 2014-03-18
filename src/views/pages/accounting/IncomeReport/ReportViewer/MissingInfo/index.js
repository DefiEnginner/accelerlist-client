import React, { Component, Fragment } from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';
import PropTypes from "prop-types";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import UploaderModal from './UploaderModal';
import SaveAndRecalculateButton from "./SaveAndRecalculateButton";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import FaSpinner from "react-icons/lib/fa/spinner";
import { exportMissingInfoTable } from "./exportTableToCSV";

class NumericInput extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onUpdate: PropTypes.func.isRequired
  }
  static defaultProps = {
    value: 0
  }
  getValue() {
    return Number(this.range.value);
  }
  render() {
    const { value, onUpdate, ...rest } = this.props;
    return [
      <input
        { ...rest }
        key="range"
        ref={ node => this.range = node }
        type="number"
        min="0"
        onBlur={() => onUpdate(this.getValue())}
        className="form-control editor edit-text"
      />
    ];
  }
}

class MissingInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadModalOpen: false
    }
  }

  toggleUploadModal = () => {
    this.setState({
      uploadModalOpen: !this.state.uploadModalOpen
    })
  }

  showUploadModal = () => {
    this.setState({
      uploadModalOpen: true
    })
  }

  closeUploadModal = () => {
    this.setState({
      uploadModalOpen: false
    })
  }

  render() {
    const tableColumns = [
      { dataField: 'sku', text: 'SKU' },
      { 
        dataField: 'buy_cost',
        text: 'Buy Cost',
        editorRenderer: (editorProps, value) => (
          <NumericInput { ...editorProps } value={ value } />
        )
      },
      { dataField: 'supplier', text: 'Supplier' }
    ];

    const {
      data,
      addMissingInfoData,
      saveAndRecalculateMissingInfo,
      recalculateIsProcessing,
      reuploadByInventoryItems
    } = this.props;
    
    let newData = [];
    if (data) {
      newData = data.map(el => {
        let elementData = el;
        Object.keys(el).forEach(field => {
          el[field] === null ? elementData[field] = "" : elementData[field] = el[field];
        })
        return elementData;
      });
    }

    return (
      <Fragment>
        <Card>
          <CardBody>
            <CardTitle className="text-center mb-5">Missing Information</CardTitle>
            <p>We found <strong className="text-danger">{newData.length} SKUs</strong> missing either 
            supplier or buy cost information. Please set that information here for the most accurate 
            analytics possible!</p>

            <ToolkitProvider
              data={newData}
              keyField="sku"
              columns={tableColumns}
            >
              {
                props => {
                  const ActionButtons = () => (
                    <div className="my-2 text-right">
                      <Button
                        color="primary ml-2"
                        onClick={() => exportMissingInfoTable(newData)}
                        disabled={newData && newData.length === 0}
                      >
                        Export CSV
                      </Button>
                      <Button
                        color="primary ml-2"
                        onClick={this.showUploadModal}
                        disabled={recalculateIsProcessing}
                      > 
                        {reuploadByInventoryItems ? (
                            <span>
                              <FaSpinner className="fa-spin" />
                              &nbsp;
                            </span>
                          ) : ""
                        }
                        {"Upload"}   
                      </Button>
                      <SaveAndRecalculateButton
                        saveAndRecalculateMissingInfo={saveAndRecalculateMissingInfo}
                        recalculateIsProcessing={recalculateIsProcessing}
                        reuploadByInventoryItems={reuploadByInventoryItems}
                      />
                    </div>
                  )

                  return (
                    <Fragment>
                      <ActionButtons />
                      <BootstrapTable 
                        {...props.baseProps} 
                        classes="acc-table acc-table-left"
                        striped
                        hover
                        cellEdit={cellEditFactory({ 
                          mode: 'click',
                          blurToSave: true,
                          afterSaveCell: (oldValue, newValue, row, coll) => {
                            if (coll.buy_cost !== "" || coll.buy_cost !== null) {
                              const data = Object.assign({}, row);
                              data.buy_cost = Number(data.buy_cost);
                              addMissingInfoData(data);
                            } else {
                              addMissingInfoData(row);
                            }
                          }
                        })}
                        pagination={paginationFactory({
                          paginationSize: 10,
                          sizePerPage: 20,
                          sizePerPageList: [20, 50, 100]
                        })}
                      />
                      <ActionButtons />
                    </Fragment>
                  )
                }
              }
            </ToolkitProvider>
          </CardBody>
        </Card>
        <UploaderModal 
          isOpen={this.state.uploadModalOpen} 
          toggle={this.toggleUploadModal}
          saveAndRecalculateMissingInfo={saveAndRecalculateMissingInfo}
          closeModal={this.closeUploadModal}
        />
      </Fragment>
    )
  }
}

MissingInfo.propTypes = {
  data: PropTypes.array,
  addMissingInfoData: PropTypes.func.isRequired,
  saveAndRecalculateMissingInfo: PropTypes.func.isRequired,
  recalculateIsProcessing: PropTypes.bool,
  reuploadByInventoryItems: PropTypes.bool,
};

export default MissingInfo;