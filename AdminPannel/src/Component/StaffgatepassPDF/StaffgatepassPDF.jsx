import React, { useRef } from "react";
import {
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import logo from "../../Assets/Learning-Step-Logo-1.png";

import "./StaffGatePassPDF.css";

const StaffGatePassPDF = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const staff = location.state || null;

  const pdfRef = useRef(null);

  if (!staff) {
    return (
      <div className="staffGatePassPDF__nodata">
        No Staff Data Found
      </div>
    );
  }

  const downloadPDF = async () => {

    const canvas = await html2canvas(
      pdfRef.current,
      {
        scale: 2,
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
      `StaffGatePass-${staff.name}.pdf`
    );
  };

  return (
<div className="staffGatePassPDF">

  {/* TOPBAR SECTION */}
  <div className="staffGatePassPDF__topbarSection">

    <div className="staffGatePassPDF__topbar">

      <button
        className="staffGatePassPDF__backBtn"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        Back
      </button>

      <button
        className="staffGatePassPDF__downloadBtn"
        onClick={downloadPDF}
      >
        <FaDownload />
        Download PDF
      </button>

    </div>

  </div>

  {/* DOCUMENT */}
  <div
    ref={pdfRef}
    className="staffGatePassPDF__document"
  >

    {/* HEADER SECTION */}
    <div className="staffGatePassPDF__headerSection">

      <div className="staffGatePassPDF__header">

        <div className="staffGatePassPDF__logoSection">

          <img
            src={logo}
            alt="School Logo"
            className="staffGatePassPDF__logoImage"
          />

        </div>

        <div className="staffGatePassPDF__schoolSection">

          <h1 className="staffGatePassPDF__schoolTitle">
            LEARNING STEP SCHOOL
          </h1>

          <h3 className="staffGatePassPDF__schoolSubtitle">
            Co-Educational Senior Secondary School
          </h3>

          <p className="staffGatePassPDF__schoolText">
            Affiliated to CBSE
          </p>

          <p className="staffGatePassPDF__schoolText">
            Bhubaneswar, Odisha
          </p>

        </div>

      </div>

    </div>

    {/* TITLE SECTION */}
    <div className="staffGatePassPDF__titleSection">

      <div className="staffGatePassPDF__heading">
        STAFF GATE PASS
      </div>

    </div>

    {/* DATE SECTION */}
    <div className="staffGatePassPDF__dateSection">

      <div className="staffGatePassPDF__date">
        Date : {staff.date}
      </div>

    </div>

    {/* CONTENT SECTION */}
    <div className="staffGatePassPDF__contentSection">

      <div className="staffGatePassPDF__content">

        {/* DETAILS SECTION */}
        <div className="staffGatePassPDF__detailsSection">

          <div className="staffGatePassPDF__detailsCard">

            <div className="staffGatePassPDF__field">
              <label className="staffGatePassPDF__fieldLabel">
                Name
              </label>

              <span className="staffGatePassPDF__fieldValue">
                {staff.name}
              </span>
            </div>

            <div className="staffGatePassPDF__field">
              <label className="staffGatePassPDF__fieldLabel">
                Department
              </label>

              <span className="staffGatePassPDF__fieldValue">
                {staff.department}
              </span>
            </div>

            <div className="staffGatePassPDF__field">
              <label className="staffGatePassPDF__fieldLabel">
                Designation
              </label>

              <span className="staffGatePassPDF__fieldValue">
                {staff.designation}
              </span>
            </div>

            <div className="staffGatePassPDF__field">
              <label className="staffGatePassPDF__fieldLabel">
                Contact
              </label>

              <span className="staffGatePassPDF__fieldValue">
                9999999999
              </span>
            </div>

            <div className="staffGatePassPDF__field">
              <label className="staffGatePassPDF__fieldLabel">
                Time
              </label>

              <span className="staffGatePassPDF__fieldValue">
                {staff.time}
              </span>
            </div>

            <div className="staffGatePassPDF__field">
              <label className="staffGatePassPDF__fieldLabel">
                Purpose
              </label>

              <span className="staffGatePassPDF__fieldValue">
                {staff.reason}
              </span>
            </div>

            <div className="staffGatePassPDF__field staffGatePassPDF__field--full">

              <label className="staffGatePassPDF__fieldLabel">
                Remark
              </label>

              <span className="staffGatePassPDF__fieldValue">
                {staff.remark}
              </span>

            </div>

          </div>

        </div>

        {/* PHOTO SECTION */}
        <div className="staffGatePassPDF__photoSection">

          <div className="staffGatePassPDF__photoCard">

            <div className="staffGatePassPDF__photoTitle">
              Staff Photo
            </div>

            <img
              src={staff.photo}
              alt={staff.name}
              className="staffGatePassPDF__photoImage"
            />

          </div>

        </div>

      </div>

    </div>

    {/* NOTE SECTION */}
    <div className="staffGatePassPDF__noteSection">

      <div className="staffGatePassPDF__note">

        This gate pass is issued by
        Learning Step School and must
        be shown to security personnel
        during entry and exit.

      </div>

    </div>

    {/* SIGNATURE SECTION */}
    <div className="staffGatePassPDF__signatureSection">

      <div className="staffGatePassPDF__signatureArea">

        <div className="staffGatePassPDF__signatureBox">

          <div className="staffGatePassPDF__signatureLine"></div>

          <div className="staffGatePassPDF__signatureText">
            Staff Signature
          </div>

        </div>

        <div className="staffGatePassPDF__signatureBox">

          <div className="staffGatePassPDF__signatureLine"></div>

          <div className="staffGatePassPDF__signatureText">
            Authorized Signature
          </div>

        </div>

      </div>

    </div>

  </div>

</div>
  );
};

export default StaffGatePassPDF;