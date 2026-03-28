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
            scale: 2,
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
                const getGrade = (marks) => {
                  if (marks >= 91) return "A1";
                  if (marks >= 81) return "A2";
                  if (marks >= 71) return "B1";
                  if (marks >= 61) return "B2";
                  if (marks >= 51) return "C1";
                  if (marks >= 41) return "C2";
                  if (marks >= 33) return "D";
                  return "E"; // Fail
                };

                const grade = getGrade(sub.marks);

                return (
                  <tr key={i}>
                    <td className="reports-subject">{sub.subject}</td>

                    {/* FULL MARK */}
                    <td className="full-mark">100</td>

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
                    <td className="total">{sub.marks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* GRADING SCALE */}
        <div className="reports-grade-scale">
          <table className="reports-grade-table">
            <thead>
              <tr>
                <th>Mark Range</th>
                <th>91-100</th>
                <th>0-33</th>
                <th>22-32</th>
                <th>81-91</th>
                <th>71-81</th>
                <th>61-70</th>
                <th>51-60</th>
                <th>41-50</th>
                <th>80-100</th>
                <th>62-80</th>
                <th>40-60</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Grade</b>
                </td>
                <td>A1</td>
                <td>E1</td>
                <td>TE</td>
                <td>A2</td>
                <td>B1</td>
                <td>B2</td>
                <td>C1</td>
                <td>C2</td>
                <td>A</td>
                <td>B</td>
                <td>D</td>
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
