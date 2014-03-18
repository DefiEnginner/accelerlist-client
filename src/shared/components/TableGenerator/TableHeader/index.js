import React from "react";
import PropTypes from "prop-types";
import Caret from "../../SVGIcons/Caret";
import MinusIcon from '../../SVGIcons/Minus';
import PlusIcon from '../../SVGIcons/Plus';

class TableHeader extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    const { 
      titles, 
      isCheckable, 
      isExpandable, 
      sort, 
      order,     
      options,
      selectAllRows,
      selectedRows,
      checkedRowName,
      sortable,
      expandAllRows,
      handleExpandAllRows
    } = this.props;
    return (
      <thead>
        <tr>
          {
            isCheckable && <th className="check-all">
                <div className="check">
                    <label className="container-check">&nbsp;<input checked={selectedRows.length === options.length} onClick={(e) => selectAllRows(e, options.map(o => o[checkedRowName]))} type="checkbox" /><span className="checkmark"></span></label>
                </div>
            </th>
          }
          {isExpandable && <th>
                { expandAllRows ? <MinusIcon onClick={handleExpandAllRows} /> : <PlusIcon onClick={handleExpandAllRows} />}
            </th>
          }
          {!!titles &&
            titles.map(title => {
              const canBeSort = title.sortable || false;
              return (
                <th
                  key={`custom-table-header-${title.value}`}
                  onClick={() => canBeSort && this.props.changeSortOrder(title.value)}
                  className={title.className || ""}
                  style={{ cursor: !!canBeSort ? "pointer" : "" }}
                >
                  {!!sortable &&
                    sort === title.value && (
                      <Caret collapsed={order !== "asc"} />
                    )}{" "}
                  {title.name}
                </th>
              );
            })}
        </tr>
      </thead>
    );
  }
}

TableHeader.propTypes = {
  isExpandable: PropTypes.bool,
  isCheckable: PropTypes.bool,
  sort: PropTypes.string,
  order: PropTypes.string,
  titles: PropTypes.array,
  options: PropTypes.array,
  selectAllRows: PropTypes.func,
  selectedRows: PropTypes.array,
  checkedRowName: PropTypes.string,
  sortable: PropTypes.bool,
  expandAllRows: PropTypes.bool.isRequired,
  handleExpandAllRows: PropTypes.func.isRequired
};

TableHeader.defaultProps = {
  title: [],
  isCheckable: false
};

export default TableHeader;
