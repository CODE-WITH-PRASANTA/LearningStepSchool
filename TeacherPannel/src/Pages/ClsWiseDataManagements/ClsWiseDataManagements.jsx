import React, { useState, useEffect } from "react";
import "./ClsWiseDataManagements.css";
import API, { IMAGE_URL } from "../../api/axios";

const PAGE_SIZE = 6;

const ClsWiseDataManagements = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    age: "",
    weekly: "",
    timeManagement: "",
    image: null,
    preview: null,
  });

  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await API.get("/class-data");
      setData(res.data.data || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file, preview: URL.createObjectURL(file) });
  };

  /* ================= SUBMIT (CREATE / UPDATE) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("age", form.age);
      formData.append("weekly", form.weekly);
      formData.append("timeManagement", form.timeManagement);
      if (form.image) formData.append("image", form.image);

      if (editId) {
        await API.put(`/class-data/${editId}`, formData);
        setEditId(null);
      } else {
        await API.post("/class-data", formData);
      }

      setForm({
        title: "",
        description: "",
        age: "",
        weekly: "",
        timeManagement: "",
        image: null,
        preview: null,
      });

      setVisibleCount(PAGE_SIZE);
      fetchData();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      age: item.age,
      weekly: item.weekly,
      timeManagement: item.timeManagement,
      image: null,
      preview: item.image ? `${IMAGE_URL}${item.image}` : null,
    });

    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await API.delete(`/class-data/${id}`);
      fetchData();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  /* ================= SCROLL ================= */
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, data.length));
    }
  };

  const visibleData = data.slice(0, visibleCount);

  return (
    <div className="clswisedata-wrapper">
      <h1 className="clswisedata-title">Class Wise Data Management</h1>

      <div className="clswisedata-layout">
        {/* LEFT FORM */}
        <form className="clswisedata-form" onSubmit={handleSubmit}>
          <h2 className="clswisedata-section-title">
            {editId ? "Edit Class Data" : "Add Class Data"}
          </h2>

          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <label>Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <label>Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
          />

          <label>Weekly</label>
          <input
            value={form.weekly}
            onChange={(e) => setForm({ ...form, weekly: e.target.value })}
          />

          <label>Time Management</label>
          <input
            value={form.timeManagement}
            onChange={(e) =>
              setForm({ ...form, timeManagement: e.target.value })
            }
          />

          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImage} />

          {form.preview && (
            <img
              src={form.preview}
              alt="Preview"
              className="clswisedata-preview"
            />
          )}

          <button className="clswisedata-btn">
            {editId ? "Update" : "Submit"}
          </button>
        </form>

        {/* RIGHT TABLE */}
        <div className="clswisedata-table-wrapper">
          <h2 className="clswisedata-section-title">Class Records</h2>

          {data.length === 0 ? (
            <p className="clswisedata-empty">No records added</p>
          ) : (
            <div className="clswisedata-table-scroll" onScroll={handleScroll}>
              <table className="clswisedata-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Age</th>
                    <th>Weekly</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleData.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={`${IMAGE_URL}${item.image}`}
                          alt=""
                          className="clswisedata-table-img"
                        />
                      </td>

                      <td>{item.title}</td>

                      <td style={{ maxWidth: "200px" }}>{item.description}</td>

                      <td>{item.age}</td>
                      <td>{item.weekly}</td>
                      <td>{item.timeManagement}</td>

                      <td>
                        <button
                          onClick={() => handleEdit(item)}
                          style={{
                            padding: "6px 10px",
                            marginRight: "6px",
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{
                            padding: "6px 10px",
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleCount < data.length && (
                <p className="clswisedata-loading">Loading more...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClsWiseDataManagements;
