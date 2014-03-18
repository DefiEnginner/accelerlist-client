import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import styled from 'styled-components';
import { digitСonversion } from '../../../../../../../helpers/utility';
import moment from 'moment';
import { ButtonGroup, Button } from 'reactstrap';

const StyledSummary = styled.p`
  margin-top: 2em;
  font-size: 18px;
  text-align: center;
`;

class ProfitAnalyticsChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      period: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.period === null) {
      if (nextProps.data) {
        const weekArray = Object.keys(nextProps.data).reduce((acc, data) => {
          let grouping = moment(data).year() + '-' + (moment(data).week());
          if (acc.findIndex(el => el === grouping) === -1) {
            acc.push(grouping);
          }
          return acc;
        }, []);

        const daysCount = Object.keys(nextProps.data).length;
        const weeksCount = weekArray.length;

        if (daysCount > 90) {
          if (weeksCount > 90) {
            return { period: 'monthly'}
          } else {
            return { period: 'weekly'}
          }
        }
        return { period: 'daily'};
      } else {
        return { period: 'daily'};
      }
    }
    return null;
  }

  customTickFormatter = (value) => {
    return digitСonversion(value, "currency", "USD");
  };

  getDailyData = (data) => {
    let dailyData = [];

    for(let key of Object.keys(data)) {
      let item = data[key];
      item.totalExpenses = Math.abs(item.totalExpenses)
      dailyData.push(item);
    }

    return dailyData;
  }

  getWeeklyData = (data) => {
    let weeklyData = [];
    let weekGroups = this.getDateGroups(Object.keys(data), 'year-week');

    for(let key of Object.keys(weekGroups)) {
      let group = weekGroups[key];
      let weeklyNetProfit = 0, weeklyGrossIncome = 0, weeklyExpenses = 0;

      group.forEach( date => {
        let dateKey = moment(date).format("YYYY-MM-DD");

        weeklyGrossIncome += data[dateKey].grossIncome;
        weeklyExpenses += data[dateKey].totalExpenses;
        weeklyNetProfit += data[dateKey].netProfit;
      });

      weeklyData.push({
        "grossIncome": weeklyGrossIncome,
        "totalExpenses": Math.abs(weeklyExpenses),
        "netProfit": weeklyNetProfit,
        "label": key
      });
    }

    return weeklyData;
  }

  getMonthlyData = (data) => {
    let monthlyData = [];
    let monthGroups = this.getDateGroups(Object.keys(data), 'year-month');

    for(let key of Object.keys(monthGroups)) {
      let group = monthGroups[key];
      let weeklyNetProfit = 0, weeklyGrossIncome = 0, weeklyExpenses = 0;

      group.forEach( date => {
        let dateKey = moment(date).format("YYYY-MM-DD");

        weeklyGrossIncome += data[dateKey].grossIncome;
        weeklyExpenses += data[dateKey].totalExpenses;
        weeklyNetProfit += data[dateKey].netProfit;
      });

      monthlyData.push({
        "grossIncome": weeklyGrossIncome,
        "totalExpenses": Math.abs(weeklyExpenses),
        "netProfit": weeklyNetProfit,
        "label": key
      });
    }

    return monthlyData;
  }

  getDateGroups = (dates, groupType) => {
    let dateGroups = dates.reduce( function (acc, date) {
      let grouping = '';

      if(groupType === 'year-week') {
        grouping = moment(date).year() + '-' + moment(date).week();
      } else if(groupType === 'year-month') {
        grouping = moment(date).year() + '-' + (moment(date).month()+1);
      }

      if (typeof acc[grouping] === 'undefined') {
        acc[grouping] = [];
      }
      
      acc[grouping].push(date);
      
      return acc;
    }, {});

    return dateGroups;
  }

  getData = (data) => {
    if(this.state.period === 'daily') {
      return this.getDailyData(data);
    } else if(this.state.period === 'weekly') {
      return this.getWeeklyData(data);
    } else if(this.state.period === 'monthly') {
      return this.getMonthlyData(data);
    }    
  }

  togglePeriod = (period) => {
    this.setState({
      period: period
    });
  }

  render() {
    const {
      data,
      roi,
      dailyNetProfit
    } = this.props

    let chartData = this.getData(data);
    
    return (
      <Fragment>
        <ButtonGroup className="mb-3 d-flex justify-content-end">
          <Button color={this.state.period === 'daily' ? 'primary' : 'secondary'} onClick={() => this.togglePeriod('daily')}>Daily</Button>
          <Button color={this.state.period === 'weekly' ? 'primary' : 'secondary'} onClick={() => this.togglePeriod('weekly')}>Weekly</Button>
          <Button color={this.state.period === 'monthly' ? 'primary' : 'secondary'} onClick={() => this.togglePeriod('monthly')}>Monthly</Button>
        </ButtonGroup>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ left: 20}}> 
            <CartesianGrid stroke='#ececec' vertical={false} />
            <XAxis dataKey="label" />
            <YAxis tickFormatter={this.customTickFormatter}/>
            <Tooltip formatter={this.customTickFormatter}/>
            <Legend />
            <Bar dataKey="grossIncome" barSize={20} fill="rgba(0, 200, 83, 0.5)" />
            <Bar dataKey="totalExpenses" barSize={20} fill="rgba(228, 12, 12, 0.5)" />
            <Line dataKey="netProfit" type="natural" stroke="#2962ff" width={3} isAnimationActive={false} />
          </ComposedChart>
      </ResponsiveContainer>
      <StyledSummary>
        During this time period, your average ROI was <strong
          className={ roi > 0 ? "text-success" : "text-danger"}
        >
          {digitСonversion(roi, "percent")}
        </strong> and a net profit of <strong
          className={ dailyNetProfit > 0 ? "text-success" : "text-danger"}
        >
          {digitСonversion(dailyNetProfit, "currency", "USD")}/day
        </strong>
      </StyledSummary>
    </Fragment>
    );
  }
}

ProfitAnalyticsChart.propTypes = {
  data: PropTypes.object.isRequired,
  roi: PropTypes.number.isRequired,
  dailyNetProfit: PropTypes.number.isRequired
};

export default ProfitAnalyticsChart;