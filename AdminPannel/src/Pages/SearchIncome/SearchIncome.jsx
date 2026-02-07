import React, { useState } from "react";
import "./SearchIncome.css";
import { FaSearch, FaList, FaFilePdf, FaFileExcel, FaPrint } from "react-icons/fa";

const SearchIncome = () => {
  const incomeHeadOptions = [
    "Test","Demo","Scholarship","bnm","test","lightng","picnic trip",
    "donation","test2","Scholarship","admission form","general","exam form",
    "donation from govt","Medical Camp","Registration Form Fee","XYZ - st",
    "School -Picnic","registrationform fee","TRIAL STUDENT",
    "playground competition","Admisiion fee","Instant","INTRANCE EXAM",
    "Admission Form","Registeration Form Fee","Registeration-Form-Fee",
    "Student wellfare funds","miscellaneous","science exhibition","annual function"
  ];

  const [records] = useState([]);

  return (
    <div className="income-page">

      {/* HEADER */}
      <div className="page-header">
        <FaSearch className="header-icon" />
        <h2>Income Search</h2>
        <span className="breadcrumb">💰 Income / Income Search</span>
      </div>

      {/* FILTER BOX */}
      <div className="filter-box">
        <div className="filter-title">
          <FaSearch className="title-icon" />
          <span>Select Criteria</span>
        </div>

        <div className="filter-grid">

          <div className="form-group">
            <label>Income Head</label>
            <select>
              <option>Select Income Head</option>
              {incomeHeadOptions.map((item, i) => (
                <option key={i}>{item}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date From</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>Date To</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>Search</label>
            <input type="text" placeholder="Search by Income" />
          </div>
        </div>

        {/* TWO SEPARATE SEARCH BUTTONS */}
        <div className="two-search-buttons">
          <button className="btn-date-search">
            <FaSearch /> Search
          </button>

          <button className="btn-history-search">
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* LIST BOX */}
      <div className="list-box">

        <div className="list-header">
          <FaList className="list-icon" />
          <h3>Search Income List</h3>
        </div>

        {/* TOOLBAR ROW */}
        <div className="list-toolbar">

          <div className="export-buttons">
            <button><FaFilePdf /></button>
            <button><FaFileExcel /></button>
            <button><FaPrint /></button>
          </div>

          <div className="table-tools">
            <select className="entries-select">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>

            <label className="search-label">Search:</label>
            <input className="table-search" type="text" />
          </div>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="income-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Invoice Number</th>
                <th>Payment Mode</th>
                <th>Income Head</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount (Rs)</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No Records Found</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default SearchIncome;
