import React, { useState, useEffect, useCallback } from "react";
import API from "../../api/axios";
import "./NotificationPublish.css";

const NotificationPublish = () => {
  const [notifications, setNotifications] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    session: "",
  });

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({ title: "", session: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.session.trim()) return;

    try {
      setSubmitting(true);

      if (editId) {
        await API.put(`/notifications/${editId}`, formData);
      } else {
        await API.post("/notifications", formData);
      }

      resetForm();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    await API.patch(`/notifications/toggle/${id}`);
    fetchNotifications();
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      session: item.session || "",
    });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    await API.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  return (
    <div className="notif">
      <div className="notif__container">

        <h2 className="notif__title">
          {editId ? "Update Notification" : "Publish Notification"}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="notif__form">

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Notification Title"
            className="notif__input"
          />

          <input
            name="session"
            value={formData.session}
            onChange={handleChange}
            placeholder="Session (2026-27)"
            className="notif__input"
          />

          <button
            type="submit"
            disabled={submitting}
            className="notif__submitBtn"
          >
            {submitting ? "Saving..." : editId ? "Update" : "Publish"}
          </button>

        </form>

        {/* TABLE */}
        <h3 className="notif__subTitle">All Notifications</h3>

        <div className="notif__tableWrap">
          <table className="notif__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Session</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="notif__center">
                    Loading...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="notif__center">
                    No Records Found
                  </td>
                </tr>
              ) : (
                notifications.map((item, i) => (
                  <tr key={item._id} className="notif__row">
                    <td>{i + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.session}</td>

                    <td>
                      <span
                        className={`notif__status ${
                          item.isPublished
                            ? "notif__status--active"
                            : "notif__status--inactive"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>

                    <td className="notif__actions">
                      <button
                        className="notif__edit"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className={`notif__toggle ${
                          item.isPublished
                            ? "notif__toggle--unpublish"
                            : "notif__toggle--publish"
                        }`}
                        onClick={() => handleToggle(item._id)}
                      >
                        {item.isPublished ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        className="notif__delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
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

export default NotificationPublish;