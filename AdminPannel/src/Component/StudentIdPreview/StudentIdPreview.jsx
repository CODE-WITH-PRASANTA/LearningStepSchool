import React from "react";
import "./StudentIdPreview.css";

import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { IMAGE_URL } from "../../api/axios";

// Static Asset Imports
import abstractBg from "../../Assets/mainicard.png";
import signatureImg from "../../Assets/sign-pri.png";

const StudentIdPreview = ({ students = [], onBack, onPrint }) => {
  /* =====================================================
      STUDENT PHOTO URL
  ===================================================== */
  const getStudentPhoto = (student) => {
    const photo = student.photo || student.studentPhoto;
    if (!photo) return "";

    if (/^https?:\/\//i.test(photo)) {
      return photo;
    }

    return `${IMAGE_URL}/${photo.replace(/^\/+/, "")}`;
  };

  /* =====================================================
      GENERATE FORMATTED STUDENT ID
  ===================================================== */
  const getFormattedStudentId = (student) => {
    const sessionStr = String(student.session || "");
    const yearMatch = sessionStr.match(/\d{4}/);
    const sessionYear = yearMatch ? yearMatch[0] : "";

    const rawAdmission =
      student.admissionNo !== undefined && student.admissionNo !== null && student.admissionNo !== ""
        ? String(student.admissionNo).trim()
        : student.rollNumber !== undefined && student.rollNumber !== null && student.rollNumber !== ""
        ? String(student.rollNumber).trim()
        : student.studentId !== undefined && student.studentId !== null && student.studentId !== ""
        ? String(student.studentId).trim()
        : "";

    let admissionPart = rawAdmission;
    if (/^\d{1,2}$/.test(rawAdmission)) {
      admissionPart = rawAdmission.padStart(4, "0");
    }

    if (sessionYear && admissionPart) {
      return `${sessionYear}-LS-${admissionPart}`;
    }

    if (admissionPart) {
      return `LS-${admissionPart}`;
    }

    return student.id || student._id || "N/A";
  };

  /* =====================================================
      DATE FORMAT: YYYY-MM-DD -> DD/MM/YYYY
  ===================================================== */
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const value = String(dateValue).trim();
    const parts = value.split("-");

    if (parts.length === 3) {
      const [year, month, day] = parts;
      const fullYear = year.length === 2 ? `20${year}` : year;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${fullYear}`;
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="id-preview-container">
      {/* TOOLBAR */}
      <div className="id-preview-toolbar no-print">
        <div className="id-preview-title">
          <h2>Student ID Card Preview</h2>
          <p>Preview & Print Student Identity Cards</p>
        </div>

        <div className="id-preview-actions">
          <button type="button" className="id-btn-back" onClick={onBack}>
            <FaArrowLeft />
            Back
          </button>

          <button type="button" className="id-btn-print" onClick={onPrint}>
            <FaPrint />
            Print ID Cards
          </button>
        </div>
      </div>

      {/* PRINT AREA */}
      <div className="id-print-area" id="StudentIdPreview-printArea">
        <div className="id-card-grid">
          {students.map((student) => {
            const formattedStudentId = getFormattedStudentId(student);

            const fullName =
              student.name ||
              student.studentName ||
              `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
              "N/A";

            const fullAddress =
              student.currentAddress ||
              student.permanentAddress ||
              student.address ||
              "N/A";

            const studentPhotoUrl = getStudentPhoto(student);

            return (
              <div
                className="exact-ref-card"
                key={student._id || student.id || formattedStudentId}
                style={{ backgroundImage: `url(${abstractBg})` }}
              >
                {/* HEADER */}
                <div className="ref-card-header">
                  <div className="ref-header-text">
                    <h3 className="ref-school-title">
                      THE LEARNING STEP SCHOOL
                    </h3>
                    <p className="ref-school-address">
                      Tehla Bypass Alwar Road, Rajgarh, Rajasthan 301408
                    </p>
                  </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="ref-card-content">
                  {/* LEFT PHOTO + ID + ADDRESS */}
                  <div className="ref-photo-section">
                    <div className="ref-photo-frame">
                      {studentPhotoUrl ? (
                        <div
                          className="ref-photo-img"
                          style={{
                            backgroundImage: `url("${studentPhotoUrl}")`,
                          }}
                          role="img"
                          aria-label={fullName}
                        />
                      ) : (
                        <div className="ref-photo-placeholder">PHOTO</div>
                      )}
                    </div>

                    {/* BOLD STUDENT ID UNDER PHOTO */}
                    <div className="ref-student-id-label">
                      STUDENT ID: {formattedStudentId}
                    </div>

                    {/* ADDRESS DIRECTLY UNDER STUDENT ID */}
                    <div className="ref-under-id-address">
                      <span className="address-label">Address:</span>
                      <span className="address-val" title={fullAddress}>
                        {fullAddress}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT DETAILS */}
                  <div className="ref-details-section">
                    <div className="ref-details-title">STUDENT ID CARD</div>

                    {/* NAME */}
                    <div className="ref-data-row">
                      <span className="ref-data-label">Name</span>
                      <span className="ref-data-colon">:</span>
                      <span className="ref-data-value">{fullName}</span>
                    </div>

                    {/* FATHER */}
                    <div className="ref-data-row">
                      <span className="ref-data-label">Father</span>
                      <span className="ref-data-colon">:</span>
                      <span className="ref-data-value">
                        {student.fatherName || "N/A"}
                      </span>
                    </div>

                    {/* MOTHER */}
                    <div className="ref-data-row">
                      <span className="ref-data-label">Mother</span>
                      <span className="ref-data-colon">:</span>
                      <span className="ref-data-value">
                        {student.motherName || "N/A"}
                      </span>
                    </div>

                    {/* CLASS + SECTION */}
                    <div className="ref-data-row ref-class-sec-row">
                      <div className="ref-inline-field">
                        <span className="ref-data-label">Class</span>
                        <span className="ref-data-colon">:</span>
                        <span className="ref-data-value">
                          {student.class || student.className || "N/A"}
                        </span>
                      </div>
                      <div className="ref-inline-field ref-sec-field">
                        <span className="ref-sec-label">Section</span>
                        <span className="ref-data-colon">:</span>
                        <span className="ref-data-value">
                          {student.section || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* D.O.B */}
                    <div className="ref-data-row">
                      <span className="ref-data-label">D.O.B.</span>
                      <span className="ref-data-colon">:</span>
                      <span className="ref-data-value">
                        {formatDate(student.dob)}
                      </span>
                    </div>
                  </div>

                  {/* PRINCIPAL SIGNATURE + LABEL */}
                  <div className="ref-principal-signature">
                    <img
                      src={signatureImg}
                      alt="Signature"
                      className="signature-overlay"
                    />
                    <span className="signature-label">Principal</span>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="ref-card-footer">
                  <span className="footer-item">
                    Contact: +91 9887868746
                  </span>
                  <span className="footer-item">+91 7014627849</span>
                  <span className="footer-item">learningstepschool.in</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentIdPreview;