import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DataPoint {
    category: string;
    goal: number;
    values: number;
    selectionId: any;
}

interface WeeksInYearChartProps {
    data: DataPoint[];
    selectedQuarter: string;
    options:any
}

const WeeksInYearChart: React.FC<WeeksInYearChartProps> = ({ data, selectedQuarter,options }) => {
    const ref = useRef<SVGSVGElement | null>(null);
    const [height, setHeight] = useState(options.viewport.height);
    const [width, setWidth] = useState(960);

    useEffect(() => {
        if (!ref.current || data.length === 0) return;
        const width = 960;
        const weeksInYear = 53; // Assuming a non-leap year
        const maxDifference = Math.max(...data.map((point) => Math.abs(point.values - point.goal))); // Calculate the maximum absolute difference between values and goals

        const weekWidth = 6.6;
        const weekHeight = 30;
        const cornerRadius = 3;
        const monthSpacing = 0; // Spacing between months

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous drawings

        const barGroup = svg.append('g');

        data.forEach((point) => {
            // Parse date based on the different formats
            const date = point.category.includes('/') ? new Date(point.category) : new Date(point.category.replace(/-/g, '/'));
            // Calculate the week number based on the month column
            const weekNumber = Math.floor((date.getMonth()) * weeksInYear / 12) + getWeekNumber(date);
            const difference = Math.abs(point.values - point.goal);
            const barHeight = (difference / maxDifference) * weekHeight; // Calculate height based on absolute difference

            // Determine fill color based on the dropdown selection
            let fillColor;
            switch (selectedQuarter) {
                case 'Q1':
                    fillColor = date.getMonth() >= 0 && date.getMonth() <= 2 ? 'rgba(149, 168, 208, 1)' : 'rgba(245, 245, 245, 1)';
                    break;
                case 'Q2':
                    fillColor = date.getMonth() >= 3 && date.getMonth() <= 5 ? 'rgba(149, 168, 208, 1)' : 'rgba(245, 245, 245, 1)';
                    break;
                case 'Q3':
                    fillColor = date.getMonth() >= 6 && date.getMonth() <= 8 ? 'rgba(149, 168, 208, 1)' : 'rgba(245, 245, 245, 1)';
                    break;
                case 'Q4':
                    fillColor = date.getMonth() >= 9 && date.getMonth() <= 11 ? 'rgba(149, 168, 208, 1)' : 'rgba(245, 245, 245, 1)';
                    break;
                default:
                    fillColor = difference >= 0 ? 'rgba(149, 168, 208, 1)' : 'rgba(245, 245, 245, 1)';
                    break;
            }

            // Adjust x position to create space for each month
            const adjustedXPosition = weekNumber * (weekWidth +2) + 2;

            // First, create the colored rect based on the calculated barHeight and fillColor
            barGroup.append('rect')
                .attr('x', adjustedXPosition)
                .attr('y', weekHeight - barHeight) // Adjust the y position to fill from bottom to top
                .attr('width', weekWidth)
                .attr('height', barHeight)
                .attr('fill', fillColor) // Fill color based on absolute difference
                .attr('stroke', 'none')
                .attr('rx', cornerRadius)
                .attr('ry', cornerRadius);

            // Then, create the white background rect for the remaining height
            barGroup.append('rect')
                .attr('x', adjustedXPosition)
                .attr('y', 0)
                .attr('width', weekWidth)
                .attr('height', weekHeight - barHeight) // Adjust the height
                .attr('fill', 'whitesmoke') // White background for the remaining space
                .attr('stroke', 'none')
                .attr('rx', cornerRadius)
                .attr('ry', cornerRadius);
        });
       

        // Calculate and set SVG width based on the data
        const maxWeekNumber = Math.max(...data.map(point => Math.floor((new Date(point.category).getMonth()) * weeksInYear / 12) + getWeekNumber(new Date(point.category))));
        const calculatedWidth = (maxWeekNumber + 1) * (weekWidth + 2.5) + 2; // Add 10 for padding
        setWidth(calculatedWidth);

        // Set SVG height
        setHeight(42); // You may adjust the height as per your requirement
    }, [data, selectedQuarter]);

    // Function to get week number in the year
    const getWeekNumber = (date: Date) => {
        const onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() ) / 7);
    };

   return (
<div>
<svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', marginLeft: '85px ', marginTop: '20px' }} />

</div>);

};

export default WeeksInYearChart;
