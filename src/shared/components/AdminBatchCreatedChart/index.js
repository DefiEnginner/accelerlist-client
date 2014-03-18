import React, { Component } from "react";
import {
  Card,
  CardBody,
  Row,
} from "reactstrap";
import { connect } from "react-redux";
import adminActions from "../../../redux/admin/actions";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from 'recharts';

const {
	batchStats,
} = adminActions;

class AdminBatchCreatedChart extends Component {
    constructor (props) {
        super(props);
		this.state = {
		};
    }

	componentDidMount(){
		this.props.batchStats();
	}

	render() {
		const {
			batchStatsData,
		} = this.props;
    return (
		<div>
		<Card>
			<br />
			<h4>Batches Completed In Last 3 Months</h4>
			<CardBody>
				<Row>
					{batchStatsData ? (
					<ResponsiveContainer width='100%' aspect={4.0/1.0}>
						<BarChart
							data={batchStatsData["created_batches_per_week"]}
							margin={{top: 20, right: 30, left: 20, bottom: 5,}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="week" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="count" stackId="a" fill="#82ca9d" />
						</BarChart>
					</ResponsiveContainer>
					) : (null)
					}
				</Row>
			</CardBody>
		</Card>
	</div>
    );
  }
}

export default connect(
  state => {
    return {
		batchStatsData: state.Admin.get('batchStatsData'),
    };
  },
  {
	batchStats,
  }
)(AdminBatchCreatedChart);
