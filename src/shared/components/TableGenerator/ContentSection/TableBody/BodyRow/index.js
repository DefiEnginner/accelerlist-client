

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MinusIcon from '../../../../SVGIcons/Minus';
import PlusIcon from '../../../../SVGIcons/Plus';

class TableBody extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            count: this.props.expandAllRows
        };
    }

    componentDidMount() {
        const { expandAllRows } = this.props;
        if (!isNaN(expandAllRows)) {
            this.setState({
                isExpanded: expandAllRows
            })
        }
    }

    componentDidUpdate(prevProps) {
        const { expandAllRows } = this.props;
        if (prevProps.expandAllRows !== expandAllRows) {
            this.setState({
                isExpanded: expandAllRows
            })
        }
    }

    toggleExpandedRow = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    }
    
    render() {
        const { 
            isExpanded
        } = this.state;
        const {
            option,
            ExpandableMapper,
            isExpandable,
            isCheckable,
            expandableAdditionalProps,
            selectedRows,
            selectRow,
            checkedRowName
        } = this.props;
        
        return (
            <Fragment>
                <tr>
                {
                    isCheckable && <td>
                        <div className="check">
                            <label className="container-check">&nbsp;<input onClick={(e) => selectRow(e, option[checkedRowName])} type="checkbox" checked={selectedRows.includes(option[checkedRowName])} /><span className="checkmark"></span></label>
                        </div>
                    </td>
                }
                {
                    isExpandable && <td>
                        { isExpanded ? <MinusIcon onClick={this.toggleExpandedRow} /> : <PlusIcon onClick={this.toggleExpandedRow} />}
                    </td>
                }
                    {this.props.optionMapper(option)}
                </tr>
                {
                    !!isExpanded && <ExpandableMapper option={option} {...expandableAdditionalProps} />
                }
            </Fragment>
        );
    }
}

TableBody.propTypes = {
    option: PropTypes.object,
    ExpandableMapper: PropTypes.func,
    isExpandable: PropTypes.bool,
    selectedRows: PropTypes.array,
    selectRow: PropTypes.func,
    checkedRowName: PropTypes.string,
    expandableAdditionalProps: PropTypes.object.isRequired,
    expandAllRows: PropTypes.bool.isRequired
};

TableBody.defaultProps = {
    isExpandable: false,
    expandableAdditionalProps: {},
    selectedRows: [],
};

export default TableBody;
