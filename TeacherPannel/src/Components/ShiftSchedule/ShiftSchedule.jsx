import React from "react";
import "./ShiftSchedule.css";
import {
  FiHome,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";

const weeklySchedule = [
  {
    day: "Monday",
    date: "Jan 20",
    shift: "Day Shift",
    color: "#45b649",
  },
  {
    day: "Tuesday",
    date: "Jan 21",
    shift: "Day Shift",
    color: "#45b649",
  },
  {
    day: "Wednesday",
    date: "Jan 22",
    shift: "Day Shift",
    color: "#45b649",
  },
  {
    day: "Thursday",
    date: "Jan 23",
    shift: "Evening Shift",
    color: "#ff9800",
  },
  {
    day: "Friday",
    date: "Jan 24",
    shift: "Evening Shift",
    color: "#ff9800",
  },
  {
    day: "Saturday",
    date: "Jan 25",
    shift: "Off",
    color: "#e5e7eb",
  },
  {
    day: "Sunday",
    date: "Jan 26",
    shift: "Off",
    color: "#e5e7eb",
  },
];

const shiftDetails = [
  {
    title: "Day Shift",
    time: "09:00 - 18:00",
    break: "Break: 1h",
    color: "#45b649",
  },
  {
    title: "Evening Shift",
    time: "14:00 - 23:00",
    break: "Break: 1h",
    color: "#ff9800",
  },
  {
    title: "Night Shift",
    time: "22:00 - 07:00 (Next Day)",
    break: "Break: 1h",
    color: "#673ab7",
  },
];

const ShiftSchedule = () => {
  return (
    <div className="shift-page">

      {/* Header */}

      <div className="shift-header">

        <h2>Shift Schedule</h2>

        <div className="breadcrumb">

          <FiHome />

          <FiChevronRight />

          <span>Attendance</span>

          <FiChevronRight />

          <span>Schedule</span>

        </div>

      </div>

      {/* Weekly Schedule */}

      <div className="schedule-section">

        <h2>My Weekly Schedule</h2>

        <div className="schedule-grid">

          {weeklySchedule.map((item, index) => (
            <div
              className="schedule-card"
              key={index}
              style={{
                borderTop: `5px solid ${item.color}`,
              }}
            >
              <h3>{item.day}</h3>

              <p>{item.date}</p>

              <div className="shift-tag">{item.shift}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shift Details */}

      <div className="details-section">

        <h2>Shift Details</h2>

        <div className="details-grid">
          {shiftDetails.map((shift, index) => (
            <div className="detail-card" key={index}>
              <div
                className="clock-icon"
                style={{
                  background: shift.color,
                }}
              >
                <FiClock />
              </div>

              <div>

                <h3>{shift.title}</h3>

                <h4>{shift.time}</h4>

                <p>{shift.break}</p>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ShiftSchedule;