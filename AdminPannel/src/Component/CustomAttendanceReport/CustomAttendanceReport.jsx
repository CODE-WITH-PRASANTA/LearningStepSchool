import React, { useState } from "react";
import "./CustomAttendanceReport.css";
import { FaSearch, FaDownload, FaList } from "react-icons/fa";

const CustomAttendanceReport = () => {
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 6;

  const dummyData = [
    { name: "Rahul", admission: "A001", roll: 1, class: "4th" },
    { name: "Amit", admission: "A002", roll: 2, class: "4th" },
    { name: "Riya", admission: "A003", roll: 3, class: "4th" },
    { name: "Sita", admission: "A004", roll: 4, class: "4th" },
    { name: "Karan", admission: "A005", roll: 5, class: "4th" },
    { name: "Neha", admission: "A006", roll: 6, class: "4th" },
    { name: "Raj", admission: "A007", roll: 7, class: "4th" },
  ];

  const totalPages = Math.ceil(dummyData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentData = dummyData.slice(start, start + rowsPerPage);

  return (
    <div className="customAttendanceReport">

      {/* ================= SELECT CRITERIA ================= */}
      <div className="customAttendanceReport__card">
        <div className="customAttendanceReport__title">
          🔍 Select Criteria
        </div>

        <div className="customAttendanceReport__form">
          <div className="customAttendanceReport__field">
            <label>Class *</label>
            <select>
              <option>1st</option><option>2nd</option><option>3rd</option>
              <option>4th</option><option>5th</option><option>6th</option>
              <option>7th</option><option>8th</option><option>9th</option>
            </select>
          </div>

          <div className="customAttendanceReport__field">
            <label>Section</label>
            <select>
              <option>A</option><option>B</option><option>C</option>
              <option>D</option><option>E</option><option>F</option>
              <option>G</option><option>H</option>
            </select>
          </div>

          <div className="customAttendanceReport__field">
            <label>Start Date 📅</label>
            <input type="date" />
          </div>

          <div className="customAttendanceReport__field">
            <label>End Date 📅</label>
            <input type="date" />
          </div>
        </div>

        <div className="customAttendanceReport__note">
          Note : For Export Only Class is Mandatory to select.
        </div>

        <div className="customAttendanceReport__actions">
          <button className="export">
            <FaDownload /> Export Excel
          </button>

          <button
            className="search"
            onClick={() => setShowTable(true)}
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {showTable && (
        <div className="customAttendanceReport__card">

          <div className="customAttendanceReport__title">
            <FaList /> Student Attendance List
          </div>

          {/* TOOLBAR */}
          <div className="customAttendanceReport__toolbar">
            <div>
              <button>📄</button>
              <button>📊</button>
              <button>🖨</button>
              <button className="dropdown">Column visibility ▼</button>
            </div>

            <div className="customAttendanceReport__right">
              <select><option>10</option></select>
              <input placeholder="Search:" />
            </div>
          </div>

          <div className="customAttendanceReport__tableWrapper">
            <table className="customAttendanceReport__table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>ADMISSION NO</th>
                  <th>ROLL NO</th>
                  <th>CLASS</th>
                  <th>%</th>
                  <th>PRESENT (P)</th>
                  <th>LATE (LA)</th>
                  <th>LEAVE (L)</th>
                  <th>ABSENT (A)</th>
                  <th>HOLIDAY (H)</th>
                  <th>HALF DAY (F)</th>
                  <th>5 MAY TUE</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{row.admission}</td>
                    <td>{row.roll}</td>
                    <td>{row.class}</td>
                    <td>0</td><td>0</td><td>0</td><td>0</td>
                    <td>0</td><td>0</td><td>0</td><td>0</td>
                  </tr>
                ))}

                <tr className="customAttendanceReport__total">
                  <td>TOTAL</td>
                  <td colSpan="10"></td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="customAttendanceReport__pagination">
            <div className="customAttendanceReport__paginationInfo">
              Showing {start + 1} to{" "}
              {Math.min(start + rowsPerPage, dummyData.length)} of{" "}
              {dummyData.length} entries
            </div>

            <div className="customAttendanceReport__paginationControls">
              <button
                className="paginationBtn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`paginationBtn ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="paginationBtn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CustomAttendanceReport;