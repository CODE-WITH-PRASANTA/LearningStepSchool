import React, { useState, useEffect } from "react";
// import API, { IMAGE_URL } from "../api/axios";
import "./EventManagement.css";

const EventManagement = () => {
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

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data.data);
    } catch {
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.location || !form.date) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      if (editId) {
        await API.put(`/events/${editId}`, formData);
        setEditId(null);
      } else {
        await API.post("/events", formData);
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
      console.log(err);
    }
  };

  const handleEdit = (ev) => {
    setForm({
      title: ev.title,
      location: ev.location,
      date: ev.date?.split("T")[0],
      review: ev.review || "",
      rating: ev.rating || 0,
      image: null,
      preview: ev.image ? `${IMAGE_URL}${ev.image}` : "",
    });

    setEditId(ev._id);
  };

  const removeEvent = async (id) => {
    await API.delete(`/events/${id}`);
    fetchEvents();
  };

  return (
    <div className="eventMgmt">
      <h1 className="eventMgmt__title">Event Management</h1>

      <div className="eventMgmt__grid">

        {/* FORM */}
        <form className="eventMgmt__form" onSubmit={handleSubmit}>
          <h2 className="eventMgmt__formTitle">
            {editId ? "Edit Event" : "Add Event"}
          </h2>

          <input
            className="eventMgmt__input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event Title"
          />

          <input
            className="eventMgmt__input"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />

          <input
            className="eventMgmt__input"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <input
            className="eventMgmt__file"
            type="file"
            onChange={handleImage}
          />

          {form.preview && (
            <img
              src={form.preview}
              alt=""
              className="eventMgmt__preview"
            />
          )}

          {/* Rating */}
          <div className="eventMgmt__rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setForm({ ...form, rating: star })}
                className={`eventMgmt__star ${
                  star <= form.rating ? "eventMgmt__star--active" : ""
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className="eventMgmt__textarea"
            name="review"
            value={form.review}
            onChange={handleChange}
            placeholder="Event Review"
          />

          <button className="eventMgmt__submitBtn">
            {editId ? "Update Event" : "Submit Event"}
          </button>
        </form>

        {/* TABLE */}
        <div className="eventMgmt__tableWrap">
          <h2 className="eventMgmt__tableTitle">Manage Events</h2>

          <div className="eventMgmt__tableContainer">
            <table className="eventMgmt__table">
              <thead className="eventMgmt__thead">
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {events.map((ev) => (
                  <tr key={ev._id} className="eventMgmt__row">
                    <td>
                      {ev.image && (
                        <img
                          src={`${IMAGE_URL}${ev.image}`}
                          className="eventMgmt__tableImg"
                          alt=""
                        />
                      )}
                    </td>
                    <td>{ev.title}</td>
                    <td>{ev.location}</td>
                    <td>{new Date(ev.date).toLocaleDateString()}</td>
                    <td className="eventMgmt__ratingText">
                      {"★".repeat(ev.rating)}
                    </td>
                    <td className="eventMgmt__actions">
                      <button
                        className="eventMgmt__editBtn"
                        onClick={() => handleEdit(ev)}
                      >
                        Edit
                      </button>
                      <button
                        className="eventMgmt__deleteBtn"
                        onClick={() => removeEvent(ev._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {events.length === 0 && (
                  <tr>
                    <td colSpan="6" className="eventMgmt__empty">
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
};

export default EventManagement;