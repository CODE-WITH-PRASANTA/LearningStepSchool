import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { IMAGE_URL } from "../../Api/Api";
import "./Noticeboard.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH NOTICES ================= */
  const fetchEvents = async () => {
    try {
      const res = await API.get("/notices");
      setEvents(res.data.data || res.data);
    } catch (err) {
      console.error("FETCH NOTICE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="events-wrapper">
        <p>Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="events-wrapper">
      {events.length === 0 ? (
        <p>No notices available</p>
      ) : (
        events.map((event) => (
          <div className="event-card" key={event._id}>
            
            {/* IMAGE */}
            {event.image && (
              <img
                src={IMAGE_URL + event.image}
                alt={event.title}
                className="event-image"
              />
            )}

            <div className="event-content">
              <div className="event-meta">
                <span className="event-date">
                  {event.dateTime
                    ? new Date(event.dateTime).toLocaleDateString()
                    : ""}
                </span>

                {event.location && (
                  <span>📍 {event.location}</span>
                )}
              </div>

              <h2 className="event-title">{event.title}</h2>

              <p className="event-description">
                {event.description?.length > 120
                  ? event.description.slice(0, 120) + "..."
                  : event.description}
              </p>
            </div>

            {/* 🔥 FIXED BUTTON */}
            <div className="event-action">
              <button
                onClick={() => navigate(`/notice/${event._id}`)}
                className="register-btn"
              >
                View Notice
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default Events;