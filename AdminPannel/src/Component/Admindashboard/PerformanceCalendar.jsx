import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PerformanceCalendar = () => {

  const [date, setDate] = useState(new Date());

  const monthName = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const changeMonth = (direction) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + direction);
    setDate(newDate);
  };

  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();

  return (
    <div className="dashboard-card">

      <div className="dashboard-card-header">
        <h3>School Performance</h3>

        <div className="calendar-controls">
          <span>{monthName} {year}</span>
          <FaChevronLeft onClick={() => changeMonth(-1)} />
          <FaChevronRight onClick={() => changeMonth(1)} />
        </div>
      </div>

      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }).map((_, i) => (
          <div key={i} className="calendar-day">
            {i + 1}
          </div>
        ))}
      </div>

    </div>
  );
};

export default PerformanceCalendar;
