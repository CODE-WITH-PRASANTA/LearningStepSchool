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

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const FeeCollection = ({ charts = {} }) => {
  const dailyCollection = charts.feeCollectionDaily || [];

  const data = {
    labels: dailyCollection.map((item) => item.label),
    datasets: [
      {
        label: "Collection",
        data: dailyCollection.map((item) => asNumber(item.collection)),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,.25)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#2563eb",
      },
      {
        label: "Expense",
        data: dailyCollection.map((item) => asNumber(item.expense)),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        pointRadius: 3,
        tension: 0.3,
      },
      {
        label: "Income",
        data: dailyCollection.map((item) => asNumber(item.income)),
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        pointRadius: 3,
        tension: 0.3,
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
          font: { size: 14, weight: "600" },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          callback: (value) => (value >= 1000 ? `${value / 1000}k` : value),
        },
        grid: { color: "#e5e7eb" },
        title: { display: true, text: "Amount", color: "#334155" },
      },
      x: {
        ticks: { color: "#334155" },
        grid: { color: "#eef2ff" },
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
