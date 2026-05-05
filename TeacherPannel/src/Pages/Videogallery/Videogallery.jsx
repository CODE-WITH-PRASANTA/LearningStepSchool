import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const Videogallery = () => {
  const [form, setForm] = useState({
    videoUrl: "",
    title: "",
    category: "",
  });

  const [videoData, setVideoData] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH VIDEOS ================= */
  const fetchVideos = async () => {
    try {
      const res = await API.get("/video-gallery");
      setVideoData(res.data);
    } catch (err) {
      console.error("FETCH VIDEO ERROR:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  /* ================= YOUTUBE CONVERTER ================= */
  const convertToEmbedUrl = (url) => {
    try {
      // Convert normal YouTube watch URL
      const watchMatch = url.match(
        /youtube\.com\/watch\?v=([^&]+)/i
      );

      if (watchMatch) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
      }

      // Convert short youtu.be URL
      const shortMatch = url.match(
        /youtu\.be\/([^?]+)/i
      );

      if (shortMatch) {
        return `https://www.youtube.com/embed/${shortMatch[1]}`;
      }

      // If already embed link
      if (url.includes("youtube.com/embed/")) {
        return url;
      }

      return "";
    } catch {
      return "";
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.videoUrl || !form.title || !form.category) {
      alert("Please fill all fields");
      return;
    }

    const embedUrl = convertToEmbedUrl(form.videoUrl);

    if (!embedUrl) {
      alert("Please enter a valid YouTube link");
      return;
    }

    try {
      const payload = {
        videoUrl: embedUrl,
        title: form.title,
        category: form.category,
      };

      if (editId) {
        await API.put(`/video-gallery/${editId}`, payload);
        setEditId(null);
      } else {
        await API.post("/video-gallery", payload);
      }

      setForm({
        videoUrl: "",
        title: "",
        category: "",
      });

      fetchVideos();
    } catch (err) {
      console.error("SUBMIT VIDEO ERROR:", err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setForm({
      videoUrl: item.videoUrl,
      title: item.title,
      category: item.category,
    });
    setEditId(item._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await API.delete(`/video-gallery/${id}`);
      fetchVideos();
    } catch (err) {
      console.error("DELETE VIDEO ERROR:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT FORM */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Update Video" : "Upload Video"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="Paste YouTube link (watch or share link)"
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter video title"
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

            <button className="w-full bg-indigo-600 text-white py-2 rounded">
              {editId ? "Update Video" : "Submit"}
            </button>
          </form>
        </div>

        {/* RIGHT TABLE */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md overflow-auto">
          <h2 className="text-xl font-semibold mb-4">History</h2>

          {videoData.length === 0 ? (
            <p className="text-gray-500">No videos added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Preview</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videoData.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="p-2">
                        <iframe
                          src={item.videoUrl}
                          title="video"
                          className="w-28 h-20 rounded"
                          allowFullScreen
                        ></iframe>
                      </td>
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.category}</td>
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

export default Videogallery;