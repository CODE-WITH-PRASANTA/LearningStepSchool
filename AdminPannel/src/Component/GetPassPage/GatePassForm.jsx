import React, { useState } from "react";

const GatePassForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    student: "",
    person: "",
    startDate: "",
    endDate: "",
    inTime: "",
    outTime: "",
    note: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, image: URL.createObjectURL(files[0]) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({
      student: "",
      person: "",
      startDate: "",
      endDate: "",
      inTime: "",
      outTime: "",
      note: "",
      image: null,
    });
  };

  return (
    <div className="gatepass-form-card">
      <h3>Add Gate Pass</h3>

      <form onSubmit={submit}>
        <input
          name="student"
          placeholder="Student Name"
          value={form.student}
          onChange={handleChange}
          required
        />

        <input
          name="person"
          placeholder="Person Carrying Student"
          value={form.person}
          onChange={handleChange}
          required
        />

        <input type="date" name="startDate" onChange={handleChange} required />
        <input type="date" name="endDate" onChange={handleChange} required />

        <input type="time" name="inTime" onChange={handleChange} />
        <input type="time" name="outTime" onChange={handleChange} />

        <input type="file" onChange={handleChange} />

        <textarea
          name="note"
          placeholder="Note"
          value={form.note}
          onChange={handleChange}
        />

        <button className="btn-primary">Save</button>
      </form>
    </div>
  );
};

export default GatePassForm;
