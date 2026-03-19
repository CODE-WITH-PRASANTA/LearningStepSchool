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
      const res = await API.get("/classwise-subjects");
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
      await API.post("/classwise-subjects", {
        classId: form.classId,
        subjects: [form.subjectName]
      });

      fetchSubjects();
      setForm(emptyForm);
      setEditId(null);

    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  /* ================= DELETE SINGLE SUBJECT ================= */

  const deleteSubject = async (classId, subject) => {
    try {
      await API.put("/classwise-subjects/remove", {
        classId,
        subject
      });

      fetchSubjects();
    } catch (err) {
      console.error("Delete subject error:", err);
    }
  };

  /* ================= DELETE FULL CLASS ================= */

  const deleteClass = async (docId) => {
    try {
      if (!window.confirm("Delete full class and all subjects?")) return;

      await API.delete(`/classwise-subjects/${docId}`);

      fetchSubjects();
    } catch (err) {
      console.error("Delete class error:", err);
    }
  };

  /* ================= EDIT ================= */

  const editSubject = (clsId, subject) => {
    setForm({
      classId: clsId,
      subjectName: subject
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /* ================= GROUP SUBJECTS ================= */

  const groupedSubjects = classes
    .map((cls) => {
      const found = subjects.find(
        (s) => String(s.classId?._id || s.classId) === String(cls._id)
      );

      return {
        ...cls,
        docId: found?._id,
        subjects: found ? found.subjects : []
      };
    })
    .filter((cls) => cls.subjects.length > 0); // ✅ FIX: hide empty classes

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
          Add Subject
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
          Add Subject
        </button>

      </form>

      {/* CLASS WISE SUBJECT LIST */}

      {groupedSubjects.map((cls) => (

        <div
          key={cls._id}
          className="bg-white rounded shadow p-6 mb-6"
        >

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {cls.className}
            </h2>

            {cls.docId && (
              <button
                onClick={() => deleteClass(cls.docId)}
                className="text-red-700"
              >
                Delete Class
              </button>
            )}
          </div>

          <ul className="space-y-2">

            {cls.subjects.map((sub, index) => (

              <li
                key={index}
                className="flex justify-between border p-2 rounded"
              >

                <span>{sub}</span>

                <div className="space-x-3">

                  <button
                    onClick={() => editSubject(cls._id, sub)}
                    className="text-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteSubject(cls._id, sub)}
                    className="text-red-600"
                  >
                    Delete
                  </button>

                </div>

              </li>

            ))}

          </ul>

        </div>

      ))}

    </div>
  );
}