

import React from 'react';
import PropTypes from 'prop-types';

class Retry extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        onClick,
        title,
        isLoading
    } = this.props;
    const { props } = this;
    return (
        <a {...props} href="about:blank" onClick={(e) => {e.preventDefault(); onClick()}} data-toggle="tooltip" title={title}>
            <svg className={`icon animate-reverse ${isLoading ? 'animate-spin' : ''}`} width="15" height="14" viewBox="0 3 15 14" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.500375 4.12c.2358125-.23625.5035625-.441875.5035625-.6825 0-.240625-.1955625-.4375-.4375-.4375h-4.375c-.0529375 0-.4375 0-.4375.4375v4.375c0 .240625.196.4375.4375.4375.2419375 0 .410375-.231875.59675-.415625L11.004 6.618125C11.778375 7.5325 12.25 8.709375 12.25 10c0 2.900625-2.3506875 5.25-5.25 5.25S1.75 12.900625 1.75 10c0-2.59875 1.8930625-4.755625 4.375-5.17125v-1.7675C2.6726875 3.49 0 6.43 0 10c0 3.8675 3.13425 7 7 7s7-3.1325 7-7c0-1.77625-.66325-3.390625-1.7530625-4.624375L13.500375 4.12" fill="#00C853" fillRule="evenodd"/>
            </svg>
        </a>
    );
  }
}

Retry.propTypes = {
    collapsed: PropTypes.bool,
    onClick: PropTypes.func
};

Retry.defaultProps = {
    title: "Retry",
    isLoading: false,
};

export default Retry;
