

import React from 'react';
import PropTypes from 'prop-types';

class Delete extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        onClick,
        title
    } = this.props;
    const { props } = this;
    return (
        <a {...props} href="about:blank" onClick={(e) => {e.preventDefault(); onClick()}} data-toggle="tooltip" title={title}>
            <svg width="14" height="17" viewBox="34 3 14 17" xmlns="http://www.w3.org/2000/svg">
                <path d="M35.6 17.5c0 1 .8 1.8 1.8 1.8h7.2c1 0 1.8-.8 1.8-1.8V6.8H35.6v10.7zM47.2 4.1h-3l-1-.8h-4.4l-1 .8h-3V6h12.5V4.1z" fill="#F22F2F" fillRule="evenodd"/>
            </svg>
        </a>
    );
  }
}

Delete.propTypes = {
    collapsed: PropTypes.bool,
    onClick: PropTypes.func
};

Delete.defaultProps = {
    title: ""
};

export default Delete;
