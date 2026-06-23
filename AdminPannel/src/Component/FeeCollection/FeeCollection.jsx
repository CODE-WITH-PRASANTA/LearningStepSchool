import React from "react";
import "./FeeCollection.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const FeeCollection = () => {
  const labels = [
    "01","02","03","04","05","06","07","08","09","10",
    "11","12","13","14","15","16","17","18","19","20",
    "21","22","23","24","25","26","27","28","29","30"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Collection",
        data: [
          404500,0,0,118756,0,97801,0,118474,202549,35600,
          92047,0,30000,0,11600,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0
        ],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,.25)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#2563eb",
      },
      {
        label: "Expense",
        data: [
          0,0,0,0,2300,0,0,0,0,0,
          50000,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0
        ],
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        pointRadius: 3,
        tension: 0.3,
      },
      {
        label: "Income",
        data: new Array(30).fill(0),
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        pointRadius: 3,
      },
      {
        label: "Inventory Sales",
        data: new Array(30).fill(0),
        borderColor: "#06b6d4",
        backgroundColor: "#06b6d4",
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          color: "#334155",
          padding: 20,
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        max: 450000,

        ticks: {
          color: "#64748b",
          callback: (value) =>
            value >= 1000 ? `${value / 1000}k` : value,
        },

        grid: {
          color: "#e5e7eb",
        },

        title: {
          display: true,
          text: "Values",
          color: "#334155",
        },
      },

      x: {
        ticks: {
          color: "#334155",
        },

        grid: {
          color: "#eef2ff",
        },
      },
    },
  };

  return (
    <section className="FeeCollection">

      <div className="FeeCollection_Card">

        <div className="FeeCollection_Header">
          <h2>Fee Collection Overview</h2>
          <p>Monthly Collection Analytics</p>
        </div>

        <div className="FeeCollection_GraphWrap">
          <Line data={data} options={options} />
        </div>

      </div>

    </section>
  );
};

export default FeeCollection;