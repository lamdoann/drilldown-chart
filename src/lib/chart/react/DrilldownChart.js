import React from 'react';

import DrillDown from '../drilldown';

import '../styles/drilldown.scss';

class ReactDrillDownChart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.chart = new DrillDown({
            data: this.props.data,
            parentId: this.props.id,
            margin: this.props.margin,
            dimension: {
                width: this.props.width,
                height: this.props.height,
            }
        });
    }

    componentDidMount() {
        this.chart.update(this.props.data)
    }

    componentDidUpdate() {
        this.chart.update(this.props.data);
    }

    componentWillUnmount() {
        this.chart.remove();
    }

    render() {
        return (
            <div className="drilldown-chart" id={this.props.id} />
        );
    }
} 

export default ReactDrillDownChart;
