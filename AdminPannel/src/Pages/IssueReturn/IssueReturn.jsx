import React, { useState, useEffect } from "react";
import "./IssueReturn.css";

const dummyStudents = [
  {
    id: 1,
    name: "ABHAY RAJ",
    father: "JAMUNA PRASAD",
    class: "5th(A)",
    admission: "5847",
    phone: "6396548562",
    member: "166",
    card: "5847",
    maxBook: "5",
  },
  {
    id: 2,
    name: "Akshay",
    father: "Akshayhhh",
    class: "5th(A)",
    admission: "995588",
    phone: "3445654326",
    member: "200",
    card: "995588",
    maxBook: "5",
  },
];

export default function IssueReturn() {
  const [formData, setFormData] = useState({
    memberType: "Student",
    admissionNo: "",
    className: "",
    section: "",
  });

  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const closeMenu = () => setOpenAction(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const filteredStudents = dummyStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="issue-page">

      {/* PAGE HEADER */}
      <div className="issue-header">
        <h2>← Issue Return</h2>
        <span>Library / Issue Return</span>
      </div>

      {/* SELECT CRITERIA */}
      <div className="issue-card">
        <div className="issue-card-header">
          🔍 Select Criteria
        </div>

        <div className="issue-card-body">

          <div className="issue-grid">

            <div className="issue-group">
              <label>Member Type *</label>
              <select
                name="memberType"
                value={formData.memberType}
                onChange={handleChange}
              >
                <option>Student</option>
                <option>Teacher</option>
              </select>
            </div>

            <div className="issue-group">
              <label>Student</label>
              <input
                type="text"
                name="admissionNo"
                placeholder="Please Enter Admission No"
                onChange={handleChange}
              />
            </div>

            <div className="issue-group">
              <label>Class</label>
              <select name="className" onChange={handleChange}>
                <option>Select Class</option>
                <option>3rd(A)</option>
                <option>4th(A)</option>
                <option>5th(A)</option>
              </select>
            </div>

            <div className="issue-group">
              <label>Section</label>
              <select name="section" onChange={handleChange}>
                <option>Select Section</option>
                <option>A</option>
                <option>B</option>
              </select>
            </div>

          </div>

          <div className="issue-btn-wrap">
            <button className="issue-btn-primary">
              🔍 Search
            </button>
          </div>

        </div>
      </div>

      {/* STUDENT LIST */}
      <div className="issue-card">

        <div className="issue-card-header">
          📋 Student List
        </div>

        <div className="issue-toolbar">
          <div>
            Search:
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="issue-table-wrap">
          <table className="issue-table">
            <thead>
              <tr>
                <th>STUDENT NAME</th>
                <th>FATHER NAME</th>
                <th>CLASS</th>
                <th>ADMISSION NO.</th>
                <th>PHONE</th>
                <th>MEMBER ID</th>
                <th>LIBRARY CARD NO</th>
                <th>MAXIMUM BOOK ALLOWED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.father}</td>
                  <td>{s.class}</td>
                  <td>{s.admission}</td>
                  <td>{s.phone}</td>
                  <td>{s.member}</td>
                  <td>{s.card}</td>
                  <td>{s.maxBook}</td>

                  <td className="issue-action-cell">
                    <button
                      className="issue-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAction(openAction === s.id ? null : s.id);
                      }}
                    >
                      Action ▾
                    </button>

                    {openAction === s.id && (
                      <div className="issue-action-menu">
                        <div>View</div>
                        <div>Edit</div>
                        <div>Return Book</div>
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
