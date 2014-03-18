import React from 'react';
import Graph from './Graph';
import Stat from './Stat';

import History1 from '../../../../shared/components/SVGIcons/History1';
import History2 from '../../../../shared/components/SVGIcons/History2';
import History3 from '../../../../shared/components/SVGIcons/History3';
import History4 from '../../../../shared/components/SVGIcons/History4';
import History5 from '../../../../shared/components/SVGIcons/History5';
import History6 from '../../../../shared/components/SVGIcons/History6';

class Statistics extends React.Component {

   
    render() {
        return (
            <div className="card-block">
                <h3 className="h5 card-title">Historical Batch Statistic</h3>

                <div className="row mt-4">
                    <div className="col-md-7">
                        <Graph />
                    </div>
                    <div className="col-md-5">
                        <div className="batch-metric-group">
                            <div className="batch-metric-row">
                                <Stat
                                    Icon={History1}
                                    value={"234"}
                                    title="TOTAL BATCHES"
                                />
                                <Stat
                                    Icon={History2}
                                    value={"3,102"}
                                    title="TOTAL SKUs"
                                />
                            </div>
                            <div className="batch-metric-row">
                                <Stat
                                    Icon={History3}
                                    value={"126"}
                                    title="PRIVATE BATCHES"
                                />
                                <Stat
                                    Icon={History4}
                                    value={"108"}
                                    title="LIVE BATCHES"
                                />
                            </div>
                            <div className="batch-metric-row">
                                <Stat
                                    Icon={History5}
                                    value={"$245"}
                                    title="PRIVATE BATCHES"
                                    valueClassName="text-danger"
                                />
                                <Stat
                                    Icon={History6}
                                    value={"$1,572"}
                                    title="TOTAL GROSS PROFIT"
                                    valueClassName="text-success"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
}

Statistics.propTypes = {

}
export default Statistics;

