import React, { useState } from "react";
import "./ReturnBook.css";
import { FaSearch, FaList, FaUndo } from "react-icons/fa";

export default function StudentListPage() {

  const [filters, setFilters] = useState({
    memberType: "All",
    status: "All",
    className: "All",
    section: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="student-page">

      {/* ===== SELECT CRITERIA ===== */}
      <section className="card-box">
        <div className="card-header">
          <h2><FaSearch /> Select Criteria</h2>
        </div>

        <div className="criteria-grid">

          {/* Member Type */}
          <div className="field">
            <label>Member Type *</label>
            <select name="memberType" value={filters.memberType} onChange={handleChange}>
              <option value="All">All</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {/* Additional Filter */}
          <div className="field">
            <label>Additional Filter</label>
            <select name="status" value={filters.status} onChange={handleChange}>
              <option value="All">All</option>
              <option value="Issued">Issued</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Class */}
          <div className="field">
            <label>Class</label>
            <select name="className" value={filters.className} onChange={handleChange}>
              <option value="All">All</option>
              {[...Array(10)].map((_, i) => (
                <option key={i+1} value={i+1}>
                  {i+1} {i===0 ? "st" : i===1 ? "nd" : i===2 ? "rd" : "th"}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div className="field">
            <label>Section</label>
            <select name="section" value={filters.section} onChange={handleChange}>
              <option value="">All</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>

          {/* Dates */}
          <div className="field">
            <label>Start Date</label>
            <input type="date" name="startDate" value={filters.startDate} onChange={handleChange}/>
          </div>

          <div className="field">
            <label>End Date</label>
            <input type="date" name="endDate" value={filters.endDate} onChange={handleChange}/>
          </div>

        </div>

        <div className="search-btn-wrap">
          <button className="search-btn">
            <FaSearch /> Search
          </button>
        </div>
      </section>

      {/* ===== STUDENT LIST ===== */}
      <section className="card-box">
        <div className="card-header">
          <h2><FaList /> Student List</h2>
        </div>

        <div className="table-top">
          <div></div>
          <div className="right-tools">
            <select>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <input placeholder="Search..." />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>STUDENT NAME</th>
                <th>BOOK TITLE</th>
                <th>ISBN NUMBER</th>
                <th>ISSUE DATE</th>
                <th>DUE DATE</th>
                <th>RETURN</th>
                <th>LATE FEES</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>ABHAY RAJ (NLET/ 5847)</td>
                <td>Hum Hindu Hai</td>
                <td>2234</td>
                <td>15-01-2026</td>
                <td>17-01-2026</td>
                <td>
                  <button className="return-btn">
                    <FaUndo /> Return
                  </button>
                </td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>Showing 1 to 1 of 1 entries</p>

          <div className="pagination">
            <button disabled>Previous</button>
            <button className="active">1</button>
            <button disabled>Next</button>
          </div>
        </div>
      </section>

    </div>
  );
}