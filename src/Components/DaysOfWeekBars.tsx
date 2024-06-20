import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DaysOfWeekBars = ({ data }) => {
    const svgRef = useRef();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        createDaysOfWeek(data);
    }, [data]);

    const parseDate = (dateString) => {
        const formats = ['%m/%d/%Y', '%m-%d-%Y'];
        let parsedDate = null;
        for (const format of formats) {
            parsedDate = d3.timeParse(format)(dateString);
            if (parsedDate) break;
        }
        return parsedDate;
    };

    const createDaysOfWeek = (data) => {
        const dayWidth = 10;
        const xPosition = 60; // Adjust this position based on your heatmap width
        const yPosition = 50; // Position at the top
        const weekdayStats = {
            'Mon': { totalDiff: 0 },
            'Tue': { totalDiff: 0 },
            'Wed': { totalDiff: 0 },
            'Thu': { totalDiff: 0 },
            'Fri': { totalDiff: 0 },
            'Sat': { totalDiff: 0 },
            'Sun': { totalDiff: 0 }
        };

        data.forEach(point => {
            const date = parseDate(point.category);
            if (date) {
                const dayOfWeek = date.getDay();
                const dayOfWeekName = weekdays[dayOfWeek];

                if (weekdayStats[dayOfWeekName]) {
                    // Calculate the difference between goal and values for each weekday
                    weekdayStats[dayOfWeekName].totalDiff += point.goal - point.values;
                }
            }
        });

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear any previous elements

        const barGroup = svg.append('g')
            .attr('class', 'days-of-week-bar-group')
            .attr('transform', `translate(${xPosition}, ${yPosition}) rotate(90)`); // Rotate 90 degrees

        const cornerRadius = 3;
        const barHeight = 40; // Fixed bar height

        // Find the highest totalDiff among all weekdays
        const maxTotalDiff = Math.max(...Object.values(weekdayStats).map(stats => stats.totalDiff));

        weekdays.forEach((weekday, colIndex) => {
            const totalDiff = weekdayStats[weekday].totalDiff;

            // Calculate the fill color height based on the totalDiff
            const fillColorHeight = Math.abs((totalDiff / maxTotalDiff) * barHeight);

            // Calculate the y position for the fill color based on the bar height
            const fillColorY = 0; // Start from the top

            // Calculate the fill color based on the totalDiff
            const fillColor = totalDiff >= 0 ? 'rgba(149, 168, 208, 1)' : 'rgba(245, 245, 245, 1)';

            const xBarPosition = colIndex * (dayWidth + 6.5);

            barGroup.append('rect')
                .attr('x', xBarPosition)
                .attr('y', 0) // Start from the top
                .attr('width', dayWidth)
                .attr('height', barHeight)
                .attr('fill', 'whitesmoke') // White background for the bar
                .attr('stroke', 'none')
                .attr('rx', cornerRadius)
                .attr('ry', cornerRadius);

            barGroup.append('rect')
                .attr('x', xBarPosition)
                .attr('y', fillColorY)
                .attr('width', dayWidth)
                .attr('height', fillColorHeight)
                .attr('fill', fillColor)
                .attr('stroke', 'none')
                .attr('rx', cornerRadius)
                .attr('ry', cornerRadius);

            barGroup.append('text')
                .attr('x', xBarPosition + dayWidth / 2)
                .attr('y', barHeight + 5) // Adjust the y position for text placement
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('font-size', '8px')
                .text(weekday[0]);
        });
    };

    return (
        <svg ref={svgRef} width={60} style={{marginTop:'-40px'}} height={200}></svg>
    );
};

export default DaysOfWeekBars;
