import React, { Component } from "react";
import { string, number, func, bool } from 'prop-types';
import { digitСonversion } from "../../../../helpers/utility";
import TooltipAtCustomElement from "../../../../shared/components/TooltipAtCustomElement";
import DashboardTooltipIcon from "../../../../shared/components/SVGIcons/DashboardTooltipIcon";
import DashboardRefreshIcon from "../../../../shared/components/SVGIcons/DashboardRefreshIcon";

class MetricItem extends Component {
  static propTypes = {
    metricKey: string.isRequired,
    minTimestamp: string.isRequired,
    maxTimestamp: string.isRequired,
    numberType: string.isRequired,
    stat: string.isRequired,
    value: number.isRequired,
    metricName: string.isRequired,
    tooltipText: string.isRequired,
    fetchDashboardData: func.isRequired,
    currencyCode: string.isRequired,
    fetchingStatus: bool
  };

  UNSAFE_componentWillMount() {
    let {
      metricKey, minTimestamp, maxTimestamp, stat, fetchDashboardData
    } = this.props;
    fetchDashboardData(metricKey, stat, minTimestamp, maxTimestamp);
  }

  refresh() {
    this.UNSAFE_componentWillMount();
  }

  render() {
    let {className, metricName, value, currencyCode, numberType, metricKey, tooltipText, fetchingStatus} = this.props;
    return (
      <div className={`metric-item metric-box ${className}`}>
        <span className="title">{metricName}</span>
        <span className="value">{!!value || value === 0 ? digitСonversion(value, numberType, currencyCode) : "-"}</span>
        <span className="help" data-toggle="tooltip" data-title="90 days item sales / current inventory">
          <TooltipAtCustomElement tooltipId={metricKey} tooltipText={tooltipText} CustomElement={DashboardTooltipIcon}/>
        </span>
        <button type="button" className="btn btn-link btn-refresh" onClick={() => this.refresh()}>
          <DashboardRefreshIcon isAnimationLoading={fetchingStatus} />
        </button>
      </div>
    )
  }
}

export default MetricItem;
