import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import DashboardDropdown from "./DashboardDropdown";
import ThreeDotMenu from "./ThreeDotMenu";

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

      <div className="dashboard-card-header">
        <h3>School Finance</h3>

        <div className="dashboard-tools">
          <DashboardDropdown value={period} onChange={setPeriod} />
          <ThreeDotMenu />
        </div>
      </div>

      <Bar data={data} options={options} />

    </div>
  );
};

export default FinanceChart;
