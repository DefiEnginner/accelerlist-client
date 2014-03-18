
import React from 'react';
import PropTypes from 'prop-types';

class Minus extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        onClick,
        title
    } = this.props;
    const { props } = this;
    return (
        <a {...props} href="about:blank" onClick={(e) => {e.preventDefault(); onClick()}} data-toggle="tooltip" title={title}>
            <svg width="16px" height="16px" viewBox="0 19 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.75,19.25 C3.61,19.25 0.25,22.61 0.25,26.75 C0.25,30.89 3.61,34.25 7.75,34.25 C11.89,34.25 15.25,30.89 15.25,26.75 C15.25,22.61 11.89,19.25 7.75,19.25 Z M11.5,27.5 L4,27.5 L4,26 L11.5,26 L11.5,27.5 Z" id="Shape" stroke="none" fill="#00C853" fillRule="evenodd"></path>
            </svg>
        </a>
    );
  }
}

Minus.propTypes = {
    collapsed: PropTypes.bool,
    onClick: PropTypes.func
};

Minus.defaultProps = {
    title: ""
};

export default Minus;
