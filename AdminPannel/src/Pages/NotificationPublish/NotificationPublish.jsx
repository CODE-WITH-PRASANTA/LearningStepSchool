import React, { useState, useEffect, useCallback } from "react";
import API from "../../api/axios";

export const NotificationPublish = () => {
  const [notifications, setNotifications] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    session: "",
  });

  /* ================= FETCH ALL ================= */
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");

      if (res.data?.success) {
        setNotifications(res.data.data || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setFormData({ title: "", session: "" });
    setEditId(null);
  };

  /* ================= CREATE / UPDATE ================= */
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
      await fetchNotifications();
    } catch (error) {
      console.error("Save Error:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= TOGGLE PUBLISH ================= */
  const handleToggle = async (id) => {
    try {
      await API.patch(`/notifications/toggle/${id}`);
      await fetchNotifications();
    } catch (error) {
      console.error("Toggle Error:", error.response?.data || error.message);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    if (!item?._id) return;

    setFormData({
      title: item.title || "",
      session: item.session || "",
    });
    setEditId(item._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/notifications/${id}`);
      await fetchNotifications();
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">

        <h2 className="text-xl font-bold mb-6">
          {editId ? "Update Notification" : "Publish Notification"}
        </h2>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            name="title"
            placeholder="Notification Title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <input
            type="text"
            name="session"
            placeholder="Session (2026-27)"
            value={formData.session}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-orange-500 text-white rounded-lg px-6 py-2 hover:bg-orange-600 transition disabled:opacity-50"
          >
            {submitting
              ? "Please wait..."
              : editId
              ? "Update"
              : "Publish"}
          </button>
        </form>

        {/* ================= TABLE ================= */}
        <h3 className="font-semibold mb-3">All Notifications</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Session</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No Records Found
                  </td>
                </tr>
              ) : (
                notifications.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{item.title}</td>
                    <td className="p-3 border">{item.session}</td>

                    {/* STATUS */}
                    <td className="p-3 border">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggle(item._id)}
                        className={`px-3 py-1 rounded-md text-sm text-white ${
                          item.isPublished
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {item.isPublished ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
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
