import React, { useRef } from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import logo from "../../Assets/Learning-Step-Logo-1.png";

import "./VisitorEnquiryPDF.css";

const VisitorEnquiryPDF = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const visitor = location.state || null;

  const pdfRef = useRef(null);

  if (!visitor) {
    return (
      <div className="visitorEnquiryPDF__noData">
        No Visitor Data Found
      </div>
    );
  }

  const downloadPDF = async () => {
    const canvas = await html2canvas(
      pdfRef.current,
      {
        scale: 2,
        useCORS: true,
      }
    );

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pdfWidth = 210;

    const pdfHeight =
      (canvas.height * pdfWidth) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(
      `VisitorPass-${visitor.name}.pdf`
    );
  };

  return (
    <div className="visitorEnquiryPDF">

      <div className="visitorEnquiryPDF__topbar">

        <button
          className="visitorEnquiryPDF__backBtn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Back
        </button>

        <button
          className="visitorEnquiryPDF__downloadBtn"
          onClick={downloadPDF}
        >
          <FaDownload />
          Download PDF
        </button>

      </div>

      <div
        ref={pdfRef}
        className="visitorEnquiryPDF__paper"
      >

        {/* HEADER */}

        <div className="visitorEnquiryPDF__header">

          <img
            src={logo}
            alt=""
            className="visitorEnquiryPDF__logo"
          />

          <div className="visitorEnquiryPDF__school">

            <h1>
              LEARNING STEP SCHOOL
            </h1>

            <h3>
              Co-Educational Senior Secondary School
            </h3>

            <p>
              Affiliated to CBSE
            </p>

            <p>
              Bhubaneswar, Odisha
            </p>

          </div>

        </div>

        {/* TITLE */}

        <div className="visitorEnquiryPDF__titleRow">

          <h2>
            VISITOR PASS
          </h2>

          <div>
            Date :
            {" "}
            {visitor.date}
          </div>

        </div>

        {/* CONTENT */}

        <div className="visitorEnquiryPDF__content">

          <div className="visitorEnquiryPDF__left">

            <div className="visitorEnquiryPDF__field">
              <strong>
                Visitor Name :
              </strong>
              <span>
                {visitor.name}
              </span>
            </div>

            <div className="visitorEnquiryPDF__field">
              <strong>
                Mobile No :
              </strong>
              <span>
                {visitor.contact}
              </span>
            </div>

            <div className="visitorEnquiryPDF__field">
              <strong>
                Purpose :
              </strong>
              <span>
                {visitor.purpose}
              </span>
            </div>

            <div className="visitorEnquiryPDF__field">
              <strong>
                Description :
              </strong>
              <span>
                {visitor.description}
              </span>
            </div>

            <div className="visitorEnquiryPDF__field">
              <strong>
                Enquiry Type :
              </strong>
              <span>
                {visitor.type}
              </span>
            </div>

          </div>

          <div className="visitorEnquiryPDF__photo">

            <img
              src={visitor.photo}
              alt=""
            />

          </div>

        </div>

        {/* SIGNATURE */}

        <div className="visitorEnquiryPDF__footer">

          <div>
            <div className="visitorEnquiryPDF__signLine" />
            Parent Signature
          </div>

          <div>
            <div className="visitorEnquiryPDF__signLine" />
            Signature
          </div>

        </div>

      </div>

    </div>
  );
};

export default VisitorEnquiryPDF;