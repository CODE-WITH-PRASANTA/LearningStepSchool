import React, { useState, useEffect, useCallback } from "react";
import API from "../../api/axios";

export const LatestNewsAdmin = () => {
  const [newsList, setNewsList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    icon: "🔔",
  });

  /* ================= FETCH ALL ================= */
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/latest-news");

      if (res.data?.success) {
        setNewsList(res.data.data || []);
      } else {
        setNewsList([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setFormData({ title: "", icon: "🔔" });
    setEditId(null);
  };

  /* ================= CREATE / UPDATE ================= */
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
      await fetchNews();
    } catch (error) {
      console.error("Save Error:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      icon: item.icon || "🔔",
    });
    setEditId(item._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await API.delete(`/latest-news/${id}`);
      await fetchNews();
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
    }
  };

  /* ================= TOGGLE ================= */
  const handleToggle = async (id) => {
    try {
      await API.patch(`/latest-news/toggle/${id}`);
      await fetchNews();
    } catch (error) {
      console.error("Toggle Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">

        {/* ================= FORM ================= */}
        <h2 className="text-xl font-bold mb-6">
          {editId ? "Update Latest News" : "Add Latest News"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            name="title"
            placeholder="Enter News Title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <input
            type="text"
            name="icon"
            placeholder="Icon (🔔 📢 🎓)"
            value={formData.icon}
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
              : "Add"}
          </button>
        </form>

        {/* ================= LIVE PREVIEW ================= */}
        <h3 className="font-semibold mb-3">Live Preview</h3>

        <div className="flex bg-orange-500 text-white items-center mb-6 rounded-lg overflow-hidden">
          <div className="px-4 py-2 font-semibold bg-orange-600">
            🔔 Latest News
          </div>

          <div className="flex gap-8 px-6 py-2 overflow-x-auto whitespace-nowrap">
            {newsList
              .filter((n) => n.isActive)
              .map((item) => (
                <span key={item._id}>
                  {item.icon} {item.title}
                </span>
              ))}
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <h3 className="font-semibold mb-3">All News Records</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No Records Found
                  </td>
                </tr>
              ) : (
                newsList.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">
                      {item.icon} {item.title}
                    </td>
                    <td className="p-3 border">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 border text-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggle(item._id)}
                        className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600"
                      >
                        Toggle
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

export default LatestNewsAdmin
