import React, { useEffect, useState } from "react";

const classes = ["LKG","UKG","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];
const sections = ["A","B","C","D"];
const teachers = ["DS (1107)","T DILIP KUMAR","Kajal Saini","Sachin","Sonali Jain"];

const EditClassTeacherForm = ({ editRow, onSave }) => {
  const [form, setForm] = useState({ className: "", section: "", teacher: "" });

  useEffect(() => {
    if (editRow) setForm(editRow);
  }, [editRow]);

  const submit = () => {
    if (!form.className || !form.section || !form.teacher) return;
    onSave(form);
    setForm({ className: "", section: "", teacher: "" });
  };

  return (
    <div className="ct-card ct-form">
      <div className="ct-card-header">✏️ Add / Edit Class Teacher</div>

      <div className="ct-body">
        <label>Class *</label>
        <select value={form.className} onChange={(e)=>setForm({...form,className:e.target.value})}>
          <option value="">Select Class</option>
          {classes.map(c => <option key={c}>{c}</option>)}
        </select>

        <label>Section *</label>
        <select value={form.section} onChange={(e)=>setForm({...form,section:e.target.value})}>
          <option value="">Select Section</option>
          {sections.map(s => <option key={s}>{s}</option>)}
        </select>

        <label>Class Teacher *</label>
        <select value={form.teacher} onChange={(e)=>setForm({...form,teacher:e.target.value})}>
          <option value="">Select Teacher</option>
          {teachers.map(t => <option key={t}>{t}</option>)}
        </select>

        <button className="ct-btn" onClick={submit}>
          {editRow ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default EditClassTeacherForm;
