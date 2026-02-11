import React, { useState } from "react";
import "./Studentleave.css";
import { Link } from "react-router-dom";



const StudentLeaveList = () => {
  const [search, setSearch] = useState("");

  const data = [
    {
      name: "Kapil",
      class: "5th-A",
      applyDate: "06-02-2026",
      days: "5 Days",
      leaveDate: "07-02-2026 - 11-02-2026",
      status: "Rejected",
      reply: "there is FA test on these date I dont suggest you to go",
      description: "I am going out of town.",
    },
    {
      name: "Karan Aswani",
      class: "6th-A",
      applyDate: "18-01-2026",
      days: "1 Day",
      leaveDate: "19-01-2026 - 19-01-2026",
      status: "Approved",
      reply: "leave application approved",
      description: "bimar",
    },
    {
      name: "Test Student",
      class: "9th-A",
      applyDate: "17-01-2026",
      days: "1 Day",
      leaveDate: "17-01-2026 - 17-01-2026",
      status: "Approved",
      reply: "",
      description: "wdw",
    },
  ];

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="leave-container">
      {/* ===== HEADER ===== */}
      <div className="leave-header">
        <h2>📋 Student Leave List</h2>
<Link to="/attendance/student-leave/add" className="leave-header-link">
  <h3 className="leave-header">✏️ Add / Edit Leave</h3>
</Link>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="leave-toolbar">
        <div className="left-tools">
          <button>📄</button>
          <button>📑</button>
          <button>🖨</button>
          <button>📊</button>
          <button className="column-btn">Column visibility ⌄</button>
        </div>

        <div className="right-tools">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>

          <label>
            Search:
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="table-scroll">
        <table className="leave-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>CLASS</th>
              <th>APPLY DATE</th>
              <th>NO OF DAYS</th>
              <th>LEAVE DATE</th>
              <th>STATUS</th>
              <th>REPLY</th>
              <th>DESCRIPTION</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{row.name}</td>
                <td>{row.class}</td>
                <td>{row.applyDate}</td>
                <td>{row.days}</td>
                <td>{row.leaveDate}</td>
                <td
                  className={
                    row.status === "Approved"
                      ? "status approved"
                      : "status rejected"
                  }
                >
                  {row.status}
                </td>
                <td>{row.reply}</td>
                <td>{row.description}</td>
                <td>
                  <button className="action-btn">Action</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentLeaveList;
