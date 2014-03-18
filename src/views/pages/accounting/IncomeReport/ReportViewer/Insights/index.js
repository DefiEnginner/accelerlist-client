import React, { Component, Fragment } from 'react';
import SupplierInsights from './SupplierInsights';
import SupplierBreakdown from './SupplierBreakdown';

class Insights extends Component {

  render() {
    return (
      <Fragment>
        <SupplierInsights />
        <div className="mb-4" />
        <SupplierBreakdown />
      </Fragment>
    );
  }
}

export default Insights;