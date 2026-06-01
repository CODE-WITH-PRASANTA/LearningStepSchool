import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AttendanceCalendar = ({ month, year, onUpdate }) => {
  const [records, setRecords] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);

  const today = new Date();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/teacher-attendance/monthly?month=${month}&year=${year}`
      );
      setRecords(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const getStatus = (day) => {
    const found = records.find(
      (r) => new Date(r.date).getUTCDate() === day
    );
    return found?.status || "Absent";
  };

  const handleClick = (day) => {
    const selectedDate = new Date(year, month - 1, day);

    // ❌ block future dates
    if (selectedDate > today) return;

    setSelectedDay(day);
    setShowModal(true);
    setStatus(getStatus(day)); // Set current status
  };

  const handleSave = async () => {
    try {
      // Normalize date to UTC midnight in YYYY-MM-DD format
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

      await API.post("/teacher-attendance", {
        date: dateStr,
        status,
      });

      setShowModal(false);
      fetchData();
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const totalDays = new Date(year, month, 0).getDate();

  return (
    <>
      <div className="attendance-calendar">
        {[...Array(totalDays)].map((_, i) => {
          const day = i + 1;
          const status = getStatus(day);

          const isToday =
            day === today.getDate() &&
            month === today.getMonth() + 1 &&
            year === today.getFullYear();

          return (
            <div
              key={i}
              className={`day ${status.toLowerCase()} ${
                isToday ? "today" : ""
              }`}
              onClick={() => handleClick(day)}
            >
              <span>{day}</span>
              <small>{status}</small>
            </div>
          );
        })}
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Mark Attendance (Day {selectedDay})</h3>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Present</option>
              <option>Absent</option>
              <option>Leave</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceCalendar;