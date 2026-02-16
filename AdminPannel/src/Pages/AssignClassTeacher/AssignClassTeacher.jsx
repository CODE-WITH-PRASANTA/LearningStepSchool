import React, { useState } from "react";
import "./AssignClassTeacher.css";
import EditClassTeacherForm from "../../Component/ClassTeacherForm/ClassTeacherForm";
import TeacherList from "../../Component/ClassTeacherForm/ClassTeacherList";

const AssignClassTeacher = () => {
  const [editData, setEditData] = useState(null);
  const [list, setList] = useState([
    { id: 1, className: "10th", section: "A", teacher: "DS (1107)" },
    { id: 2, className: "1st", section: "A", teacher: "T DILIP KUMAR" },
    { id: 3, className: "1st", section: "A", teacher: "Kajal Saini" },
    { id: 4, className: "1st", section: "A", teacher: "Sachin" },
    { id: 5, className: "1st", section: "A", teacher: "Sonali Jain" },
  ]);

  const handleSave = (data) => {
    if (editData) {
      setList(list.map(i => i.id === editData.id ? { ...data, id: i.id } : i));
    } else {
      setList([...list, { ...data, id: Date.now() }]);
    }
    setEditData(null);
  };

  const handleDelete = (id) => {
    setList(list.filter(i => i.id !== id));
  };

  return (
    <div className="ct-wrapper">
      <div className="ct-header">
        <h2>👤 Assign Class Teacher</h2>
        <span>Academics / Assign Class Teacher</span>
      </div>

      <div className="ct-grid">
        <EditClassTeacherForm
          editData={editData}
          onSave={handleSave}
        />
        <TeacherList
          data={list}
          onEdit={setEditData}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AssignClassTeacher;
