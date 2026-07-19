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

      <div className="id-print-area" id="StudentIdPreview-printArea">
        <div className="id-card-grid">
          {students.map((student) => (
            <div className="id-card" key={student._id || student.id}>
              {/* Header */}
              <div className="id-card-header">
                <img src={SchoolLogo} alt="Logo" className="id-school-logo" />
                <div className="id-school-details">
                  <h3>THE LEARNING STEP INTERNATIONAL SCHOOL</h3>
                  <p>Tehla Bypass Alwar road, Rajgarh, Rajasthan</p>
                </div>
              </div>

              {/* Photo Section — locked square frame, image always fills it via object-fit: cover */}
              <div className="id-photo-container">
                <div className="id-photo-frame">
                  <img src={getStudentPhoto(student)} alt={student.name} />
                </div>
              </div>

              {/* Identity Info */}
              <div className="id-bio-section">
                <h4 className="id-student-name">{student.name}</h4>
                <div className="id-student-meta">
                  Class: {student.class} | Roll: {student.rollNo}
                </div>
              </div>

              {/* Table Data */}
              <div className="id-info-table">
                <div className="id-info-row">
                  <span>Father Name</span>
                  <span className="id-colon">:</span>
                  <strong>{student.fatherName}</strong>
                </div>
                <div className="id-info-row">
                  <span>Mother Name</span>
                  <span className="id-colon">:</span>
                  <strong>{student.motherName}</strong>
                </div>
                <div className="id-info-row">
                  <span>Date of Birth</span>
                  <span className="id-colon">:</span>
                  <strong>{student.dob}</strong>
                </div>
                <div className="id-info-row">
                  <span>Contact No</span>
                  <span className="id-colon">:</span>
                  <strong>{student.phone}</strong>
                </div>
                <div className="id-info-row">
                  <span>Address</span>
                  <span className="id-colon">:</span>
                  <strong>{student.address}</strong>
                </div>
              </div>

              {/* Signature Footer */}
              <div className="id-card-footer">
                <p>Authorized Signatory</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentIdPreview;