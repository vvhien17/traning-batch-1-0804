"use client";
import React, { useState } from "react";

// Type for each data entry
type PieChartData = {
  value: number;
  color: string;
  label: string; // Add a label for the tooltip
};

// Type for the PieChart component props
type PieChartProps = {
  data: PieChartData[];
};

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const [hoveredSlice, setHoveredSlice] = useState<PieChartData | null>(null);

  // Calculate the total value of the dataset
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Calculate the angles for each slice
  let cumulativeValue = 0;
  const slices = data.map((item) => {
    const value = item.value;
    const startAngle = (cumulativeValue / total) * 360;
    const endAngle = ((cumulativeValue + value) / total) * 360;
    cumulativeValue += value;

    return {
      startAngle,
      endAngle,
      color: item.color,
      label: item.label,
      value: item.value,
    };
  });

  console.log({ slices });

  return (
    <div className="relative w-64 h-64">
      <svg viewBox="0 0 32 32" className="w-full h-full">
        {slices.map((slice, index) => {
          const { startAngle, endAngle, color, label, value } = slice;
          const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

          const start = polarToCartesian(16, 16, 15, endAngle);
          const end = polarToCartesian(16, 16, 15, startAngle);

          const d =
            data.length === 1
              ? `M 16 16 m -16, 0 a 16,16 0 1,0 32,0 a 16,16 0 1,0 -32,0`
              : `M 16 16 L ${polarToCartesian(16, 16, 16, endAngle).x} ${
                  polarToCartesian(16, 16, 16, endAngle).y
                } A 16 16 0 ${largeArcFlag} 0 ${
                  polarToCartesian(16, 16, 16, startAngle).x
                } ${polarToCartesian(16, 16, 16, startAngle).y} Z`;

          return (
            <path
              key={index}
              d={d}
              fill={color}
              stroke="white"
              strokeWidth="0.2"
              onMouseOver={() => setHoveredSlice(slice)}
              onMouseOut={() => setHoveredSlice(null)}
              className="cursor-pointer"
            />
          );
        })}
      </svg>

      {hoveredSlice && (
        <div
          className="absolute px-3 py-2 bg-white text-black rounded shadow-lg"
          style={{
            top: "calc(50% - 2rem)",
            left: "calc(50% - 2rem)",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div>{hoveredSlice.label}</div>
          <div>Value: {hoveredSlice.value.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

// Convert polar coordinates to Cartesian coordinates
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export default PieChart;
