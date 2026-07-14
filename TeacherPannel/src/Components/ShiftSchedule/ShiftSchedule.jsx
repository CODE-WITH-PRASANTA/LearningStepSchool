import React, { useEffect, useMemo, useState } from "react";
import "./ShiftSchedule.css";

import {
  FiHome,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";

import API from "../../api/axios";

const SHIFT_COLORS = {
  Morning: "#45b649",
  Afternoon: "#2196f3",
  Evening: "#ff9800",
  Night: "#673ab7",
};

const ShiftSchedule = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMySchedule = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/shift-planning/my-schedule"
      );

      console.log(
        "MY SHIFT SCHEDULE:",
        response.data
      );

      const data = response.data?.data || [];

      setShifts(data);
    } catch (error) {
      console.error(
        "FETCH SHIFT SCHEDULE ERROR:",
        error.response?.data || error.message
      );

      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySchedule();
  }, []);

  const weeklySchedule = useMemo(() => {
    return shifts.map((item) => {
      const date = new Date(item.date);

      return {
        id: item._id,

        day: date.toLocaleDateString("en-IN", {
          weekday: "long",
        }),

        date: date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),

        shift: `${item.shiftType} Shift`,

        color:
          SHIFT_COLORS[item.shiftType] ||
          "#e5e7eb",
      };
    });
  }, [shifts]);

  const shiftDetails = useMemo(() => {
    const uniqueShifts = [];

    shifts.forEach((item) => {
      const exists = uniqueShifts.some(
        (shift) =>
          shift.shiftType === item.shiftType &&
          shift.startTime === item.startTime &&
          shift.endTime === item.endTime
      );

      if (!exists) {
        uniqueShifts.push(item);
      }
    });

    return uniqueShifts.map((item) => ({
      id: item._id,

      title: `${item.shiftType} Shift`,

      time: `${item.startTime} - ${item.endTime}`,

      status: item.status,

      color:
        SHIFT_COLORS[item.shiftType] ||
        "#64748b",
    }));
  }, [shifts]);

  return (
    <div className="shift-page">
      {/* Header */}

      <div className="shift-header">
        <h2>Shift Schedule</h2>

        <div className="breadcrumb">
          <FiHome />

          <FiChevronRight />

          <span>Attendance</span>

          <FiChevronRight />

          <span>Schedule</span>
        </div>
      </div>

      {/* Weekly Schedule */}

      <div className="schedule-section">
        <h2>My Weekly Schedule</h2>

        {loading ? (
          <div className="schedule-loading">
            Loading shift schedule...
          </div>
        ) : weeklySchedule.length === 0 ? (
          <div className="schedule-loading">
            No shift scheduled
          </div>
        ) : (
          <div className="schedule-grid">
            {weeklySchedule.map((item) => (
              <div
                className="schedule-card"
                key={item.id}
                style={{
                  borderTop: `5px solid ${item.color}`,
                }}
              >
                <h3>{item.day}</h3>

                <p>{item.date}</p>

                <div className="shift-tag">
                  {item.shift}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shift Details */}

      <div className="details-section">
        <h2>Shift Details</h2>

        <div className="details-grid">
          {shiftDetails.map((shift) => (
            <div
              className="detail-card"
              key={shift.id}
            >
              <div
                className="clock-icon"
                style={{
                  background: shift.color,
                }}
              >
                <FiClock />
              </div>

              <div>
                <h3>{shift.title}</h3>

                <h4>{shift.time}</h4>

                <p>{shift.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShiftSchedule;