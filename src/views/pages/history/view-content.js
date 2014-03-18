import React from 'react';
import PropTypes from 'prop-types';
import batchActions from "../../../redux/history/actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import HistoryTable from './HistoryTable';
import cloneDeep from 'lodash/cloneDeep';
import qs from 'query-string';
//import Statistics from './Statistics';

import "./scss/historical-batch.css";

const { fetchBatchList, deleteBatch } = batchActions;

const defaultTableRowsLimit = 15;

class ViewContent extends React.Component {
    checkPreSetStatus = () => {
        const { search } = this.props.location;
        const tab = qs.parse(search).tab;
        if (tab === "completed") {
            return "completed";
        }
    return null;
    }

    state = {
        status: this.checkPreSetStatus() || "in_progress",
        filter_method: 'name',
        filter_query: '',
        selectedHistoryBatches: []
    }

    componentDidMount = () => {
        const { status, filter_method, filter_query } = this.state;
        const { search } = this.props.location;
        const limit = qs.parse(search).limit;
        const filters = { status, filter_method, filter_query, page: 1, page_size: limit || defaultTableRowsLimit }
        this.props.fetchBatchList(filters);
    }

    changeState = (name, value, triggerCallback = true) => {
        const { search } = this.props.location;
        const limit = qs.parse(search).limit;
        this.setState({ [name]: value }, () => {
            if(triggerCallback) {
                this.props.fetchBatchList({
                    status: this.state.status,
                    filter_method: this.state.filter_method,
                    filter_query: this.state.filter_query,
                    page: 1,
                    page_size: limit || defaultTableRowsLimit
                });
            }
        });
    }

    
    selectHistoryBatches = (e, option) => {
        const { selectedHistoryBatches } = this.state;
        let newSelectedHistoryBatches = cloneDeep(selectedHistoryBatches);
        if(e.target.checked) {
            newSelectedHistoryBatches.push(option);
            this.setState({ selectedHistoryBatches: newSelectedHistoryBatches });
        } else {
            newSelectedHistoryBatches = newSelectedHistoryBatches.filter(o => o !== option);
            this.setState({ selectedHistoryBatches: newSelectedHistoryBatches });
        }
    }

    
    selectAllHistoryBatches = (e, options) => {
        if(e.target.checked) {
            this.setState({ selectedHistoryBatches: options });
        } else {
            this.setState({ selectedHistoryBatches: [] });
        }
    }

    deleteSelectedBatches = () => {
        const { selectedHistoryBatches } = this.state;
        console.log("DELETE SELECTED BATCHES: ", selectedHistoryBatches)
        this.props.deleteBatch({ batch_ids: selectedHistoryBatches }, {
            status: this.state.status,
            filter_method: this.state.filter_method,
            filter_query: this.state.filter_query,
            page: 1,
            page_size: defaultTableRowsLimit
        });
    }

    clearSearch = () => {
      const { search } = this.props.location;
      const limit = qs.parse(search).limit;
      this.props.fetchBatchList({
          status: this.state.status,
          filter_method: "name",
          filter_query: "",
          page: 1,
          page_size: limit || defaultTableRowsLimit
      });
    }

    render = () => {
        const { batchList, batchListTotalCount, loadingList, batchDeleteLoading } = this.props;
        const { status, filter_method, filter_query, selectedHistoryBatches } = this.state;
        return (
            <div className="card">
                {/* <Statistics /> */}
                {!!batchList && <HistoryTable 
                    batches={batchList}
                    totalHistoryBatches={batchListTotalCount}
                    fetchBatchList={this.props.fetchBatchList}
                    loadingList={loadingList}
                    batchDeleteLoading={batchDeleteLoading}
                    selectedHistoryBatches={selectedHistoryBatches}
                    selectHistoryBatches={this.selectHistoryBatches}
                    selectAllHistoryBatches={this.selectAllHistoryBatches}
                    onDeleteSelectedBatches={this.deleteSelectedBatches}
                    status={status}
                    filter_method={filter_method}
                    filter_query={filter_query}
                    changeState={this.changeState}
                    clearSearch={this.clearSearch}
                    defaultTableRowsLimit={defaultTableRowsLimit}
                />}
            </div>
        )
    }
}

ViewContent.propTypes = {
    fetchBatchList: PropTypes.func,
    deleteBatch: PropTypes.func,
    batchList: PropTypes.array, 
    batchListTotalCount: PropTypes.number, 
    loadingList: PropTypes.bool, 
    batchDeleteLoading: PropTypes.bool
}

export default withRouter(connect(
  state => ({
    batchDeleteLoading: state.History.get('batchDeleteLoading'),
    loadingList: state.History.get('loadingList'),
    batchListTotalCount: state.History.get('batchListTotalCount'),
    batchList: state.History.get('batchList'),
  }),
  { fetchBatchList, deleteBatch }
)(ViewContent));
