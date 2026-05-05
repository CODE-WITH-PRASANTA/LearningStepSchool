import React, { useState } from "react";
import "./AbsentStudent.css";
import { FaSearch, FaList } from "react-icons/fa";

const AbsentStudent = () => {
  const [form, setForm] = useState({
    class: "",
    section: "",
  });

  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 4;

  const dummyData = [
    {
      admission: "A001",
      roll: "1",
      absentFrom: "01-05-2026",
      name: "Rahul",
      class: "6th",
      father: "Ramesh",
      phone: "9876543210",
    },
    {
      admission: "A002",
      roll: "2",
      absentFrom: "02-05-2026",
      name: "Amit",
      class: "6th",
      father: "Suresh",
      phone: "9876543211",
    },
    {
      admission: "A003",
      roll: "3",
      absentFrom: "03-05-2026",
      name: "Riya",
      class: "6th",
      father: "Mahesh",
      phone: "9876543212",
    },
    {
      admission: "A004",
      roll: "4",
      absentFrom: "04-05-2026",
      name: "Sita",
      class: "6th",
      father: "Dinesh",
      phone: "9876543213",
    },
    {
      admission: "A005",
      roll: "5",
      absentFrom: "05-05-2026",
      name: "Karan",
      class: "6th",
      father: "Naresh",
      phone: "9876543214",
    },
  ];

  const handleSearch = () => {
    setShowTable(true);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(dummyData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentData = dummyData.slice(start, start + rowsPerPage);

  return (
    <div className="absentStudent">

      {/* ================= SELECT CRITERIA ================= */}
      <div className="absentStudent__card">
        <div className="absentStudent__title">
          🔍 Select Criteria
        </div>

        <div className="absentStudent__form">

          {/* CLASS */}
          <div className="absentStudent__field">
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
          <div className="absentStudent__field">
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

        </div>

        <div className="absentStudent__actions">
          <button
            className="absentStudent__btn"
            onClick={handleSearch}
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {showTable && (
        <div className="absentStudent__card">
          <div className="absentStudent__titleRow">
            <div className="absentStudent__title">
              <FaList /> Absent Student Report List
            </div>
            <div className="absentStudent__note">
              *Report only shows students who are absent from last 0 days continuously.
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="absentStudent__toolbar">
            <div>
              <button>📄</button>
              <button>📊</button>
              <button>🖨</button>
              <button className="absentStudent__dropdown">
                Column visibility ▼
              </button>
            </div>

            <div className="absentStudent__right">
              <select>
                <option>10</option>
                <option>25</option>
              </select>
              <input type="text" placeholder="Search:" />
            </div>
          </div>

          <div className="absentStudent__tableWrapper">
            <table className="absentStudent__table">
              <thead>
                <tr>
                  <th>ADMISSION NUMBER</th>
                  <th>ROLL NUMBER</th>
                  <th>ABSENT FROM</th>
                  <th>NAME</th>
                  <th>CLASS</th>
                  <th>FATHER NAME</th>
                  <th>FATHER PHONE</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="7">No data available in table</td>
                  </tr>
                ) : (
                  currentData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.admission}</td>
                      <td>{row.roll}</td>
                      <td>{row.absentFrom}</td>
                      <td>{row.name}</td>
                      <td>{row.class}</td>
                      <td>{row.father}</td>
                      <td>{row.phone}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="absentStudent__pagination">
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

export default AbsentStudent;