// StudentLink.jsx
import React, { useState, useRef, useEffect } from "react";
import "./StudentLink.css";
import { FaBars } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const StudentLink = () => {
  const [activeId, setActiveId] = useState(null);
  const dropdownRef = useRef(null);

  const students = [
    {
      id: 1,
      gender: "Male",
      dob: "06-05-2024",
      father: "Test Father",
      mother: "Test Mother",
      guardianPhone: "123456789",
      pen: "PEN123",
      srNo: "SR-01",
      behaviour: "Good",
    },
    {
      id: 2,
      gender: "Female",
      dob: "01-01-2017",
      father: "ddd",
      mother: "fff",
      guardianPhone: "1234567890",
      pen: "PEN222",
      srNo: "SR-02",
      behaviour: "Average",
    },
  ];

  const toggleDropdown = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (id) => {
    alert("Edit student " + id);
    setActiveId(null);
  };

  const handleDelete = (id) => {
    alert("Delete student " + id);
    setActiveId(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="student-container">
      <div className="student-card">
        {/* HEADER */}
        <div className="student-header">
          <div className="student-title">
            <FaBars />
            <h2>Student List</h2>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="top-toolbar">
          <select className="entries-select">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>

          <input
            type="text"
            placeholder="Search students..."
            className="search-input"
          />
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>GENDER</th>
                <th>DATE OF BIRTH</th>
                <th>FATHER NAME</th>
                <th>MOTHER NAME</th>
                <th>GUARDIAN PHONE</th>
                <th>PEN</th>
                <th>SR NO</th>
                <th>BEHAVIOUR</th>
                <th className="th-action">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.gender}</td>
                  <td>{student.dob}</td>
                  <td>{student.father}</td>
                  <td>{student.mother}</td>
                  <td>{student.guardianPhone}</td>
                  <td>{student.pen}</td>
                  <td>{student.srNo}</td>
                  <td>
                    <span className="badge">{student.behaviour}</span>
                  </td>

                  <td className="action-cell">
                    <div
                      className="dots-wrap"
                      ref={activeId === student.id ? dropdownRef : null}
                    >
                      <button
                        className="dots-btn"
                        onClick={() => toggleDropdown(student.id)}
                        aria-label="Open actions"
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {activeId === student.id && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleEdit(student.id)}>
                            ✏ Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(student.id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentLink;