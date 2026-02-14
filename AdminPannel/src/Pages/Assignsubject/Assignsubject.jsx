// Full React component + CSS in same file for clarity
// You can split CSS into a separate file if needed

import React, { useState } from "react";
import "./Assignsubject.css";

const classOptions = ["KSV 6th", "KSV 7th", "KSV 8th"];
const sectionOptions = ["A", "B", "C"];
const subjectOptions = ["Maths", "Science", "English", "Social Science", "Computer"];
const teacherOptions = ["Mr. Sharma", "Ms. Rina", "Mr. Das", "Mrs. Gupta"];

export default function AssignSubjects() {
  const [criteria, setCriteria] = useState({
    className: "KSV 6th",
    section: "C",
    auto: true,
  });

  const [rows, setRows] = useState([
    { id: 1, optional: false, subject: "", teacher: "" },
    { id: 2, optional: false, subject: "", teacher: "" },
    { id: 3, optional: false, subject: "", teacher: "" },
    { id: 4, optional: false, subject: "", teacher: "" },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), optional: false, subject: "", teacher: "" },
    ]);
  };

  const removeRow = (id) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const updateRow = (id, key, value) => {
    setRows(
      rows.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    );
  };

  const handleSave = () => {
    alert("Subjects Assigned Successfully ✔");
  };

  return (
    <div className="as-page">
      <div className="as-card">
        <h2 className="as-title">Assign Subjects</h2>

        {/* Select Criteria */}
        <div className="as-section">
          <h3 className="as-section-title">Select Criteria</h3>
          <div className="as-grid">
            <div className="as-field">
              <label>Class *</label>
              <select
                value={criteria.className}
                onChange={(e) =>
                  setCriteria({ ...criteria, className: e.target.value })
                }
              >
                {classOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="as-field">
              <label>Section *</label>
              <select
                value={criteria.section}
                onChange={(e) =>
                  setCriteria({ ...criteria, section: e.target.value })
                }
              >
                {sectionOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="as-checkbox">
            <input
              type="checkbox"
              checked={criteria.auto}
              onChange={(e) =>
                setCriteria({ ...criteria, auto: e.target.checked })
              }
            />
            <span>Generate Automatic Timetable</span>
          </div>

          <p className="as-note">
            Note: This action will overwrite your current timetable. Please
            ensure you take a backup beforehand.
          </p>

          <div className="as-actions-right">
            <button className="as-btn-primary">Search</button>
          </div>
        </div>

        {/* Assign Subject */}
        <div className="as-section">
          <div className="as-section-header">
            <h3 className="as-section-title">Assign Subject</h3>
            <div className="as-header-actions">
              <button className="as-btn-secondary">Reassign PreSession</button>
              <button className="as-btn-primary" onClick={addRow}>Add</button>
            </div>
          </div>

          <div className="as-table">
            {rows.map((row, index) => (
              <div className="as-row" key={row.id}>
                <div className="as-col small">{index + 1}</div>

                <div className="as-col">
                  <label>Optional Subject</label>
                  <select
                    value={row.optional}
                    onChange={(e) =>
                      updateRow(row.id, "optional", e.target.value === "true")
                    }
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div className="as-col">
                  <label>Subject</label>
                  <select
                    value={row.subject}
                    onChange={(e) =>
                      updateRow(row.id, "subject", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {subjectOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="as-col">
                  <label>Teacher</label>
                  <select
                    value={row.teacher}
                    onChange={(e) =>
                      updateRow(row.id, "teacher", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {teacherOptions.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="as-col action">
                  <button
                    className="as-btn-danger"
                    onClick={() => removeRow(row.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="as-actions-right">
            <button className="as-btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}