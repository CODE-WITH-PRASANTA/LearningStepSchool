import { useState } from "react";
import "./Secondary.css";

export default function Secondary() {
  const [form, setForm] = useState({
    hour: "",
    activity: "",
  });

  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updated = [...records];
      updated[editIndex] = form;
      setRecords(updated);
      setEditIndex(null);
    } else {
      setRecords([...records, form]);
    }

    setForm({ hour: "", activity: "" });
  };

  const editRecord = (i) => {
    setForm(records[i]);
    setEditIndex(i);
  };

  const deleteRecord = (i) => {
    setRecords(records.filter((_, index) => index !== i));
  };

  return (
    <div className="pp-container">

      {/* ---------- FORM ---------- */}
      <form className="pp-form" onSubmit={handleSubmit}>
        <h2 className="pp-title">
          {editIndex !== null ? "Edit Activity" : "Add Activity"}
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
          {editIndex !== null ? "Update" : "Submit"}
        </button>

        {/* Version Text */}
        <p className="pp-version">Version 1.0.0</p>
      </form>

      {/* ---------- TABLE ---------- */}
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
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.hour}</td>
                <td>{r.activity}</td>
                <td className="pp-actions">
                  <button className="pp-edit" onClick={() => editRecord(i)}>
                    Edit
                  </button>
                  <button className="pp-delete" onClick={() => deleteRecord(i)}>
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

