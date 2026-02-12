import React from "react";

const SelectCriteria = () => {
  return (
    <div className="card criteria-card">
      <div className="card-header">
        🔍 Select Criteria
      </div>

      <div className="criteria-grid">
        <div className="form-group">
          <label>Source</label>
          <select>
            <option>Select</option>
            <option>Social Media</option>
            <option>Website</option>
            <option>Phone</option>
            <option>Walk In</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select>
            <option>Select</option>
            <option>Active</option>
            <option>Student Enrolled</option>
            <option>Telephone Enquiry</option>
          </select>
        </div>

        <div className="form-group">
          <label>Enquiry Date</label>
          <input type="date" />
        </div>
      </div>

      <div className="criteria-actions">
        <button className="btn-search">🔍 Search</button>
      </div>
    </div>
  );
};

export default SelectCriteria;
