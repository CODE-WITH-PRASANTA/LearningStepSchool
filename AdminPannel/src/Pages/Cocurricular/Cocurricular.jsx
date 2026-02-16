import React, { useState } from "react";
import SubjectForm from "../../Component/Cocurricualrfrom/Subjectfrom";
import SubjectTable from "../../Component/Cocurricualrfrom/Subjecttable";
import "./Cocurricular.css";

const CoCurricularSubject = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "01. Bhagti", code: "0", class: "KSV 6th,1st", type: "Social Skills" },
    { id: 2, name: "02. Poojan", code: "0", class: "KSV 6th,1st", type: "Social Skills" },
    { id: 3, name: "03. cleaning", code: "123", class: "1st,KSV 6th", type: "Discipline" },
    { id: 4, name: "Art Education", code: "", class: "4th,5th,3rd,6th,7th,8th", type: "Co-Scholastic" }
  ]);

  const [editData, setEditData] = useState(null);

  const handleSave = (data) => {
    if (editData) {
      setSubjects(subjects.map(s => s.id === editData.id ? data : s));
      setEditData(null);
    } else {
      setSubjects([...subjects, { ...data, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="cc-wrapper">
      <div className="cc-grid">
        <SubjectForm onSave={handleSave} editData={editData} />
        <SubjectTable
          subjects={subjects}
          onEdit={setEditData}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default CoCurricularSubject;