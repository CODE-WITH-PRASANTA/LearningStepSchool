import React from "react";
import "./Noticeboard.css";

const events = [
  {
    id: 1,
    image: "https://www.zoutula.com/themes/enfant-school/wp-content/uploads/2017/03/Depositphotos_11633182_original-min-600x300.jpg",
    day: "23",
    month: "September",
    time: "4 Hours",
    location: "Kings, Liverpool UK",
    title: "Grand Opening of the Summers Walk",
    description:
      "Alterum accommodare duo cu. Ius labore efficiendi ex, ne vim enim rebum honestatis, ad his consulatu pertinacia deterruisset. Te bonorum ancillae nec.",
  },
  {
    id: 2,
    image: "https://www.zoutula.com/themes/enfant-school/wp-content/uploads/2017/03/Depositphotos_130582076_original-min-600x300.jpg",
    day: "5",
    month: "November",
    time: "3 Hours",
    location: "Ovington, London UK",
    title: "World Drawing Day",
    description:
      "Alterum accommodare duo cu. Ius labore luptatum, ne vim enim rebum honestatis, ad his consulatu pertinacia deterruisset. Te bonorum ancillae nec.",
  },
];

const Events = () => {
  return (
    <div className="events-wrapper">
      {events.map((event) => (
        <div className="event-card" key={event.id}>
          <img src={event.image} alt={event.title} className="event-image" />

          <div className="event-content">
            <div className="event-meta">
              <span className="event-date">
                <strong>{event.day}</strong> / {event.month}
              </span>
              <span>⏰ {event.time}</span>
              <span>📍 {event.location}</span>
            </div>

            <h2 className="event-title">{event.title}</h2>
            <p className="event-description">{event.description}</p>
          </div>

          <div className="event-action">
            <button className="register-btn">Register</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;
