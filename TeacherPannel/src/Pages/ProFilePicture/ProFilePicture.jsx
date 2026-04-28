import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { IMAGE_URL } from "../../api/axios";
import "./ProFilepicture.css";

const ProFilePicture = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    avatar: "https://i.pravatar.cc/150",
    department: "",
    permissions: [],
  });

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // ── Leave Request State ──────────────────────────────────────
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "sick",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveTab, setLeaveTab] = useState("form"); // "form" | "history"
  
  const LEAVE_TYPES = [
    { value: "sick", label: "Sick Leave" },
    { value: "casual", label: "Casual Leave" },
    { value: "earned", label: "Earned Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "emergency", label: "Emergency Leave" },
    { value: "other", label: "Other" },
  ];

  const STATUS_STYLES = {
    pending: {
      background: "rgba(234,179,8,0.12)",
      color: "#b45309",
      border: "1px solid rgba(234,179,8,0.3)",
    },
    approved: {
      background: "rgba(34,197,94,0.12)",
      color: "#15803d",
      border: "1px solid rgba(34,197,94,0.3)",
    },
    rejected: {
      background: "rgba(239,68,68,0.12)",
      color: "#b91c1c",
      border: "1px solid rgba(239,68,68,0.3)",
    },
  };

  // ── Image helpers ────────────────────────────────────────────
  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";
    if (typeof imagePath !== "string") return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;
    if (imagePath.startsWith("/")) return `${IMAGE_URL}${imagePath}`;
    return `${IMAGE_URL}/${imagePath}`;
  };

  // ── Load teacher + leave history ────────────────────────────
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("teacher"));
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Teacher",
      }));
    }

    (async () => {
      try {
        const res = await API.get("/teacher/me");
        const me = res?.data;
        setImageError(false);
        setProfile((prev) => ({
          ...prev,
          name: me?.name || prev.name,
          email: me?.email || prev.email,
          role: me?.role || prev.role || "Teacher",
          phone: me?.contact || prev.phone || "",
          department: me?.department || prev.department || "",
          permissions: Array.isArray(me?.permissions)
            ? me.permissions
            : prev.permissions,
          avatar: me?.image ? getImageSrc(me.image) : prev.avatar,
        }));
      } catch (err) {
        console.log(err);
      }
    })();

    // Fetch leave history
    (async () => {
      try {
        const res = await API.get("/teacher/leaves");
        setLeaveHistory(res.data.data || res.data || []);
      } catch (err) {
        console.log("Could not load leave history:", err);
      }
    })();
  }, []);
  
 
  // ── Profile image handlers ───────────────────────────────────
  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setProfile({ ...profile, avatar: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!selectedImage) return alert("Please choose an image first");
      const fd = new FormData();
      fd.append("image", selectedImage);
      await API.put("/teacher/me/image", fd);
      const res = await API.get("/teacher/me");
      const me = res?.data;
      setImageError(false);
      setSelectedImage(null);
      setProfile((prev) => ({
        ...prev,
        avatar: me?.image ? getImageSrc(me.image) : prev.avatar,
      }));
      alert("Profile photo updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Leave request handlers ───────────────────────────────────
  const handleLeaveChange = (e) =>
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    if (!leaveForm.fromDate || !leaveForm.toDate) {
      return alert("Please select both From and To dates.");
    }
    if (new Date(leaveForm.toDate) < new Date(leaveForm.fromDate)) {
      return alert("'To' date cannot be before 'From' date.");
    }
    if (!leaveForm.reason.trim()) {
      return alert("Please provide a reason for leave.");
    }

    try {
      setLeaveLoading(true);
      const payload = {
        leaveType: leaveForm.leaveType,
        fromDate: leaveForm.fromDate,
        toDate: leaveForm.toDate,
        reason: leaveForm.reason,
      };

      const res = await API.post("/teacher/leaves", payload);
      await fetchLeaves();
      // Prepend to history

      // Reset form
      setLeaveForm({ leaveType: "sick", fromDate: "", toDate: "", reason: "" });

      alert(res.data.message || " Leave submit successfully");
      setLeaveTab("history");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit leave request.");
    } finally {
      setLeaveLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaves();
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/teacher/leaves");
      setLeaveHistory(res.data.data || res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // Calculate number of days between two dates (inclusive)
  const calcDays = (from, to) => {
    if (!from || !to) return 0;
    const diff = new Date(to) - new Date(from);
    return Math.max(Math.round(diff / (1000 * 60 * 60 * 24)) + 1, 1);
  };

  return (
    <div className="ProfilePage">
      <div className="ProfilePage__container">
        {/* Header */}
        <div className="ProfilePage__header">
          <h1 className="ProfilePage__title">Teacher Profile</h1>
          <p className="ProfilePage__subtitle">
            Manage your personal information
          </p>
        </div>

        <div className="ProfilePage__content">
          {/* LEFT CARD */}
          <div className="ProfilePage__sidebarCard">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="ProfilePage__avatar"
              onError={() => setImageError(true)}
            />
            <h3 className="ProfilePage__name">{profile.name}</h3>
            <span className="ProfilePage__roleBadge">{profile.role}</span>

            {!imageError && profile.avatar?.includes("/uploads/") && (
              <p
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "rgba(15,23,42,0.55)",
                }}
              >
                Profile photo is loaded from server
              </p>
            )}

            <label className="ProfilePage__avatarBtn">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="ProfilePage__hiddenInput"
              />
            </label>
          </div>

          {/* RIGHT FORM */}
          <form className="ProfilePage__formCard" onSubmit={handleSubmit}>
            <div className="ProfilePage__grid">
              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Full Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="ProfilePage__input ProfilePage__input--disabled"
                  disabled
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Email</label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="ProfilePage__input ProfilePage__input--disabled"
                  disabled
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Phone</label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="ProfilePage__input ProfilePage__input--disabled"
                  disabled
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Role</label>
                <input
                  value={profile.role}
                  disabled
                  className="ProfilePage__input ProfilePage__input--disabled"
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Department</label>
                <input
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  className="ProfilePage__input ProfilePage__input--disabled"
                  disabled
                />
              </div>
            </div>

            <div className="ProfilePage__field" style={{ marginTop: 14 }}>
              <label className="ProfilePage__label">Permissions</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(profile.permissions || []).length === 0 ? (
                  <span style={{ color: "rgba(15,23,42,0.55)", fontSize: 13 }}>
                    No permissions assigned
                  </span>
                ) : (
                  profile.permissions.map((p) => (
                    <span
                      key={p}
                      style={{
                        background: "rgba(43,106,243,0.10)",
                        border: "1px solid rgba(43,106,243,0.18)",
                        color: "rgba(35,79,190,0.95)",
                        borderRadius: 999,
                        padding: "5px 10px",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {p}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="ProfilePage__field">
              <label className="ProfilePage__label">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="ProfilePage__input ProfilePage__textarea ProfilePage__input--disabled"
                disabled
              />
            </div>

            <div className="ProfilePage__actions">
              <button className="ProfilePage__saveBtn">
                {loading ? "Uploading..." : "Upload Profile Photo"}
              </button>
            </div>
          </form>
        </div>

        {/* ═══════════════════════════════════════════════════════
            LEAVE REQUEST SECTION
        ═══════════════════════════════════════════════════════ */}
        <div className="LeaveSection">
          {/* Section heading */}
          <div className="LeaveSection__heading">
            <div className="LeaveSection__headingIcon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h2 className="LeaveSection__title">Leave Requests</h2>
              <p className="LeaveSection__subtitle">
                Apply for leave and track your requests
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="LeaveSection__tabs">
            <button
              type="button"
              className={`LeaveSection__tab ${leaveTab === "form" ? "LeaveSection__tab--active" : ""}`}
              onClick={() => setLeaveTab("form")}
            >
              Apply for Leave
            </button>
            <button
              type="button"
              className={`LeaveSection__tab ${leaveTab === "history" ? "LeaveSection__tab--active" : ""}`}
              onClick={() => setLeaveTab("history")}
            >
              My Requests
              {leaveHistory.length > 0 && (
                <span className="LeaveSection__tabBadge">
                  {leaveHistory.length}
                </span>
              )}
            </button>
          </div>

          {/* ── Apply Form ── */}
          {leaveTab === "form" && (
            <form className="LeaveForm" onSubmit={handleLeaveSubmit}>
              <div className="LeaveForm__grid">
                {/* Leave Type */}
                <div className="ProfilePage__field">
                  <label className="ProfilePage__label">
                    Leave Type <span className="LeaveForm__required">*</span>
                  </label>
                  <select
                    name="leaveType"
                    value={leaveForm.leaveType}
                    onChange={handleLeaveChange}
                    className="ProfilePage__input LeaveForm__select"
                    required
                  >
                    {LEAVE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* From Date */}
                <div className="ProfilePage__field">
                  <label className="ProfilePage__label">
                    From Date <span className="LeaveForm__required">*</span>
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={leaveForm.fromDate}
                    onChange={handleLeaveChange}
                    className="ProfilePage__input"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                {/* To Date */}
                <div className="ProfilePage__field">
                  <label className="ProfilePage__label">
                    To Date <span className="LeaveForm__required">*</span>
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={leaveForm.toDate}
                    onChange={handleLeaveChange}
                    className="ProfilePage__input"
                    min={
                      leaveForm.fromDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                  />
                </div>

                {/* Days preview */}
                {leaveForm.fromDate && leaveForm.toDate && (
                  <div className="ProfilePage__field LeaveForm__daysBadge">
                    <span>
                      📅 Duration:{" "}
                      <strong>
                        {calcDays(leaveForm.fromDate, leaveForm.toDate)} day(s)
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Reason */}
              <div className="ProfilePage__field" style={{ marginTop: 4 }}>
                <label className="ProfilePage__label">
                  Reason <span className="LeaveForm__required">*</span>
                </label>
                <textarea
                  name="reason"
                  value={leaveForm.reason}
                  onChange={handleLeaveChange}
                  className="ProfilePage__input ProfilePage__textarea"
                  placeholder="Describe the reason for your leave request..."
                  rows={4}
                  required
                />
              </div>

              <div className="ProfilePage__actions" style={{ marginTop: 18 }}>
                <button
                  type="submit"
                  className="LeaveForm__submitBtn"
                  disabled={leaveLoading}
                >
                  {leaveLoading ? (
                    <span className="LeaveForm__spinner" />
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Send Leave Request to Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── History ── */}
          {leaveTab === "history" && (
            <div className="LeaveHistory">
              {leaveHistory.length === 0 ? (
                <div className="LeaveHistory__empty">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p>No leave requests yet.</p>
                </div>
              ) : (
                <div className="LeaveHistory__list">
                  {leaveHistory.map((leave, idx) => (
                    <div
                      key={leave._id || idx}
                      className="LeaveHistory__card"
                      style={{
                        background:
                          leave.status === "approved"
                            ? "#f0fdf4"
                            : leave.status === "rejected"
                              ? "#fef2f2"
                              : "#fff",
                        borderLeft:
                          leave.status === "approved"
                            ? "4px solid #22c55e"
                            : leave.status === "rejected"
                              ? "4px solid #ef4444"
                              : "4px solid #f59e0b",
                      }}
                    >
                      <div className="LeaveHistory__cardTop">
                        <div>
                          <span className="LeaveHistory__type">
                            {LEAVE_TYPES.find(
                              (t) => t.value === leave.leaveType,
                            )?.label || leave.leaveType}
                          </span>

                          <span className="LeaveHistory__dates">
                            {leave.fromDate?.slice(0, 10)} →{" "}
                            {leave.toDate?.slice(0, 10)}
                            <span className="LeaveHistory__days">
                              (
                              {calcDays(
                                leave.fromDate?.slice(0, 10),
                                leave.toDate?.slice(0, 10),
                              )}{" "}
                              day(s))
                            </span>
                          </span>

                          {/* 🆕 Applied Date */}
                          <p style={{ fontSize: "12px", color: "#64748b" }}>
                            Applied on{" "}
                            {new Date(leave.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* ✅ FIXED STATUS BADGE */}
                        <span
                          className="LeaveHistory__status"
                          style={
                            STATUS_STYLES[leave.status] || STATUS_STYLES.pending
                          }
                        >
                          {leave.status === "approved"
                            ? "Approved ✅"
                            : leave.status === "rejected"
                              ? "Rejected ❌"
                              : "Pending ⏳"}
                        </span>
                      </div>

                      {/* REASON */}
                      <p className="LeaveHistory__reason">{leave.reason}</p>

                      {/* 🔥 STATUS MESSAGE */}
                      {leave.status === "approved" && (
                        <p
                          style={{
                            color: "#15803d",
                            fontWeight: "600",
                            marginTop: "5px",
                          }}
                        >
                          ✔ Your leave has been approved
                        </p>
                      )}

                      {leave.status === "rejected" && (
                        <p
                          style={{
                            color: "#b91c1c",
                            fontWeight: "600",
                            marginTop: "5px",
                          }}
                        >
                          ✖ Your leave has been rejected
                        </p>
                      )}

                      {/* ADMIN NOTE */}
                      {leave.adminNote && (
                        <p className="LeaveHistory__adminNote">
                          📝 <strong>Admin note:</strong> {leave.adminNote}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* end LeaveSection */}
      </div>
    </div>
  );
};

export default ProFilePicture;
