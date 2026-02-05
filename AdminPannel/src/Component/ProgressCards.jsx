import React from "react";
import CircleProgress from "./CircleProgress";

const ProgressCards = () => {
  return (
    <div className="dashboard-stats-grid">

      <div className="stats-card progress-card">

        <CircleProgress percent={62} color="#ff4d4f" />

        <div>
          <h2>887</h2>
          <p>Events</p>
        </div>

      </div>

      <div className="stats-card progress-card">

        <CircleProgress percent={38} color="#2b50ed" />

        <div>
          <h2>175</h2>
          <p>Foods</p>
        </div>

      </div>

    </div>
  );
};

export default ProgressCards;
