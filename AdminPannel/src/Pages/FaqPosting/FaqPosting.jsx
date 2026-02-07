import { useState } from "react";
import "./FaqPosting.css";

export default function FaqPosting() {
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
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

    setForm({
      question: "",
      answer: "",
      category: "",
    });
  };

  const editRecord = (i) => {
    setForm(records[i]);
    setEditIndex(i);
  };

  const deleteRecord = (i) => {
    setRecords(records.filter((_, index) => index !== i));
  };

  return (
    <div className="faq-container">

      {/* ========== FORM LEFT SIDE ========== */}
      <form className="faq-form" onSubmit={handleSubmit}>
        <h2 className="faq-title">
          {editIndex !== null ? "Edit FAQ" : "Add New FAQ"}
        </h2>

        {/* Question */}
        <div>
          <label className="faq-label">Question</label>
          <input
            type="text"
            value={form.question}
            onChange={(e) =>
              setForm({ ...form, question: e.target.value })
            }
            required
            className="faq-input"
            placeholder="Enter your question"
          />
        </div>

        {/* Answer */}
        <div className="mt-4">
          <label className="faq-label">Answer</label>
          <textarea
            value={form.answer}
            onChange={(e) =>
              setForm({ ...form, answer: e.target.value })
            }
            required
            className="faq-textarea"
            placeholder="Enter answer"
          ></textarea>
        </div>

        {/* Category */}
        <div className="mt-4">
          <label className="faq-label">Category</label>
          <select
            className="faq-input"
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

        {/* Submit Button */}
        <button className="faq-btn">
          {editIndex !== null ? "Update" : "Submit"}
        </button>

        <p className="faq-version">Version 1.0.0</p>
      </form>

      {/* ========== TABLE RIGHT SIDE ========== */}
      <div className="faq-table-box">
        <h2 className="faq-title mb-4">FAQ List</h2>

        <table className="faq-table">
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
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.question}</td>
                <td>{r.answer}</td>
                <td>{r.category}</td>
                <td className="faq-actions">
                  <button className="faq-edit" onClick={() => editRecord(i)}>
                    Edit
                  </button>
                  <button
                    className="faq-delete"
                    onClick={() => deleteRecord(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan="5" className="faq-empty">
                  No FAQ added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
