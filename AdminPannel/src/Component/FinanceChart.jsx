import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import DashboardDropdown from "./DashboardDropdown";
import ThreeDotMenu from "./ThreeDotMenu";
import CircleProgress from "./CircleProgress";   // 👈 ADD

const FinanceChart = () => {

  const [period, setPeriod] = useState("Daily");

  const data = {
    labels: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    datasets: [
      {
        label: "Income",
        data: [30, 40, 28, 50, 38, 110, 95],
        backgroundColor: "#2b50ed"
      },
      {
        label: "Expense",
        data: [10, 30, 42, 30, 32, 52, 40],
        backgroundColor: "#ff4d4f"
      }
    ]
  };

  const options = {
    responsive: true,
    animation: { duration: 1200 }
  };

  return (
    <div className="dashboard-card">

      {/* HEADER */}
      <div className="dashboard-card-header">
        <h3>School Finance</h3>

        <div className="dashboard-tools">
          <DashboardDropdown value={period} onChange={setPeriod} />
          <ThreeDotMenu />
        </div>
      </div>

      {/* ===== FINANCE CIRCLE SUMMARY ===== */}

      <div className="finance-circle-row">

        <div className="finance-circle-box">
          <CircleProgress percent={75} color="#2b50ed" size={70} />

          <div>
            <h2>$23,445</h2>
            <p>total Income</p>
          </div>
        </div>

        <div className="finance-circle-box">
          <CircleProgress percent={25} color="#ff4d4f" size={70} />

          <div>
            <h2>$1,564</h2>
            <p>total Expense</p>
          </div>
        </div>

      </div>

      {/* ===== BAR CHART ===== */}
      <Bar data={data} options={options} />

    </div>
  );
};

export default FinanceChart;
