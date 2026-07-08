import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { FiHome, FiChevronRight } from "react-icons/fi";
import "./MonthlyAttendance.css"; // Importing the updated CSS file

const MonthlyAttendance = () => {
  const [days, setDays] = useState([]);

  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    late: 0,
    halfDay: 0,
  });

  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [loading, setLoading] = useState(true);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const loadMonthlyAttendance = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/teacher-attendance/monthly?month=${month}&year=${year}`,
      );

      const records = res.data.data || [];

      const totalDays = new Date(year, month, 0).getDate();

      const firstDay = new Date(year, month - 1, 1).getDay();

      const calendar = [];

      // Empty cells
      for (let i = 0; i < firstDay; i++) {
        calendar.push({
          empty: true,
        });
      }

      for (let day = 1; day <= totalDays; day++) {
        const found = records.find((item) => {
          const d = new Date(item.date);

          return (
            d.getDate() === day &&
            d.getMonth() + 1 === month &&
            d.getFullYear() === year
          );
        });

        calendar.push({
          day,
          attendance: found || null,
          status: found ? found.status : "Absent",
        });
      }

      setDays(calendar);

      console.log("Monthly Attendance Data:", calendar);

      const summary = {
        present: 0,
        absent: 0,
        leave: 0,
        late: 0,
        halfDay: 0,
      };

      calendar.forEach((item) => {
        if (item.empty) return;
        switch (item.status) {
          case "Present":
            summary.present++;
            break;

          case "Absent":
            summary.absent++;
            break;

          case "Late":
            summary.late++;
            break;

          case "Leave":
            summary.leave++;
            break;

          case "Half Day":
            summary.halfDay++;
            break;

          default:
            break;
        }
      });

      setSummary(summary);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthlyAttendance();
  }, [month, year]);

  // Determines the specific state class for each date box
  const getBoxStatusClass = (status) => {
    switch (status) {
      case "Present":
        return "status-present";

      case "Absent":
        return "status-absent";

      case "Late":
        return "status-late";

      case "Half Day":
        return "status-halfday";

      case "Leave":
        return "status-leave";
      case "Future":
        return "status-future";

      case "No Record":
        return "status-default";
      default:
        return "status-default";
    }
  };

  const handleDayClick = (item) => {
    if (!item.attendance) {
      alert("No attendance found for this day.");
      return;
    }

    setSelectedAttendance(item.attendance);
    setShowModal(true);
  };

  const previousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }

    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="attendance-container">
        <h2>Loading Attendance...</h2>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      {/* Header & Breadcrumbs Area */}
      <div className="attendance-header">
        <h1>Monthly Attendance</h1>
        <div className="breadcrumbs">
          <FiHome className="home-icon" size={14} />
          <FiChevronRight className="separator" />
          <span className="link">Attendance</span>
          <FiChevronRight className="separator" />
          <span className="current-page">Monthly Attendance</span>
        </div>
      </div>

      {/* Top Statistical Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card card-present">
          <p>Total Present</p>
          <p className="stat-number">{summary.present}</p>
        </div>
        <div className="stat-card card-absent">
          <p>Total Absent</p>
          <p className="stat-number">{summary.absent}</p>
        </div>
        <div className="stat-card card-late">
          <p>Late Arrivals</p>
          <p className="stat-number">{summary.late}</p>
        </div>
        <div className="stat-card card-halfday">
          <p>Half Days</p>
          <p className="stat-number">{summary.halfDay}</p>
        </div>
      </div>

      {/* Main Calendar Panel */}
      <div className="calendar-panel">
        <div className="calendar-title">
          <button className="month-btn" onClick={previousMonth}>
            ◀
          </button>

          <h2>
            {new Date(year, month - 1).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button className="month-btn" onClick={nextMonth}>
            ▶
          </button>
        </div>

        <div className="calendar-week-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Date Box Grid */}
        {/* Date Box Grid */}
        <div className="calendar-grid">
          {days.map((item, index) => {
            if (item.empty) {
              return <div key={item.id} className="empty-box" />;
            }

            return (
              <div
                key={item.day}
                onClick={() => handleDayClick(item)}
                className={`
          date-box
          ${getBoxStatusClass(item.status)}
          ${item.isToday ? "today-box" : ""}
        `}
              >
                <span>{item.day}</span>

                {item.status === "Present" && <small>🟢</small>}
                {item.status === "Late" && <small>🟠</small>}
                {item.status === "Half Day" && <small>🔵</small>}
                {item.status === "Leave" && <small>🟣</small>}
              </div>
            );
          })}
        </div>

        {/* Legend / Status Indicators Footnote */}
        <div className="legend-container">
          <div className="legend-item">
            <span className="legend-dot dot-present" />
            <span>Present</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-absent" />
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-late" />
            <span>Late</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-halfday" />
            <span>Half Day</span>
          </div>
        </div>
      </div>

      {/* Attendance Details Modal */}

      {showModal && selectedAttendance && (
        <div
          className="attendance-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="attendance-modal">
            <div className="modal-header">
              <div>
                <h2>Attendance Details</h2>

                <p>
                  {new Date(selectedAttendance.date).toLocaleDateString(
                    "en-IN",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>

              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div
              className={`status-pill ${selectedAttendance.status.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {selectedAttendance.status}
            </div>

            <div className="attendance-summary">
              <div className="summary-card">
                <h4>Punch In</h4>
                <span>
                  {selectedAttendance.punchIn
                    ? new Date(selectedAttendance.punchIn).toLocaleTimeString()
                    : "--"}
                </span>
              </div>

              <div className="summary-card">
                <h4>Punch Out</h4>
                <span>
                  {selectedAttendance.punchOut
                    ? new Date(selectedAttendance.punchOut).toLocaleTimeString()
                    : "--"}
                </span>
              </div>

              <div className="summary-card">
                <h4>Working</h4>
                <span>{formatDuration(selectedAttendance.workSeconds)}</span>
              </div>

              <div className="summary-card">
                <h4>Break</h4>
                <span>{formatDuration(selectedAttendance.breakSeconds)}</span>
              </div>
            </div>

            <div className="section">
              <h3>Break History</h3>

              {selectedAttendance.breaks?.length ? (
                selectedAttendance.breaks.map((item, index) => (
                  <div key={index} className="break-card">
                    <div>
                      <strong>{item.reason}</strong>

                      <p>
                        {new Date(item.start).toLocaleTimeString()} →{" "}
                        {item.end
                          ? new Date(item.end).toLocaleTimeString()
                          : "Running"}
                      </p>
                    </div>

                    <span>{formatDuration(item.durationSeconds)}</span>
                  </div>
                ))
              ) : (
                <p>No Breaks</p>
              )}
            </div>

            <div className="section">
              <h3>Activity Timeline</h3>

              {selectedAttendance.activities.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot" />

                  <div>
                    <strong>{item.type}</strong>

                    <p>{new Date(item.time).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyAttendance;
