import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function ClassWiseSubjectAdmin() {

  const emptyForm = {
    classId: "",
    subjectName: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH CLASSES ================= */

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      setClasses(res.data.data || []);
    } catch (err) {
      console.error("Fetch classes error:", err);
    }
  };

  /* ================= FETCH SUBJECTS ================= */

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subjects");
      setSubjects(res.data.data || []);
    } catch (err) {
      console.error("Fetch subjects error:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.classId || !form.subjectName) return;

    try {

      if (editId) {
        await API.put(`/subjects/${editId}`, form);
      } else {
        await API.post("/subjects", form);
      }

      fetchSubjects();
      setForm(emptyForm);
      setEditId(null);

    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  /* ================= DELETE ================= */

  const deleteSubject = async (id) => {
    try {
      await API.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ================= EDIT ================= */

  const editSubject = (subject) => {
    setForm({
      classId: subject.classId,
      subjectName: subject.subjectName
    });

    setEditId(subject._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /* ================= GROUP SUBJECTS ================= */

  const groupedSubjects = classes.map((cls) => ({
    ...cls,
    subjects: subjects.filter(
      (s) => String(s.classId) === String(cls._id)
    )
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Class Wise Subject Management
      </h1>

      {/* SUBJECT FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8 space-y-4"
      >

        <h2 className="text-lg font-semibold">
          {editId ? "Edit Subject" : "Add Subject"}
        </h2>

        {/* CLASS SELECT */}

        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >

          <option value="">Select Class</option>

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}
            </option>
          ))}

        </select>

        {/* SUBJECT */}

        <input
          name="subjectName"
          value={form.subjectName}
          onChange={handleChange}
          placeholder="Subject Name"
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update Subject" : "Add Subject"}
        </button>

      </form>

      {/* CLASS WISE SUBJECT LIST */}

      {groupedSubjects.map((cls) => (

        <div
          key={cls._id}
          className="bg-white rounded shadow p-6 mb-6"
        >

          <h2 className="text-xl font-bold mb-4">
            {cls.className}
          </h2>

          {cls.subjects.length === 0 ? (
            <p className="text-gray-500">
              No subjects added
            </p>
          ) : (

            <ul className="space-y-2">

              {cls.subjects.map((sub) => (

                <li
                  key={sub._id}
                  className="flex justify-between border p-2 rounded"
                >

                  <span>{sub.subjectName}</span>

                  <div className="space-x-3">

                    <button
                      onClick={() => editSubject(sub)}
                      className="text-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSubject(sub._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>

                  </div>

                </li>

              ))}

            </ul>

          )}

        </div>

      ))}

    </div>
  );
}