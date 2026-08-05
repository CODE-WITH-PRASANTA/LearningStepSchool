import React from "react";
import "./StudentIdPreview.css";
import { FaPrint, FaArrowLeft, FaGlobe } from "react-icons/fa";
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
      <div className="id-preview-toolbar no-print">
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
            <div className="exact-ref-card" key={student._id || student.id}>
              {/* Top Red Section */}
              <div className="ref-card-header">
                <div className="ref-header-text">
                  <h3 className="ref-school-title">THE LEARNING STEP SCHOOL</h3>
                  <p className="ref-school-address">
                    6HVX+F2V, Tehla Bypass Alwar Road , Rajgarh, Thana, Rajasthan 301408
                  </p>
                  <p className="ref-school-website">
                    <FaGlobe className="ref-web-icon" /> learningstepschool.in
                  </p>
                </div>
              </div>

              {/* Geometric Angle Container */}
              <div className="ref-shape-wrapper">
                {/* Center V-Banner Shape */}
                <div className="ref-v-banner"></div>
                {/* Left/Right Side Wing Accent Shapes */}
                <div className="ref-side-wing left"></div>
                <div className="ref-side-wing right"></div>

                {/* Larger Circular Photo Profile */}
                <div className="ref-photo-wrapper">
                  <div className="ref-photo-frame">
                    {getStudentPhoto(student) ? (
                      <img
                        src={getStudentPhoto(student)}
                        alt={student.name || student.studentName}
                      />
                    ) : (
                      <div className="ref-photo-placeholder" />
                    )}
                  </div>
                </div>
              </div>

              {/* Red Student Name Pill */}
              <div className="ref-name-pill-wrapper">
                <div className="ref-name-pill">
                  {student.name || student.studentName}
                </div>
              </div>

              {/* Information Table Section */}
              <div className="ref-details-grid">
                {[
                  { label: "Father's Name", value: student.fatherName },
                  { label: "Mother's Name", value: student.motherName },
                  { label: "Admi. No.", value: student.admissionNo || "N/A" },
                  { label: "Session", value: student.session || "2026-2027" },
                  {
                    label: "Class",
                    value: `${student.class || student.className || ""} ${
                      student.section || ""
                    }`.trim(),
                  },
                  { label: "Date of Birth", value: student.dob },
                  { label: "Address", value: student.address },
                  { label: "Contact No.", value: student.phone },
                ].map((item, index) => (
                  <div className="ref-data-row" key={index}>
                    <span className="ref-data-label">{item.label}</span>
                    <span className="ref-data-colon">:</span>
                    <strong className="ref-data-value">
                      {item.value || "N/A"}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Principal Signature Area */}
              <div className="ref-principal-signature">
                <span>Principal</span>
              </div>

              {/* Red Footer Bar */}
              <div className="ref-card-footer">
                School Contact - +91 70146 27894
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentIdPreview;