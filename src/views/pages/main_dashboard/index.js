import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { digitСonversion } from "../../../helpers/utility";
import moment from "moment";
import dashboardActions from "../../../redux/main_dashboard/actions";
import './main-dashboard.css';
import MetricItem from "./components/MetricItem";
import SalesExpensesChart from "./components/SalesExpensesChart";
import { configuration } from "./dashboard_config";
const { fetchDashboardData } = dashboardActions;

const ViewHeader = () => (
  <div className="view-header">
    <header className="text-white"></header>
  </div>
);

const ViewContent = ({ children }) => (
  <div className="view-content view-dashboard">
    {children}
  </div>
);

class MainDashboard extends Component {

  static propTypes = {
    stats: PropTypes.object.isRequired,
    fetchDashboardData: PropTypes.func.isRequired,
    internationalization_config: PropTypes.object.isRequired
  };

  render() {
    const {
      stats, fetchDashboardData, internationalization_config, statusOfFetchData
    } = this.props;
	let metrics = configuration.map(config => {
		  let {key, minTimestamp, maxTimestamp, className, numberType, stat, metricName, tooltipText} = config;
		  let value = stats[key];
		  let fetchingStatus = statusOfFetchData[key];
		  return (
			<div className="col-lg-3" key={key}>
			  <MetricItem
				metricKey={key}
				value={value}
				minTimestamp={minTimestamp}
				maxTimestamp={maxTimestamp}
				numberType={numberType}
				className={className}
				stat={stat}
				metricName={metricName}
				tooltipText={tooltipText}
				fetchDashboardData={fetchDashboardData}
				currencyCode={internationalization_config.currency_code}
				fetchingStatus={fetchingStatus}
			  />
			</div>
		  )
	});

    let costRatio;
    if (!!stats && !!stats.sales_this_month && (34./stats.sales_this_month) < 0.01) {
      costRatio = 34./stats.sales_this_month;
    }
    return (
      <div className="view">
        <ViewHeader />
        <ViewContent>
          <Card>
            <CardBody>
              <div className="page-header">
                <h2 className="page-title">
                  BUSINESS DASHBOARD
                  <small>
                    <span className="page-subtitle">
                      {moment().format('LLLL')}
                    </span>
                  </small>
                </h2>
              </div>
              {!!costRatio ?
                <p className="page-info mb-4">
                  <svg className="icon" width="17" height="17" viewBox="0 2 17 17" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.5 2C3.808 2 0 5.808 0 10.5S3.808 19 8.5 19s8.5-3.808 8.5-8.5S13.192 2 8.5 2zm.85 12.75h-1.7v-5.1h1.7v5.1zm0-6.8h-1.7v-1.7h1.7v1.7z"
                      fill="#2962FF"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span>
                      One month of AccelerList only cost you
                      <strong> {digitСonversion(costRatio, "percent", internationalization_config.currency_code, 3)} </strong>
                      of your gross sales for this month.</span>
                </p>
              : <br />}

              <div className="metric-row row">
                {metrics}
              </div>
            </CardBody>
          </Card>

          <Card className="mt-4">
            <CardBody>
              <CardTitle>Monthly Sales vs. Expenses</CardTitle>
              <SalesExpensesChart />
            </CardBody>
          </Card>

        </ViewContent>

      </div>
    );
  }
}

export default connect(
  state => {
    return {
      stats: state.Dashboard.get('stats'),
      statusOfFetchData: state.Dashboard.get('statusOfFetchData'),
      internationalization_config: state.Auth.get("internationalization_config")
    };
  },
  {
    fetchDashboardData
  }
)(MainDashboard);
