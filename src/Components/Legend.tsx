import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Legend = ({ colors }) => {
    const ref = useRef(null);

    useEffect(() => {
        const legendWidth = 200;
        const legendHeight = 15;
        const labelPadding = 5;
        const borderRadius = 5; // Adjust the border radius as needed

        const svg = d3.select(ref.current)
            .attr('width', legendWidth)
            .attr('height', legendHeight + 20);

        const defs = svg.append('defs');
        const linearGradient = defs.append('linearGradient')
            .attr('id', 'color-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        colors.forEach((color, index) => {
            linearGradient.append('stop')
                .attr('offset', `${(index / (colors.length - 1)) * 100}%`)
                .style('stop-color', color);
        });

        svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('rx', borderRadius) // Set the border radius for x-axis
            .attr('ry', borderRadius) // Set the border radius for y-axis
            .style('fill', 'url(#color-gradient)');

        const labels = ['High', 'Low'];
        const labelGroup = svg.append('g').attr('class', 'legend-labels');

        labels.forEach((label, index) => {
            labelGroup.append('text')
                .attr('x', index === 0 ? labelPadding : legendWidth - labelPadding)
                .attr('y', legendHeight + labelPadding * 2)
                .text(label)
                .style('fill', '#000')
                .attr('text-anchor', index === 0 ? 'start' : 'end')
                .attr('alignment-baseline', 'middle');
        });
    }, [colors]);

    return <svg  style={{margin:'0 auto', position:"absolute" ,right:280}} ref={ref}></svg>;
};

export default Legend;
