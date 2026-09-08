import React from "react";
import "./StaffPayrollMain.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const StaffPayrollMain = ({ charts = {}, academicYear = "Current Academic Year" }) => {
  const financialYear = charts.financialYear || [];
  const series = [
    { label: "Fees Collection", key: "fees", color: "#3b82f6" },
    { label: "Expense", key: "expense", color: "#64748b" },
    { label: "Income", key: "income", color: "#22c55e" },
    { label: "Staff Payroll", key: "payroll", color: "#f59e0b" },
  ];

  const data = {
    labels: financialYear.map((item) => item.label),
    datasets: series.map((item) => ({
      label: item.label,
      data: financialYear.map((month) => asNumber(month[item.key])),
      borderColor: item.color,
      backgroundColor: item.color,
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 3,
      tension: 0.35,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#334155",
          usePointStyle: true,
          padding: 20,
          font: { size: 14, weight: "600" },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
          color: "#334155",
          font: { size: 14, weight: "600" },
        },
        ticks: {
          color: "#64748b",
          callback: (value) => (value >= 1000000 ? `${value / 1000000}M` : value),
        },
        grid: { color: "#e2e8f0" },
      },
      x: {
        ticks: { color: "#334155", font: { weight: "600" } },
        grid: { color: "#f1f5f9" },
      },
    },
  };

  return (
    <section className="StaffPayrollMain">
      <div className="StaffPayrollMain_Card">
        <div className="StaffPayrollMain_Header">
          <h2>Fee Collection / Staff Payroll / Expense / Income ({academicYear})</h2>
        </div>

        <div className="StaffPayrollMain_GraphWrap">
          <Line data={data} options={options} />
        </div>
      </div>
    </section>
  );
};

export default StaffPayrollMain;
