import React from 'react';
import {Card, CardBody} from 'reactstrap';

const ViewContent = ({children}) => (
    <div className="view-content view-components" style={{marginTop: "10px"}}>
      <Card>
        <CardBody>
          {children}
        </CardBody>
      </Card>
    </div>
);

export default ViewContent;