import React, { useRef } from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { IMAGE_URL } from "../../api/axios";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import logo from "../../Assets/Learning-Step-Logo-1.png";

import "./StudentGatepassPrint.css";

const StudentGatepassPrint = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const visitor = location.state || {};

  const pdfRef = useRef(null);

  const downloadPDF = async () => {
    const element = pdfRef.current;

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;

    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`GatePass-${visitor?.id || "Student"}.pdf`);
  };

  return (
    <div className="studentGatepassPrint">
      {/* Top Bar */}

      <div className="studentGatepassPrint__topbar">
        <button
          className="studentGatepassPrint__backBtn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Back
        </button>

        <button
          className="studentGatepassPrint__downloadBtn"
          onClick={downloadPDF}
        >
          <FaDownload />
          Download PDF
        </button>
      </div>

      {/* PDF Area */}

      <div ref={pdfRef} className="studentGatepassPrint__document">
        {/* Header */}

        <div className="studentGatepassPrint__header">
          <div className="studentGatepassPrint__logo">
            <img src={logo} alt="Learning Step School" />
          </div>

          <div className="studentGatepassPrint__school">
            <h1>LEARNING STEP SCHOOL</h1>

            <h3>Co-Educational Senior Secondary School</h3>

            <p>Affiliated to CBSE</p>

            <p>Tehla Bypass, Alwar Road, Rajgarh – 301408</p>

            <p>learningstepschool@gmail.com</p>
          </div>
        </div>

        {/* Title */}

        <div className="studentGatepassPrint__heading">STUDENT GATE PASS</div>

        {/* Date */}

        <div className="studentGatepassPrint__date">
          Date :{" "}
          {visitor?.createdAt
            ? new Date(visitor.createdAt).toLocaleDateString()
            : "-"}
        </div>

        {/* Content */}

        <div className="studentGatepassPrint__content">
          {/* Left Side */}

          <div className="studentGatepassPrint__detailsCard">
            <div className="studentGatepassPrint__field">
              <label>Visitor Name</label>

              <span>{visitor?.visitorName || "-"}</span>
            </div>

            <div className="studentGatepassPrint__field">
              <label>Relation</label>

              <span>{visitor?.relation || "-"}</span>
            </div>

            <div className="studentGatepassPrint__field">
              <label>Mobile Number</label>

              <span>{visitor?.phone || "-"}</span>
            </div>

            <div className="studentGatepassPrint__field">
              <label>Time In</label>

              <span>{visitor?.timeIn || "-"}</span>
            </div>

            <div className="studentGatepassPrint__field">
              <label>Time Out</label>

              <span>{visitor?.timeOut || "-"}</span>
            </div>

            <div className="studentGatepassPrint__field">
              <label>Purpose</label>

              <span>{visitor?.reason || "-"}</span>
            </div>

            <div
              className="
              studentGatepassPrint__field
              studentGatepassPrint__full
            "
            >
              <label>Student Information</label>

              <span>
                {visitor?.studentId
                  ? `${visitor.studentId.admissionNo || ""} - ${visitor.studentId.firstName || ""} ${visitor.studentId.lastName || ""}`.trim()
                  : "-"}
              </span>
            </div>

            <div
              className="
              studentGatepassPrint__field
              studentGatepassPrint__full
            "
            >
              <label>Remark</label>

              <span>{visitor?.remark || "-"}</span>
            </div>
          </div>

          {/* Photo Card */}

          <div className="studentGatepassPrint__photoCard">
            <div className="studentGatepassPrint__photoTitle">
              Visitor Photo
            </div>

            <img
              src={
                visitor?.photo
                  ? `${IMAGE_URL}${visitor.photo}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Visitor"
            />
          </div>
        </div>

        {/* Note */}

        <div className="studentGatepassPrint__note">
          This gate pass is issued by Learning Step School and must be presented
          to the security staff while entering or leaving the campus premises.
        </div>

        {/* Signatures */}

        <div className="studentGatepassPrint__signatureArea">
          <div className="studentGatepassPrint__signatureBox">
            <div className="studentGatepassPrint__signatureLine"></div>
            Parent Signature
          </div>

          <div className="studentGatepassPrint__signatureBox">
            <div className="studentGatepassPrint__signatureLine"></div>
            Teacher Signature
          </div>

          <div className="studentGatepassPrint__signatureBox">
            <div className="studentGatepassPrint__signatureLine"></div>
            Authorized Signature
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGatepassPrint;
