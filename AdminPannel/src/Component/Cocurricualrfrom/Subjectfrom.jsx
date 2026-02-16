import React, { useEffect, useState } from "react";

const SubjectForm = ({ onSave, editData }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    class: "",
    type: "Social Skills"
  });

  useEffect(() => {
    // if (editData) setForm(editData);
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ name: "", code: "", class: "", type: "Social Skills" });
  };

  return (
    <div className="cc-card">
      <h3>✏️ Add Co-Curricular Subject</h3>

      <form onSubmit={handleSubmit}>
        <label>Name *</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

        <label>Code</label>
        <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />

        <label>Class *</label>
        <input value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required />

        <label>Type</label>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option>Social Skills</option>
          <option>Discipline</option>
          <option>Co-Scholastic</option>
        </select>

        <button type="submit">{editData ? "Update" : "Save"}</button>
      </form>
    </div>
  );
};

export default SubjectForm;