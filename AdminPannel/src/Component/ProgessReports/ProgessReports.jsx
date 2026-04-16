import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import "./ProgessReports.css";

const ProgessReports = ({ viewData, setViewData }) => {
  const reportRef = useRef();

  if (!viewData) return null;

  // 🔥 DOWNLOAD PDF FUNCTION
  const downloadPDF = () => {
    const element = reportRef.current;

    const opt = {
      margin: 0,
      filename: `${viewData.name}_Report.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="pr-main">

      {/* 🔥 ACTION BAR (OUTSIDE PAGE) */}
      <div className="pr-actions no-print">
        <button onClick={() => setViewData(null)}>← Back</button>
        <button onClick={downloadPDF}>📄 Download PDF</button>
      </div>

      {/* 📄 A4 PAGE */}
      <div className="pr-page" ref={reportRef}>

        {/* 🏫 HEADER */}
        <div className="pr-header">
          <img src="/logo.png" alt="logo" />
          <div>
            <h2>Learning Step International School</h2>
            <p>Report Card - 2025-26</p>
          </div>
        </div>

        {/* 👤 STUDENT DETAILS */}
        <div className="pr-info">
          <div>
            <p><b>Name:</b> {viewData.name}</p>
            <p><b>Father's Name:</b> {viewData.fatherName || "-"}</p>
            <p><b>Mother's Name:</b> {viewData.motherName || "-"}</p>
            <p><b>Admission No:</b> {viewData.admissionNo || "-"}</p>
            <p><b>Aadhar No:</b> {viewData.aadhar || "-"}</p>
            <p><b>PEN No:</b> -</p>
          </div>

          <div>
            <p><b>Roll No:</b> {viewData.rollNumber}</p>
            <p><b>Class:</b> {viewData.class}</p>
            <p><b>DOB:</b> {viewData.dob || "-"}</p>
            <p><b>House:</b> {viewData.house || "-"}</p>
            <p><b>Blood Group:</b> {viewData.bloodGroup || "-"}</p>
            <p><b>Weight:</b> -</p>
          </div>
        </div>

        {/* 📊 TABLE */}
        <table className="pr-table">
          <thead>
            <tr>
              <th rowSpan="2">Subject</th>
              <th rowSpan="2">Full Marks</th>
              <th colSpan={viewData.exams?.length || 1}>Term</th>
              <th rowSpan="2">Total</th>
            </tr>

            <tr>
              {viewData.exams?.map((e, i) => (
                <th key={i}>{e}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {viewData.subjects?.map((sub, i) => {
              let total = 0;

              return (
                <tr key={i}>
                  <td>{sub.name}</td>
                  <td>100</td>

                  {viewData.exams?.map((e, idx) => {
                    const mark = Number(sub.exams?.[e]) || 0;
                    total += mark;
                    return <td key={idx}>{mark || "-"}</td>;
                  })}

                  <td className="bold">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 📊 GRADE LEGEND */}
        <div className="pr-grade">
          <div>A (81-100)</div>
          <div>B (61-80)</div>
          <div>C (41-60)</div>
          <div>D (33-40)</div>
          <div>E (0-32)</div>
        </div>

        {/* 📊 SUMMARY */}
        <div className="pr-summary">
          <p><b>Total:</b> {viewData.total} / {viewData.fullMarks}</p>
          <p><b>Percentage:</b> {viewData.percentage?.toFixed(2)}%</p>
          <p><b>Grade:</b> {viewData.grade}</p>
          <p><b>Rank:</b> 🏅 #1</p>
          <p><b>Result:</b> {viewData.grade === "Fail" ? "Fail" : "Pass"}</p>
        </div>

        {/* 📊 ATTENDANCE */}
        <div className="pr-attendance">
          <p>Working Days: 200</p>
          <p>Present: 140</p>
          <p>Attendance: 70%</p>
        </div>

        {/* 📝 REMARK */}
        <div className="pr-remark">
          Teacher Remark: Keep improving and stay consistent.
        </div>

        {/* ✍ SIGN */}
        <div className="pr-sign">
          <div>Parent</div>
          <div>Class Teacher</div>
          <div>Principal</div>
        </div>

      </div>
    </div>
  );
};

export default ProgessReports;