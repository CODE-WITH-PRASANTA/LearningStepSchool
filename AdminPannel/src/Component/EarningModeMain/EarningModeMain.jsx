import React from "react";
import "./EarningModeMain.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const EarningModeMain = () => {
  const earningData = {
    labels: ["Cash", "Cheque", "Online", "APP", "Card"],
    datasets: [
      {
        data: [100, 0, 0, 0, 0],
        backgroundColor: [
          "#2563eb",
          "#4ade80",
          "#fb7185",
          "#f59e0b",
          "#94a3b8",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const classChartData = {
    labels: ["KSV 6th", "7th", "5 Kidz"],
    datasets: [
      {
        label: "Class",
        data: [1, 3, 1],
        backgroundColor: [
          "#60a5fa",
          "#3b82f6",
          "#86efac",
        ],
        borderRadius: 8,
        barThickness: 120,
      },
    ],
  };

  const classChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#334155",
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: [
          "School Management Software",
          "Click the columns to view Section Wise",
        ],
        color: "#334155",
        font: {
          size: 14,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          stepSize: 1,
        },
        grid: {
          color: "#e5e7eb",
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
          display: false,
        },
      },
    },
  };

  return (
    <section className="EarningModeMain">

      {/* EARNING */}

      <div className="EarningModeMain_Card">

        <div className="EarningModeMain_Header">
          <h2>Earning Mode</h2>
          <p>Financial Year : 2026-27</p>
        </div>

        <div className="EarningModeMain_DonutWrap">
          <Doughnut
            data={earningData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "48%",
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    boxWidth: 40,
                    color: "#475569",
                  },
                },
              },
            }}
          />
        </div>

      </div>

      {/* CLASS CHART */}

      <div className="EarningModeMain_Card EarningModeMain_BarCard">

        <div className="EarningModeMain_Header">
          <h2>Class Chart (2026-27)</h2>
        </div>

        <div className="EarningModeMain_BarWrap">
          <Bar
            data={classChartData}
            options={classChartOptions}
          />
        </div>

      </div>

    </section>
  );
};

export default EarningModeMain;