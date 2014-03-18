
import React from 'react';
import PropTypes from 'prop-types';
import CountBar from './CountBar';
import Pagination from './Pagination';

class PaginatorFooter extends React.Component { // eslint-disable-line react/prefer-stateless-function

    render() {
      const {
          page,
          limit,
          changePage,
          changeLimit,
          totalCount,
      } = this.props;
        return (
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
        );
    }
  }
  
  PaginatorFooter.propTypes = {
      page: PropTypes.number,
      limit: PropTypes.number,
      changePage: PropTypes.func,
      changeLimit: PropTypes.func,
      totalCount: PropTypes.number,
  };
  
  PaginatorFooter.defaultProps = {
      totalCount: 0
  };
  
  export default PaginatorFooter;
  