import React, { Component } from 'react';
import { connect } from "react-redux";
import {
    BarChart, Bar, Tooltip, XAxis, YAxis, Legend,
	ResponsiveContainer,
} from 'recharts';
import dashboardActions from '../../../../redux/main_dashboard/actions';
import { digitСonversion } from "../../../../helpers/utility";

const { getSalesStats } = dashboardActions;

class CustomizedLabel extends Component {
  render() {
	  const {x, y, value, internationalizationConfig} = this.props;
      return (
          <text
              x={x}
              y={y}
              dx={20}
              dy={-5}
              fontSize='12'
              fontFamily='sans-serif'
              fill='#3a3a3a'
			  textAnchor="middle"
		  >
			  {internationalizationConfig.currency_identifier}{digitСonversion(value, 'decimal', 'USD')}
          </text>
      );
  }
};
CustomizedLabel = connect(
  state => {
    return {
		internationalizationConfig: state.Auth.get("internationalization_config"),
    };
  },
  {
	getSalesStats,
  }
)(CustomizedLabel);

class SalesExpensesChart extends Component {

	componentDidMount(){
		this.props.getSalesStats();
	}

	render() {
		const { internationalizationConfig, salesExpensesData } = this.props;
    return(
	<ResponsiveContainer width='100%' aspect={4.0/1.0}>
      <BarChart width={600} height={300} data={salesExpensesData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
        <XAxis stroke="#9EA29C" dataKey="month"/>
		<YAxis stroke="#9EA29C"/>
        <Legend/>
        <Tooltip formatter={(value) => {return `${internationalizationConfig.currency_identifier}${digitСonversion(value, 'decimal', 'USD')}`}} />
        <Bar dataKey="expenses" stackId="a" barSize={40} fill="#FF6F00" label={<CustomizedLabel />} />
        <Bar dataKey="sales" stackId="a" barSize={40} fill="#00FF20" label={<CustomizedLabel />} />
      </BarChart>
	</ResponsiveContainer>
    );
  }
}

export default connect(
  state => {
    return {
		internationalizationConfig: state.Auth.get("internationalization_config"),
		salesExpensesData: state.Dashboard.get('salesExpensesData'),
    };
  },
  {
	getSalesStats,
  }
)(SalesExpensesChart);
