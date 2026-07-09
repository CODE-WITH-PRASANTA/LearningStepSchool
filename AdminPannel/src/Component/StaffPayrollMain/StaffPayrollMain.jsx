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

const StaffPayrollMain = () => {
  const data = {
    labels: [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ],

    datasets: [
      {
        label: "Fees Collection",
        data: [
          29684129,
          1737492,
          1106546,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.35,
      },

      {
        label: "Expense",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "#64748b",
        backgroundColor: "#64748b",
        pointRadius: 4,
      },

      {
        label: "Income",
        data: [14444, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        pointRadius: 4,
      },

      {
        label: "Staff Payroll",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        pointRadius: 4,
      },

      {
        label: "Inventory Sales",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "#06b6d4",
        backgroundColor: "#06b6d4",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#334155",
          usePointStyle: true,
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
        max: 40000000,

        title: {
          display: true,
          text: "Amount",
          color: "#334155",
          font: {
            size: 14,
            weight: "600",
          },
        },

        ticks: {
          color: "#64748b",

          callback: (value) => {
            return value >= 1000000
              ? value / 1000000 + "M"
              : value;
          },
        },

        grid: {
          color: "#e2e8f0",
        },
      },

      x: {
        ticks: {
          color: "#334155",

          font: {
            weight: "600",
          },
        },

        grid: {
          color: "#f1f5f9",
        },
      },
    },
  };

  return (
    <section className="StaffPayrollMain">

      <div className="StaffPayrollMain_Card">

        <div className="StaffPayrollMain_Header">
          <h2>
            Fee Collection / Staff Payroll /
            Expense / Income (2026-27)
          </h2>
        </div>

        <div className="StaffPayrollMain_GraphWrap">
          <Line
            data={data}
            options={options}
          />
        </div>

      </div>

    </section>
  );
};

export default StaffPayrollMain;