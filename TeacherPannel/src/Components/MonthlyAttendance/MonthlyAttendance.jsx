import React from "react";
import "./MonthlyAttendance.css";

import {
  FaHome,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";

const attendance = {
  17: "absent",
  18: "present",
  19: "late",
  20: "present",
};

const totalDays = 31;

const MonthlyAttendance = () => {
  return (
    <div className="MonthlyAttendance">

      {/* Header */}

      <div className="MonthlyAttendance_header">
        <h2>Monthly Attendance</h2>

        <div className="MonthlyAttendance_breadcrumb">
          <FaHome />
          <FaChevronRight />
          <span>Attendance</span>
          <FaChevronRight />
          <span>Monthly Attendance</span>
        </div>
      </div>

      {/* Summary */}

      <div className="MonthlyAttendance_summary">

        <div className="MonthlyAttendance_card present">
          <h4>Total Present</h4>
          <h2>15</h2>
        </div>

        <div className="MonthlyAttendance_card absent">
          <h4>Total Absent</h4>
          <h2>2</h2>
        </div>

        <div className="MonthlyAttendance_card late">
          <h4>Late Arrivals</h4>
          <h2>3</h2>
        </div>

        <div className="MonthlyAttendance_card half">
          <h4>Half Days</h4>
          <h2>0</h2>
        </div>

      </div>

      {/* Calendar */}

      <div className="MonthlyAttendance_calendar">

        <h2>January 2026</h2>

        <div className="MonthlyAttendance_grid">

          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;

            return (
              <div
                key={day}
                className={`MonthlyAttendance_day ${
                  attendance[day] || ""
                }`}
              >
                {day}
              </div>
            );
          })}

        </div>

        {/* Legend */}

        <div className="MonthlyAttendance_legend">

          <div>
            <FaCircle className="green" />
            Present
          </div>

          <div>
            <FaCircle className="red" />
            Absent
          </div>

          <div>
            <FaCircle className="orange" />
            Late
          </div>

          <div>
            <FaCircle className="blue" />
            Half Day
          </div>

        </div>

      </div>

    </div>
  );
};

export default MonthlyAttendance;