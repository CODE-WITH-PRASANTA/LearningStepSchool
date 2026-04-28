import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import "./LeaveSection.css";

const LeaveSection = () => {
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "sick",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveTab, setLeaveTab] = useState("form");

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

  const handleLeaveChange = (e) =>
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/teacher/leaves");
      setLeaveHistory(res.data.data || res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    const interval = setInterval(fetchLeaves, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    if (!leaveForm.fromDate || !leaveForm.toDate)
      return alert("Select dates");

    if (new Date(leaveForm.toDate) < new Date(leaveForm.fromDate))
      return alert("Invalid date range");

    if (!leaveForm.reason.trim())
      return alert("Reason required");

    try {
      setLeaveLoading(true);

      const res = await API.post("/teacher/leaves", leaveForm);

      await fetchLeaves();

      setLeaveForm({
        leaveType: "sick",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      alert(res.data.message || "Leave submitted");
      setLeaveTab("history");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLeaveLoading(false);
    }
  };

  const calcDays = (from, to) => {
    if (!from || !to) return 0;
    const diff = new Date(to) - new Date(from);
    return Math.max(Math.round(diff / (1000 * 60 * 60 * 24)) + 1, 1);
  };

  return (
    <div className="LeaveSection">
      <div className="LeaveSection__heading">
        <h2>Leave Requests</h2>
        <p>Apply and track leave</p>
      </div>

      {/* Tabs */}
      <div className="LeaveSection__tabs">
        <button
          className={leaveTab === "form" ? "active" : ""}
          onClick={() => setLeaveTab("form")}
        >
          Apply
        </button>

        <button
          className={leaveTab === "history" ? "active" : ""}
          onClick={() => setLeaveTab("history")}
        >
          History ({leaveHistory.length})
        </button>
      </div>

      {/* FORM */}
      {leaveTab === "form" && (
        <form className="LeaveForm" onSubmit={handleLeaveSubmit}>
          <select
            name="leaveType"
            value={leaveForm.leaveType}
            onChange={handleLeaveChange}
          >
            {LEAVE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="fromDate"
            value={leaveForm.fromDate}
            onChange={handleLeaveChange}
            required
          />

          <input
            type="date"
            name="toDate"
            value={leaveForm.toDate}
            onChange={handleLeaveChange}
            required
          />

          {leaveForm.fromDate && leaveForm.toDate && (
            <div className="days">
              {calcDays(leaveForm.fromDate, leaveForm.toDate)} days
            </div>
          )}

          <textarea
            name="reason"
            value={leaveForm.reason}
            onChange={handleLeaveChange}
            placeholder="Reason..."
            required
          />

          <button type="submit" disabled={leaveLoading}>
            {leaveLoading ? "Sending..." : "Submit Leave"}
          </button>
        </form>
      )}

      {/* HISTORY */}
      {leaveTab === "history" && (
        <div className="LeaveHistory">
          {leaveHistory.length === 0 ? (
            <p>No leave requests</p>
          ) : (
            leaveHistory.map((leave, i) => (
              <div key={i} className="card">
                <div className="top">
                  <strong>{leave.leaveType}</strong>
                  <span style={STATUS_STYLES[leave.status]}>
                    {leave.status}
                  </span>
                </div>

                <p>
                  {leave.fromDate?.slice(0, 10)} →{" "}
                  {leave.toDate?.slice(0, 10)}
                </p>

                <p>{leave.reason}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveSection;