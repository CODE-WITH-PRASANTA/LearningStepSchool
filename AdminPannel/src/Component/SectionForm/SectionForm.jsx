import React, { useEffect, useState } from "react";

const SectionForm = ({ editRow, onSave }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editRow) setName(editRow.name);
  }, [editRow]);

  const submit = () => {
    onSave(name);
    setName("");
  };

  return (
    <div className="section-card section-form">
      <div className="section-card-header">
        ✏️ Add / Edit Section
      </div>

      <div className="section-body">
        <label>
          Name <span className="required">*</span>
        </label>
        <input
          placeholder="Enter section"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn-primary" onClick={submit}>
          {editRow ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SectionForm;
