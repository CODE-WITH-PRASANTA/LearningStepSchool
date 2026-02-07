// TeacherTimetable.jsx
import React, { useState } from "react";
import "./TeacherTimetable.css";

const staffList = [
  "Aatam Jain", "Admin", "Akshay Singhal", "Amandeep Kaue",
  "Basan Gowd", "DS", "Durga Dutta", "Geeta", "HM",
  "JM", "JP", "Kajal Saini"
];

const TeacherTimeTable = () => {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const days = [
    "02-02-2026 Monday",
    "03-02-2026 Tuesday",
    "04-02-2026 Wednesday",
    "05-02-2026 Thursday",
    "06-02-2026 Friday",
    "07-02-2026 Saturday",
  ];

  const periods = [
    "1 (06:30 AM–07:15 AM)",
    "Primary (08:00 AM–05:00 PM)",
    "1 (08:00 AM–09:00 AM)",
    "2 (09:00 AM–10:00 AM)",
    "Lunch Break (10:00 AM–10:30 PM)",
    "ABC (10:00 AM–04:30 PM)",
    "4 (10:30 AM–11:15 AM)",
    "Tea Break (12:00 PM–12:30 PM)",
    "7 (11:00 AM–04:00 PM)",
    "10th (08:00 AM–09:15 AM)",
  ];

  return (
    <div className="tt-wrapper">

      {/* TOP HEADER */}
      <div className="tt-header">
        <div className="left">
          <h1>Teacher Timetable</h1>
          <p>Academics / Teacher Timetable</p>
        </div>
      </div>

      {/* CRITERIA BOX */}
      <div className="tt-box">

        <div className="tt-grid">

          {/* STAFF DROPDOWN */}
          <div className="tt-field">
            <label>Staff</label>
            <select
              className="tt-input"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option>Select Staff</option>
              {staffList.map((s, i) => (
                <option key={i}>{s}</option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div className="tt-field">
            <label>Date</label>
            <input
              type="date"
              className="tt-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* SEARCH BUTTON */}
          <div className="tt-field tt-btn-field">
            <button className="tt-search-btn">Search</button>
          </div>
        </div>
      </div>

      {/* TIME TABLE BOX */}
      <div className="tt-table-box">
        <h2 className="tt-title">Teacher Timetable List</h2>

        <div className="tt-scroll">
          <table className="tt-table">
            <thead>
              <tr>
                <th className="period-col">PERIOD</th>
                {days.map((d, i) => (
                  <th key={i}>{d}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {periods.map((p, i) => (
                <tr key={i}>
                  <td className="period-col">{p}</td>

                  {days.map((_, di) => (
                    <td key={di} className="tt-cell"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default TeacherTimeTable;
