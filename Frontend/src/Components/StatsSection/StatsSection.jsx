import React from "react";
import "./StatsSection.css";

import bg from "../../assets/stats-bg.jpg"; // use your background image

const StatsSection = () => {
  return (
    <section className="stats-section">
      {/* Background */}
      <img src={bg} alt="stats background" className="stats-bg" />

      {/* Overlay */}
      <div className="stats-overlay"></div>

      {/* Content */}
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-icon">👩‍🏫</span>
          <h2>76</h2>
          <p>Loving Teachers</p>
        </div>

        <div className="stat-item">
          <span className="stat-icon">✏️</span>
          <h2>135</h2>
          <p>English Lessons</p>
        </div>

        <div className="stat-item">
          <span className="stat-icon">🏈</span>
          <h2>332</h2>
          <p>Outdoor Activities</p>
        </div>

        <div className="stat-item">
          <span className="stat-icon">🧪</span>
          <h2>278</h2>
          <p>Fun Experiments</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
