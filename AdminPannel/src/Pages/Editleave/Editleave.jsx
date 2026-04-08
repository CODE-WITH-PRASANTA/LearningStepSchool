import React, { useState, useEffect } from "react";
import "./Editleave.css";
import API from "../../api/axios";

const Editleave = () => {
  const [form, setForm] = useState({
    className: "",
    section: "",
    student: "",
    applyDate: new Date().toISOString().split("T")[0],
    file: null,
    leaveFrom: "",
    leaveTo: "",
    description: "",
  });

  const [tableData, setTableData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);

  const filteredStudents = students.filter(
    (stu) => stu.class === form.className,
  );

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/student-leave");
      setTableData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");
        setClasses(res.data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/students");

        setStudents(res.data.data || res.data); // handle both cases
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "className") {
      setForm({ ...form, className: value, student: "" });
    } else {
      setForm({ ...form, [name]: files ? files[0] : value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      if (editId) {
        // 🔥 UPDATE
        await API.put(`/student-leave/${editId}`, formData);
        alert("Updated successfully ✅");
      } else {
        // 🔥 CREATE
        await API.post("/student-leave", formData);
        alert("Created successfully ✅");
      }

      fetchLeaves();

      setEditId(null);

      setForm({
        className: "",
        section: "",
        student: "",
        applyDate: new Date().toISOString().split("T")[0],
        file: null,
        leaveFrom: "",
        leaveTo: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error ❌");
    }
  };

  const handleEdit = (item) => {
    setForm({
      className: item.className,
      section: item.section,
      student: item.student?._id || "",
      applyDate: item.applyDate ? item.applyDate.split("T")[0] : "",
      file: null, // file not prefilled
      leaveFrom: item.leaveFrom.split("T")[0],
      leaveTo: item.leaveTo.split("T")[0],
      description: item.description,
    });

    setEditId(item._id); // 👈 track editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this leave?")) return;

    try {
      await API.delete(`/student-leave/${id}`);
      alert("Deleted successfully ✅");

      fetchLeaves(); // refresh table
    } catch (error) {
      console.error(error);
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="leave-wrapper">
      {/* FORM */}
      <div className="leave-card">
        <h3 className="leave-header">✏️ Add / Edit Leave</h3>

        <form onSubmit={handleSave}>
          <div className="grid-3">
            <div className="form-group">
              <label>Class Name *</label>
              <select
                name="className"
                value={form.className}
                onChange={handleChange}
              >
                <option value="">Select Class</option>

                {classes.map((cls) => (
                  <option key={cls._id} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Section *</label>
              <select
                name="section"
                value={form.section}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>

            <div className="form-group">
              <label>Student *</label>
              <select
                name="student"
                value={form.student}
                onChange={handleChange}
                disabled={!form.className} // 🔥 disable until class selected
              >
                {/* Default */}
                <option value="">
                  {!form.className ? "Select Class First" : "Select Student"}
                </option>

                {/* If class selected but no students */}
                {form.className && filteredStudents.length === 0 && (
                  <option disabled>No students in this class</option>
                )}

                {/* Show students */}
                {filteredStudents.map((stu) => (
                  <option key={stu._id} value={stu._id}>
                    {stu.firstName} {stu.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>Apply Date</label>
              <input type="date" value={form.applyDate} disabled />
            </div>

            <div className="form-group">
              <label>Attach Document</label>
              <input type="file" name="file" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Leave Date *</label>
              <div className="date-range">
                <input
                  type="date"
                  name="leaveFrom"
                  value={form.leaveFrom}
                  onChange={handleChange}
                />
                <span>—</span>
                <input
                  type="date"
                  name="leaveTo"
                  value={form.leaveTo}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button className="save-btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="leave-card">
        <h3 className="leave-header">📋 Leave Table</h3>

        <div className="table-scroll">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Student</th>
                <th>Apply Date</th>
                <th>Leave Date</th>
                <th>Document</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No data found
                  </td>
                </tr>
              ) : (
                tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.className}</td>
                    <td>{item.section}</td>

                    <td>
                      {item.student
                        ? `${item.student.firstName} ${item.student.lastName}`
                        : "-"}
                    </td>

                    <td>
                      {item.applyDate
                        ? new Date(item.applyDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      {new Date(item.leaveFrom).toLocaleDateString()} –{" "}
                      {new Date(item.leaveTo).toLocaleDateString()}
                    </td>

                    <td>
                      {item.file ? (
                        <a
                          href={`http://localhost:5000${item.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="file-link"
                        >
                          View File
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{item.description}</td>

                    {/* 🔥 ACTION BUTTONS */}
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item)}
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item._id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Editleave;
