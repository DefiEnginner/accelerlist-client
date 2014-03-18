import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import {
  secureProtocolImgURL,
  digitСonversion
} from "../../../../../helpers/utility";

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onResultSelected = this.onResultSelected.bind(this);
  }

  onResultSelected(result, channel) {
    let { onResultSelected } = this.props;
    if (!onResultSelected) {
      return;
    }
    onResultSelected(result);
  }

  render() {
    let { result } = this.props;

    /*
    let itemWeight;
    let packageWeight;
    if (result.itemDimensions && result.itemDimensions.Weight) {
      itemWeight = result.itemDimensions.Weight + " lb."
    }
    if (result.packageDimensions && result.packageDimensions.Weight) {
      packageWeight = result.packageDimensions.Weight + " lb."
    }
    */

    return (
      <div className="header" onClick={this.onResultSelected.bind(this, result)}>
        <div className="media">
          <img
            src={
              secureProtocolImgURL(result.imageUrl.replace("_SL75_", "_SL200_"))
            }
            className="book-picture medium-bottom-margin"
            alt={result.name}
          />
        </div>
        <div className="info">
          <h2 className="search-result-title book-title">{result.name}</h2>
          
          <Row className="meta-info">
            <Col>
              <p><strong>Rank:</strong> {result.salesrank

              ? digitСonversion(result.salesrank, "rank")
              : "N/A"}</p>
              <p><strong>ASIN:</strong> {result.ASIN ? result.ASIN : "N/A"}</p>
            </Col>
            <Col>
              <p><strong>Category:</strong>  {result.category ? result.category : "N/A"}</p>
              <p><strong>Prep:</strong> {result.prepInstructions ? result.prepInstructions : "Unconfirmed"}</p>
            </Col>
            <Col>
              {
                result.binding ? (
                  <p><strong>Binding:</strong>  {result.binding}</p>
                ) : ""
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

SearchResult.propTypes = {
  onResultSelected: PropTypes.func.isRequired,
  result: PropTypes.object.isRequired,
  channel: PropTypes.string
};

export default SearchResult;
