import React, { useState } from "react";
import "./Assesment.css";

const studentData = [
  { admission: "2322212004", name: "abc" },
  { admission: "NLET / 125", name: "RIDVI" },
  { admission: "NLET / 2025", name: "devesh" },
  { admission: "NLET / 5556", name: "Daksh" },
  { admission: "NLET / 5575", name: "NAMAN" },
  { admission: "NLET / 20620", name: "Hetashvi Choudhary" },
  { admission: "NLET / 45454", name: "lakh asda" },
  { admission: "test 2322212019", name: "S GANESH" },
];

export default function Assessment() {
  const [criteria, setCriteria] = useState({
    className: "",
    section: "B",
    subject: "English",
    term: "UNIT TEST",
  });

  const [search, setSearch] = useState("");
  const [showData, setShowData] = useState(false);

  const handleSearch = () => {
    setShowData(true);
  };

  const filteredStudents = studentData.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admission.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ass-page">
      {/* HEADER */}
      <div className="ass-header">
        <h2>📄 Assessment</h2>
        <span>Primary Evaluation / Assessment</span>
      </div>

      {/* SELECT CRITERIA */}
      <div className="ass-card ass-criteria">
        <h3>🔍 Select Criteria</h3>

        <div className="ass-grid">
          {/* CLASS DROPDOWN */}
          <div>
            <label>Class *</label>
            <select
              value={criteria.className}
              onChange={(e) =>
                setCriteria({ ...criteria, className: e.target.value })
              }
              className={
                criteria.className === "" ? "ass-placeholder" : ""
              }
            >
              <option value="" disabled>
                Select Class
              </option>
              <option>KSV 6th</option>
              <option>KSV 7th</option>
              <option>KSV 8th</option>
            </select>
          </div>

          <div>
            <label>Section *</label>
            <select
              value={criteria.section}
              onChange={(e) =>
                setCriteria({ ...criteria, section: e.target.value })
              }
            >
              <option>A</option>
              <option>B</option>
            </select>
          </div>

          <div>
            <label>Subject *</label>
            <select
              value={criteria.subject}
              onChange={(e) =>
                setCriteria({ ...criteria, subject: e.target.value })
              }
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          <div>
            <label>Term</label>
            <select
              value={criteria.term}
              onChange={(e) =>
                setCriteria({ ...criteria, term: e.target.value })
              }
            >
              <option>UNIT TEST</option>
              <option>RBSE EXAM</option>
            </select>
          </div>
        </div>

        <div className="ass-search-btn-wrap">
          <button onClick={handleSearch}>🔍 Search</button>
        </div>
      </div>

      {/* STUDENT TABLE */}
      {showData && (
        <div className="ass-card ass-table-card">
          <h3>✏️ Add Student Assessment</h3>

          <div className="ass-table-toolbar">
            <button className="ass-column-btn">
              Column visibility ▾
            </button>

            <div className="ass-search">
              Search:
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ass-table-wrap">
            <table className="ass-table">
              <thead>
                <tr>
                  <th>ADMISSION</th>
                  <th>STUDENT NAME</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={i}>
                    <td>{s.admission}</td>
                    <td>{s.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ass-footer">
            Showing 1 to {filteredStudents.length} of{" "}
            {filteredStudents.length} entries
          </div>
        </div>
      )}
    </div>
  );
}
