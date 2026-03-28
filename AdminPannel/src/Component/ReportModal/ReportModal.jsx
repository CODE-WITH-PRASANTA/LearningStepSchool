import React from "react";
import html2pdf from "html2pdf.js";
import "./ReportModal.css";
import { IMAGE_URL } from "../../api/axios";

const ReportModal = ({ viewData, setViewData, logo }) => {
  if (!viewData) return null;

  const handleDownloadPDF = () => {
    const element = document.getElementById("printArea");

    // ⏳ WAIT FOR IMAGE LOAD (IMPORTANT)
    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0,
          filename: `${viewData.name}_Report.pdf`,
          html2canvas: {
            scale: 3,
            useCORS: true, // ✅ FIX
            allowTaint: true, // ✅ FIX
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(element)
        .save();
    }, 500); // wait for image load
  };

  const gradeConfig = [
    { min: 91, grade: "A1", point: 10 },
    { min: 81, grade: "A2", point: 9 },
    { min: 71, grade: "B1", point: 8 },
    { min: 61, grade: "B2", point: 7 },
    { min: 51, grade: "C1", point: 6 },
    { min: 41, grade: "C2", point: 5 },
    { min: 33, grade: "D", point: 4 },
    { min: 0, grade: "E", point: 0 },
  ];

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
            <p className="reports-subtitle">Report Card - 2025-26</p>
          </div>

          <div className="reports-student-photo">
            <img
              crossOrigin="anonymous" // 🔥 VERY IMPORTANT
              src={
                viewData.studentPhoto
                  ? `${IMAGE_URL}${viewData.studentPhoto}`
                  : "https://via.placeholder.com/80"
              }
              alt="student"
            />
          </div>
        </div>

        <hr />

        {/* INFO */}
        <div className="reports-info reports-box">
          <div>
            <p>
              <b>Name of Student:</b> {viewData.name || "-"}
            </p>
            <p>
              <b>Father's Name:</b> {viewData.fatherName || "-"}
            </p>
            <p>
              <b>Mother's Name:</b> {viewData.motherName || "-"}
            </p>
            <p>
              <b>Admission No:</b> {viewData.admissionNo || "-"}
            </p>
            <p>
              <b>Aadhaar No:</b> {viewData.aadhaarNumber || "-"}
            </p>
            <p>
              <b>Height:</b> {viewData.height || "-"}
            </p>
            <p>
              <b>PEN No:</b> {viewData.penNo || "-"}
            </p>
          </div>

          <div>
            <p>
              <b>Roll No:</b> {viewData.rollNumber || "-"}
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
              <b>House Name:</b> {viewData.houseName || "-"}
            </p>
            <p>
              <b>Blood Group:</b> {viewData.bloodGroup || "-"}
            </p>
            <p>
              <b>Weight:</b> {viewData.weight || "-"}
            </p>
          </div>
        </div>

        {/* SUBJECT TABLE */}
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th rowSpan="2">Subject</th>
                <th rowSpan="2">Full Marks</th>
                <th colSpan="2">Term</th>
                <th colSpan="2">Final</th>
                <th rowSpan="2">Total</th>
              </tr>
              <tr>
                <th>Marks</th>
                <th>Grade</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>

            <tbody>
              {viewData.subjects?.map((sub, i) => {
                const getGrade = (marks, fullMarks) => {
                  if (!fullMarks) return "-";

                  const percent = (marks / fullMarks) * 100;

                  const found = gradeConfig.find((g) => percent >= g.min);

                  return found ? found.grade : "-";
                };

                const grade = getGrade(sub.marks, sub.fullMarks);

                return (
                  <tr key={i}>
                    <td className="reports-subject">{sub.subject}</td>

                    {/* FULL MARK */}
                    <td className="full-mark">{sub.fullMarks || "-"}</td>

                    <td className="mark">{sub.marks}</td>

                    {/* 🔥 PREMIUM GRADE BADGE */}
                    <td>
                      <span className={`grade-badge ${grade.toLowerCase()}`}>
                        {grade}
                      </span>
                    </td>

                    <td>-</td>
                    <td>-</td>

                    {/* TOTAL */}
                    <td className="total">
                      {sub.marks} / {sub.fullMarks || 100}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* GRADING SCALE */}
        <div className="reports-grade-scale small">
          <table className="reports-grade-table small">
            <tbody>
              {/* 🔥 GRADE ROW */}
              <tr>
                <td>
                  <b>Grade</b>
                </td>
                {gradeConfig.map((g, i) => (
                  <td key={i}>{g.grade}</td>
                ))}
              </tr>

              {/* 🔥 POINT ROW */}
              <tr>
                <td>
                  <b>Point</b>
                </td>
                {gradeConfig.map((g, i) => (
                  <td key={i}>{g.point}</td>
                ))}
              </tr>

              {/* 🔥 MIN % ROW */}
              <tr>
                <td>
                  <b>Min %</b>
                </td>
                {gradeConfig.map((g, i) => (
                  <td key={i}>{g.min}+</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        <div className="reports-summary">
          <p>
            <b>Total:</b> {viewData.total} / {viewData.fullMarks}
          </p>
          <p>
            <b>Percentage:</b> {viewData.percentage?.toFixed(2) || "0.00"}%
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

        {/* ATTENDANCE */}
        <div className="reports-attendance">
          <p>
            <b>Working Days:</b> 200
          </p>
          <p>
            <b>Present:</b> 140
          </p>
          <p>
            <b>Attendance:</b> 70%
          </p>
        </div>

        {/* REMARK */}
        <div className="reports-remark">
          <p>
            <b>Teacher Remark:</b> Keep improving and stay consistent.
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
            <p>Class Teacher</p>
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

        <button className="btn" onClick={() => window.print()}>
          Print
        </button>

        <button className="btn black" onClick={() => setViewData(null)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
