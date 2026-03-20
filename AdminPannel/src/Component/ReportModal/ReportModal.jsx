import React from "react";
import html2pdf from "html2pdf.js";
import "./ReportModal.css";

const ReportModal = ({ viewData, setViewData, logo }) => {
  if (!viewData) return null;

  return (
    <div className="reports-overlay">

      <div id="printArea" className="reports-card">

        {/* HEADER */}
        <div className="reports-header">
          <img src={logo} alt="logo" className="reports-logo" />

          <div>
            <h1 className="reports-title">
              Learning Step International School
            </h1>
            <p className="reports-subtitle">
              Academic Progress Report
            </p>
          </div>
        </div>

        <hr />

        {/* INFO */}
        <div className="reports-info">
          <div>
            <p><b>Name:</b> {viewData.name}</p>
            <p><b>Admission:</b> {viewData.admissionNo}</p>
            <p><b>Roll:</b> {viewData.rollNumber}</p>
          </div>

          <div>
            <p><b>Class:</b> {viewData.class || viewData.classId?.className}</p>
            <p><b>Exam:</b> {viewData.examType}</p>
            <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* TABLE WRAPPER (NEW) */}
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Full Marks</th>
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {viewData.subjects?.map((sub, i) => {
                const fail = sub.marks < sub.fullMarks * 0.35;

                return (
                  <tr key={i}>
                    <td className="reports-subject">{sub.subject}</td>
                    <td>{sub.marks}</td>
                    <td>{sub.fullMarks}</td>
                    <td className={fail ? "fail" : "pass"}>
                      {fail ? "Fail" : "Pass"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        <div className="reports-summary">
          <p><b>Total:</b> {viewData.total} / {viewData.fullMarks}</p>
          <p><b>Percentage:</b> {viewData.percentage?.toFixed(2)}%</p>
          <p><b>Grade:</b> {viewData.grade}</p>
          <p>
            <b>Result:</b>{" "}
            <span className={viewData.result === "Fail" ? "fail" : "pass"}>
              {viewData.result}
            </span>
          </p>
        </div>

        {/* REMARK */}
        <div className="reports-remark">
          <p><b>Teacher Remark:</b> Keep improving and stay consistent.</p>
        </div>

        {/* SIGN */}
        <div className="reports-sign">
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
        <button
          className="btn green"
          onClick={() => {
            html2pdf()
              .set({
                margin: 10,
                filename: `${viewData.name}_Report.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4" },
              })
              .from(document.getElementById("printArea"))
              .save();
          }}
        >
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