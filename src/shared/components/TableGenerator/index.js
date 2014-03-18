import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';

import ContentSection from './ContentSection';
import assign from 'lodash/assign';
import qs from 'query-string';
import { withRouter } from "react-router-dom";
import FaSpinner from "react-icons/lib/fa/spinner";

import TableGeneratorLeftArrow from "../SVGIcons/TableGeneratorLeftArrow";
import TableGeneratorRightArrow from "../SVGIcons/TableGeneratorRightArrow";

class TableGenerator extends Component {

    UNSAFE_componentWillMount(){
        console.log("AAO",this.props);
    }
    constructor(props) {
        super(props);
        const { search } = this.props.location;
        const limit = qs.parse(search).limit || this.props.defaultLimit || 5;
        this.state = {
            page: 1,
            limit: limit,
            sort: this.props.headerTitles[0].value || "",
            order: 'asc',
            sortable: false,
            expandAllRows: false
        };
    }

    changePage = (page) => {
        const { isAsync, additionalFilters } = this.props;
        const { limit } = this.state;
        this.setState({ page }, () => {
            if(isAsync) {
                this.props.loadItems(assign(additionalFilters, {
                    page,
                    page_size: limit
                }));
            }
        });
    }

    changeLimit = (limit) => {
        const { isAsync, additionalFilters } = this.props;
        console.log("MUSA",this.props.history)
        this.setState({ limit, page: 1 }, () => {
            this.props.history.replace({ search: `?limit=${limit}`})
            if(isAsync) {
                this.props.loadItems(assign(additionalFilters, {
                    page: 1,
                    page_size: limit
                }));
            }
        });
    }

    componentDidUpdate(prevProps) {
        console.log("DID UPDATE MIUSA", this.props.parentPageCheck, this.props.parentPageResetCheck)
        if(this.props.parentPageCheck && this.props.parentPageResetCheck ) this.setState({ page: 1 }, () => this.props.changeState("parentPageResetCheck", false));
    }

    changeSortOrder = (newSort) => {
        const { sort, order, sortable } = this.state;
        if (sortable) {
            if(sort === newSort) {
                if (order === 'desc') {
                    this.setState({ sortable: false, order: 'asc' });
                } else {
                    this.setState({ order: 'desc' });
                }
            } else {
                this.setState({
                    sort: newSort,
                    order: 'asc'
                })
            }
        } else {
            this.setState({
                sort: newSort,
                order: 'asc',
                sortable: true
            })
        }

    }

    handleExpandAllRows = () => {
        const { allBatchListingRowsExpanded, setAllBatchListingRowsExpanded } = this.props;
        if (!isNaN(allBatchListingRowsExpanded) && setAllBatchListingRowsExpanded) {
            setAllBatchListingRowsExpanded(!allBatchListingRowsExpanded);
        } else {
            this.setState({
                expandAllRows: !this.state.expandAllRows
            })
        }
    }

    render() {
        const {
            rootClassName,
            headerTitles,
            isExpandable,
            isCheckable,
            options,
            optionMapper,
            expandableMapper,
            expandableAdditionalProps,
            allBatchListingRowsExpanded,

            isAsync,
            isLoading,

            selectedRows,
            selectRow,
            checkedRowName,
            selectAllRows,
            defaultText,
            defaultLoadingText
        } = this.props;
        const {
            page,
            limit,
            sort,
            order,
            sortable,
            expandAllRows
        } = this.state;
        let totalCount = options.length;
        if(isAsync) totalCount = this.props.totalCount;

        let footerColSpan = headerTitles.length;
        if (isExpandable) {
            footerColSpan += 1;
        }
        if (isCheckable) {
            footerColSpan += 1;
        }
        
        return (
            <Fragment>
                {!isLoading ? 
                    totalCount > 0 ? <table className={rootClassName}>
                        <TableHeader 
                            titles={headerTitles}
                            options={options}
                            isExpandable={isExpandable}
                            isCheckable={isCheckable}
                            sortable={sortable}
                            sort={sort}
                            order={order}
                            changeSortOrder={this.changeSortOrder}
                            selectAllRows={selectAllRows}
                            selectedRows={selectedRows}
                            checkedRowName={checkedRowName}
                            expandAllRows={!isNaN(allBatchListingRowsExpanded) ? allBatchListingRowsExpanded : expandAllRows}
                            handleExpandAllRows={this.handleExpandAllRows}
                        />
                        <ContentSection
                            options={options}
                            optionMapper={optionMapper}
                            isExpandable={isExpandable}
                            isCheckable={isCheckable}
                            expandableMapper={expandableMapper}
                            expandableAdditionalProps={expandableAdditionalProps}
                            sortable={sortable}
                            page={page}
                            limit={limit}
                            sort={sort}
                            order={order}
                            changePage={this.changePage}
                            changeLimit={this.changeLimit}
                            totalCount={totalCount}
                            isAsync={isAsync}
                            footerColSpan={footerColSpan}
                            expandAllRows={!isNaN(allBatchListingRowsExpanded) ? allBatchListingRowsExpanded : expandAllRows}
                            selectedRows={selectedRows}
                            selectRow={selectRow}
                            checkedRowName={checkedRowName}
                        />
                    </table>
                    :
                        <div className="text-center table-generator-default-view">
                            {
                                defaultText ? (
                                    <p className="info info-empty-batch">
                                        <TableGeneratorLeftArrow />
                                        <TableGeneratorRightArrow />
                                        <span className="text">{defaultText}</span>
                                    </p>
                                ) : <h1>{"No Results Found!"}</h1>
                            }
                        </div>
                :
                    <div className="text-center table-generator-default-view">
                        <FaSpinner className="fa-spin fa-2x mt-3 mb-3" />
                        <h1>{defaultLoadingText}</h1>
                    </div>
                }
            </Fragment>
        )
    }
}

TableGenerator.propTypes = {
    rootClassName: PropTypes.string.isRequired,
    headerTitles: PropTypes.array,
    isExpandable: PropTypes.bool,
    isCheckable: PropTypes.bool,
    isAsync: PropTypes.bool,
    options: PropTypes.array,
    optionMapper: PropTypes.func,
    loadItems: PropTypes.func,
    additionalFilters: PropTypes.object,
    expandableMapper: PropTypes.func,
    isLoading: PropTypes.bool,
    selectedRows: PropTypes.array,
    selectRow: PropTypes.func,
    checkedRowName: PropTypes.string,
    selectAllRows: PropTypes.func,
    expandableAdditionalProps: PropTypes.object.isRequired,
    parentPageCheck: PropTypes.bool,
    parentPageResetCheck: PropTypes.bool,
    setAllBatchListingRowsExpanded: PropTypes.func,
    allBatchListingRowsExpanded: PropTypes.bool,
    defaultLimit: PropTypes.number,
};

TableGenerator.defaultProps = {
    isCheckable: false,
    filterable: [],
    selectedRows: [],
    rootClassName: "",
    isAsync: false,
    isLoading: false,
    totalCount: 0,  
    expandableAdditionalProps: {}
}
export default withRouter(TableGenerator);