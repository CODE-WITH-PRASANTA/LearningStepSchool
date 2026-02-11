import React from "react";
import "./DailyTimeTable.css";

export default function DailyTimeTable() {
  const classOptions = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];

  const sectionOptions = ["A","B","C","D","E","Commerce","Gujarat Board"];

  const subjectOptions = [
    "Hindi (Practical)",
    "Gujarati (Theory)",
    "DBMS (Theory)",
    "Maths (Theory)",
  ];

  const teacherOptions = [
    "Aatam Jain",
    "Admin",
    "Akshay Singhal",
    "Amandeep Kaue",
    "Basan Gowd",
    "DS",
    "Durga Dutta",
    "Geeta",
    "HM",
    "JM",
    "JP",
    "Kajal Saini",
    "Kate K",
    "KG Htet",
    "Kuldeep Singh Shekhawat"
  ];

  const weekDays = [
    "Monday 26-01-2026",
    "Tuesday 27-01-2026",
    "Wednesday 28-01-2026",
    "Thursday 29-01-2026",
    "Friday 30-01-2026",
    "Saturday 31-01-2026",
    "Sunday 01-02-2026"
  ];

  const periods = [
    "1 (06:30 AM - 07:15 AM)",
    "1 (08:00 AM - 09:00 AM)",
    "2 (07:00 PM - 07:45 PM)",
    "2 (09:00 AM - 10:00 AM)",
    "10th (08:00 AM - 09:15 AM)"
  ];

  return (
    <div className="dt-wrapper">

      {/* PAGE TITLE */}
      <div className="dt-left-title">
        <h1>📘 Daily Time Table</h1>
        <p className="dt-sub">Academics / Daily Time Table</p>
      </div>

      {/* SELECT CRITERIA */}
      <div className="dt-criteria-box">
        <div className="dt-box-header">
          <h2>Select Criteria</h2>
        </div>

        <div className="dt-criteria-grid">
          
          <div className="dt-field">
            <label>Class</label>
            <select className="dt-input">
              <option>Select</option>
              {classOptions.map((c, i) => <option key={i}>{c}</option>)}
            </select>
          </div>

          <div className="dt-field">
            <label>Section</label>
            <select className="dt-input">
              <option>Select</option>
              {sectionOptions.map((s, i) => <option key={i}>{s}</option>)}
            </select>
          </div>

          <div className="dt-field">
            <label>Date</label>
            <input type="date" className="dt-input" />
          </div>

          {/* FIXED SEARCH BUTTON */}
          <div className="dt-field">
            <button className="dt-search-btn">Search</button>
          </div>

        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="dt-table-box">
        <h2 className="dt-table-title">Daily Time Table List</h2>

        <div className="dt-table-scroll">
          <table className="dt-table">
            <thead>
              <tr>
                <th>Period</th>
                {weekDays.map((day, i) => (
                  <th key={i}>{day}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {periods.map((period, r) => (
                <tr key={r}>
                  <td className="dt-period-col">{period}</td>

                  {weekDays.map((day, c) => (
                    <td key={c}>

                      {/* SUBJECT DROPDOWN */}
                      <select className="dt-select subject-select">
                        <option>Select Subject</option>
                        {subjectOptions.map((sub, si) => (
                          <option key={si}>{sub}</option>
                        ))}
                      </select>

                      {/* TEACHER DROPDOWN */}
                      <select className="dt-select teacher-select">
                        <option>Select Teacher</option>
                        {teacherOptions.map((t, ti) => (
                          <option key={ti}>{t}</option>
                        ))}
                      </select>

                    </td>
                  ))}

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="dt-save-box">
          <button className="dt-save-btn">Save</button>
        </div>

      </div>

    </div>
  );
}
