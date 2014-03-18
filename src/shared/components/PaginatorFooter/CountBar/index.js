

import React from 'react';
import PropTypes from 'prop-types';
import {
  Input
} from 'reactstrap';
class CountBar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  changePage = (e) => {
    const limit = e.target.value;
    this.props.changeLimit(Number(limit));
  }
  render() {
    const {
        limit
    } = this.props;
    return (
      <Input
        className="w-auto"
        type="select"
        placeholder="Select Size per Page"
        value={limit}
        name="limit"
        onChange={this.changePage}
      >
          <option key="limit_0" selected={limit === 1} value="1">1</option>
          <option key="limit_1" selected={limit === 5} value="5">5</option>
          <option key="limit_2" selected={limit === 10} value="10">10</option>
          <option key="limit_3" selected={limit === 50} value="50">50</option>
          <option key="limit_4" selected={limit === 100} value="100">100</option>
      </Input>	
    );
  }
}


CountBar.propTypes = {
  changeLimit: PropTypes.func,
  limit: PropTypes.number
};

CountBar.defaultProps = {
};

export default CountBar;

