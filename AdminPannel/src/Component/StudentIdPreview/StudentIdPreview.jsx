import React from "react";
import "./StudentIdPreview.css";

import { FaPrint, FaArrowLeft, FaGlobe } from "react-icons/fa";

import { IMAGE_URL } from "../../api/axios";

const StudentIdPreview = ({ students, onBack, onPrint }) => {
  /* =====================================================
     STUDENT PHOTO URL
  ===================================================== */

  const getStudentPhoto = (student) => {
    const photo = student.photo || student.studentPhoto;

    if (!photo) return "";

    if (/^https?:\/\/+/i.test(photo)) {
      return photo;
    }

    return `${IMAGE_URL}/${photo.replace(/^\/+/, "")}`;
  };

  return (
    <div className="id-preview-container">

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="id-preview-toolbar no-print">

        <div className="id-preview-title">
          <h2>Student ID Card Preview</h2>

          <p>
            Preview & Print Student Identity Cards
          </p>
        </div>

        <div className="id-preview-actions">

          <button
            type="button"
            className="id-btn-back"
            onClick={onBack}
          >
            <FaArrowLeft />
            Back
          </button>

          <button
            type="button"
            className="id-btn-print"
            onClick={onPrint}
          >
            <FaPrint />
            Print ID Cards
          </button>

        </div>

      </div>


      {/* =====================================================
          PRINT AREA
      ===================================================== */}

      <div
        className="id-print-area"
        id="StudentIdPreview-printArea"
      >

        <div className="id-card-grid">

          {students.map((student) => (

            <div
              className="exact-ref-card"
              key={student._id || student.id}
            >

              {/* =================================================
                  TOP RED SECTION
              ================================================= */}

              <div className="ref-card-header">

                <div className="ref-header-text">

                  <h3 className="ref-school-title">
                    THE LEARNING STEP SCHOOL
                  </h3>

                  {/* 6HVX+F2V REMOVED */}
                  <p className="ref-school-address">
                    Tehla Bypass Alwar Road, Rajgarh, Thana,
                    Rajasthan 301408
                  </p>

                  {/* TOP WEBSITE REMOVED */}

                </div>

              </div>


              {/* =================================================
                  GEOMETRIC SHAPE + PHOTO
              ================================================= */}

              <div className="ref-shape-wrapper">

                {/* Center V-Banner Shape */}
                <div className="ref-v-banner"></div>

                {/* Left Wing */}
                <div className="ref-side-wing left"></div>

                {/* Right Wing */}
                <div className="ref-side-wing right"></div>


                {/* =================================================
                    PHOTO
                ================================================= */}

                <div className="ref-photo-wrapper">

                  <div className="ref-photo-frame">

                    {getStudentPhoto(student) ? (

                      <img
                        src={getStudentPhoto(student)}
                        alt={
                          student.name ||
                          student.studentName ||
                          "Student"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          display: "block",
                        }}
                      />

                    ) : (

                      <div className="ref-photo-placeholder"></div>

                    )}

                  </div>

                </div>

              </div>


              {/* =================================================
                  STUDENT NAME
              ================================================= */}

              <div className="ref-name-pill-wrapper">

                <div className="ref-name-pill">

                  {student.name || student.studentName}

                </div>

              </div>


              {/* =================================================
                  STUDENT DETAILS
              ================================================= */}

              <div className="ref-details-grid">

                {[
                  {
                    label: "Father's Name",
                    value: student.fatherName,
                  },

                  {
                    label: "Mother's Name",
                    value: student.motherName,
                  },

                  {
                    label: "Admi. No.",
                    value: student.admissionNo || "N/A",
                  },

                  {
                    label: "Session",
                    value: student.session || "2026-2027",
                  },

                  {
                    label: "Class",
                    value: `${student.class || student.className || ""} ${
                      student.section || ""
                    }`.trim(),
                  },

                  {
                    label: "Date of Birth",
                    value: student.dob,
                  },

                  {
                    label: "Address",
                    value: student.address,
                  },

                  {
                    label: "Contact No.",
                    value: student.phone,
                  },

                ].map((item, index) => (

                  <div
                    className="ref-data-row"
                    key={index}
                  >

                    <span className="ref-data-label">
                      {item.label}
                    </span>

                    <span className="ref-data-colon">
                      :
                    </span>

                    <strong className="ref-data-value">
                      {item.value || "N/A"}
                    </strong>

                  </div>

                ))}

              </div>


              {/* =================================================
                  PRINCIPAL
              ================================================= */}

              <div className="ref-principal-signature">
                <span>Principal</span>
              </div>


              {/* =================================================
                  UPDATED FOOTER
              ================================================= */}

              <div className="ref-card-footer">

                <div className="ref-footer-contact">
                  School Contact - +91 9887868746 | +91 7014627849
                </div>

                <div className="ref-footer-web">
                  Web:- learningstepschool.in
                </div>

                <div className="ref-footer-email">
                  Email:- learningstep19@gmail.com
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