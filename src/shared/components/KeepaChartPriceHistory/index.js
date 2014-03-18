import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col
} from "reactstrap";
import Select from "react-select";
import PropTypes from "prop-types";
import batchActions from "../../../redux/batch/actions";
import { displayedGraphOptions, rangeGraphOptions } from "../../../helpers/settings/graph_options"; 

const { updateListingDefaultsData } = batchActions;

const keepaEmbedURL = (asin, domain, keepaEmbedURLOptions) => {
  return `https://dyn.keepa.com/pricehistory.png?asin=${asin}&domain=${domain}&used=1${keepaEmbedURLOptions}`;
};

class KeepaChartPriceHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedGraph: null,
      rangeGraph: null
    };
  }

  componentDidMount() {
    const { batchListingDefaults } = this.props;
    const rangeGraph = batchListingDefaults.keepaDateRange;
    console.log(rangeGraph)
    this.setState({
      displayedGraph: displayedGraphOptions,
      rangeGraph: rangeGraph || rangeGraphOptions[5].numberValue
    })
  }
  
  changeDisplayedGraph = (displayedGraph) => {
    this.setState({
      displayedGraph
    })
  }

  changeRangeGraph = (rangeGraph) => {
    this.props.updateListingDefaultsData("keepaDateRange", rangeGraph.numberValue);
    this.setState({
      rangeGraph: rangeGraph.numberValue
    })
  }
  getObjectOfGraphOptions = (rangeGraph) => {
    const rangeGraphObject = rangeGraphOptions.find(el => el.numberValue === rangeGraph);
    if (rangeGraphObject) {
      return rangeGraphObject;
    } else {
      return rangeGraphOptions[5];
    }
  }
  
  render() {
    let { internationalConfig, asin } = this.props;
    const { displayedGraph, rangeGraph } = this.state;
    let keepaEmbedURLOptions = "";
    let domain = internationalConfig && internationalConfig.keepa_domain ? internationalConfig.keepa_domain : "com";
    const rangeGraphObject = this.getObjectOfGraphOptions(rangeGraph);

    if (displayedGraph) {
      displayedGraphOptions.forEach(elementGraphIsOff => {
        const selectedGraph = displayedGraph.find(el => el.label === elementGraphIsOff.label);
        if (selectedGraph) {
          keepaEmbedURLOptions += selectedGraph.value + "1";
        } else {
          keepaEmbedURLOptions += elementGraphIsOff.value + "0";
        }
      })
    }
    if (rangeGraph) {
        keepaEmbedURLOptions += rangeGraphObject.value;
    }

    return (
      <div>
        <Row style={{ justifyContent: "center" }}>
          <img
            src={keepaEmbedURL(asin, domain, keepaEmbedURLOptions)} 
            alt="Keepa Date Range Graph" 
            className="img-fluid" 
          />
         </Row>
         <br />
         <Row style={{ justifyContent: "center" }}>
          <Col style={{ maxWidth: "320px" }}>
            Displayed graph:
            <Select
              value={displayedGraph}
              options={displayedGraphOptions}
              onChange={this.changeDisplayedGraph}
              className="basic-multi-select"
              classNamePrefix="select"
              multi={true}
            />
          </Col>
          <Col style={{ maxWidth: "150px" }}>
            The range in days:
            <Select
              value={this.getObjectOfGraphOptions(rangeGraph)}
              options={rangeGraphOptions}
              onChange={this.changeRangeGraph}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

KeepaChartPriceHistory.propTypes = {
  asin: PropTypes.string.isRequired,
  internationalConfig: PropTypes.object.isRequired,
  keepaDateRange: PropTypes.number.isRequired,
  updateListingDefaultsData: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    internationalConfig: state.Auth.get("internationalization_config"),
    batchListingDefaults: state.Batch.get("batchListingDefaults")
  }),
  {
    updateListingDefaultsData
  }
)(KeepaChartPriceHistory);
