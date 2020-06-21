// eslint-disable-next-line
import * as d3 from 'd3';

import BaseChart from '../baseChart';

class DrillDown extends BaseChart {
    constructor(props) {
        super(props);
        this.activeData = this.data;
        this.dataHistory = [this.activeData];
        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();
    }

    draw() {
        super.draw();

        this.xScale = this.xScale
            .range([0, this.innerWidth])
            .padding(0.5)
            .domain(this.activeData.map(d => d.name))

        this.yScale = this.yScale
            .domain([0, d3.max(this.activeData, d => d.value)])
            .range([this.innerHeight, 0]);

        this.drawBackground();
        this.drawXAxis();
        this.drawYAxis();
        this.drawBars();
    }

    drawBackground() {
        let background = this.rootGroup.select('rect.drilldown-chart-background');
        if (background.empty()) {
            background = this.rootGroup.append('rect')
                .attr('class', 'drilldown-chart-background')
                .on('click', this.handleGoBack);
        }

        background
            .attr('width', this.innerWidth)
            .attr('height', this.innerHeight);
            
    }

    drawXAxis() {
        const xAxis = this.createElement('g', 'axis-x', this.rootGroup);

        xAxis
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(0, ${this.innerHeight})`)
            .transition()
                .duration(750)
            .call(d3.axisBottom(this.xScale).tickPadding(16));
    }

    drawYAxis() {
        const yAxis = this.createElement('g', 'axis-y', this.rootGroup);

        yAxis
            .attr('class', 'axis axis-y')
            .attr('transform', `translate(0, 0)`)
            .transition()
                .duration(750)
            .call(
                d3.axisLeft(this.yScale)
                    .ticks(this.innerHeight / 80, 's')
                    .tickSize(-this.innerWidth)
                    .tickPadding(16)
            )
            .call(g => (g.selection ? g.selection() : g).select('.domain').remove());
    }

    drawBars() {
        const barsGroup = this.createElement('g', 'bars', this.rootGroup);
        const bars = barsGroup.selectAll('g.bar').data(this.activeData);
        const enterBars = bars.enter().append('g').attr('class', 'bar');
        const mergeBars = bars.merge(enterBars);

        enterBars.append('rect');
        enterBars.append('text');

        mergeBars
            .attr('class', 'bar')
            .classed('bar--active', d => this.hasChildren(d))
            .transition()
                .duration(750)
                .ease(d3.easePoly)
            .attr('transform', d => `translate(${this.xScale(d.name)}, 0)`)

        enterBars.select('rect')
            .attr('width', this.xScale.bandwidth())
            .attr('y', this.innerHeight)
            .attr('height', 0);

        mergeBars.select('rect')
            .transition()
                .duration(750)
                .ease(d3.easeLinear)
            .attr('width', this.xScale.bandwidth())
            .attr('y', d => this.yScale(d.value))
            .attr('height', d => this.innerHeight - this.yScale(d.value));
        
        mergeBars.select('rect')
            .on('click', this.handleGoNext);
            
        mergeBars.select('text')
            .attr('x', this.xScale.bandwidth() / 2)
            .transition()
                .duration(500)
                .ease(d3.easeLinear)
            .attr('y', d => this.yScale(d.value) - 12)
            .attr('text-anchor', 'middle')
            .text(d => d3.format('$.1s')(d.value));

        bars.exit().remove();
    }

    handleGoBack = () => {
        this.dataHistory.pop();
        this.activeData = this.dataHistory[this.dataHistory.length - 1];
        this.activeData = this.activeData || this.data;
        this.draw();
    }

    handleGoNext = (data) => {
        if (this.hasChildren(data)) {
            this.activeData = data.children;
            this.dataHistory.push(this.activeData);
            this.draw();
        }
    }

    hasChildren = (data) => {
        return data.children && data.children.length > 0;
    }
}

export default DrillDown;
