import { useState, useEffect } from "react";
import API from "../../api/axios";   // ✅ your axios instance
import "./Primery.css";

export default function Primery() {
  const [form, setForm] = useState({
    hour: "",
    activity: "",
  });

  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH ================= */
  const fetchActivities = async () => {
  try {
    const res = await API.get("/primery");

    const sorted = res.data.sort((a, b) =>
      a.hour.localeCompare(b.hour)
    );

    setRecords(sorted);
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
};

  useEffect(() => {
    fetchActivities();
  }, []);

  /* ================= SUBMIT ================= */
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.hour.trim() || !form.activity.trim()) return;

  try {
    if (editId) {
      await API.put(`/primery/${editId}`, form);
      setEditId(null);
    } else {
      await API.post("/primery", form);
    }

    setForm({ hour: "", activity: "" });
    fetchActivities();
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
  }
};

  /* ================= EDIT ================= */
  const editRecord = (record) => {
    setForm({
      hour: record.hour,
      activity: record.activity,
    });
    setEditId(record._id);
  };

  /* ================= DELETE ================= */
  const deleteRecord = async (id) => {
    try {
      await API.delete(`/primery/${id}`);
      fetchActivities();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="pp-container">

      {/* ========== FORM ========== */}
      <form className="pp-form" onSubmit={handleSubmit}>
        <h2 className="pp-title">
          {editId !== null ? "Edit Primery Activity" : "Add Primery Activity"}
        </h2>

        <div>
          <label className="pp-label">Hour</label>
          <input
            type="time"
            value={form.hour}
            onChange={(e) => setForm({ ...form, hour: e.target.value })}
            required
            className="pp-input"
          />
        </div>

        <div className="mt-4">
          <label className="pp-label">Activity</label>
          <input
            value={form.activity}
            onChange={(e) =>
              setForm({ ...form, activity: e.target.value })
            }
            required
            className="pp-input"
            placeholder="Enter activity"
          />
        </div>

        <button className="pp-btn">
          {editId !== null ? "Update" : "Submit"}
        </button>

        <p className="pp-version">Version 1.0.0</p>
      </form>

      {/* ========== TABLE ========== */}
      <div className="pp-table-box">
        <h2 className="pp-title mb-4">Today's Activities</h2>

        <table className="pp-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Activity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.hour}</td>
                <td>{r.activity}</td>
                <td className="pp-actions">
                  <button
                    className="pp-edit"
                    onClick={() => editRecord(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="pp-delete"
                    onClick={() => deleteRecord(r._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan="3" className="pp-empty">
                  No records added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}