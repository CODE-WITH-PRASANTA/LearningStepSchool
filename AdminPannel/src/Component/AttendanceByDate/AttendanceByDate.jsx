import React, { useState } from "react";
import "./AttendanceByDate.css";
import { FaSearch, FaList } from "react-icons/fa";

const AttendanceByDate = () => {
  const [form, setForm] = useState({
    class: "",
    section: "",
    date: "",
  });

  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 4;

  const dummyData = [
    { admission: "A001", class: "3rd", roll: "1", name: "Rahul", status: "Present" },
    { admission: "A002", class: "3rd", roll: "2", name: "Amit", status: "Absent" },
    { admission: "A003", class: "3rd", roll: "3", name: "Riya", status: "Present" },
    { admission: "A004", class: "3rd", roll: "4", name: "Sita", status: "Late" },
    { admission: "A005", class: "3rd", roll: "5", name: "Karan", status: "Present" },
    { admission: "A006", class: "3rd", roll: "6", name: "Neha", status: "Absent" },
  ];

  const handleSearch = () => {
    setShowTable(true);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(dummyData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentData = dummyData.slice(start, start + rowsPerPage);

  return (
    <div className="attendanceByDate">

      {/* ================= SELECT CRITERIA ================= */}
      <div className="attendanceByDate__card">
        <div className="attendanceByDate__title">
          🔍 Select Criteria
        </div>

        <div className="attendanceByDate__form">

          {/* CLASS */}
          <div className="attendanceByDate__field">
            <label>Class</label>
            <select>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
              <option>5th</option>
              <option>6th</option>
              <option>7th</option>
              <option>8th</option>
              <option>9th</option>
            </select>
          </div>

          {/* SECTION */}
          <div className="attendanceByDate__field">
            <label>Section</label>
            <select>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>E</option>
              <option>F</option>
              <option>G</option>
              <option>H</option>
            </select>
          </div>

          {/* DATE */}
          <div className="attendanceByDate__field">
            <label>Attendance Date 📅</label>
            <input
              type="date"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

        </div>

        <div className="attendanceByDate__actions">
          <button
            className="attendanceByDate__btn"
            onClick={handleSearch}
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {showTable && (
        <div className="attendanceByDate__card">
          <div className="attendanceByDate__title">
            <FaList /> Student Attendance List
          </div>

          {/* TOOLBAR */}
          <div className="attendanceByDate__toolbar">
            <div className="attendanceByDate__left">
              <button>📄</button>
              <button>📊</button>
              <button>🖨</button>
              <button className="attendanceByDate__dropdown">
                Column visibility ▼
              </button>
            </div>

            <div className="attendanceByDate__right">
              <select>
                <option>25</option>
                <option>50</option>
              </select>

              <input type="text" placeholder="Search:" />
            </div>
          </div>

          <div className="attendanceByDate__tableWrapper">
            <table className="attendanceByDate__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ADMISSION NUMBER</th>
                  <th>CLASS</th>
                  <th>ROLL NUMBER</th>
                  <th>NAME</th>
                  <th>ATTENDANCE</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="6">No data available in table</td>
                  </tr>
                ) : (
                  currentData.map((row, i) => (
                    <tr key={i}>
                      <td>{start + i + 1}</td>
                      <td>{row.admission}</td>
                      <td>{row.class}</td>
                      <td>{row.roll}</td>
                      <td>{row.name}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="attendanceByDate__pagination">
            <span>
              Showing {start + 1} to{" "}
              {Math.min(start + rowsPerPage, dummyData.length)} of{" "}
              {dummyData.length} entries
            </span>

            <div>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              <button className="active">{currentPage}</button>

              <button
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

export default AttendanceByDate;