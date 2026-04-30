import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "./ClassesAdmin.css";

export default function ClassesAdmin() {
  const emptyForm = {
    className: "",
    sectionName: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      setClasses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/classes/${editId}`, form);
      } else {
        await API.post("/classes", form);
      }

      fetchClasses();
      setForm(emptyForm);
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteClass = async (id) => {
    try {
      await API.delete(`/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const editClass = (c) => {
    setForm({
      className: c.className || "",
      sectionName: c.sectionName || "",
    });

    setEditId(c._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredClasses = classes.filter((c) =>
    (c.className || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cls">
      <h1 className="cls__title">Classes Admin Panel</h1>

      {/* FORM */}
      <div className="cls__card">
        <form onSubmit={handleSubmit} className="cls__form">
          <h2 className="cls__subtitle">
            {editId ? "Edit Class" : "Add Class"}
          </h2>

          <div className="cls__grid">
            <div className="cls__field">
              <label>Class Name</label>
              <input
                name="className"
                value={form.className || ""}
                onChange={handleChange}
                placeholder="Example: Class 1"
              />
            </div>

            <div className="cls__field">
              <label>Section Name</label>
              <input
                name="sectionName"
                value={form.sectionName || ""}
                onChange={handleChange}
                placeholder="Example: A"
              />
            </div>
          </div>

          <button className="cls__btn">
            {editId ? "Update Class" : "Post Class"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="cls__card">
        <div className="cls__table-header">
          <h2 className="cls__subtitle">Class List</h2>

          <input
            placeholder="Search class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cls__search"
          />
        </div>

        <div className="cls__table-wrapper">
          <table className="cls__table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredClasses.map((c) => (
                <tr key={c._id}>
                  <td>{c.className}</td>
                  <td>{c.sectionName}</td>

                  <td>
                    <div className="cls__actions">
                      <button
                        onClick={() => editClass(c)}
                        className="btn edit"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteClass(c._id)}
                        className="btn delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan="3" className="cls__empty">
                    No classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}