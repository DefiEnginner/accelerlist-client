import React from 'react';


class StatusBadge extends React.Component {
    
    render() {
        const colorMapping = {
            "Deleted": "deleted",
            "In Progress": "inprogress",
            "Completed": "completed"
        };
        const { status } = this.props;
        return (
            <span className={`badge badge-${colorMapping[status]}`}>{status}</span>
        );
    }
}


export default StatusBadge;