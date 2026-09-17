import React from "react";
import "./StudentIdPreview.css";

import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { IMAGE_URL } from "../../api/axios";

const StudentIdPreview = ({ students, onBack, onPrint }) => {
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
     DATE FORMAT
     YYYY-MM-DD -> DD/MM/YY
  ===================================================== */

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const value = String(dateValue);
    const parts = value.split("-");

    if (parts.length === 3) {
      const [year, month, day] = parts;

      return `${day.padStart(2, "0")}/${month.padStart(
        2,
        "0"
      )}/${year.slice(-2)}`;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="id-preview-container">

      {/* =====================================================
          PREVIEW TOOLBAR
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
                  HEADER
              ================================================= */}

              <div className="ref-card-header">

                <div className="ref-header-text">

                  <h3 className="ref-school-title">
                    THE LEARNING STEP SCHOOL
                  </h3>

                  <p className="ref-school-address">
                    Tehla Bypass Alwar Road, Rajgarh, Thana,
                    Rajasthan 301408
                  </p>

                </div>

              </div>


              {/* =================================================
                  MAIN CONTENT
              ================================================= */}

              <div className="ref-card-content">

                {/* =================================================
                    LEFT PHOTO
                ================================================= */}

                <div className="ref-photo-section">

                  <div className="ref-photo-frame">

                    {getStudentPhoto(student) ? (

                      <img
                        src={getStudentPhoto(student)}
                        alt={
                          student.name ||
                          student.studentName ||
                          "Student"
                        }
                      />

                    ) : (

                      <div className="ref-photo-placeholder">
                        PHOTO
                      </div>

                    )}

                  </div>

                </div>


                {/* =================================================
                    RIGHT DETAILS
                ================================================= */}

                <div className="ref-details-section">

                  {/* STUDENT ID CARD TITLE */}

                  <div className="ref-details-title">
                    STUDENT ID CARD
                  </div>


                  {/* STUDENT NAME */}

                  <div className="ref-data-row ref-name-row">

                    <span className="ref-data-label">
                      Name
                    </span>

                    <span className="ref-data-colon">
                      :
                    </span>

                    <strong className="ref-data-value">
                      {student.name ||
                        student.studentName ||
                        "N/A"}
                    </strong>

                  </div>


                  {/* FATHER */}

                  <div className="ref-data-row">

                    <span className="ref-data-label">
                      Father
                    </span>

                    <span className="ref-data-colon">
                      :
                    </span>

                    <strong className="ref-data-value">
                      {student.fatherName || "N/A"}
                    </strong>

                  </div>


                  {/* MOTHER */}

                  <div className="ref-data-row">

                    <span className="ref-data-label">
                      Mother
                    </span>

                    <span className="ref-data-colon">
                      :
                    </span>

                    <strong className="ref-data-value">
                      {student.motherName || "N/A"}
                    </strong>

                  </div>


                  {/* =================================================
                      CLASS + SECTION SAME LINE
                  ================================================= */}

                  <div className="ref-class-section-row">

                    <div className="ref-small-data">

                      <span className="ref-small-label">
                        Class
                      </span>

                      <span className="ref-small-colon">
                        :
                      </span>

                      <strong className="ref-small-value">
                        {student.class ||
                          student.className ||
                          "N/A"}
                      </strong>

                    </div>


                    <div className="ref-small-data">

                      <span className="ref-small-label">
                        Section
                      </span>

                      <span className="ref-small-colon">
                        :
                      </span>

                      <strong className="ref-small-value">
                        {student.section || "N/A"}
                      </strong>

                    </div>

                  </div>


                  {/* DATE OF BIRTH */}

                  <div className="ref-data-row">

                    <span className="ref-data-label">
                      D.O.B.
                    </span>

                    <span className="ref-data-colon">
                      :
                    </span>

                    <strong className="ref-data-value">
                      {formatDate(student.dob)}
                    </strong>

                  </div>


                  {/* ADDRESS */}

                  <div className="ref-data-row ref-address-row">

                    <span className="ref-data-label">
                      Address
                    </span>

                    <span className="ref-data-colon">
                      :
                    </span>

                    <strong className="ref-data-value">
                      {student.address || "N/A"}
                    </strong>

                  </div>

                </div>


                {/* =================================================
                    PRINCIPAL
                ================================================= */}

                <div className="ref-principal">
                  Principal
                </div>

              </div>


              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="ref-card-footer">

                <span className="footer-contact">
                  Contact: +91 9887868746
                </span>

                <span className="footer-phone">
                  +91 7014627849
                </span>

                <span className="footer-web">
                  learningstepschool.in
                </span>

                <span className="footer-email">
                  learningstep19@gmail.com
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default StudentIdPreview;