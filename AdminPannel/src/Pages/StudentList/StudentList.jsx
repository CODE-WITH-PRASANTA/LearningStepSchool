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

  const handleDelete = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleEdit = (student) => {
    setEditId(student.id);
    setFormData(student);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <div className="Student-list-container">

      {/* HEADER */}
      <div className="Student-list-header">
        <h2 className="Student-list-title">Student List</h2>

        <div className="Student-list-header-right">

          <div className="Student-list-search-box">
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="Student-list-search-input"
            />
            <FaSearch className="Student-list-search-icon" />
          </div>

          <button
            className="Student-list-add-btn"
            onClick={() => setShowForm(true)}
          >
            <FaPlus /> Add Student
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="Student-list-table-wrapper">
        <table className="Student-list-table">
          <thead className="Student-list-thead">
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

          <tbody className="Student-list-tbody">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="Student-list-row">
                <td>{student.studentName}</td>
                <td>{student.fatherName}</td>
                <td>{student.className}</td>
                <td>{student.admissionNo}</td>
                <td>{student.phone}</td>
                <td>{student.memberId}</td>
                <td>{student.libraryCard}</td>
                <td>{student.maxBook}</td>

                <td className="Student-list-action-buttons">
                  <button
                    className="Student-list-edit-btn"
                    onClick={() => handleEdit(student)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="Student-list-delete-btn"
                    onClick={() => handleDelete(student.id)}
                  >
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
        <div className="Student-list-modal">
          <div className="Student-list-form-card">

            <div className="Student-list-form-header">
              <h3 className="Student-list-form-title">
                {editId ? "Edit Student" : "Add Student"}
              </h3>
              <FaTimes
                onClick={() => setShowForm(false)}
                className="Student-list-close-icon"
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="Student-list-form"
            >
              {Object.keys(formData).map((key) => (
                <input
                  key={key}
                  name={key}
                  placeholder={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  className="Student-list-input"
                />
              ))}

              <button type="submit" className="Student-list-save-btn">
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
