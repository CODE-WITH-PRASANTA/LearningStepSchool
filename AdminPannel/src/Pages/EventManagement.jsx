import React, { useState, useEffect } from "react";
import API, { IMAGE_URL } from "../api/axios";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    review: "",
    rating: 0,
    image: null,
    preview: "",
  });

  /* ================= FETCH ================= */
  const fetchEvents = async () => {
  try {
    const res = await API.get("/events");

    // ✅ correct line
    setEvents(res.data.data);

  } catch (err) {
    console.error(err);
    setEvents([]);
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      image: file,
      preview: URL.createObjectURL(file),
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.location || !form.date) return;

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("location", form.location);
      formData.append("date", form.date);
      formData.append("review", form.review);
      formData.append("rating", form.rating);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editId) {
        await API.put(`/events/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditId(null);
      } else {
        await API.post("/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        title: "",
        location: "",
        date: "",
        review: "",
        rating: 0,
        image: null,
        preview: "",
      });

      fetchEvents();
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (event) => {
    setForm({
      title: event.title,
      location: event.location,
      date: event.date ? event.date.split("T")[0] : "",
      review: event.review || "",
      rating: event.rating || 0,
      image: null,
      preview: event.image ? `${IMAGE_URL}${event.image}` : "",
    });

    setEditId(event._id);
  };

  /* ================= DELETE ================= */
  const removeEvent = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
        Event Management
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 space-y-5"
        >
          <h2 className="text-xl font-semibold text-gray-700">
            {editId ? "Edit Event" : "Add New Event"}
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
          />

          <input
            type="file"
            onChange={handleImage}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-600
            hover:file:bg-indigo-100"
          />

          {form.preview && (
            <img
              src={form.preview}
              alt=""
              className="w-full h-44 object-cover rounded-2xl shadow-lg border"
            />
          )}

          {/* Rating */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`cursor-pointer text-2xl transition ${
                    star <= form.rating
                      ? "text-yellow-400 scale-110"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <textarea
            name="review"
            value={form.review}
            onChange={handleChange}
            placeholder="Event Review"
            rows="3"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none transition resize-none"
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition shadow-md">
            {editId ? "Update Event" : "Submit Event"}
          </button>
        </form>

        {/* ================= TABLE ================= */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-6">
          <h2 className="text-xl font-semibold mb-5 text-gray-700">
            Manage Events
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-pink-50 text-gray-700">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-center">Rating</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {events.map((ev) => (
                  <tr key={ev._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {ev.image && (
                        <img
                          src={`${IMAGE_URL}${ev.image}`}
                          className="w-12 h-12 rounded object-cover"
                          alt=""
                        />
                      )}
                    </td>
                    <td className="p-2">{ev.title}</td>
                    <td className="p-2">{ev.location}</td>
                    <td className="p-2">
                      {new Date(ev.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-yellow-400 text-center">
                      {"★".repeat(ev.rating)}
                    </td>
                    <td className="p-2 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(ev)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeEvent(ev._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {events.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      No events added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}