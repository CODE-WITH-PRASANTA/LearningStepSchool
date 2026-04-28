import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import "./ProgessReports.css";

const ProgessReports = ({ viewData, setViewData }) => {
  const reportRef = useRef();

  // console.log("Viewing Report:", viewData);

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

          <img
            src={viewData.student?.studentPhoto || "/default.png"}
            className="student-photo"
            alt="student"
          />
        </div>

        {/* 👤 STUDENT DETAILS */}
        <div className="pr-info">
          <div>
            <p>
              <b>Name:</b> {viewData?.name || "-"}
            </p>
            <p>
              <b>Father's Name:</b> {viewData?.fatherName || "-"}
            </p>
            <p>
              <b>Mother's Name:</b> {viewData?.motherName || "-"}
            </p>
            <p>
              <b>Admission No:</b> {viewData?.admissionNo || "-"}
            </p>
            <p>
              <b>Aadhar No:</b> {viewData?.aadhar || "-"}
            </p>
            <p>
              <b>PEN No:</b> {viewData?.penNo || "-"}
            </p>
          </div>

          <div>
            <p>
              <b>Roll No:</b> {viewData?.rollNumber || "-"}
            </p>
            <p>
              <b>Class:</b> {viewData?.class || "-"}
            </p>

            <p>
              <b>DOB:</b>{" "}
              {viewData?.dob
                ? new Date(viewData.dob).toLocaleDateString("en-GB")
                : "-"}
            </p>

            <p>
              <b>House:</b> {viewData?.house || "-"}
            </p>
            <p>
              <b>Blood Group:</b> {viewData?.bloodGroup || "-"}
            </p>
            <p>
              <b>Weight:</b> {viewData?.weight || "-"}
            </p>
          </div>
        </div>
        {/* 📊 TABLE */}
        <table className="pr-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th colSpan={viewData.exams?.length || 1}>Term</th>
              <th>Total</th>
            </tr>

            <tr>
              <th></th>
              {viewData.exams?.map((e, i) => (
                <th key={i}>{e}</th>
              ))}
              <th></th>
            </tr>
          </thead>

          <tbody>
            {/* ✅ FULL MARKS ROW */}
            <tr>
              <td>
                <b>Full Marks</b>
              </td>

              {viewData.exams?.map((e, idx) => {
                const subjectWithMarks = viewData.subjects?.find(
                  (s) => s.fullMarks && s.fullMarks[e],
                );

                return (
                  <td key={idx}>{subjectWithMarks?.fullMarks?.[e] || "-"}</td>
                );
              })}

              <td>-</td>
            </tr>

            {/* 🔽 SUBJECT ROWS */}
            {viewData.subjects?.map((sub, i) => {
              let total = 0;

              return (
                <tr
                  key={i}
                  style={{
                    background:
                      (sub.type || "regular") === "optional"
                        ? "#eef6ff"
                        : "white",
                  }}
                >
                  <td>
                    {sub.name}
                    {sub.type === "optional" && (
                      <span
                        style={{
                          color: "blue",
                          fontSize: "12px",
                          marginLeft: "6px",
                        }}
                      >
                        (Optional)
                      </span>
                    )}
                  </td>

                  {viewData.exams?.map((e, idx) => {
                    const mark = Number(sub.exams?.[e]) || 0;

                    // ❌ DO NOT add optional to total
                    if ((sub.type || "regular") === "regular") {
                      total += mark;
                    }

                    return <td key={idx}>{mark || "-"}</td>;
                  })}

                  <td className="bold">{total}</td>
                </tr>
              );
            })}

            {/* 🔥 ✅ ADD THIS ROW */}
            <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
              <td>Term Total</td>

              {viewData.exams?.map((e, idx) => {
                let termTotal = 0;

                viewData.subjects?.forEach((sub) => {
                  if ((sub.type || "regular") === "regular") {
                    termTotal += Number(sub.exams?.[e]) || 0;
                  }
                });

                return <td key={idx}>{termTotal}</td>;
              })}

              <td>{viewData.total}</td>
            </tr>
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
        <div className="pr-summary-card">
          <div className="pr-summary-item">
            <span>Total</span>
            <strong>
              {viewData.total} / {viewData.fullMarks}
            </strong>
          </div>

          <div className="pr-summary-item">
            <span>Percentage</span>
            <strong>{viewData.percentage?.toFixed(2)}%</strong>
          </div>

          <div className="pr-summary-item">
            <span>Grade</span>
            <strong
              className={`grade ${viewData.grade === "Fail" ? "fail" : "pass"}`}
            >
              {viewData.grade}
            </strong>
          </div>

          <div className="pr-summary-item">
            <span>Rank</span>
            <strong>🏅 #1</strong>
          </div>

          <div className="pr-summary-item">
            <span>Result</span>
            <strong className={viewData.grade === "Fail" ? "fail" : "pass"}>
              {viewData.grade === "Fail" ? "Fail" : "Pass"}
            </strong>
          </div>
        </div>

        {/* 📊 ATTENDANCE */}
        <div className="pr-attendance-card">
          <div>
            <span>Working Days</span>
            <strong>200</strong>
          </div>
          <div>
            <span>Present</span>
            <strong>140</strong>
          </div>
          <div>
            <span>Attendance</span>
            <strong>70%</strong>
          </div>
        </div>

        {/* 📝 REMARK */}
        <div className="pr-remark-box">
          <b>Teacher Remark:</b>
          <p>Keep improving and stay consistent.</p>
        </div>

        {/* ✍ SIGN */}
        <div className="pr-sign">
          <div>
            <div className="line"></div>
            <p>Parent</p>
          </div>
          <div>
            <div className="line"></div>
            <p>Class Teacher</p>
          </div>
          <div>
            <div className="line"></div>
            <p>Principal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgessReports;
