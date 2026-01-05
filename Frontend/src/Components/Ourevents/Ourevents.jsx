import React from "react";
import "./Ourevents.css";

const Ourevents = () => {
  const events = [
    {
      id: 1,
      date: "Jan 16, 2024",
      title: "Last Day Of School End Of Year Picnic",
      location: "6391 Elgin St. Celina, USA",
      image:
        "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900",
    },
    {
      id: 2,
      date: "Feb 20, 2024",
      title: "The Complete Web Developer Guideline 2024",
      location: "6391 Elgin St. Celina, USA",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=900",
    },
    {
      id: 3,
      date: "Mar 26, 2024",
      title: "Gathering & Welcome Speech Marketing Strategy",
      location: "6391 Elgin St. Celina, USA",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900",
    },
  ];

  return (
    <section className="Ourevents-section">
      <div className="Ourevents-container">

        {/* Header */}
        <div className="Ourevents-header">
          <div className="Ourevents-label-wrapper">
            <span className="Ourevents-label-line"></span>
            <span className="Ourevents-label">Our Events</span>
            <span className="Ourevents-label-line"></span>
          </div>
          <h2 className="Ourevents-title">
            Upcoming School Activities & <br /> <span className="Ourevents-title-highlight">Events Schedule</span>
          </h2>
          <p className="Ourevents-subtitle">
            Join our exciting school events designed for learning, fun, and community building
          </p>
        </div>

        {/* Cards */}
        <div className="Ourevents-cards">
          {events.map((event) => (
            <div className="Ourevents-card" key={event.id}>
              <div className="Ourevents-image-wrapper">
                <img src={event.image} alt={event.title} />
                <div className="Ourevents-image-overlay"></div>
                <span className="Ourevents-date">
                  <span className="Ourevents-date-day">16</span>
                  <span className="Ourevents-date-month">JAN</span>
                </span>
                <div className="Ourevents-cloud">
                  <div className="Ourevents-cloud-inner"></div>
                </div>
              </div>

              <div className="Ourevents-content">
                <div className="Ourevents-location-wrapper">
                  <svg className="Ourevents-location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="Ourevents-location">{event.location}</span>
                </div>
                <h3 className="Ourevents-card-title">{event.title}</h3>

                <div className="Ourevents-footer">
                  <button className="Ourevents-btn">
                    <span className="Ourevents-btn-text">Get Ticket</span>
                    <svg className="Ourevents-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="Ourevents-rating">
                    <div className="Ourevents-stars">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F4A261" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                      ))}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#E0E0E0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <span className="Ourevents-review-count">(10 Reviews)</span>
                  </div>
                </div>
              </div>

              <div className="Ourevents-card-decoration">
                <div className="Ourevents-card-corner"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <div className="Ourevents-background-decoration"></div>
      <div className="Ourevents-floating-shapes">
        <div className="Ourevents-shape Ourevents-shape-1"></div>
        <div className="Ourevents-shape Ourevents-shape-2"></div>
        <div className="Ourevents-shape Ourevents-shape-3"></div>
      </div>
    </section>
  );
};

export default Ourevents;