import React, { Fragment } from 'react';

const Step2 = ({ selectAudience }) => {
    return <Fragment>
        <div className="inner-body">
            <p className="description">You can pick more than one audience</p>
            <div className="audiences" onClick={selectAudience}>
                <div className="audience-box" data-id="book_sellers">
                    <h5 className="audience-title">BOOKS SELLERS</h5>
                </div>
                <div className="audience-box" data-id="media_sellers">
                    <h5 className="audience-title">MEDIA SELLERS</h5>
                </div>
                <div className="audience-box" data-id="ra_sellers">
                    <h5 className="audience-title">RA SELLERS</h5>
                </div>
                <div className="audience-box" data-id="oa_sellers">
                    <h5 className="audience-title">OA SELLERS</h5>
                </div>
                <div className="audience-box" data-id="pl_sellers">
                    <h5 className="audience-title">PL SELLERS</h5>
                </div>
            </div>
        </div>
            
  </Fragment>
}

export default Step2;
