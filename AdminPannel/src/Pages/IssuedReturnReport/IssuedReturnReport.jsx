import React, { useState } from "react";
import "./IssuedReturnReport.css";

const dummyData = [
  {
    id: 1,
    student: "ABHAY RAJ (NLET/5847)",
    book: "Java",
    isbn: "54",
    issue: "15-01-2026",
    due: "17-01-2026",
    returnDate: "",
    lateFees: 0,
  },
  {
    id: 2,
    student: "ABHAY RAJ (NLET/5847)",
    book: "Hum Hindu Hai",
    isbn: "2234",
    issue: "15-01-2026",
    due: "17-01-2026",
    returnDate: "",
    lateFees: 0,
  },
];

export default function IssuedReturnReport() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(dummyData);

  const handleReturn = (id) => {
    const updated = data.map((item) =>
      item.id === id
        ? { ...item, returnDate: new Date().toLocaleDateString() }
        : item
    );
    setData(updated);
  };

  const filtered = data.filter((d) =>
    d.student.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="report-page">

      {/* HEADER */}
      <div className="report-header">
        <h2>📘 Issued Return Report</h2>
        <span>Library / Issued Return Report</span>
      </div>

      {/* SELECT CRITERIA */}
      <div className="report-card">
        <div className="report-card-header">
          🔍 Select Criteria
        </div>

        <div className="report-card-body">
          <div className="report-grid">

            <div>
              <label>Member Type *</label>
              <select>
                <option>Student</option>
                <option>Staff</option>
              </select>
            </div>

            <div>
              <label>Additional Filter</label>
              <select>
                <option>Issued</option>
                <option>Returned</option>
              </select>
            </div>

            <div>
              <label>Class</label>
              <select>
                <option>Select Class</option>
                <option>6th(A)</option>
              </select>
            </div>

            <div>
              <label>Section</label>
              <select>
                <option>Select Section</option>
                <option>A</option>
              </select>
            </div>

            <div>
              <label>Start Date</label>
              <input type="date" />
            </div>

            <div>
              <label>End Date</label>
              <input type="date" />
            </div>

          </div>

          <div className="report-btn-wrap">
            <button className="btn-primary">🔍 Search</button>
          </div>
        </div>
      </div>

      {/* STUDENT LIST */}
      <div className="report-card">
        <div className="report-card-header">
          📋 Student List
        </div>

        <div className="report-toolbar">
          <div>
            Search:
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>STUDENT NAME</th>
                <th>BOOK TITLE</th>
                <th>ISBN NUMBER</th>
                <th>ISSUE DATE</th>
                <th>DUE DATE</th>
                <th>RETURN DATE</th>
                <th>LATE FEES</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.student}</td>
                  <td>{row.book}</td>
                  <td>{row.isbn}</td>
                  <td>{row.issue}</td>
                  <td>{row.due}</td>
                  <td>
                    {row.returnDate ? (
                      row.returnDate
                    ) : (
                      <button
                        className="btn-primary small-btn"
                        onClick={() => handleReturn(row.id)}
                      >
                        ↩ Return
                      </button>
                    )}
                  </td>
                  <td>{row.lateFees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="report-footer">
          Showing {filtered.length} entries
        </div>
      </div>

    </div>
  );
}
