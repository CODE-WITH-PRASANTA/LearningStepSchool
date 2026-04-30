import React, { useState, useEffect, useCallback } from "react";
import API from "../../api/axios";
import "./LatestNewsAdmin.css";

const LatestNewsAdmin = () => {
  const [newsList, setNewsList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    icon: "🔔",
  });

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/latest-news");
      setNewsList(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({ title: "", icon: "🔔" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setSubmitting(true);

      if (editId) {
        await API.put(`/latest-news/${editId}`, formData);
      } else {
        await API.post("/latest-news", formData);
      }

      resetForm();
      fetchNews();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      icon: item.icon || "🔔",
    });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await API.delete(`/latest-news/${id}`);
    fetchNews();
  };

  const handleToggle = async (id) => {
    await API.patch(`/latest-news/toggle/${id}`);
    fetchNews();
  };

  return (
    <div className="latestNewsAdmin">
      <div className="latestNewsAdmin__container">

        {/* FORM */}
        <h2 className="latestNewsAdmin__title">
          {editId ? "Update Latest News" : "Add Latest News"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="latestNewsAdmin__form"
        >
          <input
            type="text"
            name="title"
            placeholder="Enter News Title"
            value={formData.title}
            onChange={handleChange}
            className="latestNewsAdmin__input"
          />

          <input
            type="text"
            name="icon"
            placeholder="Icon"
            value={formData.icon}
            onChange={handleChange}
            className="latestNewsAdmin__input"
          />

          <button
            type="submit"
            disabled={submitting}
            className="latestNewsAdmin__submitBtn"
          >
            {submitting ? "Saving..." : editId ? "Update" : "Add"}
          </button>
        </form>

        {/* PREVIEW */}
        <h3 className="latestNewsAdmin__subTitle">Live Preview</h3>

        <div className="latestNewsAdmin__previewBar">
          <div className="latestNewsAdmin__previewLabel">
            🔔 Latest News
          </div>

          <div className="latestNewsAdmin__previewContent">
            {newsList
              .filter((n) => n.isActive)
              .map((item) => (
                <span key={item._id}>
                  {item.icon} {item.title}
                </span>
              ))}
          </div>
        </div>

        {/* TABLE */}
        <h3 className="latestNewsAdmin__subTitle">
          All News Records
        </h3>

        <div className="latestNewsAdmin__tableWrap">
          <table className="latestNewsAdmin__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="latestNewsAdmin__center">
                    Loading...
                  </td>
                </tr>
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="latestNewsAdmin__center">
                    No Records
                  </td>
                </tr>
              ) : (
                newsList.map((item, i) => (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>{item.icon} {item.title}</td>
                    <td>
                      <span
                        className={`latestNewsAdmin__status ${
                          item.isActive
                            ? "latestNewsAdmin__status--active"
                            : "latestNewsAdmin__status--inactive"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="latestNewsAdmin__actions">
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => handleToggle(item._id)}>Toggle</button>
                      <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default LatestNewsAdmin;