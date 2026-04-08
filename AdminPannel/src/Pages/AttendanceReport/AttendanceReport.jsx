import React from "react";
import "./AttendanceReport.css";

const AttendanceReport = () => {

  // 🔥 DOWNLOAD EXCEL
  const downloadExcel = async (type) => {
    try {
      let url = "http://localhost:5000/api/attendance/export";

      // 👉 future filters (optional)
      if (type === "class") url += "?type=class";
      if (type === "date") url += "?type=date";
      if (type === "absent") url += "?type=absent";

      const res = await fetch(url);

      const blob = await res.blob();
      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.download = `${type || "attendance"}-report.xlsx`;
      link.click();

    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const reportList = [
    {
      title: "ATTENDANCE REPORT",
      subtitle: "Attendance Report",
      icon: "📅",
      action: () => downloadExcel("all"),
    },
    {
      title: "CLASS WISE REPORT",
      subtitle: "Class Wise Report",
      icon: "🏫",
      action: () => downloadExcel("class"),
    },
    {
      title: "ATTENDANCE BY DATE",
      subtitle: "Attendance By Date",
      icon: "📆",
      action: () => downloadExcel("date"),
    },
    {
      title: "ABSENT STUDENT REPORT",
      subtitle: "Absent Student Report",
      icon: "🚫",
      action: () => downloadExcel("absent"),
    },
    {
      title: "UNMARKED ATTENDANCE",
      subtitle: "Unmarked Attendance",
      icon: "🗓",
      action: () => alert("Coming Soon 🚀"),
    },
    {
      title: "CUSTOM ATTENDANCE REPORT",
      subtitle: "Custom Attendance Report",
      icon: "📊",
      action: () => alert("Coming Soon 🚀"),
    },
  ];

  return (
    <div className="attendance-report-page">

      {/* HEADER */}
      <div className="attendance-header">
        <h2>📄 Attendance Report</h2>
        <p>
          Attendance / <span>Attendance Report</span>
        </p>
      </div>

      {/* REPORT CARDS */}
      <div className="attendance-report-list">
        {reportList.map((item, index) => (
          <div
            key={index}
            className="attendance-report-card"
            onClick={item.action} // 🔥 click action
          >
            <div className="report-icon">{item.icon}</div>

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