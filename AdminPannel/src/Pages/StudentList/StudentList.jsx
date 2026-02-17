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

  // Search Filter
  const filteredStudents = students.filter((s) =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  // Delete
  const handleDelete = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  // Edit
  const handleEdit = (student) => {
    setEditId(student.id);
    setFormData(student);
    setShowForm(true);
  };

  // Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit
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

      {/* Header */}
      <div className="header">
        <h2>Student List</h2>

        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch />
          </div>

          <button className="add-btn" onClick={() => setShowForm(true)}>
            <FaPlus /> Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
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

                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(student)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="delete-btn"
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

      {/* Modal Form */}
      {showForm && (
        <div className="modal">
          <div className="form-card">
            <div className="form-header">
              <h3>{editId ? "Edit Student" : "Add Student"}</h3>
              <FaTimes onClick={() => setShowForm(false)} className="close" />
            </div>

            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((key) => (
                <input
                  key={key}
                  name={key}
                  placeholder={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                />
              ))}

              <button type="submit" className="save-btn">
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