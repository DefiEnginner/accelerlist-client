import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MetricItem extends Component {
  render() {
    const { value, title } = this.props;

    return (
      <div className="metric-item-inline">
        <span className="value">{value}</span> <span className="title">{title}</span>
      </div>
    );
  }
}

MetricItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string
}

export default MetricItem;