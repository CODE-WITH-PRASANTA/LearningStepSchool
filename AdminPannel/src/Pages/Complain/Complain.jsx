import React, { useState } from "react";
import "./Complain.css";
import { Link } from "react-router-dom";

const Complain = () => {
  const [criteria, setCriteria] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const [search, setSearch] = useState("");
  const [records, setRecords] = useState([]);

  return (
    <div className="cmp-wrapper">

      <h1 className="cmp-main-heading">Complain</h1>

      {/* ------------------- SELECT CRITERIA BOX ------------------- */}
      <div className="cmp-criteria-box">
        <h2 className="cmp-title">Select Criteria</h2>

        <div className="cmp-criteria-grid">

          <div className="cmp-field">
            <label>Status</label>
            <select
              className="cmp-input"
              value={criteria.status}
              onChange={(e) =>
                setCriteria({ ...criteria, status: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="Requested">Requested</option>
              <option value="On Process">On Process</option>
              <option value="Reply">Reply</option>
            </select>
          </div>

          <div className="cmp-field">
            <label>Start Date</label>
            <input
              type="date"
              className="cmp-input"
              value={criteria.startDate}
              onChange={(e) =>
                setCriteria({ ...criteria, startDate: e.target.value })
              }
            />
          </div>

          <div className="cmp-field">
            <label>End Date</label>
            <input
              type="date"
              className="cmp-input"
              value={criteria.endDate}
              onChange={(e) =>
                setCriteria({ ...criteria, endDate: e.target.value })
              }
            />
          </div>

          <div className="cmp-field search-btn-box">
            <button className="cmp-search-btn">Search</button>
          </div>

        </div>
      </div>

      {/* ------------------- COMPLAIN LIST TABLE ------------------- */}
      <div className="cmp-table-container">

        <div className="cmp-table-header">
          <h2 className="cmp-title">Complain List</h2>

          <div className="cmp-table-actions">
            <input
              type="text"
              className="cmp-search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Link to="/front-office/complain/add" className="cmp-add-btn">+ Add</Link>
          </div>
        </div>

        <div className="cmp-table-scroll">
          <table className="cmp-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Complain Type</th>
                <th>Is Parent</th>
                <th>Complain By</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Admission No</th>
                <th>Email</th>
                <th>Date</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Note</th>
                <th>Description</th>
                <th>Reply</th>
                <th>Reply Attachment</th>
                <th>Reply By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="17" className="cmp-empty">
                    No Records Found
                  </td>
                </tr>
              ) : (
                records.map((rec, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{rec.type}</td>
                    <td>{rec.isParent}</td>
                    <td>{rec.complainBy}</td>
                    <td>{rec.studentName}</td>
                    <td>{rec.class}</td>
                    <td>{rec.admissionNo}</td>
                    <td>{rec.email}</td>
                    <td>{rec.date}</td>
                    <td>{rec.assigned}</td>
                    <td>{rec.status}</td>
                    <td>{rec.note}</td>
                    <td>{rec.description}</td>
                    <td>{rec.reply}</td>
                    <td>{rec.replyAttachment}</td>
                    <td>{rec.replyBy}</td>
                    <td>
                      <button className="cmp-edit-btn">Edit</button>
                      <button className="cmp-delete-btn">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Complain;
