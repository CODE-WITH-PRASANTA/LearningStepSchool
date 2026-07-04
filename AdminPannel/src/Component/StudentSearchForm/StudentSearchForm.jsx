import React from "react";
import "./StudentSearchForm.css";
import { FaSearch } from "react-icons/fa";

const StudentSearchForm = ({ filters, setFilters, classes = [], onSearch }) => {
  const classOptions = Array.from(
    new Map(classes.map((item) => [item.className, item])).values(),
  );

  const sectionOptions = classes
    .filter((item) => !filters.className || item.className === filters.className)
    .map((item) => item.sectionName)
    .filter(Boolean);

  const handleChange = (e) => {
    const nextFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };

    if (e.target.name === "className") {
      nextFilters.section = "";
    }

    setFilters({
      ...nextFilters,
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

              {classOptions.map((item) => (
                <option key={item._id} value={item.className}>
                  {item.className}
                </option>
              ))}
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
              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
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
