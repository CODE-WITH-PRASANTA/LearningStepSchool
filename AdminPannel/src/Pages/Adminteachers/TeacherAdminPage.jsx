import React, { useState } from "react";
import TeacherForm from "../../Component/TeachersPosting/TeacherForm";
import TeacherList from "../../Component/TeachersPosting/TeacherList";
import "./TeacherAdminPage.css";

const TeacherAdminPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [editTeacher, setEditTeacher] = useState(null);

  const handleAddTeacher = (teacher) => {
    if (editTeacher) {
      setTeachers(
        teachers.map((t) => (t.id === editTeacher.id ? teacher : t))
      );
      setEditTeacher(null);
    } else {
      setTeachers([...teachers, teacher]);
    }
  };

  const handleDeleteTeacher = (id) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  const handleEditTeacher = (teacher) => {
    setEditTeacher(teacher);
  };

  return (
    <div className="teacher-admin-container">
      <div className="teacher-admin-form-section">
        <TeacherForm
          onSubmit={handleAddTeacher}
          editTeacher={editTeacher}
        />
      </div>

      <div className="teacher-admin-list-section">
        <TeacherList
          teachers={teachers}
          onEdit={handleEditTeacher}
          onDelete={handleDeleteTeacher}
        />
      </div>
    </div>
  );
};

export default TeacherAdminPage;
