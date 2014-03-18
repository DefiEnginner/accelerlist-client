import React, { Component } from 'react';
import { Col, Row, } from 'reactstrap';
import SearchResult from '../shared/SearchResult'
import PropTypes from 'prop-types';

class SearchResultsVisualizer extends Component {

  render() {
    let { search, onResultSelected } = this.props;
    if (!search || !search.searchResults || search.searchResults.length === 0) {
      return (
        <Col lg="12">
        </Col>
      )
    }

    let resultNodes = search.searchResults.map(function (result, index) {
      return (
        <SearchResult
          onResultSelected={onResultSelected}
          result={result}
          key={index}
        />
      )
    });

    return (
      <Row>
        <Col lg="12">
          {resultNodes}
        </Col>
      </Row>
    )
  }
}

SearchResultsVisualizer.propTypes = {
  search: PropTypes.object.isRequired,
  onResultSelected: PropTypes.func.isRequired,
}

export default SearchResultsVisualizer;
