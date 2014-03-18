import React from 'react';
import ViewHeader from './view-header';
import ViewContent from './view-content';

// styling
import './style.css';


export default ({ match }) => (
    <div className="view">
        <ViewHeader/>
        <ViewContent id={match.params.id} />
    </div>
);