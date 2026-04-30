import React from "react";
import "./StudentPrintForm.css";

const StudentPrintForm = ({ student }) => {
  if (!student) return null;

  return (
    <div className="print-area">
      {/* HEADER */}
      <div className="pf-header">
        <h2>Learning Step International School</h2>
        <p>Tehla bypass, alwar road, Rajgarh (Rajasthan)</p>
        <h3>Student Admission Form (2026-27)</h3>
      </div>

      {/* PERSONAL INFO */}
      <div className="pf-section">
        <h3>Personal Information</h3>

        <div className="pf-field">
          <label>Admission No:</label>
          <span>{student.admissionNo}</span>
        </div>

        <div className="pf-field">
          <label>Student Name:</label>
          <span>{student.firstName} {student.lastName}</span>
        </div>

        <div className="pf-field">
          <label>Roll No:</label>
          <span>{student.rollNumber}</span>
        </div>

        <div className="pf-row">
          <div className="pf-field">
            <label>Class:</label>
            <span>{student.class}</span>
          </div>

          <div className="pf-field">
            <label>Section:</label>
            <span>{student.section}</span>
          </div>
        </div>

        <div className="pf-row">
          <div className="pf-field">
            <label>DOB:</label>
            <span>{student.dob}</span>
          </div>

          <div className="pf-field">
            <label>Gender:</label>
            <span>{student.gender}</span>
          </div>
        </div>

        <div className="pf-field">
          <label>Mobile:</label>
          <span>{student.mobile}</span>
        </div>

        <div className="pf-field">
          <label>Email:</label>
          <span>{student.email}</span>
        </div>

        <div className="pf-field">
          <label>Aadhar:</label>
          <span>{student.aadharNumber}</span>
        </div>
      </div>

      {/* PARENT */}
      <div className="pf-section">
        <h3>Parent Guardian Detail</h3>

        <div className="pf-field">
          <label>Father Name:</label>
          <span>{student.fatherName}</span>
        </div>

        <div className="pf-field">
          <label>Mother Name:</label>
          <span>{student.motherName}</span>
        </div>

        <div className="pf-field">
          <label>Father Phone:</label>
          <span>{student.fatherPhone}</span>
        </div>

        <div className="pf-field">
          <label>Guardian Name:</label>
          <span>{student.guardianName}</span>
        </div>

        <div className="pf-field">
          <label>Guardian Phone:</label>
          <span>{student.guardianPhone}</span>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="pf-section">
        <h3>Miscellaneous Details</h3>

        <div className="pf-field">
          <label>Permanent Address:</label>
          <span>{student.permanentAddress}</span>
        </div>

        <div className="pf-field">
          <label>Current Address:</label>
          <span>{student.currentAddress}</span>
        </div>
      </div>

      {/* SIGN */}
      <div className="pf-sign">
        <span>Parent Signature</span>
        <span>Authorized Signature</span>
      </div>
    </div>
  );
};

export default StudentPrintForm;