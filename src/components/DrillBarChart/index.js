import React from 'react';
import ReactDrilldownChart from '../../lib/chart/react/DrilldownChart';
import DrillBarData from './data.json';

const DrillDownChart = () => {
    return (
        <div>
            <ReactDrilldownChart 
                id="drill-bar-chart-container"
                width={undefined}
                height={400}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                data={DrillBarData}
            />
        </div>
    )
}

export default DrillDownChart;