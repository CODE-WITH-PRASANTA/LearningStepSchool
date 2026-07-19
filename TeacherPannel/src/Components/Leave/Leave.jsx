import React, { useState, useEffect } from "react";
import "./Leave.css";
import API from "../../api/axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Leave = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    applicationDate: new Date().toISOString().split("T")[0],
    leaveType: "",
    fromDate: "",
    toDate: "",
    halfDay: "No",
    reason: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        leaveType: formData.leaveType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
      };

      if (id) {
        const res = await API.put(`/teacher/leaves/${id}`, payload);

        console.log("Updated Leave:", res.data);

        alert("Leave Updated Successfully");
      } else {
        const res = await API.post("/teacher/leaves", payload);

        console.log("Created Leave:", res.data);

        alert("Leave Applied Successfully");
      }

      navigate("/leave/request");
    } catch (err) {
      console.error("Leave Error:", err.response?.data || err);

      alert(err.response?.data?.message || "Something went wrong");
    }
  };

 

  const fetchLeave = async () => {
    try {
      console.log("Edit Leave ID:", id);

      const res = await API.get(`/teacher/leaves/${id}`);

      console.log("Single Leave Response:", res.data);

      const leave = res.data.data || res.data;

      setFormData({
        applicationDate: leave.createdAt ? leave.createdAt.split("T")[0] : "",
        leaveType: leave.leaveType || "",
        fromDate: leave.fromDate ? leave.fromDate.split("T")[0] : "",
        toDate: leave.toDate ? leave.toDate.split("T")[0] : "",
        halfDay: "No",
        reason: leave.reason || "",
      });
    } catch (err) {
      console.error("Fetch Leave Error:", err.response?.data || err);

      alert(err.response?.data?.message || "Unable to load leave details");
    }
  };

   useEffect(() => {
    if (id) {
      fetchLeave();
    }
  }, [id]);

  // Dynamically monitors if required fields are filled to unlock the button
  const isFormValid =
    formData.leaveType &&
    formData.fromDate &&
    formData.toDate &&
    formData.reason.trim();

  return (
    <div className="leave-app">
      {/* Top Header Row */}
      <div className="leave-app__header">
        <h1 className="leave-app__title">
          {id ? "Edit Leave" : "Apply Leave"}
        </h1>
        <div className="leave-app__breadcrumb">
          <span className="leave-app__breadcrumb-icon">🏠</span>
          <span className="leave-app__breadcrumb-item">Leaves</span>
          <span className="leave-app__breadcrumb-separator">&gt;</span>
          <span className="leave-app__breadcrumb-item leave-app__breadcrumb-item--active">
            Apply Leave
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="leave-app__card">
        <h2 className="leave-app__card-title">
          {id ? "Edit Leave Application" : "New Leave Application"}
        </h2>

        <form className="leave-app__form" onSubmit={handleSubmit}>
          {/* Row 1: Application Date & Leave Type */}
          <div className="leave-app__form-row leave-app__form-row--two-cols">
            <div className="leave-app__input-group">
              <label className="leave-app__label">
                Application Date<span className="leave-app__required">*</span>
              </label>
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
              <label className="leave-app__label">
                Leave Type<span className="leave-app__required">*</span>
              </label>
              <div className="leave-app__input-wrapper">
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="leave-app__select"
                  required
                >
                  <option value="">Select Leave</option>

                  <option value="casual">Casual Leave</option>

                  <option value="sick">Sick Leave</option>

                  <option value="earned">Earned Leave</option>

                  <option value="maternity">Maternity Leave</option>

                  <option value="emergency">Emergency Leave</option>

                  <option value="other">Other</option>
                </select>
                <span className="leave-app__icon leave-app__icon--select">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: From Date & To Date */}
          <div className="leave-app__form-row leave-app__form-row--two-cols">
            <div className="leave-app__input-group">
              <label className="leave-app__label">
                From Date<span className="leave-app__required">*</span>
              </label>
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
              <label className="leave-app__label">
                To Date<span className="leave-app__required">*</span>
              </label>
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
              <label className="leave-app__label">
                Half Day<span className="leave-app__required">*</span>
              </label>
              <div className="leave-app__input-wrapper">
                {/* <select
                  name="halfDay"
                  value={formData.halfDay}
                  onChange={handleChange}
                  className="leave-app__select"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select> */}
                <span className="leave-app__icon leave-app__icon--select">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Reason Textarea */}
          <div className="leave-app__form-row">
            <div className="leave-app__input-group">
              <label className="leave-app__label">
                Reason for Leave<span className="leave-app__required">*</span>
              </label>
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
              className={`leave-app__btn ${isFormValid ? "leave-app__btn--submit-active" : "leave-app__btn--submit"}`}
              disabled={!isFormValid}
            >
              {id ? "Update Leave" : "Apply Leave"}
            </button>
            <button
              type="button"
              className="leave-app__btn leave-app__btn--cancel"
              onClick={() => navigate("/leaves")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Leave;
