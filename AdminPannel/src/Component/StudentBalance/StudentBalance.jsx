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

const StudentBalance = () => {
  const balanceData = {
    labels: ["7th", "5 Kidz"],
    datasets: [
      {
        label: "Class",
        data: [52700, 107700],
        backgroundColor: [
          "#60a5fa",
          "#475569",
        ],
        borderRadius: 10,
        barThickness: 190,
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
          font: {
            size: 14,
            weight: "600",
          },
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
        max: 150000,

        ticks: {
          color: "#64748b",
          callback: (value) =>
            value >= 1000 ? `${value / 1000}k` : value,
        },

        grid: {
          color: "#e5e7eb",
        },
      },

      x: {
        ticks: {
          color: "#334155",
          font: {
            weight: "700",
          },
        },

        grid: {
          display: false,
        },
      },
    },
  };

  const feeCollectionData = {
    labels: [
      "Assigned",
      "Collected",
      "Fine",
      "Discount",
      "Due",
    ],

    datasets: [
      {
        data: [49, 11, 1, 1, 38],

        backgroundColor: [
          "#9333ea",
          "#4ade80",
          "#ef4444",
          "#f59e0b",
          "#9ec5d6",
        ],

        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  return (
    <section className="StudentBalance">

      {/* LEFT CARD */}

      <div className="StudentBalance_Card StudentBalance_BarCard">

        <div className="StudentBalance_Header">
          <h2>
            Student Balance Fee Chart (2026-27)
          </h2>
        </div>

        <div className="StudentBalance_BarWrap">
          <Bar
            data={balanceData}
            options={balanceOptions}
          />
        </div>

      </div>

      {/* RIGHT CARD */}

      <div className="StudentBalance_Card">

        <div className="StudentBalance_Header">

          <div>
            <h2>Fee Collection Chart</h2>
            <p>Academic Year : 2026-27</p>
          </div>

          <span className="StudentBalance_Badge">
            Today's Collection : 0
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

    </section>
  );
};

export default StudentBalance;