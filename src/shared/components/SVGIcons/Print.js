
import React from 'react';
import PropTypes from 'prop-types';

class Print extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        onClick,
        title
    } = this.props;
    const { props } = this;
    return (
        <a {...props} href="about:blank" onClick={(e) => {e.preventDefault(); onClick()}} data-toggle="tooltip" title={title}>
            <svg width="16" height="18" viewBox="1 3 16 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.3 8H3.7c-1.2 0-2.2 1.3-2.2 3v6h3v4h9v-4h3v-6c0-1.7-1-3-2.3-3zM12 19H6v-5h6v5zm2.3-7c-.5 0-.8-.4-.8-1s.3-1 .8-1c.4 0 .7.4.7 1s-.3 1-.8 1zm-.8-9h-9v4h9V3z" fill="#00C853" fillRule="evenodd"/>
            </svg>
        </a>
    );
  }
}

Print.propTypes = {
    collapsed: PropTypes.bool,
    onClick: PropTypes.func
};

Print.defaultProps = {
    title: ""
};

export default Print;
