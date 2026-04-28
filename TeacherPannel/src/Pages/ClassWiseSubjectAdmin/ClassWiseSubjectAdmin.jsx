import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "./ClassWiseSubjectAdmin.css";

export default function ClassWiseSubjectAdmin() {
  const emptyForm = {
    classIds: [],
    subjectName: "",
    subjectType: "regular",
  };

  const [form, setForm] = useState(emptyForm);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= CHECKBOX ================= */

  const handleCheckbox = (classId, checked) => {
    const id = String(classId);

    if (checked) {
      setForm({ ...form, classIds: [...form.classIds, id] });
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

    const subjectName = form.subjectName.trim();

    if (!form.classIds.length || !subjectName) {
      alert("Select class & enter subject");
      return;
    }

    const alreadyExists = form.classIds.some((classId) => {
      const cls = subjects.find(
        (c) => String(c.classId?._id || c.classId) === String(classId)
      );

      return cls?.subjects?.some(
        (s) =>
          (typeof s === "string" ? s : s.name).toLowerCase() ===
          subjectName.toLowerCase()
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
                name: subjectName,
                type: form.subjectType,
              },
            ],
          })
        )
      );

      fetchSubjects();
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

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
      classIds: [String(clsId)],
      subjectName: isString ? subject : subject.name,
      subjectType: isString ? "regular" : subject.type || "regular",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= GROUP ================= */

  const groupedSubjects = classes
    .map((cls) => {
      const matched = subjects.filter((s) => {
        const subjectClassId =
          typeof s.classId === "object" ? s.classId._id : s.classId;

        return String(subjectClassId) === String(cls._id);
      });

      if (!matched.length) {
        return { ...cls, subjects: [] };
      }

      return {
        ...cls,
        docId: matched[0]._id,
        classId:
          typeof matched[0].classId === "object"
            ? matched[0].classId._id
            : matched[0].classId,
        subjects: matched.flatMap((m) => m.subjects),
      };
    })
    .filter((cls) => cls.subjects.length > 0);

  if (!classes.length || !subjects.length) {
    return <div className="cw-loading">Loading...</div>;
  }

  return (
    <div className="cw">
      <h1 className="cw-title">Class Wise Subject Management</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="cw-form">

        <h2>{form.subjectName ? "Update Subject" : "Add Subject"}</h2>

        {/* CHECKBOX */}
        <div className="cw-grid">
          {classes.map((cls) => (
            <label
              key={cls._id}
              className={`cw-checkbox ${
                form.classIds.includes(String(cls._id)) ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={form.classIds.includes(String(cls._id))}
                onChange={(e) =>
                  handleCheckbox(cls._id, e.target.checked)
                }
              />
              <span>{cls.className}</span>
            </label>
          ))}
        </div>

        <p className="cw-selected">
          Selected: {form.classIds.length} classes
        </p>

        {/* INPUT */}
        <input
          name="subjectName"
          value={form.subjectName}
          onChange={handleChange}
          placeholder="Subject Name"
        />

        {/* RADIO */}
        <div className="cw-radio">
          <label>
            <input
              type="radio"
              name="subjectType"
              value="regular"
              checked={form.subjectType === "regular"}
              onChange={handleChange}
            />
            Regular
          </label>

          <label>
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

        <div className="cw-actions">
          <button>Add Subject</button>

          {form.subjectName && (
            <button
              type="button"
              className="secondary"
              onClick={() => setForm(emptyForm)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      {groupedSubjects.map((cls) => (
        <div key={cls._id} className="cw-card">
          <div className="cw-card-header">
            <h2>{cls.className}</h2>

            {cls.docId && (
              <button onClick={() => deleteClass(cls.docId)}>
                Delete Class
              </button>
            )}
          </div>

          <ul>
            {cls.subjects.map((sub, i) => (
              <li key={i}>
                <span>
                  {typeof sub === "string" ? sub : sub.name}
                  {sub.type === "optional" && <small>(Optional)</small>}
                </span>

                <div>
                  <button onClick={() => editSubject(cls.classId, sub)}>
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteSubject(
                        cls.classId,
                        typeof sub === "string" ? sub : sub.name
                      )
                    }
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