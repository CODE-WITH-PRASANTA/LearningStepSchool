import React, { useEffect, useMemo, useState } from "react";
import "./LeavesDashboard.css";
import API from "../../api/axios";
import { FaPlus, FaTimes } from "react-icons/fa";

const initialLeaveForm = {
  teacher: "",
  leaveType: "sick",
  fromDate: "",
  toDate: "",
  reason: "",
  status: "pending",
  adminNote: "",
};

const LeavesDashboard = ({
  leaveData = [],
  loading = false,
  setLeaveData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animateCircle, setAnimateCircle] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [leaveForm, setLeaveForm] = useState(initialLeaveForm);

  const leaveTypes = [
    { value: "sick", label: "Sick Leave" },
    { value: "casual", label: "Casual Leave" },
    { value: "earned", label: "Earned Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "emergency", label: "Emergency Leave" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    if (loading) {
      setAnimateCircle(false);
      return undefined;
    }

    const timer = setTimeout(() => {
      setAnimateCircle(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [loading, leaveData]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setTeacherLoading(true);
        const res = await API.get("/admin/teachers");
        setTeachers(res.data.data || []);
      } catch (err) {
        console.log("Failed to load teachers:", err);
      } finally {
        setTeacherLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const stats = useMemo(() => {
    const total = leaveData.length;
    const approved = leaveData.filter(
      (leave) => leave.status === "approved",
    ).length;
    const rejected = leaveData.filter(
      (leave) => leave.status === "rejected",
    ).length;
    const pending = leaveData.filter(
      (leave) => leave.status === "pending",
    ).length;

    const getPercent = (value) => {
      if (!total) return 0;
      return Math.round((value / total) * 100);
    };

    return {
      total,
      approved,
      rejected,
      pending,
      approvedPercent: getPercent(approved),
      rejectedPercent: getPercent(rejected),
      pendingPercent: getPercent(pending),
      totalPercent: total ? 100 : 0,
    };
  }, [leaveData]);

  const cards = [
    {
      id: 1,
      value: stats.total,
      total: " requests",
      label: "Total Leaves",
      percent: stats.totalPercent,
      color: "#4e73ff",
      track: "#eaf0ff",
    },
    {
      id: 2,
      value: stats.approved,
      total: `/${stats.total}`,
      label: "Approved Leaves",
      percent: stats.approvedPercent,
      color: "#18b676",
      track: "#e5f8ef",
    },
    {
      id: 3,
      value: stats.rejected,
      total: `/${stats.total}`,
      label: "Rejected Leaves",
      percent: stats.rejectedPercent,
      color: "#ef4444",
      track: "#fee2e2",
    },
    {
      id: 4,
      value: stats.pending,
      total: `/${stats.total}`,
      label: "Pending Requests",
      percent: stats.pendingPercent,
      color: "#f59e0b",
      track: "#fff4df",
    },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "fromDate" && prev.toDate && new Date(prev.toDate) < new Date(value)
        ? { toDate: "" }
        : {}),
    }));
  };

  const closeModal = () => {
    setShowModal(false);
    setLeaveForm(initialLeaveForm);
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();

    if (!leaveForm.teacher) return alert("Please select a teacher");
    if (!leaveForm.fromDate || !leaveForm.toDate) {
      return alert("Please select from and to dates");
    }
    if (new Date(leaveForm.toDate) < new Date(leaveForm.fromDate)) {
      return alert("'To Date' cannot be before 'From Date'");
    }
    if (!leaveForm.reason.trim()) return alert("Please enter leave reason");

    try {
      setSubmitLoading(true);
      const res = await API.post("/admin/leaves", leaveForm);
      const createdLeave = res.data.data;

      if (createdLeave && setLeaveData) {
        setLeaveData((prev) => [createdLeave, ...prev]);
      }

      alert(res.data.message || "Leave created successfully");
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create leave");
    } finally {
      setSubmitLoading(false);
    }
  };

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
          onClick={closeModal}
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
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <form className="leave-form" onSubmit={handleSubmitLeave}>
              <div className="leave-form-grid">
                <div className="leave-group leave-group-full">
                  <label>Teacher</label>
                  <select
                    name="teacher"
                    value={leaveForm.teacher}
                    onChange={handleFormChange}
                    required
                    disabled={teacherLoading}
                  >
                    <option value="">
                      {teacherLoading ? "Loading teachers..." : "Select teacher"}
                    </option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                        {teacher.department ? ` - ${teacher.department}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="leave-group">
                  <label>Leave Type</label>
                  <select
                    name="leaveType"
                    value={leaveForm.leaveType}
                    onChange={handleFormChange}
                    required
                  >
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="leave-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={leaveForm.status}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="leave-group">
                  <label>From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={leaveForm.fromDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="leave-group">
                  <label>To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    value={leaveForm.toDate}
                    onChange={handleFormChange}
                    min={leaveForm.fromDate}
                    required
                  />
                </div>

                <div className="leave-group leave-group-full">
                  <label>Reason</label>
                  <textarea
                    name="reason"
                    value={leaveForm.reason}
                    onChange={handleFormChange}
                    placeholder="Enter leave reason"
                    required
                  ></textarea>
                </div>

                <div className="leave-group leave-group-full">
                  <label>Admin Note</label>
                  <textarea
                    name="adminNote"
                    value={leaveForm.adminNote}
                    onChange={handleFormChange}
                    placeholder="Optional note for this leave request"
                  ></textarea>
                </div>
              </div>

              <div className="leave-submit-wrap">
                <button
                  type="submit"
                  className="leave-submit-btn"
                  disabled={submitLoading}
                >
                  {submitLoading ? "Submitting..." : "Submit Leave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavesDashboard;
