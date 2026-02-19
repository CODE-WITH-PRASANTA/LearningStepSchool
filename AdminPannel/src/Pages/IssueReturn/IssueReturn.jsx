import React, { useState } from "react";
import "./IssueReturn.css";
import { Link } from "react-router-dom";

export default function IssueReturn() {
  const [formData, setFormData] = useState({
    memberType: "Student",
    student: "",
    className: "",
    section: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="issue-page">

      {/* PAGE HEADER */}
      <div className="issue-header">
        <h2>← Issue Return</h2>

        <span className="issue-breadcrumb">
          library / Issue Return
        </span>
      </div>

      {/* MAIN CARD */}
      <div className="issue-card">

        {/* PINK HEADER */}
        <div className="issue-card-header">
          🔍 Select Criteria
        </div>

        {/* FORM AREA */}
        <div className="issue-card-body">

          <div className="issue-grid">

            {/* MEMBER TYPE */}
            <div className="issue-group">
              <label>Member Type *</label>
              <select
                name="memberType"
                value={formData.memberType}
                onChange={handleChange}
              >
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            {/* STUDENT */}
            <div className="issue-group">
              <label>Student</label>
              <input
                type="text"
                name="student"
                placeholder="Please Enter Admission No"
                value={formData.student}
                onChange={handleChange}
              />
            </div>

            {/* CLASS */}
            <div className="issue-group">
              <label>Class</label>
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
              >
                <option value="">Select Class</option>
                <option value="3rd(A)">3rd(A)</option>
                <option value="4th(A)">4th(A)</option>
                <option value="5th(A)">5th(A)</option>
              </select>
            </div>

            {/* SECTION */}
            <div className="issue-group">
              <label>Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

          </div>

          {/* BUTTON */}
          <div className="issue-btn-wrap">
            {/* <Link to="" className="issue-btn-primary">🔍 Search<Link/> */}
            <Link to="/student-list"  className="issue-btn-primary">🔍 Search</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
