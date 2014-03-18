import React, { Component } from 'react';
import { connect } from "react-redux";
import { Row, Col} from 'reactstrap';
import MetricItem from './MetricItem';
import './style.css';
import historyActions from '../../../../redux/history/actions';
import { digitСonversion } from "../../../../helpers/utility";

const { getBatchHistoryStats } = historyActions;

class Metrics extends Component {

	componentDidMount(){
		this.props.getBatchHistoryStats();
	}

  render() {
	  const { internationalization_config, batchHistoryStats } = this.props;
	let data = []
	if(batchHistoryStats){
		data = [
		  { title: 'TOTAL BATCHES', value: batchHistoryStats.total_batches },
		  { title: 'TOTAL SKUs', value: batchHistoryStats.total_skus },
		  { title: 'PRIVATE BATCHES', value: batchHistoryStats.private_batch },
		  { title: 'LIVE BATCHES', value: batchHistoryStats.live_batch },
		  { title: 'TOTAL COST',
				value: digitСonversion(
		                batchHistoryStats.total_cost,
						"currency",
		                internationalization_config.currency_code
				      )},
		  { title: 'TOTAL GROSS PROFIT',
				value: digitСonversion(
		                batchHistoryStats.total_gross_profit,
						"currency",
		                internationalization_config.currency_code
				      )},
		];
	}
    return (
      <div  className="mt-4" style={{ flex: '0 0 45%' }}>
        <Row>
        { data.map( (item, idx) => (
          <Col key={idx} md="4">
            <MetricItem title={item.title} value={item.value} />
          </Col>
        )) }
        </Row>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      batchHistoryStats: state.History.get('batchHistoryStats'),
      internationalization_config: state.Auth.get("internationalization_config")
    };
  },
  {
    getBatchHistoryStats
  }
)(Metrics);
