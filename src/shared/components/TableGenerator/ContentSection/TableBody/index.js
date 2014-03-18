

/**
*
* TableHeader
*
*/

import React from 'react';
import BodyRow from './BodyRow';
import PropTypes from 'prop-types';
import { drop, take, orderBy } from 'lodash';
class TableBody extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        options,
        isExpandable,
        isCheckable,
        optionMapper,
        expandableMapper,
        limit,
        sort,
        order,
        currentPage,
        sortable,
        isAsync,
        expandableAdditionalProps,
        expandAllRows,

        selectedRows,
        selectRow,
        checkedRowName
    } = this.props;
    let newResults = options;
    
    if(!isAsync) {
        if(!!sortable) newResults = orderBy(options, [sort], [order]);
        newResults = take(drop(newResults, limit * (currentPage - 1)), limit);
    }
    return (
        <tbody>
            {
                !!options &&  newResults.map((option, i) => (
                    <BodyRow 
                        key={`table_rows_${i}`} 
                        option={option}
                        isExpandable={isExpandable}
                        isCheckable={isCheckable}
                        optionMapper={optionMapper}
                        ExpandableMapper={expandableMapper}
                        expandableAdditionalProps={expandableAdditionalProps}
                        selectedRows={selectedRows}
                        selectRow={selectRow}
                        checkedRowName={checkedRowName}
                        expandAllRows={expandAllRows}
                    />
                ))
            }
        </tbody>
    );
  }
}

TableBody.propTypes = {
    options: PropTypes.array,
    isCheckable: PropTypes.bool,
    isExpandable: PropTypes.bool.isRequired,
    optionMapper: PropTypes.func,
    expandableMapper: PropTypes.func,
    limit: PropTypes.number,
    sort: PropTypes.string,
    order: PropTypes.string,
    isAsync: PropTypes.bool,
    currentPage: PropTypes.number,
    selectedRows: PropTypes.array,
    selectRow: PropTypes.func,
    checkedRowName: PropTypes.string,
    expandableAdditionalProps: PropTypes.object.isRequired,
    sortable: PropTypes.bool.isRequired,
    expandAllRows: PropTypes.bool.isRequired
};

TableBody.defaultProps = {
    isExpandable: false,
    isCheckable: false,
    sortable: true,
    expandableAdditionalProps: {},
    selectedRows: [],
};

export default TableBody;
