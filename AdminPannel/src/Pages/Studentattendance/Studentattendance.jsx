import React, { useState, useEffect } from "react";
import "./Studentattendance.css";

const StudentAttendance = () => {

  /* ================= FORM STATE ================= */
  const [criteria, setCriteria] = useState({
    class: "",
    section: "",
    attendance: "",
    date: ""
  });

  const [search, setSearch] = useState("");

  /* ================= SAMPLE DATA ================= */
  const students = Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    admission: `ADM00${i + 1}`,
    roll: `${i + 1}`,
    name: ["Rahul Sharma", "Priya Das", "Amit Roy"][i % 3],
    attendance: ["Present", "Absent", "Leave"][i % 3],
    note: ""
  }));

  const [data, setData] = useState(students);

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  /* ================= HANDLERS ================= */

  const handleAttendanceChange = (id, value) => {
    setData(prev =>
      prev.map(s =>
        s.id === id ? { ...s, attendance: value } : s
      )
    );
  };

  /* SEARCH FILTER */
  const filtered = data.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  /* RESET PAGE WHEN SEARCH */
  useEffect(() => {
    setCurrentPage;
  }, [search]);

  /* PAGINATION CALCULATION */
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentRows = filtered.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const saveAttendance = () => {
    alert("Attendance Saved Successfully ✅");
  };

  return (
    <div className="StudentAttendance-container">

      {/* ================= SELECT CRITERIA ================= */}
      <div className="StudentAttendance-card">

        <div className="StudentAttendance-cardHeader">
          🔎 Select Criteria
          <button className="StudentAttendance-btnPrimary">
            Mark Holiday Range
          </button>
        </div>

        <div className="StudentAttendance-formGrid">

          <div>
            <label>Class *</label>
            <select
              value={criteria.class}
              onChange={(e)=>setCriteria({...criteria,class:e.target.value})}
            >
              <option value="">Select Class</option>
              <option>KSV 5th</option>
              <option>KSV 6th</option>
              <option>KSV 7th</option>
            </select>
          </div>

          <div>
            <label>Section *</label>
            <select
              value={criteria.section}
              onChange={(e)=>setCriteria({...criteria,section:e.target.value})}
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>

          <div>
            <label>Attendance</label>
            <select
              value={criteria.attendance}
              onChange={(e)=>setCriteria({...criteria,attendance:e.target.value})}
            >
              <option>All</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Leave</option>
            </select>
          </div>

          <div>
            <label>Attendance Date</label>
            <input
              type="date"
              value={criteria.date}
              onChange={(e)=>setCriteria({...criteria,date:e.target.value})}
            />
          </div>

        </div>

        <div className="StudentAttendance-searchRow">
          <button className="StudentAttendance-btnSearch">
            🔍 Search
          </button>
        </div>
      </div>

      {/* ================= ATTENDANCE TABLE ================= */}
      <div className="StudentAttendance-card">

        <div className="StudentAttendance-cardHeader">
          📋 Student Attendance List

          <div className="StudentAttendance-headerBtns">
            <button onClick={saveAttendance}>
              Save Attendance
            </button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="StudentAttendance-toolbar">
          <div>
            Search :
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="StudentAttendance-tableWrapper">
          <table className="StudentAttendance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ADMISSION NO.</th>
                <th>ROLL NUMBER</th>
                <th>NAME</th>
                <th>ATTENDANCE</th>
                <th>NOTE</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="StudentAttendance-empty">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentRows.map((s, i) => (
                  <tr key={s.id}>
                    <td>{startIndex + i + 1}</td>
                    <td>{s.admission}</td>
                    <td>{s.roll}</td>
                    <td>{s.name}</td>

                    <td>
                      <select
                        value={s.attendance}
                        onChange={(e)=>
                          handleAttendanceChange(s.id,e.target.value)
                        }
                      >
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Leave</option>
                      </select>
                    </td>

                    <td>
                      <input
                        value={s.note}
                        onChange={(e)=>{
                          setData(prev =>
                            prev.map(st =>
                              st.id === s.id
                                ? {...st,note:e.target.value}
                                : st
                            )
                          );
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="StudentAttendance-footer">
          Showing {currentRows.length} of {filtered.length} entries
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="StudentAttendance-pagination">

          <button
            className="page-nav"
            disabled={currentPage === 1}
            onClick={()=>setCurrentPage(p=>p-1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_,index)=>(
            <button
              key={index}
              className={`page-number ${
                currentPage===index+1 ? "active": ""
              }`}
              onClick={()=>setCurrentPage(index+1)}
            >
              {index+1}
            </button>
          ))}

          <button
            className="page-nav"
            disabled={currentPage === totalPages}
            onClick={()=>setCurrentPage(p=>p+1)}
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default StudentAttendance;
