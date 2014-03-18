

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { ceil } from 'lodash';
import { getPaginatorOptions } from "../../../../../../helpers/utility";

class PaginationGenerator extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        totalCount,
        limit,
        currentPage,
    } = this.props;
    const totalPages = ceil(totalCount/limit);
    return (
        <Fragment>
          {totalPages > 1 && 
              <Pagination>
                {getPaginatorOptions(currentPage, totalPages, true).map((option, idx) => {
                  switch (option) {
                    case '...':
                      return (
                        <PaginationItem key={`pgn-${idx}`}>
                          <PaginationLink>
                            ...
                          </PaginationLink>
                        </PaginationItem>
                      )
                    case '-':
                      return (
                        <PaginationItem key={`pgn-${idx}`} onClick={() => this.props.setCurrentPage(currentPage - 1)}>
                          <PaginationLink previous />
                        </PaginationItem>
                      )
                    case '+':
                      return (
                        <PaginationItem key={`pgn-${idx}`} onClick={() => this.props.setCurrentPage(currentPage + 1)}>
                          <PaginationLink next />
                        </PaginationItem>
                      )
                    default:
                      return (
                        <PaginationItem key={`pgn-${idx}`} onClick={() => this.props.setCurrentPage(option)} active={option === currentPage} >
                          <PaginationLink>{option}</PaginationLink>
                        </PaginationItem>
                      )
                  }
                })}
              </Pagination>
            }
        </Fragment>
    );
  }
}


PaginationGenerator.propTypes = {
  totalCount: PropTypes.number,
  limit: PropTypes.number,
  currentPage: PropTypes.number,
};

PaginationGenerator.defaultProps = {
};

export default PaginationGenerator;

