import React from "react";
import "./StudentSearchForm.css";
import { FaSearch } from "react-icons/fa";

const StudentSearchForm = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="StudentSearchForm">
      <div className="StudentSearchForm-header">
        <h3>Student ID Card Criteria</h3>
      </div>

      <div className="StudentSearchForm-body">
        <div className="StudentSearchForm-grid">
          {/* Session */}
          <div className="StudentSearchForm-group">
            <label>
              Session <span>*</span>
            </label>
            <select
              name="session"
              value={filters.session}
              onChange={handleChange}
            >
              <option value="">Select Session</option>
              <option>2026-2027</option>
              <option>2025-2026</option>
              <option>2024-2025</option>
            </select>
          </div>

          {/* Class */}
          <div className="StudentSearchForm-group">
            <label>
              Class <span>*</span>
            </label>
            <select
              name="className"
              value={filters.className}
              onChange={handleChange}
            >
              <option value="">Select Class</option>
              <option>Nursery</option>
              <option>LKG</option>
              <option>UKG</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
            </select>
          </div>

          {/* Section */}
          <div className="StudentSearchForm-group">
            <label>Section</label>
            <select
              name="section"
              value={filters.section}
              onChange={handleChange}
            >
              <option value="">Select Section</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="StudentSearchForm-footer">
          <button className="StudentSearchForm-searchBtn" onClick={onSearch}>
            <FaSearch />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSearchForm;