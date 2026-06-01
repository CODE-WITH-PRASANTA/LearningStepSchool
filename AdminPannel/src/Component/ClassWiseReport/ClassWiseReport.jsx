import React, { useState } from "react";
import "./ClassWiseReport.css";
import { FaSearch, FaList } from "react-icons/fa";

const ClassWiseReport = () => {
  const [date, setDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 4;

  const dummyData = [
    { class: "6th", section: "A" },
    { class: "6th", section: "B" },
    { class: "7th", section: "A" },
    { class: "7th", section: "B" },
    { class: "8th", section: "A" },
    { class: "8th", section: "B" },
  ];

  const handleSearch = () => {
    setShowTable(true);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(dummyData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentData = dummyData.slice(start, start + rowsPerPage);

  return (
    <div className="classWiseReport">

      {/* ================= SELECT CRITERIA ================= */}
      <div className="classWiseReport__card">
        <div className="classWiseReport__title">
          🔍 Select Criteria
        </div>

        <div className="classWiseReport__form">
          <div className="classWiseReport__field">
            <label>Attendance Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="classWiseReport__actions">
          <button
            className="classWiseReport__btn"
            onClick={handleSearch}
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {showTable && (
        <div className="classWiseReport__card">
          <div className="classWiseReport__title">
            <FaList /> Class Wise Report List
          </div>

          <div className="classWiseReport__tableWrapper">
            <table className="classWiseReport__table">
              <thead>
                <tr>
                  <th>CLASS</th>
                  <th>SECTION</th>
                  <th>PRESENT</th>
                  <th>LATE</th>
                  <th>LEAVE</th>
                  <th>ABSENT</th>
                  <th>HOLIDAY</th>
                  <th>HALF DAY</th>
                  <th>TOTAL</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="9">No data available in table</td>
                  </tr>
                ) : (
                  currentData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.class}</td>
                      <td>{row.section}</td>
                      <td>20</td>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>1</td>
                      <td>0</td>
                      <td>27</td>
                    </tr>
                  ))
                )}

                {/* TOTAL ROW */}
                <tr className="classWiseReport__total">
                  <td colSpan="2">TOTAL</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="classWiseReport__pagination">
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

export default ClassWiseReport;