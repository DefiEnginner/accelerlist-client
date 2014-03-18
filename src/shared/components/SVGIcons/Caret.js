
import React from 'react';
import PropTypes from 'prop-types';

class Caret extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        collapsed
    } = this.props;
    return (
        <a href="about:blank" onClick={(e) => e.preventDefault()} data-toggle="collapse" data-target="#more-child2" className={`toggle-more ${collapsed ? 'collapsed' : ''}`}>
            <svg className="caret" width="12" height="9" viewBox="50 196 12 9" xmlns="http://www.w3.org/2000/svg">
                <path fill="#3A3F37" fillRule="evenodd" d="M51.4 196.8l4.6 4.6 4.6-4.6 1.4 1.4-6 6-6-6z"/>
            </svg>
        </a>
    );
  }
}

Caret.propTypes = {
    collapsed: PropTypes.bool
};

Caret.defaultProps = {
};

export default Caret;
