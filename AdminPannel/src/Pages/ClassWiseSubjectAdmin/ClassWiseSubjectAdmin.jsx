import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function ClassWiseSubjectAdmin() {
  const emptyForm = {
    classIds: [], // ✅ MULTIPLE CLASSES
    subjectName: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH ================= */

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      setClasses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/classwise-subjects");
      setSubjects(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  /* ================= INPUT ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= CHECKBOX ================= */

  const handleCheckbox = (classId, checked) => {
    if (checked) {
      setForm({
        ...form,
        classIds: [...form.classIds, classId],
      });
    } else {
      setForm({
        ...form,
        classIds: form.classIds.filter((id) => id !== classId),
      });
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.classIds.length || !form.subjectName) {
      alert("Select class & enter subject");
      return;
    }

    try {
      await Promise.all(
        form.classIds.map((classId) =>
          API.post("/classwise-subjects", {
            classId,
            subjects: [form.subjectName],
          }),
        ),
      );

      fetchSubjects();
      setForm(emptyForm);
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

  const deleteSubject = async (classId, subject) => {
    try {
      await API.put("/classwise-subjects/remove", {
        classId,
        subject,
      });
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteClass = async (docId) => {
    if (!window.confirm("Delete full class?")) return;

    try {
      await API.delete(`/classwise-subjects/${docId}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */

  const editSubject = (clsId, subject) => {
    setForm({
      classIds: [clsId], // ✅ only one selected for edit
      subjectName: subject,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= GROUP ================= */

  const groupedSubjects = classes
    .map((cls) => {
      const found = subjects.find(
        (s) => String(s.classId?._id || s.classId) === String(cls._id),
      );

      return {
        ...cls,
        docId: found?._id,
        subjects: found ? found.subjects : [],
      };
    })
    .filter((cls) => cls.subjects.length > 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Class Wise Subject Management</h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8 space-y-4"
      >
        <h2 className="text-lg font-semibold">Add Subject</h2>

        {/* ✅ CHECKBOX UI */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <label
              key={cls._id}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 
        ${
          form.classIds.includes(cls._id)
            ? "bg-blue-50 border-blue-500 shadow-md"
            : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm"
        }`}
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.classIds.includes(cls._id)}
                  onChange={(e) => handleCheckbox(cls._id, e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />

                <span className="font-medium text-gray-700">
                  {cls.className}
                </span>
              </div>

              {/* RIGHT SIDE ICON */}
              {form.classIds.includes(cls._id) && (
                <span className="text-blue-600 text-sm font-semibold">✓</span>
              )}
            </label>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          Selected: {form.classIds.length} classes
        </div>

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

      {/* LIST */}

      {groupedSubjects.map((cls) => (
        <div key={cls._id} className="bg-white rounded shadow p-6 mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">{cls.className}</h2>

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
