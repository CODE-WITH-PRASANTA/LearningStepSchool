import React, { useEffect, useState } from "react";
import "./OverTime.css";
import API from "../../api/axios";

const OverTime = () => {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    hours: "1.0",
    reason: "",
  });

  const juneDays = Array.from(
    { length: 30 },
    (_, i) => i + 1
  );

  const startOffsetDays = [1];

  /* ================= FETCH OVERTIME ================= */

  const fetchOvertimes = async () => {
    try {
      setLoading(true);

      const res = await API.get("/teacher/overtimes");

      console.log("Overtime Response:", res.data);

      setRequests(res.data.data || []);
    } catch (err) {
      console.error(
        "Fetch Overtime Error:",
        err.response?.data || err
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOvertimes();
  }, []);

  /* ================= INPUT CHANGE ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= HOURS ================= */

  const handleHourStep = (direction) => {
    let current = parseFloat(formData.hours) || 0.5;

    if (direction === "up") {
      current += 0.5;
    }

    if (direction === "down" && current > 0.5) {
      current -= 0.5;
    }

    setFormData((prev) => ({
      ...prev,
      hours: current.toFixed(1),
    }));
  };

  /* ================= CALENDAR ================= */

  const selectCalendarDate = (day) => {
    const formattedDay = String(day).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      date: `2026-06-${formattedDay}`,
    }));

    setIsCalendarOpen(false);
  };

  /* ================= CREATE OVERTIME ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.hours ||
      !formData.reason.trim()
    ) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        date: formData.date,
        hours: Number(formData.hours),
        reason: formData.reason.trim(),
      };

      console.log("Overtime Payload:", payload);

      const res = await API.post(
        "/teacher/overtimes",
        payload
      );

      console.log("Created Overtime:", res.data);

      alert(
        res.data.message ||
          "Overtime request submitted successfully"
      );

      await fetchOvertimes();

      handleCloseModal();
    } catch (err) {
      console.error(
        "Create Overtime Error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Unable to submit overtime request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= CLOSE MODAL ================= */

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCalendarOpen(false);

    setFormData({
      date: new Date().toISOString().split("T")[0],
      hours: "1.0",
      reason: "",
    });
  };

  /* ================= DATE FORMAT ================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAppliedDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const isFormValid =
    formData.date &&
    Number(formData.hours) >= 0.5 &&
    formData.reason.trim().length > 0;

  return (
    <div className="ot-dashboard-container">
      <header className="ot-header">
        <h1 className="ot-main-title">
          Overtime Requests
        </h1>

        <div className="ot-breadcrumb">
          <span className="ot-home-icon">🏠</span>
          <span className="ot-chevron">&gt;</span>
          <span>Attendance</span>
          <span className="ot-chevron">&gt;</span>
          <span className="ot-current-crumb">
            Overtime
          </span>
        </div>
      </header>

      <main className="ot-content-wrapper">
        <div className="ot-subheader">
          <h2 className="ot-section-title">
            My Overtime Requests
          </h2>

          <button
            className="ot-btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="ot-plus-icon">+</span>
            New Request
          </button>
        </div>

        <div className="ot-requests-grid">
          {loading ? (
            <p>Loading overtime requests...</p>
          ) : requests.length === 0 ? (
            <p>No overtime requests found.</p>
          ) : (
            requests.map((req) => (
              <div key={req._id} className="ot-card">
                <div className="ot-card-header">
                  <div>
                    <h3 className="ot-card-date">
                      {formatDate(req.date)}
                    </h3>

                    <p className="ot-card-applied">
                      Applied:{" "}
                      {formatAppliedDate(req.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`ot-badge ${req.status}`}
                  >
                    {formatStatus(req.status)}
                  </span>
                </div>

                <div className="ot-divider" />

                <div className="ot-card-body">
                  <div className="ot-hours-display">
                    <span className="ot-clock-icon">
                      🕒
                    </span>

                    <span className="ot-hours-text">
                      {req.hours} Hours
                    </span>
                  </div>

                  <div className="ot-reason-box">
                    <p>{req.reason}</p>
                  </div>

                  {req.adminNote && (
                    <div className="ot-reason-box">
                      <p>
                        <strong>Admin Note:</strong>{" "}
                        {req.adminNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="ot-modal-overlay">
          <div className="ot-modal-window">
            <div className="ot-modal-header">
              <h3>New Overtime Request</h3>

              <button
                type="button"
                className="ot-modal-close-btn"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="ot-modal-body"
            >
              <div
                className="ot-input-group"
                onClick={() =>
                  setIsCalendarOpen((prev) => !prev)
                }
              >
                <label className="ot-input-label">
                  Request Date*
                </label>

                <div className="ot-input-inner-wrapper">
                  <span className="ot-input-value-text">
                    {formData.date}
                  </span>

                  <div className="ot-icons-right">
                    <span
                      className={`ot-calendar-icon ${
                        isCalendarOpen ? "active" : ""
                      }`}
                    >
                      📅
                    </span>
                  </div>
                </div>

                {isCalendarOpen && (
                  <div
                    className="ot-custom-calendar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="ot-cal-header">
                      <span className="ot-cal-month-year">
                        2026 JUN
                      </span>
                    </div>

                    <div className="ot-cal-weekdays">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    <div className="ot-cal-days-grid">
                      {startOffsetDays.map((_, index) => (
                        <span
                          key={`offset-${index}`}
                          className="ot-cal-empty"
                        />
                      ))}

                      {juneDays.map((day) => (
                        <span
                          key={day}
                          className={`ot-cal-day-cell ${
                            formData.date ===
                            `2026-06-${String(day).padStart(
                              2,
                              "0"
                            )}`
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            selectCalendarDate(day)
                          }
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="ot-input-group">
                <label className="ot-input-label">
                  Requested Hours*
                </label>

                <div className="ot-input-inner-wrapper">
                  <input
                    type="number"
                    name="hours"
                    step="0.5"
                    min="0.5"
                    value={formData.hours}
                    onChange={handleInputChange}
                    className="ot-hidden-raw-input"
                    required
                  />

                  <span className="ot-input-value-text">
                    {formData.hours || "0.0"}
                  </span>

                  <div className="ot-stepper-controls-wrapper">
                    <div className="ot-stepper-arrows">
                      <span
                        className="ot-arrow-up"
                        onClick={() =>
                          handleHourStep("up")
                        }
                      >
                        ▲
                      </span>

                      <span
                        className="ot-arrow-down"
                        onClick={() =>
                          handleHourStep("down")
                        }
                      >
                        ▼
                      </span>
                    </div>

                    <span className="ot-stopwatch-icon">
                      ⏱️
                    </span>
                  </div>
                </div>
              </div>

              <div className="ot-input-group text-area-group">
                <label className="ot-input-label">
                  Reason for Overtime*
                </label>

                <textarea
                  name="reason"
                  rows="3"
                  className="ot-textarea-field"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                />

                <span className="ot-doc-icon">📄</span>
              </div>

              <div className="ot-modal-footer">
                <button
                  type="submit"
                  className={`ot-btn-submit ${
                    isFormValid ? "ready" : "disabled"
                  }`}
                  disabled={!isFormValid || submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Request"}
                </button>

                <button
                  type="button"
                  className="ot-btn-cancel"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverTime;