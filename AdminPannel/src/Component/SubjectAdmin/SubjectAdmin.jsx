import React, { useEffect, useState } from "react";

const SubjectForm = ({ onSave, editData }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "Theory"
  });

  useEffect(() => {
    // if (editData) setForm(editData);
  }, [editData]);

  const submitHandler = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ name: "", code: "", type: "Theory" });
  };

  return (
    <div className="sp-card">
      <h3 className="sp-card-title">✏️ Add / Edit Subject</h3>

      <form onSubmit={submitHandler} className="sp-form">
        <label>Name *</label>
        <input
          placeholder="Enter name"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Code</label>
        <input
          placeholder="Enter code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <label>Type *</label>
        <div className="sp-checkbox-group">
          <label>
            <input
              type="radio"
              checked={form.type === "Theory"}
              onChange={() => setForm({ ...form, type: "Theory" })}
            />
            Theory
          </label>
          <label>
            <input
              type="radio"
              checked={form.type === "Practical"}
              onChange={() => setForm({ ...form, type: "Practical" })}
            />
            Practical
          </label>
        </div>

        <button className="sp-primary-btn">
          {editData ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default SubjectForm;