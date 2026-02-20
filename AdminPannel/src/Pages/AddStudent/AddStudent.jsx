import React, { useState } from "react";
import "./AddStudent.css";
import { FaUserPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const AddStudent = () => {
  const [cls, setCls] = useState("");
  const [section, setSection] = useState("");

  return (
    <div className="addStudentPage">

      {/* ===== HEADER BAR ===== */}
      <div className="topHeaderBar">

        {/* LEFT TITLE */}
        <div className="pageTitle">
          <FaUserPlus className="titleIcon" />
          <h2>Add Student</h2>
        </div>

        {/* RIGHT BREADCRUMB */}
        <div className="breadcrumb">
          <span className="libraryText">library</span>
          <span className="slash"> / </span>
          <span className="currentPage">Add Student</span>
        </div>

      </div>


      {/* ===== CONTENT ===== */}
      <div className="contentArea">

        <div className="criteriaCard">

          <div className="cardHeader">
            <h3>Select Criteria</h3>
          </div>

          {/* FORM */}
          <div className="formRow">

            <div className="formGroup">
              <label>Class <span>*</span></label>
              <select value={cls} onChange={(e) => setCls(e.target.value)}>
                <option value="">Select Class</option>
                <option>1st</option>
                <option>2nd</option>
                <option>3rd</option>
                <option>4th</option>
                <option>5th</option>
                <option>6th</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Section <span>*</span></label>
              <select value={section} onChange={(e) => setSection(e.target.value)}>
                <option value="">Select Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>E</option>
              </select>
            </div>

          </div>

          {/* SEARCH BUTTON */}
          <div className="searchWrapper">
            <Link to="/Add/Studentlist">
              <button className="searchBtn">
                <FaSearch /> Search
              </button>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AddStudent;
