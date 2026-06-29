import React, { useState } from 'react';
import './OverTime.css';

const OverTime = () => {
  // Existing & New Requests state
  const [requests, setRequests] = useState([
    {
      id: 1,
      date: 'January 15, 2026',
      appliedDate: 'Jan 14, 2026',
      hours: '2 Hours',
      status: 'Approved',
      reason: 'Project deadline.',
    },
    {
      id: 2,
      date: 'January 21, 2026',
      appliedDate: 'Jan 20, 2026',
      hours: '1.5 Hours',
      status: 'Pending',
      reason: 'Support ticket surge.',
    },
  ]);

  // Modal & Dropdown UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Form Field states
  const [formData, setFormData] = useState({
    date: '2026-06-29',
    hours: '1.0',
    reason: '',
  });

  // Calendar setup for June 2026 mapping
  const juneDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const startOffsetDays = [1, 2, 3, 4, 5]; // Offset spaces for Monday start if needed, matching UI format

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHourStep = (direction) => {
    let current = parseFloat(formData.hours) || 0;
    if (direction === 'up') current += 0.5;
    if (direction === 'down' && current > 0.5) current -= 0.5;
    setFormData((prev) => ({ ...prev, hours: current.toFixed(1) }));
  };

  const selectCalendarDate = (day) => {
    const formattedDay = day < 10 ? `0${day}` : day;
    setFormData((prev) => ({ ...prev, date: `2026-06-${formattedDay}` }));
    setIsCalendarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.hours || !formData.reason.trim()) return;

    // Convert input date format to view presentation format
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(formData.date);
    const formattedDisplayDate = dateObj.toLocaleDateString('en-US', options);
    
    const formattedAppliedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newRequest = {
      id: Date.now(),
      date: formattedDisplayDate,
      appliedDate: formattedAppliedDate,
      hours: `${formData.hours} Hours`,
      status: 'Pending',
      reason: formData.reason,
    };

    setRequests([newRequest, ...requests]);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCalendarOpen(false);
    setFormData({ date: '2026-06-29', hours: '1.0', reason: '' });
  };

  // Helper validation to toggle Submit active styling
  const isFormValid = formData.date && formData.hours && formData.reason.trim().length > 0;

  return (
    <div className="ot-dashboard-container">
      {/* Top Header Navigation Bar */}
      <header className="ot-header">
        <h1 className="ot-main-title">Overtime Requests</h1>
        <div className="ot-breadcrumb">
          <span className="ot-home-icon">🏠</span>
          <span className="ot-chevron">&gt;</span>
          <span>Attendance</span>
          <span className="ot-chevron">&gt;</span>
          <span className="ot-current-crumb">Overtime</span>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="ot-content-wrapper">
        <div className="ot-subheader">
          <h2 className="ot-section-title">My Overtime Requests</h2>
          <button className="ot-btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="ot-plus-icon">+</span> New Request
          </button>
        </div>

        {/* Requests Dashboard Grid */}
        <div className="ot-requests-grid">
          {requests.map((req) => (
            <div key={req.id} className="ot-card">
              <div className="ot-card-header">
                <div>
                  <h3 className="ot-card-date">{req.date}</h3>
                  <p className="ot-card-applied">Applied: {req.appliedDate}</p>
                </div>
                <span className={`ot-badge ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </div>
              <div className="ot-divider"></div>
              <div className="ot-card-body">
                <div className="ot-hours-display">
                  <span className="ot-clock-icon">🕒</span>
                  <span className="ot-hours-text">{req.hours}</span>
                </div>
                <div className="ot-reason-box">
                  <p>{req.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Dynamic Request Creation Dialog Modal Overlay */}
      {isModalOpen && (
        <div className="ot-modal-overlay">
          <div className="ot-modal-window">
            {/* Modal Header Title Ribbon */}
            <div className="ot-modal-header">
              <h3>New Overtime Request</h3>
              <button className="ot-modal-close-btn" onClick={handleCloseModal}>&times;</button>
            </div>

            {/* Modal Input Configuration Form */}
            <form onSubmit={handleSubmit} className="ot-modal-body">
              
              {/* Box Element 1: Target Calendar Action Point */}
              <div className="ot-input-group" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                <label className="ot-input-label">Request Date*</label>
                <div className="ot-input-inner-wrapper">
                  <span className="ot-input-value-text">{formData.date}</span>
                  <div className="ot-icons-right">
                    <span className={`ot-calendar-icon ${isCalendarOpen ? 'active' : ''}`}>📅</span>
                    <span className="ot-calendar-icon-alt">📅</span>
                  </div>
                </div>

                {/* Simulated Custom Calendar Component Wrapper */}
                {isCalendarOpen && (
                  <div className="ot-custom-calendar" onClick={(e) => e.stopPropagation()}>
                    <div className="ot-cal-header">
                      <span className="ot-cal-month-year">2026 JUN ▾</span>
                      <div className="ot-cal-arrows">
                        <span>&lt;</span>
                        <span>&gt;</span>
                      </div>
                    </div>
                    <div className="ot-cal-weekdays">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="ot-cal-days-grid">
                      {/* Blank offset positions matching calendar standard layout */}
                      {startOffsetDays.map((_, idx) => <span key={`offset-${idx}`} className="ot-cal-empty"></span>)}
                      {juneDays.map((day) => (
                        <span
                          key={day}
                          className={`ot-cal-day-cell ${day === 29 ? 'selected' : ''}`}
                          onClick={() => selectCalendarDate(day)}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Box Element 2: Quantifiable Clock Interval Stepper */}
              <div className="ot-input-group">
                <label className="ot-input-label">Requested Hours*</label>
                <div className="ot-input-inner-wrapper">
                  <input
                    type="number"
                    name="hours"
                    step="0.5"
                    min="0.5"
                    className="ot-hidden-raw-input"
                    value={formData.hours}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="ot-input-value-text">{formData.hours || '0.0'}</span>
                  <div className="ot-stepper-controls-wrapper">
                    <div className="ot-stepper-arrows">
                      <span className="ot-arrow-up" onClick={() => handleHourStep('up')}>▲</span>
                      <span className="ot-arrow-down" onClick={() => handleHourStep('down')}>▼</span>
                    </div>
                    <span className="ot-stopwatch-icon">⏱️</span>
                  </div>
                </div>
              </div>

              {/* Box Element 3: Text Context Container Area */}
              <div className="ot-input-group text-area-group">
                <label className="ot-input-label">Reason for Overtime*</label>
                <textarea
                  name="reason"
                  rows="3"
                  className="ot-textarea-field"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                ></textarea>
                <span className="ot-doc-icon">📄</span>
              </div>

              {/* Action Triggers Footer Group */}
              <div className="ot-modal-footer">
                <button
                  type="submit"
                  className={`ot-btn-submit ${isFormValid ? 'ready' : 'disabled'}`}
                  disabled={!isFormValid}
                >
                  Submit Request
                </button>
                <button type="button" className="ot-btn-cancel" onClick={handleCloseModal}>
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