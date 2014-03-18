
import React from 'react';
import PropTypes from 'prop-types';
import CountBar from './CountBar';
import Pagination from './Pagination';

class TableFooter extends React.Component { // eslint-disable-line react/prefer-stateless-function

    render() {
      const {
          page,
          limit,
          changePage,
          changeLimit,
          totalCount,
          footerColSpan,
      } = this.props;
      return (
        <tfoot>
            <tr>
                <td colSpan={footerColSpan}>
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <CountBar
                            changeLimit={changeLimit}
                            limit={limit}
                        />
                        <Pagination
                            totalCount={totalCount}
                            currentPage={page}
                            limit={limit}
                            setCurrentPage={changePage}
                        />
                    </div>
                </td>
            </tr>
        </tfoot> 
      );
    }
  }
  
  TableFooter.propTypes = {
      page: PropTypes.number,
      limit: PropTypes.number,
      changePage: PropTypes.func,
      changeLimit: PropTypes.func,
      totalCount: PropTypes.number,
      footerColSpan: PropTypes.number
  };
  
  TableFooter.defaultProps = {
      totalCount: 0,
      footerColSpan: 6
  };
  
  export default TableFooter;
  