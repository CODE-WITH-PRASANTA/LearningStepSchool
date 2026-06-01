import React, { useState } from "react";
import "./StudentAttendanceReport.css";
import { FaSearch, FaDownload, FaList } from "react-icons/fa";

const StudentAttendanceReport = () => {
  const [form, setForm] = useState({
    class: "",
    section: "",
    month: "",
    year: "",
    filter: "",
  });

  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 4;

  const dummyData = [
    { name: "xyt" },
    { name: "xyz" },
    { name: "abc" },
    { name: "pqr" },
    { name: "stu" },
    { name: "lmn" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setShowTable(true);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(dummyData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentData = dummyData.slice(start, start + rowsPerPage);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ["WED", "THU", "FRI", "SAT", "SUN", "MON", "TUE"];

  return (
    <div className="attendanceReport">

      {/* ================= FORM ================= */}
      <div className="studentattendanceReport__cardBox">
        <div className="studentattendanceReport__title">
          🔍 Select Criteria
        </div>

        <div className="studentattendanceReport__form">

          {/* CLASS → INPUT (NO DROPDOWN) */}
          <div className="studentattendanceReport__field">
            <label>Class *</label>
            <input
              type="text"
              name="class"
              placeholder="Enter Class"
              onChange={handleChange}
            />
          </div>

          {/* SECTION → 10 OPTIONS */}
          <div className="studentattendanceReport__field">
            <label>Section *</label>
            <select name="section" onChange={handleChange}>
              <option value="">Select Section</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>E</option>
              <option>F</option>
              <option>G</option>
              <option>H</option>
              <option>I</option>
              <option>J</option>
            </select>
          </div>

          {/* MONTH → 12 MONTHS */}
          <div className="studentattendanceReport__field">
            <label>Month *</label>
            <select name="month" onChange={handleChange}>
              <option value="">Select Month</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>

          {/* YEAR → INPUT (NO DROPDOWN) */}
          <div className="studentattendanceReport__field">
            <label>Year</label>
            <input
              type="number"
              name="year"
              placeholder="Enter Year"
              onChange={handleChange}
            />
          </div>

          {/* FILTER */}
          <div className="studentattendanceReport__field">
            <label>Filter</label>
            <select name="filter" onChange={handleChange}>
              <option>Without Additional</option>
              <option>With Additional</option>
            </select>
          </div>

        </div>

        <div className="studentattendanceReport__actions">
          <button className="studentattendanceReport__btn secondary">
            <FaDownload /> Download Blank Pdf
          </button>

          <button
            className="studentattendanceReport__btn primary"
            onClick={handleSearch}
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {showTable && (
        <div className="studentattendanceReport__cardBox">
          <div className="studentattendanceReport__title">
            <FaList /> Student Attendance List
          </div>

          <div className="studentattendanceReport__tableWrapper">
            <table className="studentattendanceReport__table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>%</th>
                  <th>PRESENT (P)</th>
                  <th>LATE (LA)</th>
                  <th>LEAVE (L)</th>
                  <th>ABSENT (A)</th>
                  <th>HOLIDAY (H)</th>
                  <th>HALF DAY (F)</th>

                  {days.map((d, i) => (
                    <th key={d}>
                      {d}
                      <br />
                      {weekDays[i % 7]}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {currentData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>

                    {days.map((d) => (
                      <td key={d}>0</td>
                    ))}
                  </tr>
                ))}

                <tr className="studentattendanceReport__totalRow">
                  <td>Total Absent</td>
                  <td colSpan="7"></td>
                  {days.map((d) => (
                    <td key={d}>0</td>
                  ))}
                </tr>

                <tr className="studentattendanceReport__totalRow">
                  <td>Total Present</td>
                  <td colSpan="7"></td>
                  {days.map((d) => (
                    <td key={d}>0</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="studentattendanceReport__pagination">
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

export default StudentAttendanceReport;