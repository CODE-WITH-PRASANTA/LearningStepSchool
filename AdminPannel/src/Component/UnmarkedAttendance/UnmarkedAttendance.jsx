import React, { useState } from "react";
import "./UnmarkedAttendance.css";
import { FaSearch, FaList } from "react-icons/fa";

const UnmarkedAttendance = () => {
  const [date, setDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 4;

  const dummyData = [
    { class: "1st", section: ["B", "A"] },
    { class: "1st year", section: ["CSE-2"] },
    { class: "3rd", section: ["A", "Comm"] },
    { class: "4th", section: ["B", "A"] },
    { class: "5th", section: ["A"] },
    { class: "6th", section: ["A", "B"] },
    { class: "7th", section: ["A", "C"] },
    { class: "8th", section: ["A"] },
    { class: "9th", section: ["A"] },
    { class: "All", section: ["Piano"] },
  ];

  const handleSearch = () => {
    setShowTable(true);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(dummyData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentData = dummyData.slice(start, start + rowsPerPage);

  return (
    <div className="unmarkedAttendance">

      {/* ================= SELECT CRITERIA ================= */}
      <div className="unmarkedAttendance__card">
        <div className="unmarkedAttendance__title">
          🔍 Select Criteria
        </div>

        <div className="unmarkedAttendance__form">
          <div className="unmarkedAttendance__field">
            <label>Attendance Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="unmarkedAttendance__actions">
          <button
            className="unmarkedAttendance__btn"
            onClick={handleSearch}
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {showTable && (
        <div className="unmarkedAttendance__card">
          <div className="unmarkedAttendance__title">
            <FaList /> Unmarked Class Wise Report List
          </div>

          {/* TOOLBAR */}
          <div className="unmarkedAttendance__toolbar">
            <div>
              <button>📄</button>
              <button>📊</button>
              <button>🖨</button>
              <button className="unmarkedAttendance__dropdown">
                Column visibility ▼
              </button>
            </div>

            <div className="unmarkedAttendance__right">
              <select>
                <option>10</option>
                <option>25</option>
              </select>
              <input type="text" placeholder="Search:" />
            </div>
          </div>

          <div className="unmarkedAttendance__tableWrapper">
            <table className="unmarkedAttendance__table">
              <thead>
                <tr>
                  <th>CLASS</th>
                  <th>SECTION</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.class}</td>
                    <td>
                      {row.section.map((sec, index) => (
                        <div key={index}>{sec}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="unmarkedAttendance__pagination">
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

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

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

export default UnmarkedAttendance;