import React from "react";
import "./StudentBalance.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const chartColors = ["#60a5fa", "#475569", "#a78bfa", "#f59e0b", "#14b8a6", "#f472b6"];

const StudentBalance = ({ charts = {}, academicYear = "Current Academic Year" }) => {
  const balanceByClass = charts.balanceByClass || [];
  const feeSummary = charts.feeSummary || {};

  const balanceData = {
    labels: balanceByClass.map((item) => item.label),
    datasets: [
      {
        label: "Outstanding balance",
        data: balanceByClass.map((item) => asNumber(item.value)),
        backgroundColor: balanceByClass.map(
          (_, index) => chartColors[index % chartColors.length]
        ),
        borderRadius: 10,
        maxBarThickness: 190,
      },
    ],
  };

  const balanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          color: "#334155",
          font: { size: 14, weight: "600" },
        },
      },
      title: {
        display: true,
        text: ["Outstanding fees by class", "Data updates with the dashboard"],
        color: "#334155",
        font: { size: 14 },
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
      },
      x: {
        ticks: { color: "#334155", font: { weight: "700" } },
        grid: { display: false },
      },
    },
  };

  const feeCollectionData = {
    labels: ["Assigned", "Collected", "Fine", "Discount", "Due"],
    datasets: [
      {
        data: [
          asNumber(feeSummary.assigned),
          asNumber(feeSummary.collected),
          asNumber(feeSummary.fine),
          asNumber(feeSummary.discount),
          asNumber(feeSummary.due),
        ],
        backgroundColor: ["#9333ea", "#4ade80", "#ef4444", "#f59e0b", "#9ec5d6"],
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  return (
    <section className="StudentBalance">
      <div className="StudentBalance_Card StudentBalance_BarCard">
        <div className="StudentBalance_Header">
          <h2>Student Balance Fee Chart ({academicYear})</h2>
        </div>

        <div className="StudentBalance_BarWrap">
          <Bar data={balanceData} options={balanceOptions} />
        </div>
      </div>

      <div className="StudentBalance_Card">
        <div className="StudentBalance_Header">
          <div>
            <h2>Fee Collection Chart</h2>
            <p>Academic Year: {academicYear}</p>
          </div>

          <span className="StudentBalance_Badge">
            Today&apos;s Collection: {currencyFormatter.format(asNumber(feeSummary.todayCollection))}
          </span>
        </div>

        <div className="StudentBalance_DonutWrap">
          <Doughnut
            data={feeCollectionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "50%",
              plugins: {
                legend: {
                  position: "top",
                  labels: { boxWidth: 40, color: "#475569" },
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default StudentBalance;
