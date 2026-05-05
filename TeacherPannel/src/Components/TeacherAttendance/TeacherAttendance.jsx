import React, { useState } from "react";
import AttendanceSummary from "./AttendanceSummary";
import AttendanceCalendar from "./AttendanceCalendar";
import "./TeacherAttendance.css";

const TeacherAttendance = () => {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [refresh, setRefresh] = useState(false);

  const reload = () => setRefresh((prev) => !prev);

  const getMonthName = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month - 1];
  };

  return (
    <div className="teacher-attendance">

      <div className="attendance-header">
        <h2>📊 My Attendance - {getMonthName()} {year}</h2>

        <div className="filters">
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            title="Select Month"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            title="Select Year"
          >
            {[...Array(5)].map((_, i) => {
              const y = today.getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <AttendanceSummary month={month} year={year} refresh={refresh} />
      <AttendanceCalendar month={month} year={year} onUpdate={reload} />

    </div>
  );
};

export default TeacherAttendance;