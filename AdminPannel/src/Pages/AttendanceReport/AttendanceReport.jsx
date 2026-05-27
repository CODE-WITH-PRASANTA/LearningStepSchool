import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaCalendarDay,
  FaUserTimes,
  FaRegCalendarCheck,
  FaCalendarPlus,
} from "react-icons/fa";
import "./AttendanceReport.css";

const AttendanceReport = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "ATTENDANCE REPORT",
      subtitle: "Attendance Report",
      icon: <FaClipboardList />,
      path: "/attendance/report",
      color: "#f39c12",
    },
    {
      title: "CLASS WISE REPORT",
      subtitle: "Class Wise Report",
      icon: <FaCalendarAlt />,
      path: "/attendance/class-wise",
      color: "#6c5ce7",
    },
    {
      title: "ATTENDANCE BY DATE",
      subtitle: "Attendance By Date",
      icon: <FaCalendarDay />,
      path: "/attendance/by-date",
      color: "#3498db",
    },
    {
      title: "ABSENT STUDENT REPORT",
      subtitle: "Absent Student Report",
      icon: <FaUserTimes />,
      path: "/attendance/absent",
      color: "#e74c3c",
    },
    {
      title: "UNMARKED ATTENDANCE",
      subtitle: "Unmarked Attendance",
      icon: <FaRegCalendarCheck />,
      path: "/attendance/unmarked",
      color: "#e67e22",
    },
    {
      title: "CUSTOM ATTENDANCE REPORT",
      subtitle: "Custom Attendance Report",
      icon: <FaCalendarPlus />,
      path: "/attendance/custom",
      color: "#2980b9",
    },
  ];

  return (
    <div className="mainAttendance">
      {/* Header */}
      <div className="mainAttendance__header">
        <h2>Attendance Report</h2>
        <div className="mainAttendance__breadcrumb">
          <span>Attendance</span> / <span>Attendance Report</span>
        </div>
      </div>

      {/* Cards */}
      <div className="mainAttendance__container">
        {cards.map((card, index) => (
          <div
            key={index}
            className="mainAttendance__card"
            onClick={() => navigate(card.path)}
          >
            <div
              className="mainAttendance__icon"
              style={{ backgroundColor: card.color }}
            >
              {card.icon}
            </div>

            <div className="mainAttendance__content">
              <h4>{card.title}</h4>
              <p>{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceReport;