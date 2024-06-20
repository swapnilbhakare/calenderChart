import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  ITooltipServiceWrapper,
  createTooltipServiceWrapper,
  TooltipEventArgs,
} from "powerbi-visuals-utils-tooltiputils";
import DaysOfWeekBars from "./DaysOfWeekBars";
import Legend from "./Legend";
interface DataPoint {
  category: string;
  goal: number;
  values: number;
  selectionId: any;
}

interface CalendarChartProps {
  options: any;
  target: any;
  host: any;
  data: DataPoint[];
  selectedQuarter: string;
}

const CalendarChart: React.FC<CalendarChartProps> = ({
  options,
  target,
  host,
  data,
  selectedQuarter,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const selectionManager = host.createSelectionManager();
  const [height, setHeight] = useState(options.viewport.height);
  const [width, setWidth] = useState(options.viewport.width);
  const tooltipServiceWrapperRef = useRef<ITooltipServiceWrapper | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const parseDate = (dateStr: string): string => {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split("T")[0];
    }
    return dateStr;
  };
  const legendColors = [
    "#4d004b",
    "#810f7c",
    "#88419d",
    "#8c6bb1",
    "#8c96c6",
    "#9ebcda",
    "#bfd3e6",
    "#e0ecf4",
  ];
  const calculateCellColor = (value: number, goal: number): string => {
    const difference = value - goal;
    if (difference > 1000) return legendColors[0];
    if (difference > 500) return legendColors[1];
    if (difference > 0) return legendColors[2];
    if (difference > -500) return legendColors[3];
    if (difference > -1000) return legendColors[4];
    if (difference > -2000) return legendColors[5];
    if (difference > -3000) return legendColors[6];
    return legendColors[7];
  };

  const preprocessedData = data.map((d) => ({
    ...d,
    category: parseDate(d.category),
    difference: d.values - d.goal,
  }));

  useEffect(() => {
    if (!ref.current || preprocessedData.length === 0) return;

    const svg = d3.select(ref.current);
    const cellSize = 17;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const year = new Date(preprocessedData[0].category).getFullYear();
    const svgWidth = 960;
    const svgHeight = 136;

    setWidth(svgWidth);
    setHeight(svgHeight);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const days = g
      .selectAll(".day")
      .data(d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1)))
      .enter()
      .append("g")
      .attr("transform", (d) => {
        const x =
          (d3.timeWeek.count(d3.timeYear(d), d) - Math.floor(d.getDay() / 7)) *
          cellSize;
        const y = d.getDay() * cellSize;
        return `translate(${x}, ${y})`;
      });

    days
      .append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("margin", 2)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5)
      .datum((d) => d3.timeFormat("%Y-%m-%d")(d))
      .each(function (d) {
        const dayData = preprocessedData.find((data) => data.category === d);
        if (dayData) {
          const isSelected = selectedDate === dayData.category;
          d3.select(this)
            .attr(
              "fill",
              isSelected
                ? "#f00"
                : calculateCellColor(dayData.values, dayData.goal)
            )
            .on("click", () => {
              setSelectedDate(isSelected ? null : dayData.category);
              selectionManager.select(dayData.selectionId);
            });

          // Add tooltip
          if (!tooltipServiceWrapperRef.current) {
            tooltipServiceWrapperRef.current = createTooltipServiceWrapper(
              host.tooltipService,
              ref.current
            );
          }
          tooltipServiceWrapperRef.current?.addTooltip(
            d3.select(this),
            (tooltipEvent: TooltipEventArgs<DataPoint>) => [
              { displayName: "Date", value: dayData.category },
              { displayName: "Value", value: dayData.values.toString() },
              { displayName: "Goal", value: dayData.goal.toString() },
            ],
            () => dayData.selectionId
          );
        }
      });

    days
      .filter((d) => d.getDate() === 1)
      .append("text")
      .attr("x", cellSize / 2)
      .attr("y", cellSize / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#000")
      .text((d) => d.getMonth() + 1);
    const monthLabels = g
      .selectAll(".month-label")
      .data(d3.timeMonths(new Date(year, 0, 1), new Date(year + 1, 0, 1)))
      .enter()
      .append("text")
      .attr("class", "month-label")
      .attr("x", (d, i) => Math.floor(i * 2 * cellSize * 2.2))
      .attr("y", -5)
      .text((d) => d3.timeFormat("%b")(d)); // Abbreviated month name
  }, [preprocessedData]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <DaysOfWeekBars data={data} />
        <svg
          ref={ref}
          width={width}
          style={{ display: "block", margin: "-14px 0 " }}
        ></svg>
      </div>
      <Legend colors={legendColors} />
    </div>
  );
};

export default CalendarChart;
