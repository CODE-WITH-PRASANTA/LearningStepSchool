import React from "react";
import "./SecondaryFullDayLearning.css";

export default function SecondaryFullDayLearning() {
  return (
    <section className="secondary-full-day">
      {/* HEADER */}
      <div className="secondary-full-day__header">
        <h2>Full Day with Learning</h2>
        <p>
          Secondary students follow a structured daily schedule that balances
          academic study, creativity, collaboration, and personal development.
        </p>
      </div>

      {/* TABLES */}
      <div className="secondary-full-day__tables">
        {/* LEFT TABLE */}
        <div className="secondary-schedule-table">
          <div className="secondary-schedule-header">
            <span>Hour</span>
            <span>Activity</span>
          </div>

          <div className="secondary-schedule-row">
            <span>8:00am</span>
            <span>Assembly & Planning</span>
          </div>
          <div className="secondary-schedule-row alt">
            <span>8:45am</span>
            <span>Core Subjects</span>
          </div>
          <div className="secondary-schedule-row">
            <span>9:45am</span>
            <span>Science Lab</span>
          </div>
          <div className="secondary-schedule-row alt">
            <span>10:45am</span>
            <span>Break Time</span>
          </div>
          <div className="secondary-schedule-row">
            <span>11:15am</span>
            <span>Group Projects</span>
          </div>
        </div>

        {/* RIGHT TABLE */}
        <div className="secondary-schedule-table">
          <div className="secondary-schedule-header">
            <span>Hour</span>
            <span>Activity</span>
          </div>

          <div className="secondary-schedule-row">
            <span>12:15pm</span>
            <span>Lunch</span>
          </div>
          <div className="secondary-schedule-row alt">
            <span>1:00pm</span>
            <span>Creative Arts</span>
          </div>
          <div className="secondary-schedule-row">
            <span>2:00pm</span>
            <span>Physical Education</span>
          </div>
          <div className="secondary-schedule-row alt">
            <span>3:00pm</span>
            <span>Revision & Homework</span>
          </div>
          <div className="secondary-schedule-row">
            <span>4:00pm</span>
            <span>Wrap-up</span>
          </div>
        </div>
      </div>
    </section>
  );
}
