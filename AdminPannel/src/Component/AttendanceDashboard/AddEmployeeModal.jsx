import React from "react";
import "./AddEmployeeModal.css";
import { FaTimes } from "react-icons/fa";

const AddEmployeeModal = ({ closeModal }) => {
  return (
    <div className="employee-modal-overlay" onClick={closeModal}>
      <div
        className="employee-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>Add Employee</h2>

          <button className="close-btn" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form className="employee-form">

          <div className="form-group full">
            <label>Full Name</label>
            <input type="text" placeholder="Enter full name" />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="example@email.com" />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" placeholder="+91 9876543210" />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Department</label>
              <select>
                <option>Select Department</option>
                <option>HR</option>
                <option>Finance</option>
                <option>IT</option>
              </select>
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Joining Date</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group full">
            <label>Address</label>
            <textarea rows="3" placeholder="Enter address"></textarea>
          </div>

          <div className="form-group full">
            <label>Profile Photo</label>
            <input type="file" />
          </div>

          <div className="modal-footer">
            <button type="submit" className="submit-btn">
              Add Employee
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;