import React from 'react';
import LoadingIndicator from "../../../../../shared/components/LoadingIndicator";

const LoadingDisplay = ({ loadingContainerClass, message }) => {
    return (
        <div className={loadingContainerClass}>
            <LoadingIndicator title={message} />
        </div>
    )
}

export default LoadingDisplay;