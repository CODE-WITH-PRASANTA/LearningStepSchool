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
      setEvents(res.data);
    } catch (err) {
      console.error(err);
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

  /* ================= SUBMIT (CREATE / UPDATE) ================= */
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
    console.error("UPDATE ERROR:", err.response?.data || err.message);
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
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Event Management Panel</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold">
            {editId ? "Edit Event" : "Add New Event"}
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <input type="file" onChange={handleImage} />

          {form.preview && (
            <img
              src={form.preview}
              alt=""
              className="w-full h-40 object-cover rounded"
            />
          )}

          <div>
            <p className="mb-1 text-sm font-medium">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`cursor-pointer text-2xl ${
                    star <= form.rating
                      ? "text-yellow-400"
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
            className="w-full border rounded px-3 py-2"
          />

          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            {editId ? "Update Event" : "Submit Event"}
          </button>
        </form>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-3">Manage Events</h2>

          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {events.map((ev) => (
                <tr key={ev._id} className="border-b">
                  <td className="p-2">
                    {ev.image && (
                      <img
                        src={`${IMAGE_URL}${ev.image}`}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                  </td>
                  <td className="p-2">{ev.title}</td>
                  <td className="p-2">{ev.location}</td>
                  <td className="p-2">
                    {new Date(ev.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-yellow-400">
                    {"★".repeat(ev.rating)}
                  </td>
                  <td className="p-2 flex gap-3">
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
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No events added yet
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