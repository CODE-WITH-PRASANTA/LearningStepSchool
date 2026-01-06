import React from "react";
import "./PrimeryFullDayLerning.css";

export default function PrimeryFullDayLearning() {
  return (
    <section className="full-day">
      {/* HEADER */}
      <div className="full-day__header">
        <h2>Full Day with Learning</h2>
        <p>
          With the help of teachers and the environment as the third teacher,
          students have opportunities to confidently take risks.
        </p>
      </div>

      {/* TABLES */}
      <div className="full-day__tables">
        {/* LEFT TABLE */}
        <div className="schedule-table">
          <div className="schedule-header">
            <span>Hour</span>
            <span>Activity</span>
          </div>

          <div className="schedule-row">
            <span>8:00am</span>
            <span>Free Play</span>
          </div>
          <div className="schedule-row alt">
            <span>8:30am</span>
            <span>Sand Pit</span>
          </div>
          <div className="schedule-row">
            <span>9:00am</span>
            <span>Tattoo Corner</span>
          </div>
          <div className="schedule-row alt">
            <span>9:30am</span>
            <span>Creativity Corner</span>
          </div>
          <div className="schedule-row">
            <span>10:00am</span>
            <span>Food Time</span>
          </div>
        </div>

        {/* RIGHT TABLE */}
        <div className="schedule-table">
          <div className="schedule-header">
            <span>Hour</span>
            <span>Activity</span>
          </div>

          <div className="schedule-row">
            <span>10:30am</span>
            <span>Creativity Corner</span>
          </div>
          <div className="schedule-row alt">
            <span>11:00am</span>
            <span>Food Time</span>
          </div>
          <div className="schedule-row">
            <span>11:30am</span>
            <span>Free Play</span>
          </div>
          <div className="schedule-row alt">
            <span>12:00pm</span>
            <span>Tattoo Corner</span>
          </div>
          <div className="schedule-row">
            <span>12:30pm</span>
            <span>Sand Pit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
