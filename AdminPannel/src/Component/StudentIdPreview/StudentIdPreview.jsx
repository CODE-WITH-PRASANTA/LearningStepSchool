import React from "react";
import "./StudentIdPreview.css";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import SchoolLogo from "../../Assets/Learning-Step-Logo-1.png";
import { IMAGE_URL } from "../../api/axios";

const StudentIdPreview = ({ students, onBack, onPrint }) => {
  const getStudentPhoto = (student) => {
    const photo = student.photo || student.studentPhoto;

    if (!photo) return "";
    if (/^https?:\/\//i.test(photo)) return photo;
    return `${IMAGE_URL}/${photo.replace(/^\/+/, "")}`;
  };

  return (
    <div className="id-preview-container">
      {/* Action Toolbar */}
      <div className="id-preview-toolbar">
        <div className="id-preview-title">
          <h2>Student ID Card Preview</h2>
          <p>Preview & Print Student Identity Cards</p>
        </div>
        <div className="id-preview-actions">
          <button className="id-btn-back" onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
          <button className="id-btn-print" onClick={onPrint}>
            <FaPrint /> Print ID Cards
          </button>
        </div>
      </div>

      {/* Printable Area Grid */}
      <div className="id-print-area" id="StudentIdPreview-printArea">
        <div className="id-card-grid">
          {students.map((student) => (
            <div className="id-card" key={student._id || student.id}>
              
              {/* Header Section */}
              <div className="id-card-header">
                <img src={SchoolLogo} alt="School Logo" className="id-school-logo" />
                <div className="id-school-details">
                  <h3>THE LEARNING STEP INTERNATIONAL SCHOOL</h3>
                  <p>Location: Tehla Bypass Alwar road, Rajgarh, Thana, Rajasthan 301408</p>
                </div>
              </div>

              {/* Identity Title Bar */}
              <div className="id-title-bar">IDENTITY CARD</div>

              {/* Photo & Primary Bio */}
              <div className="id-photo-section">
                <div className="id-photo-frame">
                  <img src={getStudentPhoto(student)} alt={student.name} />
                </div>
                <h4 className="id-student-name">{student.name}</h4>
                <span className="id-student-class">
                  Class: {student.class} - {student.section}
                </span>
              </div>

              {/* Dynamic Info Field Grid */}
              <div className="id-info-grid">
                <div className="id-info-row">
                  <span className="id-label">Roll No:</span>
                  <span className="id-value">{student.rollNo}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-label">F. Name:</span>
                  <span className="id-value">{student.fatherName}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-label">M. Name:</span>
                  <span className="id-value">{student.motherName}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-label">Ph. No:</span>
                  <span className="id-value">{student.phone}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-label">D.O.B:</span>
                  <span className="id-value">{student.dob}</span>
                </div>
                <div className="id-info-row">
                  <span className="id-label">Session:</span>
                  <span className="id-value">{student.session}</span>
                </div>
                <div className="id-info-row id-full-width">
                  <span className="id-label">Address:</span>
                  <span className="id-value">{student.address}</span>
                </div>
              </div>

              {/* Footer Section (Clean signature display, no barcode/QR) */}
              <div className="id-card-footer">
                <div className="id-footer-signature-container">
                  <div className="id-sign-line"></div>
                  <p>Authorized Signature</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentIdPreview;
