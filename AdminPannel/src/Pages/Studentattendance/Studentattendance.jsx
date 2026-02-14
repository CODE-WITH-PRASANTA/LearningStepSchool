import React, { useState } from "react";
import "./Studentattendance.css";

const StudentAttendance = () => {
  const [form, setForm] = useState({
    className: "",
    section: "",
    attendance: "",
    date: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="attendance-page">
      {/* ===== HEADER ===== */}
      <div className="attendance-header">
        <h2>
          📅 Student Attendance
        </h2>
        <p>
          Attendance / <span>Student Attendance</span>
        </p>
      </div>

      {/* ===== CARD ===== */}
      <div className="attendance-card">
        {/* Card Header */}
        <div className="card-head">
          <h3>🔍 Select Criteria</h3>
          <button className="holiday-btn">
            Mark Holiday Range
          </button>
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Class */}
            <div className="form-group">
              <label>
                Class <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Select Class"
                value={form.className}
                onChange={(e) =>
                  setForm({ ...form, className: e.target.value })
                }
                required
              />
            </div>

            {/* Section */}
            <div className="form-group">
              <label>
                Section <span>*</span>
              </label>
              <select
                value={form.section}
                onChange={(e) =>
                  setForm({ ...form, section: e.target.value })
                }
                required
              >
                <option value="">Select Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>

            {/* Attendance */}
            <div className="form-group">
              <label>Attendance</label>
              <select
                value={form.attendance}
                onChange={(e) =>
                  setForm({ ...form, attendance: e.target.value })
                }
              >
                <option value="">Select</option>
                <option>Present</option>
                <option>Absent</option>
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label>Attendance Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>
          </div>

          {/* ===== ACTION ===== */}
          <div className="form-action">
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAttendance;
