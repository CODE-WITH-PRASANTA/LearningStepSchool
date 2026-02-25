import React, { useState } from "react";
import "./Generate.css";
import { Link } from "react-router-dom";

const Generate = () => {
  const [filters, setFilters] = useState({
    class: "",
    subject: "",
    session: "2025-26",
  });

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const dummyData = [
    { id: 1, title: ",mfkmkf", class: "KSV 6th", subject: "English", session: "2024-25", marks: "2", time: "30" },
    { id: 2, title: "Mid Term A", class: "KSV 7th", subject: "Maths", session: "2025-26", marks: "50", time: "90" },
    { id: 3, title: "Unit Test 2", class: "KSV 8th", subject: "Science", session: "2025-26", marks: "25", time: "45" },
  ];

  const handleInputChange = (e, field) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="container">
      {/* Header Navigation */}
      <div className="headerNav">
        <div className="leftNav">
          <span className="iconPaper">📄</span>
          <h2 className="mainTitle">Paper</h2>
        </div>
        <div className="rightNav">
          <span className="navLinkActive">📝 Question Paper</span>
          <span className="navSeparator">/</span>
          <span className="navLink">Paper List</span>
        </div>
      </div>

      {/* Filter Card */}
      <div className="card">
        <div className="cardHeader">
          <div className="titleGroup">
            <span className="icon">🔍</span>
            <h3 className="cardTitle">Select Criteria</h3>
          </div>

       <Link to="/generate-question">  <button className="addButton">+ Add</button> </Link>  

        </div>

        <div className="filterRow">
          <div className="inputGroup">
            <label>Class <span className="required">*</span></label>
            <select value={filters.class} onChange={(e) => handleInputChange(e, "class")} className="selectInput">
              <option value="">Select</option>
              <option value="6th">KSV 6th</option>
              <option value="7th">KSV 7th</option>
            </select>
          </div>
          <div className="inputGroup">
            <label>Subject</label>
            <select value={filters.subject} onChange={(e) => handleInputChange(e, "subject")} className="selectInput">
              <option value="">Select</option>
              <option value="English">English</option>
              <option value="Maths">Maths</option>
            </select>
          </div>
          <div className="inputGroup">
            <label>Session</label>
            <select value={filters.session} onChange={(e) => handleInputChange(e, "session")} className="selectInput">
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </select>
          </div>
        </div>
        <div className="searchActionRow">
          <button className="searchBtn">🔍 Search</button>
        </div>
      </div>

      {/* List Card */}
      <div className="card">
        <div className="cardHeaderList">
          <div className="titleGroup">
            <span className="icon">📋</span>
            <h3 className="cardTitle">Question Paper List</h3>
          </div>
        </div>

        <div className="tableControls">
          {/* Export buttons removed from here */}
          <div className="tableSettings">
            <div className="searchBox">
              <label>Search: </label>
              <input type="text" className="searchInputField" />
            </div>
          </div>
        </div>

        <div className="tableWrapper">
          <table className="customTable">
            <thead>
              <tr>
                <th>TITLE ⇵</th>
                <th>CLASS ⇵</th>
                <th>SUBJECT ⇵</th>
                <th>SESSION ⇵</th>
                <th>MARKS ⇵</th>
                <th>TIME ⇵</th>
                <th className="actionHeader">ACTION ⇵</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((row) => (
                <tr key={row.id}>
                  <td>{row.title}</td>
                  <td>{row.class}</td>
                  <td>{row.subject}</td>
                  <td>{row.session}</td>
                  <td>{row.marks}</td>
                  <td>{row.time}</td>
                  <td>
                    <div className="actionContainer">
                      <button className="actionButton" onClick={() => toggleDropdown(row.id)}>
                        Action ▾
                      </button>
                      {openDropdownId === row.id && (
                        <div className="dropdownMenu">
                          <div className="dropdownItem">👁️ View</div>
                          <div className="dropdownItem">✏️ Edit</div>
                          <div className="dropdownItem delete">🗑️ Delete</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Generate;