import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AttendanceSummary = ({ month, year, refresh }) => {
  const [data, setData] = useState({
    totalDays: 0,
    present: 0,
    leave: 0,
    absent: 0,
    workingDays: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await API.get(
          `/teacher-attendance/summary?month=${month}&year=${year}`
        );
        setData(res.data.summary || {
          totalDays: 0,
          present: 0,
          leave: 0,
          absent: 0,
          workingDays: 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [month, year, refresh]);

  const getMonthName = () => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month - 1];
  };

  const attendancePercentage = data.totalDays > 0 
    ? Math.round((data.workingDays / data.totalDays) * 100) 
    : 0;

  return (
    <div className="attendance-summary">
      <div className="card present">
        <span>✓</span>
        <div>
          <small>Present</small>
          <span>{data.present || 0}</span>
        </div>
      </div>

      <div className="card absent">
        <span>✕</span>
        <div>
          <small>Absent</small>
          <span>{data.absent || 0}</span>
        </div>
      </div>

      <div className="card leave">
        <span>−</span>
        <div>
          <small>Leave</small>
          <span>{data.leave || 0}</span>
        </div>
      </div>

      <div className="card working">
        <span>📅</span>
        <div>
          <small>Working Days</small>
          <span>{data.workingDays || 0} / {data.totalDays || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;