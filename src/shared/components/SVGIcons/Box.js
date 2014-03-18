
import React from 'react';
import PropTypes from 'prop-types';

class Box extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
        onClick,
        title
    } = this.props;
    const { props } = this;
    return (
        <a {...props} href="about:blank" onClick={(e) => {e.preventDefault(); onClick()}} data-toggle="tooltip" title={title}>
            <svg width="19" height="18" viewBox="90 3 19 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M101 11.6l.2-.5c0-.2-.1-.4-.3-.5a.7.7 0 0 0-.4-.2h-2.8c-.2 0-.4 0-.5.2l-.2.5c0 .2 0 .3.2.5l.5.2h2.8l.4-.2zm6.4-2.6v10.4c0 .2 0 .3-.2.5l-.5.2H91.5c-.2 0-.4 0-.5-.2a.7.7 0 0 1-.2-.5V9c0-.2 0-.3.2-.5l.5-.2h15.2c.2 0 .3 0 .5.2l.2.5zm.7-4.8v2.7c0 .2 0 .4-.2.5l-.5.2H90.8c-.2 0-.4 0-.5-.2A.7.7 0 0 1 90 7V4.2c0-.2 0-.4.2-.5.1-.2.3-.2.5-.2h16.6c.2 0 .3 0 .5.2l.2.5z" fill="#00C853" fillRule="evenodd" />
            </svg>
        </a>
    );
  }
}

Box.propTypes = {
    collapsed: PropTypes.bool,
    onClick: PropTypes.func
};

Box.defaultProps = {
    title: ""
};

export default Box;
