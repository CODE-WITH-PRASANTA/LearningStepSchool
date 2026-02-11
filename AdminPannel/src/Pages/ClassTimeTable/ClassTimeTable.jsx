import React, { useState } from "react";
import "./ClassTimeTable.css";

export default function ClassTimeTable() {
  const classOptions = [
    "1st", "KSV 6th", "3rd", "4th", "5th",
    "6th", "7th", "8th", "9th", "10th",
  ];

  const sectionOptions = ["A", "B", "C", "Comm", "Gujarat Board"];

  const dayOptions = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday",
  ];

  const tableDays = [
    "MONDAY","TUESDAY","WEDNESDAY","THURSDAY",
    "FRIDAY","SATURDAY","SUNDAY",
  ];

  const subjectOptions = [
    "Hindi (Practical)",
    "Gujarati (Theory)",
    "DBMS (Theory)",
    "Maths (Theory)",
  ];

  const periods = [
    "1 (06:30 AM–07:15 AM)",
    "1 (08:00 AM–09:00 AM)",
    "2 (07:00 PM–07:45 PM)",
    "2 (09:00 AM–10:00 AM)",
    "10th (08:00 AM–09:15 AM)",
  ];

  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="ctt-wrapper">

      {/* TOP HEADING */}
      <div className="ctt-head">
        <h1>Class Timetable</h1>
        <p>Academics / Timetable</p>
      </div>

      {/* SELECT CRITERIA */}
      <div className="ctt-box">
        <h2 className="ctt-title">Select Criteria</h2>

        <div className="ctt-grid">

          {/* CLASS */}
          <div className="ctt-field">
            <label>Class</label>
            <select className="ctt-input">
              <option>Select</option>
              {classOptions.map((cls, i) => (
                <option key={i}>{cls}</option>
              ))}
            </select>
          </div>

          {/* SECTION */}
          <div className="ctt-field">
            <label>Section</label>
            <select className="ctt-input">
              <option>Select</option>
              {sectionOptions.map((sec, i) => (
                <option key={i}>{sec}</option>
              ))}
            </select>
          </div>

          {/* DAYS — UPDATED BUTTON DROPDOWN */}
          <div className="ctt-field">
            <label>Select Days</label>

            <div className="ctt-dropdown">
              <button
                className="ctt-drop-btn"
                onClick={() => setShowDayDropdown(!showDayDropdown)}
              >
                {selectedDays.length === 0
                  ? "Select Days"
                  : selectedDays.join(", ")}
              </button>

              {showDayDropdown && (
                <div className="ctt-day-menu">

                  {dayOptions.map((day, i) => (
                    <div
                      key={i}
                      className="ctt-day-item"
                      onClick={() => toggleDay(day)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        readOnly
                      />
                      <span>{day}</span>
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="ctt-field btn-field">
            <button className="ctt-search-btn">Search</button>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="ctt-table-box">
        <div className="ctt-table-top">
          <h2>Class Timetable List</h2>
        </div>

        <div className="ctt-scroll">
          <table className="ctt-table">
            <thead>
              <tr>
                <th>PERIOD</th>
                {tableDays.map((d, i) => (
                  <th key={i}>{d}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {periods.map((p, r) => (
                <tr key={r}>
                  <td className="ctt-period">{p}</td>

                  {tableDays.map((_, c) => (
                    <td key={c}>
                      <select className="ctt-select">
                        <option>Select</option>
                        {subjectOptions.map((sub, si) => (
                          <option key={si}>{sub}</option>
                        ))}
                      </select>

                      <div className="ctt-teacher-box"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="ctt-save-wrap">
          <button className="ctt-save-btn">Save</button>
        </div>

      </div>
    </div>
  );
}
