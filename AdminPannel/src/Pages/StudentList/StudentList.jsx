import React, { useState } from "react";
import "./StudentList.css";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

const StudentList = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [students, setStudents] = useState([
    {
      id: 1,
      studentName: "Rahul Sharma",
      fatherName: "Ramesh Sharma",
      className: "10",
      admissionNo: "A1001",
      phone: "9876543210",
      memberId: "M001",
      libraryCard: "LC101",
      maxBook: 3,
    },
    {
      id: 2,
      studentName: "Ankita Das",
      fatherName: "Suresh Das",
      className: "9",
      admissionNo: "A1002",
      phone: "9123456780",
      memberId: "M002",
      libraryCard: "LC102",
      maxBook: 2,
    },
  ]);

  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    className: "",
    admissionNo: "",
    phone: "",
    memberId: "",
    libraryCard: "",
    maxBook: "",
  });

  const filteredStudents = students.filter((s) =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => setStudents(students.filter((s) => s.id !== id));

  const handleEdit = (student) => {
    setEditId(student.id);
    setFormData(student);
    setShowForm(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setStudents(
        students.map((s) => (s.id === editId ? { ...formData, id: editId } : s))
      );
    } else {
      setStudents([...students, { ...formData, id: Date.now() }]);
    }

    setShowForm(false);
    setEditId(null);

    setFormData({
      studentName: "",
      fatherName: "",
      className: "",
      admissionNo: "",
      phone: "",
      memberId: "",
      libraryCard: "",
      maxBook: "",
    });
  };

  return (
    <div className="student-container">

      {/* HEADER */}
      <div className="student-header">
        <h2 className="student-title">Student List</h2>

        <div className="student-header-right">
          <div className="student-search-box">
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="student-search-input"
            />
            <FaSearch className="student-search-icon" />
          </div>

          <button className="student-add-btn" onClick={() => setShowForm(true)}>
            <FaPlus /> Add Student
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="student-table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Father</th>
              <th>Class</th>
              <th>Admission</th>
              <th>Phone</th>
              <th>Member</th>
              <th>Library</th>
              <th>Max Book</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.studentName}</td>
                <td>{student.fatherName}</td>
                <td>{student.className}</td>
                <td>{student.admissionNo}</td>
                <td>{student.phone}</td>
                <td>{student.memberId}</td>
                <td>{student.libraryCard}</td>
                <td>{student.maxBook}</td>

                <td className="action-btns">
                  <button className="edit-btn" onClick={() => handleEdit(student)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(student.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="modal">
          <div className="form-card">
            <div className="form-header">
              <h3>{editId ? "Edit Student" : "Add Student"}</h3>
              <FaTimes className="close-icon" onClick={() => setShowForm(false)} />
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              {Object.keys(formData).map((key) => (
                <div className="input-group" key={key}>
                  <label>{key.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <button className="save-btn" type="submit">
                {editId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
