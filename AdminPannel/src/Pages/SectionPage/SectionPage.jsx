import React, { useState } from "react";
import "./SectionPage.css";
import SectionForm from "../../Component/SectionForm/SectionForm";
import SectionList from "../../Component/SectionForm/SectionFormList";

const initialSections = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
  { id: 4, name: "Arts" },
  { id: 5, name: "CBSE" },
  { id: 6, name: "6pm to 7 pm" },
  { id: 7, name: "8–9:30 AM" },
];

const SectionPage = () => {
  const [sections, setSections] = useState(initialSections);
  const [editRow, setEditRow] = useState(null);

  const handleSave = (name) => {
    if (!name.trim()) return;

    // ✅ unique section names
    if (
      sections.some(
        (s) =>
          s.name.toLowerCase() === name.toLowerCase() &&
          s.id !== editRow?.id
      )
    ) {
      alert("Section name must be unique");
      return;
    }

    if (editRow) {
      setSections(
        sections.map((s) =>
          s.id === editRow.id ? { ...s, name } : s
        )
      );
    } else {
      setSections([...sections, { id: Date.now(), name }]);
    }

    setEditRow(null);
  };

  return (
    <div className="section-wrapper">
      {/* HEADER */}
      <div className="section-header">
        <h2>🧩 Section</h2>
        <span>Academics / Section</span>
      </div>

      <div className="section-grid">
        <SectionForm editRow={editRow} onSave={handleSave} />
        <SectionList data={sections} onEdit={setEditRow} />
      </div>
    </div>
  );
};

export default SectionPage;
