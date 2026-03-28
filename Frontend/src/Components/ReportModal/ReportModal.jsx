import React from "react";
import html2pdf from "html2pdf.js";
import "./ReportModal.css";
import { IMAGE_URL } from "../../Api/Api";

const ReportModal = ({ viewData, setViewData, logo }) => {
  if (!viewData) return null;

  /* ================= PDF ================= */
  const handleDownloadPDF = () => {
    const element = document.getElementById("printArea");

    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0,
          filename: `${viewData.name}_Report.pdf`,
          html2canvas: {
            scale: 3,
            useCORS: true,
            allowTaint: true,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(element)
        .save();
    }, 500);
  };

  /* ================= NEW GRADE SYSTEM ================= */
  const gradeConfig = [
    { min: 81, max: 100, grade: "A" },
    { min: 61, max: 80, grade: "B" },
    { min: 41, max: 60, grade: "C" },
    { min: 33, max: 40, grade: "D" },
    { min: 0, max: 32, grade: "E" },
  ];

  /* ================= GRADE FUNCTION ================= */
  const getGrade = (marks, fullMarks) => {
    if (!fullMarks) return "-";

    const percent = (marks / fullMarks) * 100;

    const found = gradeConfig.find((g) => percent >= g.min && percent <= g.max);

    return found ? found.grade : "-";
  };

  return (
    <div className="reports-overlay">
      <div id="printArea" className="reports-card">
        {/* HEADER */}
        <div className="reports-header">
          <img src={logo} alt="logo" className="reports-logo" />

          <div className="reports-title-box">
            <h1 className="reports-title">
              Learning Step International School
            </h1>

            {/* ✅ ADD ADDRESS HERE */}
            <p className="reports-address">
              Tehla Bypass, Alwar Road, Rajgarh – 301408
            </p>

            <p className="reports-subtitle">Report Card - 2025-26</p>
          </div>
        </div>

        <hr />

        {/* INFO */}
        <div className="reports-info reports-box">
          <div>
            <p>
              <b>Name:</b> {viewData.name || "-"}
            </p>
            <p>
              <b>Father:</b> {viewData.fatherName || "-"}
            </p>
            <p>
              <b>Mother:</b> {viewData.motherName || "-"}
            </p>
            <p>
              <b>Admission No:</b> {viewData.admissionNo || "-"}
            </p>
            <p>
              <b>Aadhaar:</b> {viewData.aadhaarNumber || "-"}
            </p>
          </div>

          <div>
            <p>
              <b>Roll:</b> {viewData.rollNumber || "-"}
            </p>
            <p>
              <b>Class:</b>{" "}
              {viewData.class || viewData.classId?.className || "-"}
            </p>
            <p>
              <b>DOB:</b>{" "}
              {viewData.dob ? new Date(viewData.dob).toLocaleDateString() : "-"}
            </p>
            <p>
              <b>Blood:</b> {viewData.bloodGroup || "-"}
            </p>
          </div>
        </div>

        {/* SUBJECT TABLE */}
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Subject</th>
                {/* <th>Full Marks</th> */}
                {/* <th>Marks</th> */}
                <th>Grade</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {viewData.subjects?.map((sub, i) => {
                const grade = getGrade(sub.marks, sub.fullMarks);

                return (
                  <tr key={i}>
                    <td>{sub.subject}</td>
                    {/* <td>{sub.fullMarks}</td> */}
                    {/* <td></td> */}
                    <td>
                      <span className={`grade-badge ${grade.toLowerCase()}`}>
                        {grade}
                      </span>
                    </td>
                    <td></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ✅ GRADE TABLE (LIKE IMAGE) */}
        <div className="reports-grade-scale">
          <table className="reports-grade-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Grade</th>
                <th>Marks</th>
              </tr>
            </thead>

            <tbody>
              {gradeConfig.map((g, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{g.grade}</td>
                  <td>
                    {g.min} - {g.max}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        <div className="reports-summary">
          <p>
            <b>Total:</b> {viewData.total} / {viewData.fullMarks}
          </p>
          <p>
            <b>Percentage:</b> {viewData.percentage?.toFixed(2)}%
          </p>
          <p>
            <b>Grade:</b> {viewData.grade}
          </p>
          <p>
            <b>Result:</b>{" "}
            <span className={viewData.result === "Fail" ? "fail" : "pass"}>
              {viewData.result}
            </span>
          </p>
        </div>

        {/* ✅ NOTE SECTION */}
        <div className="reports-note">
          <p>
            <b>Note:</b> This is an internet generated marksheet, original
            marksheet will be issued separately. Only for Admission and T.C.
            Purpose.
          </p>
        </div>

        {/* SIGN */}
        <div className="reports-sign">
          <div>
            <div className="line" />
            <p>Parent</p>
          </div>
          <div>
            <div className="line" />
            <p>Teacher</p>
          </div>
          <div>
            <div className="line" />
            <p>Principal</p>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="reports-buttons">
        <button className="btn green" onClick={handleDownloadPDF}>
          PDF
        </button>

        <button className="btn black" onClick={() => setViewData(null)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
