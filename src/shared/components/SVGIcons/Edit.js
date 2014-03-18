import React from 'react';
import PropTypes from 'prop-types';

class Edit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        onClick,
        title
    } = this.props;
    const { props } = this;
    return (
        <a {...props} href="about:blank" onClick={(e) => {e.preventDefault(); onClick()}} data-toggle="tooltip" title={title}>
            <svg width="16" height="17" viewBox="2 0 16 17" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12.9V16h3.1L14 7.1 10.9 4 2 12.9zm14.8-8.5c.3-.4.3-.9 0-1.2l-2-2a.8.8 0 0 0-1.2 0L12 3 15.1 6l1.7-1.6z" fill="#00C853" fillRule="evenodd"/>
            </svg>
        </a>
    );
  }
}

Edit.propTypes = {
    collapsed: PropTypes.bool,
    onClick: PropTypes.func
};

Edit.defaultProps = {
    title: ""
};

export default Edit;
