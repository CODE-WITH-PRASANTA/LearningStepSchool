import React, { useState, useEffect } from "react";
import "./AddStudent.css";

const dummyData = [
  {
    id: 1,
    libraryCard: "2322212004",
    admission: "2322212004",
    name: "ABC",
    class: "KSV 6th(A)",
    father: "Raj",
    dob: "2001-09-30",
    gender: "Male",
    maxBook: "5",
  },
  {
    id: 2,
    libraryCard: "2322212019",
    admission: "2322212019",
    name: "S GANESH",
    class: "KSV 6th(A)",
    father: "RAJ",
    dob: "2020-03-24",
    gender: "Male",
    maxBook: "5",
  },
];

export default function AddStudent() {
  const [formData, setFormData] = useState({
    className: "1st",
    section: "",
    gender: "",
  });

  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const close = () => setOpenAction(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const filteredData = dummyData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <h2>👤 Add Student</h2>
        <span>Library / Add Student</span>
      </div>

      {/* SELECT CRITERIA */}
      <div className="admin-card">
        <div className="admin-card-header">
          🔍 Select Criteria
          <button className="bulk-btn">
            Bulk Member Id Update
          </button>
        </div>

        <div className="admin-card-body">
          <div className="admin-grid">

            <div className="admin-group">
              <label>Class *</label>
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
              >
                <option>1st</option>
                <option>2nd</option>
                <option>6th(A)</option>
              </select>
            </div>

            <div className="admin-group">
              <label>Section *</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
              >
                <option>Select</option>
                <option>A</option>
                <option>B</option>
              </select>
            </div>

            <div className="admin-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

          </div>

          <div className="admin-btn-wrap">
            <button className="admin-btn-primary">
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* STUDENT LIST */}
      <div className="admin-card">
        <div className="admin-card-header">
          📋 Add Student List
        </div>

        <div className="admin-toolbar">
          <div>
            Search:
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>LIBRARY CARD NO</th>
                <th>ADMISSION NO.</th>
                <th>STUDENT NAME</th>
                <th>CLASS</th>
                <th>FATHER NAME</th>
                <th>DATE OF BIRTH</th>
                <th>GENDER</th>
                <th>MAXIMUM BOOK ALLOWED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((s) => (
                <tr key={s.id}>
                  <td>{s.libraryCard}</td>
                  <td>{s.admission}</td>
                  <td>{s.name}</td>
                  <td>{s.class}</td>
                  <td>{s.father}</td>
                  <td>{s.dob}</td>
                  <td>{s.gender}</td>
                  <td>{s.maxBook}</td>

                  <td className="admin-action-cell">
                    <button
                      className="admin-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAction(openAction === s.id ? null : s.id);
                      }}
                    >
                      Action ▾
                    </button>

                    {openAction === s.id && (
                      <div className="admin-action-menu">
                        <div>View</div>
                        <div>Edit</div>
                        <div>Delete</div>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
