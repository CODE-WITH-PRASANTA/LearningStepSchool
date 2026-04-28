import React, { useEffect, useState } from "react";
import "./LeavesDashboard.css";
import { FaPlus, FaTimes } from "react-icons/fa";

const LeavesDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [animateCircle, setAnimateCircle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      setTimeout(() => {
        setAnimateCircle(true);
      }, 250);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      id: 1,
      value: "1192",
      total: "/1206",
      label: "Today Presents",
      percent: 80,
      color: "#4e73ff",
      track: "#eaf0ff",
    },
    {
      id: 2,
      value: "128",
      total: "/1206",
      label: "Planned Leaves",
      percent: 20,
      color: "#ff4d1a",
      track: "#ffe9e2",
    },
    {
      id: 3,
      value: "12",
      total: "/1206",
      label: "Unplanned Leaves",
      percent: 49,
      color: "#16b7ff",
      track: "#e9f8ff",
    },
    {
      id: 4,
      value: "50",
      total: "/70",
      label: "Pending Requests",
      percent: 68,
      color: "#f59e0b",
      track: "#fff4df",
    },
  ];

  if (loading) {
    return (
      <div className="leave-loader">
        <div className="leave-spinner"></div>
        <h3>Loading Leave Dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="leaves-page">
      {/* Header */}
      <div className="leave-topbar">
        <div>
          <h1>Leaves</h1>
          <p>
            <span>Dashboard</span> / Leaves
          </p>
        </div>

        <button
          className="add-leave-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
          Add Leave
        </button>
      </div>

      {/* Cards */}
      <div className="leave-grid">
        {cards.map((item, index) => (
          <div
            className="leave-card"
            key={item.id}
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="leave-left">
              <h2>
                {item.value}
                <span>{item.total}</span>
              </h2>
              <p style={{ color: item.color }}>{item.label}</p>
            </div>

            <div
              className="progress-ring"
              style={{
                background: `conic-gradient(
                  ${item.color}
                  ${animateCircle ? item.percent * 3.6 : 0}deg,
                  ${item.track} 0deg
                )`,
              }}
            >
              <div className="ring-center">
                {animateCircle ? `${item.percent}%` : "0%"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD LEAVE MODAL */}
      {showModal && (
        <div
          className="leave-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="leave-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="leave-modal-header">
              <h2>Add Leave Request</h2>

              <button
                className="leave-close-btn"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="leave-form">
              <div className="leave-group">
                <label>Employee Name</label>
                <input
                  type="text"
                  placeholder="Enter employee name"
                />
              </div>

              <div className="leave-group">
                <label>Leave Type</label>
                <select>
                  <option>Select leave type</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Emergency Leave</option>
                  <option>Maternity Leave</option>
                </select>
              </div>

              <div className="leave-group">
                <label>Select Date</label>
                <input type="date" />
              </div>

              <div className="leave-group">
                <label>Reason</label>
                <textarea
                  placeholder="Enter leave reason"
                ></textarea>
              </div>

              <div className="leave-group">
                <label>Status</label>
                <select>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="leave-submit-wrap">
                <button
                  className="leave-submit-btn"
                  onClick={() => setShowModal(false)}
                >
                  Submit Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavesDashboard;