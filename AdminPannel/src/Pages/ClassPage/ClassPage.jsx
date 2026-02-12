import React, { useState } from "react";
import "./ClassPage.css";
import EditClassForm from "../../Component/ClassPageForms/ClassPageForm";
import ClassList from "../../Component/ClassPageForms/ClassPageList";

const initialClasses = [
  { id: 1, srNo: 1, group: "DPS", className: "1st", section: "A, Comm, B, C" },
  { id: 2, srNo: 2, group: "DPS", className: "2nd", section: "A, B, C" },
  { id: 3, srNo: 3, group: "DPS", className: "3rd", section: "A, B, D" },
  { id: 4, srNo: 4, group: "DPS", className: "4th", section: "A, B, C, D" },
];

const ClassPage = () => {
  const [data, setData] = useState(initialClasses);
  const [editRow, setEditRow] = useState(null);

  const handleSave = (form) => {
    if (editRow) {
      setData(data.map(d => d.id === editRow.id ? { ...form, id: d.id } : d));
    } else {
      setData([...data, { ...form, id: Date.now() }]);
    }
    setEditRow(null);
  };

  const handleDelete = (id) => {
    setData(data.filter(d => d.id !== id));
  };

  return (
    <div className="class-wrapper">
      <div className="class-header">
        <h2>👥 Class</h2>
        <span>Academics / Class</span>
      </div>

      <div className="class-grid">
        <EditClassForm editRow={editRow} onSave={handleSave} />
        <ClassList
          data={data}
          onEdit={setEditRow}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ClassPage;
