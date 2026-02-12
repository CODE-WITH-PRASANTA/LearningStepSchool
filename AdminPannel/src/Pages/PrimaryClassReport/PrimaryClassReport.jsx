import React, { useState } from "react";
import "./PrimaryClassReport.css";

export default function PrimaryClassReport() {
  const [criteria, setCriteria] = useState({
    className: "",
    section: "Comm",
    template: "Template 2",
  });

  const [showReport, setShowReport] = useState(false);

  const handleSearch = () => {
    setShowReport(true);
  };

  return (
    <div className="pcr-page">
      {/* HEADER */}
      <div className="pcr-header">
        <h2>📄 Primary Class Report</h2>
        <span>Primary Evaluation / Primary Class Report</span>
      </div>

      {/* SELECT CRITERIA */}
      <div className="pcr-card">
        <h3>🔍 Select Criteria</h3>

        <div className="pcr-form-grid">
          {/* CLASS DROPDOWN */}
          <div className="pcr-field">
            <label>Class *</label>
            <select
              value={criteria.className}
              onChange={(e) =>
                setCriteria({ ...criteria, className: e.target.value })
              }
              className={
                criteria.className === "" ? "pcr-placeholder" : ""
              }
            >
              <option value="" disabled>
                Select Class
              </option>
              <option>KSV 6th</option>
              <option>KSV 7th</option>
              <option>KSV 8th</option>
            </select>
          </div>

          {/* SECTION */}
          <div className="pcr-field">
            <label>Section *</label>
            <select
              value={criteria.section}
              onChange={(e) =>
                setCriteria({ ...criteria, section: e.target.value })
              }
            >
              <option>Comm</option>
              <option>A</option>
              <option>B</option>
            </select>
          </div>

          {/* TEMPLATE */}
          <div className="pcr-field">
            <label>Template</label>
            <select
              value={criteria.template}
              onChange={(e) =>
                setCriteria({ ...criteria, template: e.target.value })
              }
            >
              <option>Template 1</option>
              <option>Template 2</option>
            </select>
          </div>
        </div>

        <div className="pcr-search-btn-wrap">
          <button onClick={handleSearch}>🔍 Search</button>
        </div>
      </div>

      {/* REPORT LIST */}
      {showReport && (
        <div className="pcr-card">
          <div className="pcr-report-header">
            <h3>📋 Report List</h3>
          </div>

          <div className="pcr-table-wrap">
            <table className="pcr-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>
                    ADMISSION NO.
                    <span className="pcr-sort">↕</span>
                  </th>
                  <th>
                    NAME
                    <span className="pcr-sort">↕</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="3" className="pcr-no-data">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
