import React, { useState } from "react";
import "./Editleave.css";

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (
      !form.className ||
      !form.section ||
      !form.student ||
      !form.leaveFrom ||
      !form.leaveTo ||
      !form.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    setTableData([...tableData, form]);

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
  };

  return (
    <div className="leave-wrapper">
      {/* FORM */}
      <div className="leave-card">
        <h3 className="leave-header">✏️ Add / Edit Leave</h3>

        <form onSubmit={handleSave}>
          <div className="grid-3">
            <div className="form-group">
              <label>Class *</label>
              <input
                type="text"
                name="className"
                placeholder="Select Class"
                value={form.className}
                onChange={handleChange}
              />
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
              >
                <option value="">Select</option>
                <option>Rahul</option>
                <option>Priya</option>
                <option>Amit</option>
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
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Student</th>
                <th>Apply Date</th>
                <th>Leave Date</th>
                <th>Document</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    No data found
                  </td>
                </tr>
              ) : (
                tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.className}</td>
                    <td>{item.section}</td>
                    <td>{item.student}</td>
                    <td>{item.applyDate}</td>
                    <td>
                      {item.leaveFrom} – {item.leaveTo}
                    </td>
                    <td>{item.file ? item.file.name : "-"}</td>
                    <td>{item.description}</td>
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
