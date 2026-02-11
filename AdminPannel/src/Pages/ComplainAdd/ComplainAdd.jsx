import React, { useState } from "react";
import "./ComplainAdd.css";

const ComplainAdd = () => {
  const [form, setForm] = useState({
    complainType: "",
    complainBy: "",
    complainFrom: "",
    mobile: "",
    email: "",
    date: "",
    assigned: "",
    attachment: null,
    previousNote: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <div className="cmpadd-wrapper">

      <h1 className="cmpadd-main-title">Add & Edit Complain</h1>

      <div className="cmpadd-box">
        <h2 className="cmpadd-heading">Complain Details</h2>

        <div className="cmpadd-grid">

          {/* Complain Type */}
          <div className="cmpadd-field">
            <label>Complain Type *</label>
            <select
              name="complainType"
              className="cmpadd-input"
              value={form.complainType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Other">Other</option>
              <option value="Teacher">Teacher</option>
              <option value="Staff">Staff</option>
              <option value="Operation">Operation</option>
              <option value="Marketing">Marketing</option>
              <option value="Style">Style</option>
            </select>
          </div>

          {/* Complain By */}
          <div className="cmpadd-field">
            <label>Complain By *</label>
            <input
              type="text"
              name="complainBy"
              className="cmpadd-input"
              placeholder="Enter name"
              value={form.complainBy}
              onChange={handleChange}
            />
          </div>

          {/* Complain From */}
          <div className="cmpadd-field">
            <label>Complain From *</label>
            <select
              name="complainFrom"
              className="cmpadd-input"
              value={form.complainFrom}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Parent">Parent</option>
              <option value="Teacher">Teacher</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Mobile */}
          <div className="cmpadd-field">
            <label>Mobile Number *</label>
            <input
              type="text"
              name="mobile"
              className="cmpadd-input"
              placeholder="Enter mobile no."
              value={form.mobile}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="cmpadd-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="cmpadd-input"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Date */}
          <div className="cmpadd-field">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              className="cmpadd-input"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          {/* Assigned */}
          <div className="cmpadd-field">
            <label>Assigned</label>
            <select
              name="assigned"
              className="cmpadd-input"
              value={form.assigned}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Staff 1">Staff 1</option>
              <option value="Staff 2">Staff 2</option>
              <option value="Staff 3">Staff 3</option>
            </select>
          </div>

          {/* Attachment */}
          <div className="cmpadd-field">
            <label>Attach Document</label>
            <input
              type="file"
              name="attachment"
              className="cmpadd-input cmpadd-file"
              onChange={handleChange}
            />
          </div>

          {/* Previous Note */}
          <div className="cmpadd-field cmpadd-full">
            <label>Previous Note</label>
            <textarea
              name="previousNote"
              className="cmpadd-textarea"
              placeholder="Enter previous note"
              value={form.previousNote}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Description */}
          <div className="cmpadd-field cmpadd-full">
            <label>Description</label>
            <textarea
              name="description"
              className="cmpadd-textarea"
              placeholder="Enter description"
              value={form.description}
              onChange={handleChange}
            ></textarea>
          </div>

        </div>

        <button className="cmpadd-save-btn">Save</button>
      </div>
    </div>
  );
};

export default ComplainAdd;
