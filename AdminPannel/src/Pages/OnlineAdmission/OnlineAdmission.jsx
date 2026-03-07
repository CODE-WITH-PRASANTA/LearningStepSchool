import React, { useState } from "react";
import {
  Search,
  Calendar,
  MoreVertical,
  Pencil,
  Trash,
  FileDown,
  X,
} from "lucide-react";

import "./OnlineAdmission.css";

const OnlineAdmission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const admissionData = [
    {
      id: 1,
      name: "TEST ATEST",
      class: "1st",
      father: "John Doe",
      dob: "24-01-2015",
      gender: "Male",
      category: "General",
      mobile: "9772119901",
      status: "Paid (Cash)",
      transactionId: "8845161658",
      enrolled: "No",
      appliedOn: "20-02-2026",
    },
    {
      id: 2,
      name: "ALICE SMITH",
      class: "2nd",
      father: "Robert Smith",
      dob: "12-05-2014",
      gender: "Female",
      category: "OBC",
      mobile: "9887766554",
      status: "Unpaid",
      transactionId: "-",
      enrolled: "No",
      appliedOn: "21-02-2026",
    },
  ];

  const openPaymentModal = (data) => {
    setSelectedTransaction(data);
    setIsModalOpen(true);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <div className="admission-wrapper">

      {/* HEADER */}
      <div className="admission-header">
        <h1 className="admission-title">💻 Online Admission</h1>

        <div className="admission-breadcrumb">
          <span className="breadcrumb-link">Student info</span>
          <span className="breadcrumb-separator">/</span>
          <span>Online Admission</span>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="admission-card filter-card">
        <div className="card-header">
          <Search size={18} /> Select Criteria
        </div>

        <div className="card-body">

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Start Date <Calendar size={14} />
              </label>
              <input type="date" className="input-field" defaultValue="2025-01-01" />
            </div>

            <div className="form-group">
              <label className="form-label">
                End Date <Calendar size={14} />
              </label>
              <input type="date" className="input-field" defaultValue="2025-12-31" />
            </div>
          </div>

          <div className="search-btn-container">
            <button className="search-btn">
               Search
            </button>
          </div>

        </div>
      </div>

      {/* TABLE CARD */}
      <div className="admission-card">
        <div className="card-header">☰ Online Admission Directory List</div>

        <div className="card-body">
          <div className="table-wrapper">
            <table className="admission-table">
              <thead>
                <tr>
                  {[
                    "#", "Student Name", "Class", "Father Name", "DOB", "Gender",
                    "Category", "Mobile", "Transaction", "Enrolled", "Applied On", "Action"
                  ].map((head) => (
                    <th key={head}>{head}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {admissionData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.class}</td>
                    <td>{row.father}</td>
                    <td>{row.dob}</td>
                    <td>{row.gender}</td>
                    <td>{row.category}</td>
                    <td>{row.mobile}</td>

                    <td>
                      <button
                        onClick={() => openPaymentModal(row)}
                        className={`status-btn ${row.status.includes("Paid") ? "paid" : "unpaid"}`}
                      >
                        {row.status}
                        <span className="status-id">{row.transactionId}</span>
                      </button>
                    </td>

                    <td>{row.enrolled}</td>
                    <td>{row.appliedOn}</td>

                    {/* ACTION DROPDOWN */}
                    <td className="action-area">
                      <button
                        className="action-btn"
                        onClick={() => toggleDropdown(row.id)}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {dropdownOpen === row.id && (
                        <div className="action-dropdown">
                          <button className="dropdown-item">
                            <Pencil size={14} /> Edit
                          </button>
                          <button className="dropdown-item delete">
                            <Trash size={14} /> Delete
                          </button>
                          <button className="dropdown-item">
                            <FileDown size={14} /> Download
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">

            <div className="modal-header">
              <h3>Payment Details</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Payment</label>
                <select className="input-field">
                  <option>Unpaid</option>
                  <option>Paid (Cash)</option>
                  <option>Paid (Online)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction ID</label>
                <input
                  type="text"
                  className="input-field"
                  defaultValue={
                    selectedTransaction?.transactionId === "-" ? "" : selectedTransaction?.transactionId
                  }
                />
              </div>

              <button className="update-btn" onClick={() => setIsModalOpen(false)}>
                Update
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OnlineAdmission;