import { useState, useEffect } from "react";
import API from "../../api/axios";
import "./FaqPosting.css";

export default function FaqPosting() {

  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
  });

  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH ================= */
  const fetchFaqs = async () => {
    try {
      const res = await API.get("/faqs");
      setRecords(res.data.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/faqs/${editId}`, form);
        setEditId(null);
      } else {
        await API.post("/faqs", form);
      }

      setForm({
        question: "",
        answer: "",
        category: "",
      });

      fetchFaqs();

    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  /* ================= EDIT ================= */
  const editRecord = (record) => {
    setForm({
      question: record.question,
      answer: record.answer,
      category: record.category,
    });
    setEditId(record._id);
  };

  /* ================= DELETE ================= */
  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await API.delete(`/faqs/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="FAQ-container">

      {/* LEFT FORM */}
      <div className="FAQ-form-section">
        <form className="FAQ-form" onSubmit={handleSubmit}>
          <h2 className="FAQ-title">
            {editId ? "Edit FAQ" : "Add New FAQ"}
          </h2>

          <div className="FAQ-field">
            <label className="FAQ-label">Question</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) =>
                setForm({ ...form, question: e.target.value })
              }
              required
              className="FAQ-input"
            />
          </div>

          <div className="FAQ-field">
            <label className="FAQ-label">Answer</label>
            <textarea
              value={form.answer}
              onChange={(e) =>
                setForm({ ...form, answer: e.target.value })
              }
              required
              className="FAQ-textarea"
            />
          </div>

          <div className="FAQ-field">
            <label className="FAQ-label">Category</label>
            <select
              className="FAQ-select"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              <option value="Trust & Safety">Trust & Safety</option>
              <option value="General">General</option>
              <option value="Program">Program</option>
              <option value="Learning Step School">Learning Step School</option>
            </select>
          </div>

          <button className="FAQ-button">
            {editId ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* RIGHT TABLE */}
      <div className="FAQ-table-section">
        <h2 className="FAQ-title">FAQ List</h2>

        <div className="FAQ-table-wrapper">
          <table className="FAQ-table">
            <thead>
              <tr>
                <th>SL. No</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {records.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>{r.question}</td>
                  <td>{r.answer}</td>
                  <td>{r.category}</td>
                  <td className="FAQ-actions">
                    <button
                      className="FAQ-edit-btn"
                      onClick={() => editRecord(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="FAQ-delete-btn"
                      onClick={() => deleteRecord(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {records.length === 0 && (
                <tr>
                  <td colSpan="5" className="FAQ-empty">
                    No FAQ added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}