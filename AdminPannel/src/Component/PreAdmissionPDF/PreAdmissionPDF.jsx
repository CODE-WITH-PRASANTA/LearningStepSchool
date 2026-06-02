import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaArrowLeft, FaDownload } from "react-icons/fa";

import logo from "../../Assets/Learning-Step-Logo-1.png";

import "./PreAdmissionPDF.css";

const PreAdmissionPDF = () => {
  const pdfRef = useRef();

  const navigate = useNavigate();

  const { state } = useLocation();

  const data = state || {};

  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(
      `PreAdmission-${data.firstName || "Student"}.pdf`
    );
  };

  return (
    <div className="PreAdmissionPDF">

      <div className="PreAdmissionPDF__topBar">

        <button
          className="PreAdmissionPDF__backBtn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Back
        </button>

        <button
          className="PreAdmissionPDF__downloadBtn"
          onClick={downloadPDF}
        >
          <FaDownload />
          Download PDF
        </button>

      </div>

      <div
        className="PreAdmissionPDF__page"
        ref={pdfRef}
      >

        {/* HEADER */}

        <div className="PreAdmissionPDF__header">

          <div className="PreAdmissionPDF__logoWrap">
            <img
              src={logo}
              alt="logo"
              className="PreAdmissionPDF__logo"
            />
          </div>

          <div className="PreAdmissionPDF__schoolInfo">

            <h1>
              LEARNING STEP SCHOOL
            </h1>

            <p>
              Co-Educational Senior Secondary School
            </p>

            <p>
              Affiliated to CBSE
            </p>

            <p>
              Bhubaneswar, Odisha
            </p>

          </div>

        </div>

        <div className="PreAdmissionPDF__divider" />

        {/* TITLE */}

<div className="PreAdmissionPDF__titleRow">

  <h2 className="PreAdmissionPDF__title">
    PRE ADMISSION
  </h2>

  <span className="PreAdmissionPDF__date">
    Date : {new Date().toLocaleDateString("en-GB")}
  </span>

</div>

        {/* CONTENT */}

        <div className="PreAdmissionPDF__content">

          <div className="PreAdmissionPDF__details">

            <div className="PreAdmissionPDF__row">
              <span>
                Student Name :
              </span>

              <p>
                {data.firstName}{" "}
                {data.lastName}
              </p>
            </div>

            <div className="PreAdmissionPDF__doubleRow">

              <div>
                <span>Class :</span>
                <p>
                  {data.className}
                </p>
              </div>

              <div>
                <span>DOB :</span>
                <p>{data.dob}</p>
              </div>

            </div>

            <div className="PreAdmissionPDF__doubleRow">

              <div>
                <span>
                  Contact No :
                </span>

                <p>
                  {data.contactNo}
                </p>
              </div>

              <div>
                <span>Email :</span>
                <p>
                  {data.email}
                </p>
              </div>

            </div>

            <div className="PreAdmissionPDF__doubleRow">

              <div>
                <span>
                  Father Name :
                </span>

                <p>
                  {data.fatherName}
                </p>
              </div>

              <div>
                <span>
                  Father's Occupation :
                </span>

                <p>
                  {
                    data.fatherOccupation
                  }
                </p>
              </div>

            </div>

            <div className="PreAdmissionPDF__doubleRow">

              <div>
                <span>
                  Mother Name :
                </span>

                <p>
                  {data.motherName}
                </p>
              </div>

              <div>
                <span>
                  Mother's Occupation :
                </span>

                <p>
                  {
                    data.motherOccupation
                  }
                </p>
              </div>

            </div>

            <div className="PreAdmissionPDF__row">
              <span>
                Previous School :
              </span>

              <p>
                {
                  data.previousSchool
                }
              </p>
            </div>

            <div className="PreAdmissionPDF__row">
              <span>
                Father Address :
              </span>

              <p>
                {
                  data.fatherAddress
                }
              </p>
            </div>

            <div className="PreAdmissionPDF__row">
              <span>Remark :</span>

              <p>
                {data.remark}
              </p>
            </div>

          </div>

          <div className="PreAdmissionPDF__photoBox">

            <img
              src={
                data.photo ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt=""
            />

          </div>

        </div>

        {/* FOOTER */}

        <div className="PreAdmissionPDF__footer">

          <div>

            <div className="PreAdmissionPDF__signLine" />

            <span>
              Parent Signature
            </span>

          </div>

          <div>

            <div className="PreAdmissionPDF__signLine" />

            <span>
              Office Signature
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PreAdmissionPDF;