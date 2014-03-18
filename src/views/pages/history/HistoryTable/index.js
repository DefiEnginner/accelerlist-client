import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FaSpinner from "react-icons/lib/fa/spinner";
import SearchBar from './SearchBar';
import TableGenerator from '../../../../shared/components/TableGenerator';
import {
    momentDateTimeToLocalFormatConversion
} from '../../../../helpers/utility';
import StatusBadge from '../../../../shared/components/StatusBadge';
import { Link } from 'react-router-dom';
import Metrics from '../Metrics';

class HistoryTable extends React.Component {

    state = {
        parentPageCheck: true,
        parentPageResetCheck: false
    }

    changeHistoryStatus = (status) => {
        this.props.changeState("status", status);
        this.setState({ parentPageResetCheck: true });
    }

    changeHistoryTableState = (name, value) => this.setState({ [name]: value });

    historyBatchMapper = (option) => {
        const parsedJSON = JSON.parse(option.batch_json);
        let fulfillmentCenterBadges;
        if (option.fulfillment_center_count) {
            fulfillmentCenterBadges = Object.keys(option.fulfillment_center_count)
            .map(destinationId => {
                return (
                    <span 
                        key={`fulfillmentCenterId_${destinationId}`} 
                        className={`badge warehouse-badge ${destinationId}`}>
                        {destinationId} ({option.fulfillment_center_count[destinationId]})
                    </span>     
                )
            })
        }
        return <Fragment>
            <td>{momentDateTimeToLocalFormatConversion(option.updated_at)}</td>
            <td><Link to={"/dashboard/batch/" + option.id}>
                    {parsedJSON.batchName.slice(0, 25)}
                </Link>
            </td>
            <td width="40%">
                <Fragment>
                { fulfillmentCenterBadges && fulfillmentCenterBadges.length > 0 
                    ? fulfillmentCenterBadges 
                    : option.workflow_type === "private" 
                        ? "Private Batch"
                        : "N/A" }
                </Fragment>
            </td>
            <td><StatusBadge status={option.status} /></td>
            <td>{option.num_mskus}</td>
        </Fragment>
    }

    render() {
        const historyTableHeaders = [
            { name: "DATE", value: "date" },
            { name: "NAME", value: "name" },
            { name: "DESTINATION", value: "destination" },
            { name: "STATUS", value: "status" },
            { name: "TOTAL MSKUs", value: "total_mskus" }
        ];

        const {
            batches,
            status,
            batchDeleteLoading,
            filter_method,
            filter_query,
            loadingList,
            totalHistoryBatches,
            selectedHistoryBatches,
            clearSearch,
            defaultTableRowsLimit
        } = this.props;
        const historyBatchAdditionalFilter = {
            status,
            filter_method,
            filter_query
        };
        const {
            parentPageCheck,
            parentPageResetCheck
        } = this.state;
        return (
            <div className="card-block">
                <h3 className="h5 card-title">Batches</h3>
                <div className="d-flex justify-content-between">
                    <div style={{ flex: '0 0 45%' }}>
                        <SearchBar 
                            filter_method={filter_method}
                            filter_query={filter_query}
                            changeState={this.props.changeState}
                            changeHistoryTableState={this.changeHistoryTableState}
                            clearSearch={clearSearch}
                        />
                    </div>
                    <Metrics />
                </div>
                <div className="table-top-controls d-flex justify-content-between align-items-center">
                    <div className="btn-link-group">
                        {status !== "deleted" && <button onClick={this.props.onDeleteSelectedBatches} type="button" className="btn btn-link btn-danger">
                            <svg className="icon" width="14" height="17" viewBox="14 9 14 17" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.6 23.5c0 1 .8 1.8 1.8 1.8h7.2c1 0 1.8-.8 1.8-1.8V12.8H15.6v10.7zm11.7-13.4H24l-.9-.8h-4.4l-1 .8h-3V12h12.4v-1.8z" fill="#F22F2F" fillRule="evenodd"/>
                            </svg>
                            <span>Delete Selected</span>
                        </button>}
                    </div>
                    <div className="btn-group">
                        <button onClick={() => this.changeHistoryStatus("completed")} type="button" className={`btn btn-history-tab ${status === 'completed' && 'active-btn'}`}>Completed</button>
                        <button onClick={() => this.changeHistoryStatus("in_progress")} type="button" className={`btn btn-history-tab ${status === 'in_progress' && 'active-btn'}`}>In Progress</button>
                        <button onClick={() => this.changeHistoryStatus("deleted")} type="button" className={`btn btn-history-tab ${status === 'deleted' && 'active-btn'}`}>Deleted</button>
                    </div>
                </div>
                {!batchDeleteLoading ? <TableGenerator
                        rootClassName="table table-striped acc-table acc-table-left mt-4"
                        isCheckable
                        headerTitles={historyTableHeaders}
                        sortable={false}
                        options={batches}
                        optionMapper={this.historyBatchMapper}
                        loadItems={this.props.fetchBatchList}
                        additionalFilters={historyBatchAdditionalFilter}
                        totalCount={totalHistoryBatches}
                        isLoading={loadingList}
                        selectedRows={selectedHistoryBatches}
                        selectRow={this.props.selectHistoryBatches}
                        selectAllRows={this.props.selectAllHistoryBatches}
                        checkedRowName="id"
                        changeState={this.changeHistoryTableState}
                        parentPageCheck={parentPageCheck}
                        parentPageResetCheck={parentPageResetCheck}
                        defaultLimit={defaultTableRowsLimit}
                        isAsync
                    />
                :
                    <div className="text-center"><FaSpinner className="fa-spin fa-2x mt-3 mb-3" /></div>
                }

                {/* <nav>
                    <ul className="pagination justify-content-end">
                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                        <li className="page-item">
                        <a className="page-link" href="#">2 <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                    </ul>
                </nav> */}
            </div>
        );
    }
}

HistoryTable.propTypes = {
    changeState: PropTypes.func,
    fetchBatchList: PropTypes.func, 
    selectAllHistoryBatches: PropTypes.func, 
    selectHistoryBatches: PropTypes.func,
    onDeleteSelectedBatches: PropTypes.func,
    batches: PropTypes.array, 
    status: PropTypes.string, 
    batchDeleteLoading: PropTypes.bool, 
    filter_method: PropTypes.string, 
    filter_query: PropTypes.string, 
    loadingList: PropTypes.bool, 
    totalHistoryBatches: PropTypes.number, 
    selectedHistoryBatches: PropTypes.array,
    clearSearch: PropTypes.func.isRequired,
    defaultTableRowsLimit:  PropTypes.number,
}

export default HistoryTable;