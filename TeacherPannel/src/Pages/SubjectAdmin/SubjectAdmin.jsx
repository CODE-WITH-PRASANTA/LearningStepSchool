import React, { useState, useEffect } from "react";
import API, { IMAGE_URL } from "../../api/axios";
import "./SubjectAdmin.css";

export default function SubjectAdmin() {
  const emptyForm = {
    subjectName: "",
    className: "",
    teacher: "",
    description: "",
    image: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [subjects, setSubjects] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subjects");
      setSubjects(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setForm({
        ...form,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("subjectName", form.subjectName);
      formData.append("className", form.className);
      formData.append("teacher", form.teacher);
      formData.append("description", form.description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editId) {
        await API.put(`/subjects/${editId}`, formData);
      } else {
        await API.post("/subjects", formData);
      }

      fetchSubjects();

      setForm(emptyForm);
      setImageFile(null);
      setEditIndex(null);
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await API.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const editSubject = (subject, index) => {
    setForm({
      ...subject,
      image: subject.image ? IMAGE_URL + subject.image : "",
    });

    setEditIndex(index);
    setEditId(subject._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredSubjects = subjects.filter((s) =>
    s.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sub">
      <h1 className="sub__title">Subject Admin Panel</h1>

      <div className="sub__grid">

        {/* FORM */}
        <form onSubmit={handleSubmit} className="sub__card">
          <h2 className="sub__subtitle">
            {editIndex !== null ? "Edit Subject" : "Add Subject"}
          </h2>

          <div className="sub__field">
            <label>Subject Name</label>
            <input
              name="subjectName"
              value={form.subjectName}
              onChange={handleChange}
              placeholder="Example: Mathematics"
            />
          </div>

          <div className="sub__field">
            <label>Class</label>
            <select
              name="className"
              value={form.className}
              onChange={handleChange}
            >
              <option value="">Select Class</option>
              <option>Nursery</option>
              <option>LKG</option>
              <option>UKG</option>
              <option>Class 1</option>
              <option>Class 2</option>
            </select>
          </div>

          <div className="sub__field">
            <label>Subject Teacher</label>
            <input
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              placeholder="Teacher Name"
            />
          </div>

          <div className="sub__field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Subject details"
            />
          </div>

          <div className="sub__field">
            <label>Subject Image</label>
            <input type="file" onChange={handleImage} />
          </div>

          <button className="sub__btn">
            {editIndex !== null ? "Update Subject" : "Post Subject"}
          </button>
        </form>

        {/* PREVIEW */}
        <div className="sub__card">
          <h2 className="sub__subtitle">Live Preview</h2>

          <div className="sub__preview">
            {form.image && (
              <img src={form.image} className="sub__preview-img" />
            )}

            <div className="sub__preview-content">
              <h3>{form.subjectName || "Subject Name"}</h3>
              <p>Class: {form.className || "Class"}</p>
              <p>Teacher: {form.teacher || "Teacher Name"}</p>
              <p>{form.description || "Subject description"}</p>
            </div>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="sub__card sub__table-card">

        <div className="sub__table-header">
          <h2 className="sub__subtitle">Subject List</h2>

          <input
            placeholder="Search subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sub__search"
          />
        </div>

        <div className="sub__table-wrapper">
          <table className="sub__table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Teacher</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubjects.map((s, index) => (
                <tr key={s._id}>
                  <td>
                    {s.image && (
                      <img
                        src={IMAGE_URL + s.image}
                        className="sub__table-img"
                      />
                    )}
                  </td>

                  <td>{s.subjectName}</td>
                  <td>{s.className}</td>
                  <td>{s.teacher}</td>

                  <td>
                    <div className="sub__actions">
                      <button
                        onClick={() => editSubject(s, index)}
                        className="btn edit"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteSubject(s._id)}
                        className="btn delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}