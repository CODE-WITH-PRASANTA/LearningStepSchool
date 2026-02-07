import React from "react";
import "./AttendanceReport.css";

const AttendanceReport = () => {
  const reportList = [
    {
      title: "ATTENDANCE REPORT",
      subtitle: "Attendance Report",
      icon: "📅",
    },
    {
      title: "CLASS WISE REPORT",
      subtitle: "Class Wise Report",
      icon: "🏫",
    },
    {
      title: "ATTENDANCE BY DATE",
      subtitle: "Attendance By Date",
      icon: "📆",
    },
    {
      title: "ABSENT STUDENT REPORT",
      subtitle: "Absent Student Report",
      icon: "🚫",
    },
    {
      title: "UNMARKED ATTENDANCE",
      subtitle: "Unmarked Attendance",
      icon: "🗓",
    },
    {
      title: "CUSTOM ATTENDANCE REPORT",
      subtitle: "Custom Attendance Report",
      icon: "📊",
    },
  ];

  return (
    <div className="attendance-report-page">
      {/* ===== PAGE HEADER ===== */}
      <div className="attendance-header">
        <h2>
          📄 Attendance Report
        </h2>
        <p>
          Attendance / <span>Attendance Report</span>
        </p>
      </div>

      {/* ===== REPORT ROW LIST ===== */}
      <div className="attendance-report-list">
        {reportList.map((item, index) => (
          <div key={index} className="attendance-report-card">
            <div className="report-icon">
              {item.icon}
            </div>

            <div className="report-text">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceReport;
