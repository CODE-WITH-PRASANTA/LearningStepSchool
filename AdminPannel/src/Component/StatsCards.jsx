import React from "react";
import { FaUsers, FaGraduationCap } from "react-icons/fa";

const StatsCards = () => {
  return (
    <div className="dashboard-stats-grid">

      <div className="stats-card">
        <div>
          <h2>9,825</h2>
          <p>Total Students</p>
          <span className="positive-text">+0.5%</span>
        </div>
        <FaUsers className="stats-icon" />
      </div>

      <div className="stats-card">
        <div>
          <h2>653</h2>
          <p>Total Teachers</p>
          <span className="negative-text">-2%</span>
        </div>
        <FaGraduationCap className="stats-icon" />
      </div>

    </div>
  );
};

export default StatsCards;
