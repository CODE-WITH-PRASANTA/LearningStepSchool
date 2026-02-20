import React, { useState } from "react";

export default function EventManagement() {
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    review: "",
    rating: 0,
    image: null,
    preview: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.location || !form.date) return;

    setEvents([...events, form]);

    setForm({
      title: "",
      location: "",
      date: "",
      review: "",
      rating: 0,
      image: null,
      preview: "",
    });
  };

  const removeEvent = (i) => {
    setEvents(events.filter((_, index) => index !== i));
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-8">
    
    {/* Page Title */}
    <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
       Event Management 
    </h1>

    <div className="grid xl:grid-cols-2 gap-8">
      
      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8 space-y-5 hover:shadow-2xl transition duration-500"
      >
        <h2 className="text-xl font-semibold text-gray-700">
          Add New Event
        </h2>

        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event Title"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
        />

        {/* Location */}
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
        />

        {/* Date */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
        />

        {/* Image */}
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
          <p className="text-sm font-medium mb-2 text-gray-600">
            Rating
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setForm({ ...form, rating: star })}
                className={`cursor-pointer text-3xl transition transform hover:scale-110 ${
                  star <= form.rating
                    ? "text-yellow-400 drop-shadow-md"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Review */}
        <textarea
          name="review"
          value={form.review}
          onChange={handleChange}
          placeholder="Event Review"
          rows="3"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none transition resize-none"
        />

        {/* Button */}
        <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
          Submit Event
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-6 hover:shadow-2xl transition duration-500">
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
              {events.map((ev, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-indigo-50/40 transition"
                >
                  <td className="p-3">
                    {ev.preview && (
                      <img
                        src={ev.preview}
                        className="w-14 h-14 rounded-xl object-cover shadow"
                      />
                    )}
                  </td>

                  <td className="p-3 font-medium text-gray-700">
                    {ev.title}
                  </td>

                  <td className="p-3 text-gray-600">
                    {ev.location}
                  </td>

                  <td className="p-3 text-gray-600">
                    {ev.date}
                  </td>

                  <td className="p-3 text-center text-yellow-400 text-lg">
                    {"★".repeat(ev.rating)}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeEvent(i)}
                      className="px-4 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-400"
                  >
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
