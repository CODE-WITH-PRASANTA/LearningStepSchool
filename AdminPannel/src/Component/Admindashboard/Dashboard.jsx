import React from "react";
import StatsCards from "./StatsCards";
import FinanceChart from "./FinanceChart";
import PerformanceCalendar from "./PerformanceCalendar";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </div>

        <button className="dashboard-primary-btn">
          New Admission
        </button>
      </div>

      <StatsCards />

      <div className="dashboard-middle-grid">
        <FinanceChart />
        <PerformanceCalendar />
      </div>

    </div>
  );
};

export default Dashboard;
