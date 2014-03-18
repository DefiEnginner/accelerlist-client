

import React from 'react';
import PropTypes from 'prop-types';

class Plus extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        onClick,
        title,

    } = this.props;
    const { props } = this;
    return (
        <a {...props} href="about:blank" onClick={(e) => {e.preventDefault(); onClick()}} data-toggle="tooltip" title={title}>
            <svg width="16px" height="16px" viewBox="17 18 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                <path d="M25,18.5 C20.86,18.5 17.5,21.86 17.5,26 C17.5,30.14 20.86,33.5 25,33.5 C29.14,33.5 32.5,30.14 32.5,26 C32.5,21.86 29.14,18.5 25,18.5 Z M28.75,26.75 L25.75,26.75 L25.75,29.75 L24.25,29.75 L24.25,26.75 L21.25,26.75 L21.25,25.25 L24.25,25.25 L24.25,22.25 L25.75,22.25 L25.75,25.25 L28.75,25.25 L28.75,26.75 Z" id="Shape" stroke="none" fill="#2962FF" fillRule="evenodd"></path>
            </svg>
        </a>
    );
  }
}

Plus.propTypes = {
    collapsed: PropTypes.bool,
    onClick: PropTypes.func
};

Plus.defaultProps = {
    title: ""
};

export default Plus;
