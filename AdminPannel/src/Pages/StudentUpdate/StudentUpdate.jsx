import React from "react";
import "./StudentUpdate.css";
import { FiEdit, FiSearch } from "react-icons/fi";

const StudentUpdate = () => {
  return (
    <div className="su-page">
      <div className="su-layout">

        {/* Header */}
        <div className="su-header">
          <div className="su-header-left">
            <FiEdit className="su-header-icon" />
            <h2 className="su-header-title">Student Update</h2>
          </div>

          <div className="su-header-right">
            <span className="su-breadcrumb-link">Bulk Update</span>
            <span className="su-breadcrumb-divider">/</span>
            <span className="su-breadcrumb-active">Student Update</span>
          </div>
        </div>

        {/* Criteria Card */}
        <div className="su-criteria-card">

          <div className="su-criteria-title">
            <FiSearch className="su-search-icon" />
            <h3 className="su-criteria-heading">Select Criteria</h3>
          </div>

          <div className="su-form-grid">

            {/* Class */}
            <div className="su-form-group">
              <label className="su-label">
                Class <span className="su-required">*</span>
              </label>
              <select className="su-select">
                <option>Select Class</option>
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
              </select>
            </div>

            {/* Section */}
            <div className="su-form-group">
              <label className="su-label">
                Section <span className="su-required">*</span>
              </label>
              <select className="su-select">
                <option>Select Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>

          </div>

          <div className="su-button-area">
            <button className="su-update-btn">Update Students</button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentUpdate;