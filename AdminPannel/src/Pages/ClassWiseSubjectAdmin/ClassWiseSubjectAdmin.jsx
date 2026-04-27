import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function ClassWiseSubjectAdmin() {
  const emptyForm = {
    classIds: [],
    subjectName: "",
    subjectType: "regular", // ✅ NEW
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

  // useEffect(() => {
  //   console.log("Classes Loaded:", classes);
  //   console.log("Subjects Loaded:", subjects);
  // }, [classes, subjects]);

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
    const id = String(classId); // ✅ normalize

    if (checked) {
      setForm({
        ...form,
        classIds: [...form.classIds, id],
      });
    } else {
      setForm({
        ...form,
        classIds: form.classIds.filter((i) => i !== id),
      });
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectName = form.subjectName.trim(); // ✅ CLEAN INPUT

    // ✅ validation
    if (!form.classIds.length || !subjectName) {
      alert("Select class & enter subject");
      return;
    }

    // ✅ duplicate check (frontend)
    const alreadyExists = form.classIds.some((classId) => {
      const cls = subjects.find(
        (c) => String(c.classId?._id || c.classId) === String(classId),
      );

      return cls?.subjects?.some(
        (s) =>
          (typeof s === "string" ? s : s.name).toLowerCase() ===
          subjectName.toLowerCase(),
      );
    });

    if (alreadyExists) {
      alert("Subject already exists in selected class!");
      return;
    }

    try {
      await Promise.all(
        form.classIds.map((classId) =>
          API.post("/classwise-subjects", {
            classId,
            subjects: [
              {
                name: subjectName, // ✅ trimmed value
                type: form.subjectType,
              },
            ],
          }),
        ),
      );

      // ✅ refresh
      fetchSubjects();

      // ✅ reset form
      setForm({
        classIds: [],
        subjectName: "",
        subjectType: "regular",
      });

      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // console.log("Form IDs:", form.classIds);
  // console.log(
  //   "Class IDs:",
  //   classes.map((c) => String(c._id)),
  // );
  /* ================= DELETE ================= */
  // console.log("Subjects:", subjects);

  const deleteSubject = async (classId, subjectName) => {
    try {
      await API.put("/classwise-subjects/remove", {
        classId,
        subjectName,
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
    const isString = typeof subject === "string";

    setForm({
      classIds: [String(clsId)], // ✅ now works
      subjectName: isString ? subject : subject.name,
      subjectType: isString ? "regular" : subject.type || "regular",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= GROUP ================= */

  const groupedSubjects = classes
    .map((cls) => {
      // ✅ get ALL matching subject docs
      const matched = subjects.filter((s) => {
          if (!s?.classId) return false; // ✅ important fix

          const subjectClassId =
            typeof s.classId === "object"
              ? s.classId?._id
              : s.classId;

          return String(subjectClassId) === String(cls._id);
        });

      // ❌ no match → skip later
      if (!matched.length) {
        return {
          ...cls,
          subjects: [],
        };
      }

      // ✅ merge all subjects
      const allSubjects = matched.flatMap((m) => m.subjects);

      return {
        ...cls,
       docId: matched[0]?._id,
        classId:
          typeof matched[0]?.classId === "object"
            ? matched[0]?.classId?._id
            : matched[0]?.classId,
        subjects: allSubjects,
      };
    })
    .filter((cls) => cls.subjects.length > 0);

  if (!classes.length || !subjects.length) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Class Wise Subject Management</h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8 space-y-4"
      >
        <h2 className="text-lg font-semibold">
          {form.subjectName ? "Update Subject" : "Add Subject"}
        </h2>

        {/* ✅ CHECKBOX UI */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <label
              key={cls._id}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 
        ${
          form.classIds.includes(String(cls._id))
            ? "bg-blue-50 border-blue-500 shadow-md"
            : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm"
        }`}
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.classIds.includes(String(cls._id))}
                  onChange={(e) => handleCheckbox(cls._id, e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />

                <span className="font-medium text-gray-700">
                  {cls.className}
                </span>
              </div>

              {/* RIGHT SIDE ICON */}
              {form.classIds.includes(String(cls._id)) && (
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

        {/* ✅ ADD HERE */}
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="subjectType"
              value="regular"
              checked={form.subjectType === "regular"}
              onChange={handleChange}
            />
            Regular
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="subjectType"
              value="optional"
              checked={form.subjectType === "optional"}
              onChange={handleChange}
            />
            Optional
          </label>
        </div>

        <div className="flex items-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {form.subjectName ? "Update Subject" : "Add Subject"}
          </button>

          {/* ✅ ADD HERE */}
          {form.subjectName && (
            <button
              type="button"
              onClick={() =>
                setForm({
                  classIds: [],
                  subjectName: "",
                  subjectType: "regular",
                })
              }
              className="ml-3 bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
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
                <span>
                  {typeof sub === "string" ? sub : sub?.name}
                  {typeof sub !== "string" && sub.type === "optional" && (
                    <span className="text-blue-600 text-xs ml-1">
                      (Optional)
                    </span>
                  )}
                </span>

                <div className="space-x-3">
                  <button
                    onClick={() => editSubject(cls.classId, sub)}
                    className="text-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteSubject(
                        cls.classId,
                        typeof sub === "string" ? sub : sub.name,
                      )
                    }
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
