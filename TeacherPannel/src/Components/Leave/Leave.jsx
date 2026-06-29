import React, { useState } from 'react';
import './Leave.css';

const Leave = () => {
  const [formData, setFormData] = useState({
    applicationDate: '2026-06-29', 
    leaveType: '',
    fromDate: '',
    toDate: '',
    halfDay: 'No',
    reason: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Leave Application Submitted Successfully!\nType: ${formData.leaveType}\nFrom: ${formData.fromDate} To: ${formData.toDate}`);
    // Your actual API dispatch or submission logic goes here
  };

  // Dynamically monitors if required fields are filled to unlock the button
  const isFormValid = formData.leaveType && formData.fromDate && formData.toDate && formData.reason.trim();

  return (
    <div className="leave-app">
      {/* Top Header Row */}
      <div className="leave-app__header">
        <h1 className="leave-app__title">Apply Leave</h1>
        <div className="leave-app__breadcrumb">
          <span className="leave-app__breadcrumb-icon">🏠</span>
          <span className="leave-app__breadcrumb-item">Leaves</span>
          <span className="leave-app__breadcrumb-separator">&gt;</span>
          <span className="leave-app__breadcrumb-item leave-app__breadcrumb-item--active">Apply Leave</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="leave-app__card">
        <h2 className="leave-app__card-title">New Leave Application</h2>
        
        <form className="leave-app__form" onSubmit={handleSubmit}>
          {/* Row 1: Application Date & Leave Type */}
          <div className="leave-app__form-row leave-app__form-row--two-cols">
            <div className="leave-app__input-group">
              <label className="leave-app__label">Application Date<span className="leave-app__required">*</span></label>
              <div className="leave-app__input-wrapper">
                <input 
                  type="date" 
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={handleChange}
                  className="leave-app__input" 
                />
                <span className="leave-app__icon">📅</span>
              </div>
            </div>

            <div className="leave-app__input-group">
              <label className="leave-app__label">Leave Type<span className="leave-app__required">*</span></label>
              <div className="leave-app__input-wrapper">
                <select 
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="leave-app__select"
                  required
                >
                  <option value="" disabled hidden></option>
                  <option value="casual">Casual Leave</option>
                  <option value="medical">Medical Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="earned">Earned Leave</option>
                </select>
                <span className="leave-app__icon leave-app__icon--select">▼</span>
              </div>
            </div>
          </div>

          {/* Row 2: From Date & To Date */}
          <div className="leave-app__form-row leave-app__form-row--two-cols">
            <div className="leave-app__input-group">
              <label className="leave-app__label">From Date<span className="leave-app__required">*</span></label>
              <div className="leave-app__input-wrapper">
                <input 
                  type="date" 
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="leave-app__input" 
                  required
                />
                <span className="leave-app__icon">📅</span>
              </div>
            </div>

            <div className="leave-app__input-group">
              <label className="leave-app__label">To Date<span className="leave-app__required">*</span></label>
              <div className="leave-app__input-wrapper">
                <input 
                  type="date" 
                  name="toDate"
                  min={formData.fromDate} 
                  value={formData.toDate}
                  onChange={handleChange}
                  className="leave-app__input" 
                  required
                />
                <span className="leave-app__icon">📅</span>
              </div>
            </div>
          </div>

          {/* Row 3: Half Day Dropdown */}
          <div className="leave-app__form-row">
            <div className="leave-app__input-group">
              <label className="leave-app__label">Half Day<span className="leave-app__required">*</span></label>
              <div className="leave-app__input-wrapper">
                <select 
                  name="halfDay"
                  value={formData.halfDay}
                  onChange={handleChange}
                  className="leave-app__select"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                <span className="leave-app__icon leave-app__icon--select">▼</span>
              </div>
            </div>
          </div>

          {/* Row 4: Reason Textarea */}
          <div className="leave-app__form-row">
            <div className="leave-app__input-group">
              <label className="leave-app__label">Reason for Leave<span className="leave-app__required">*</span></label>
              <textarea 
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="leave-app__textarea"
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          {/* Bottom Control Actions */}
          <div className="leave-app__actions">
            <button 
              type="submit" 
              className={`leave-app__btn ${isFormValid ? 'leave-app__btn--submit-active' : 'leave-app__btn--submit'}`} 
              disabled={!isFormValid}
            >
              Apply Leave
            </button>
            <button type="button" className="leave-app__btn leave-app__btn--cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Leave;