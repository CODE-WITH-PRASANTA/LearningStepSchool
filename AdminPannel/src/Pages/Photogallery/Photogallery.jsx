import React, { useState, useEffect } from "react";
import API from "../../api/axios"; // adjust path if needed

const IMAGE_BASE = "http://localhost:5000/";

const Photogallery = () => {
  const [form, setForm] = useState({
    image: null,
    category: "",
    title: "",
    link: "",
  });

  const [galleryData, setGalleryData] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH PHOTOS ================= */
  const fetchPhotos = async () => {
    try {
      const res = await API.get("/photo-gallery");
      setGalleryData(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category || !form.title) {
      alert("Please fill required fields");
      return;
    }

    try {
      const formData = new FormData();

      if (form.image) formData.append("image", form.image);
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("link", form.link);

      if (editId) {
        await API.put(`/photo-gallery/${editId}`, formData);
        setEditId(null);
      } else {
        await API.post("/photo-gallery", formData);
      }

      setForm({
        image: null,
        category: "",
        title: "",
        link: "",
      });

      fetchPhotos();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setForm({
      image: null,
      category: item.category,
      title: item.title,
      link: item.link || "",
    });
    setEditId(item._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;

    try {
      await API.delete(`/photo-gallery/${id}`);
      fetchPhotos();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ================= LEFT SIDE (FORM) ================= */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Update Photo" : "Upload Photo"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              onChange={handleImage}
              className="w-full border p-2 rounded"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Category</option>
              <option value="Event">Event</option>
              <option value="Sports">Sports</option>
              <option value="News">News</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="Optional link"
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {editId ? "Update Photo" : "Submit"}
            </button>
          </form>
        </div>

        {/* ================= RIGHT SIDE (HISTORY) ================= */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md overflow-auto">
          <h2 className="text-xl font-semibold mb-4">History</h2>

          {galleryData.length === 0 ? (
            <p>No photos uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Image</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Link</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {galleryData.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="p-2">
                        <img
                          src={`${IMAGE_BASE}${item.image}`}
                          alt="gallery"
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.category}</td>
                      <td className="p-2 break-all">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            View
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Photogallery;