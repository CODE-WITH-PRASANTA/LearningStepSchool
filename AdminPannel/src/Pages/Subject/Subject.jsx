import React, { useState } from "react";
import SubjectForm from "../../Component/SubjectAdmin/SubjectAdmin";
import SubjectList from "../../Component/SubjectAdmin/SubjectAdminList";
import "./Subject.css";

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "01. KSV Math", type: "Theory", code: "KSV-MTH" },
    { id: 2, name: "02. KSV-Hindi", type: "Theory", code: "KSV-HIN" },
    { id: 3, name: "biology", type: "Practical", code: "" },
    { id: 4, name: "Accounts", type: "Theory", code: "12" }
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
    <div className="sp-page-wrapper">
      <div className="sp-grid-layout">
        <SubjectForm onSave={handleSave} editData={editData} />
        <SubjectList
          subjects={subjects}
          onEdit={setEditData}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default SubjectPage;