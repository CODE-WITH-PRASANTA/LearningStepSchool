import React, { useState } from "react";
import "./EvaluationRemark.css";

export default function EvaluationRemark() {
  const [criteria, setCriteria] = useState({
    className: "4th",
    section: "Comm",
  });

 
  const [showTable, setShowTable] = useState(false);

  const handleSearch = () => {
    setShowTable(true);
  };

  return (
    <div className="evr-page">
      {/* HEADER */}
      <div className="evr-header">
        <h2>📄 Evaluation Remark</h2>
        <span>Primary Evaluation / Evaluation Remark</span>
      </div>

      {/* SELECT CRITERIA */}
      <div className="evr-card evr-criteria-card">
        <h3>🔍 Select Criteria</h3>

        <div className="evr-form-grid">
          <div className="evr-field">
            <label>Class *</label>
            <input
              value={criteria.className}
              onChange={(e) =>
                setCriteria({ ...criteria, className: e.target.value })
              }
            />
          </div>

          <div className="evr-field">
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
        </div>

        <div className="evr-search-btn-wrap">
          <button onClick={handleSearch}>🔍 Search</button>
        </div>
      </div>

      {/* ADD EVALUATION REMARK */}
      {showTable && (
        <div className="evr-card">
          <h3>✏️ Add Evaluation Remark</h3>

          <div className="evr-table-toolbar">
           
          </div>

          <div className="evr-table-wrap">
            <table className="evr-table">
              <thead>
                <tr>
                  <th>
                    ADMISSION NO.
                    <span className="evr-sort">↕</span>
                  </th>
                  <th>
                    STUDENT NAME
                    <span className="evr-sort">↕</span>
                  </th>
                  <th>
                    REMARK
                    <span className="evr-sort">↕</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="3" className="evr-no-data">
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
