import React from "react";

const CircleProgress = ({ percent, color, size = 90 }) => {

  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke="#eee"
        strokeWidth={stroke}
        fill="none"
      />

      <circle
  cx={size/2}
  cy={size/2}
  r={radius}
  stroke={color}
  strokeWidth={stroke}
  fill="none"
  strokeDasharray={circumference}
  strokeDashoffset={offset}
  strokeLinecap="round"
  transform={`rotate(-90 ${size/2} ${size/2})`}
  style={{ transition: "stroke-dashoffset .8s ease" }}
/>


      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="600"
      >
        {percent}%
      </text>
    </svg>
  );
};


export default CircleProgress;
