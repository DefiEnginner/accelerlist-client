import React from 'react';
import PropTypes from 'prop-types';

class Stat extends React.Component {

    render() {
        const { Icon, value, valueClassName, title, titleClassName } = this.props;
        return (
            <div className="batch-metric">
                <span className="icon">
                    <Icon />
                </span>
                <div className="text">
                    <span className={`value ${valueClassName}`}>{value}</span>
                    <span className={`title ${titleClassName}`}>{title}</span>
                </div>
            </div>
        );
    }
    
}

Stat.defaultProps = {
    titleClassName: "",
    valueClassName: ""
}

Stat.propTypes = {
    titleClassName: PropTypes.string,
    valueClassName: PropTypes.string,
    title: PropTypes.string,
    Icon: PropTypes.Component,
    value: PropTypes.string
}

export default Stat;

