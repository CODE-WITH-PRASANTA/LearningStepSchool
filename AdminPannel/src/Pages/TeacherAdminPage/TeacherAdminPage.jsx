import React, { useState, useEffect } from "react";
import TeacherForm from "../../Component/TeachersPosting/TeacherForm";
import TeacherList from "../../Component/TeachersPosting/TeacherList";
import API from "../../api/axios";

const TeacherAdminPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [editTeacher, setEditTeacher] = useState(null);

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/teachers");
      setTeachers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    await API.delete(`/teachers/${id}`);
    fetchTeachers();
  };

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto">

        {/* LEFT FORM */}
        <div className="w-full xl:w-3/5 bg-white rounded-2xl shadow p-6">
          <TeacherForm
            editTeacher={editTeacher}
            setEditTeacher={setEditTeacher}
            refreshTeachers={fetchTeachers}
          />
        </div>

        {/* RIGHT LIST */}
        <div className="w-full xl:w-2/5 bg-white rounded-2xl shadow p-6 flex flex-col">
          <TeacherList
            teachers={teachers}
            onEdit={setEditTeacher}
            onDelete={handleDeleteTeacher}
          />
        </div>

      </div>
    </div>
  );
};

export default TeacherAdminPage;