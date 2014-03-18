

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import TableBody from './TableBody';
import TableFooter from './TableFooter';

class ContentSection extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        options,
        optionMapper,
        isExpandable,
        isCheckable,
        expandableMapper,
        page,
        limit,
        sort,
        order,
        changePage,
        changeLimit,
        sortable,
        isAsync,
        expandableAdditionalProps,
        totalCount,
        expandAllRows,
        footerColSpan,
        
        selectedRows,
        selectRow,
        checkedRowName
    } = this.props;
    return (
        <Fragment>
            <TableBody
                options={options}
                optionMapper={optionMapper}
                isExpandable={isExpandable}
                isCheckable={isCheckable}
                expandableMapper={expandableMapper}
                expandableAdditionalProps={expandableAdditionalProps}
                sortable={sortable}
                currentPage={page}
                limit={limit}
                sort={sort}
                order={order}
                isAsync={isAsync}
                selectedRows={selectedRows}
                selectRow={selectRow}
                checkedRowName={checkedRowName}
                expandAllRows={expandAllRows}
            />
            <TableFooter
                changeLimit={changeLimit}
                limit={limit}
                totalCount={totalCount}
                page={page}
                changePage={changePage}
                footerColSpan={footerColSpan}
            />
        </Fragment> 
    );
  }
}

ContentSection.propTypes = {
    options: PropTypes.array,
    optionMapper: PropTypes.func,
    isExpandable: PropTypes.bool,
    isCheckable: PropTypes.bool,
    expandableMapper: PropTypes.func,
    page: PropTypes.number,
    limit: PropTypes.number,
    sort: PropTypes.string,
    order: PropTypes.string,
    changePage: PropTypes.func,
    changeLimit: PropTypes.func,
    isAsync: PropTypes.bool,
    expandableAdditionalProps: PropTypes.object.isRequired,
    selectedRows: PropTypes.array,
    selectRow: PropTypes.func,
    checkedRowName: PropTypes.string,
    totalCount: PropTypes.number,
    sortable: PropTypes.bool.isRequired,
    expandAllRows: PropTypes.bool.isRequired,
    footerColSpan: PropTypes.number,
};

ContentSection.defaultProps = {
    sortable: true,
    isCheckable: false,
    isAsync: false,
    expandableAdditionalProps: {},
    selectedRows: [],
    totalCount: 0
};

export default ContentSection;
