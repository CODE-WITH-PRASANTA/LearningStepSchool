import React, { useEffect, useState } from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Jenny Wilson",
      text: "Corquent per conubia nostra, per inceptos himenaeos. Suspendisse gravida vitae nisi. Class aptent taciti sociosqu ad litora.",
      color: "dark",
    },
    {
      id: 2,
      name: "Esther Howard",
      text: "Corquent per conubia nostra, per inceptos himenaeos. Suspendisse gravida vitae nisi. Class aptent taciti sociosqu ad litora.",
      color: "teal",
    },
    {
      id: 3,
      name: "Wade Warren",
      text: "Corquent per conubia nostra, per inceptos himenaeos. Suspendisse gravida vitae nisi. Class aptent taciti sociosqu ad litora.",
      color: "orange",
    },
  ];

  const [active, setActive] = useState(1);

  // 🔁 AUTO SLIDE EVERY 3 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="Testimonials-section">
      <div className="Testimonials-container">

        {/* Header */}
        <div className="Testimonials-header">
          <div className="Testimonials-label-wrapper">
            <span className="Testimonials-label-line"></span>
            <span className="Testimonials-label">Testimonials</span>
            <span className="Testimonials-label-line"></span>
          </div>
          <h2 className="Testimonials-title">
            Parent's Words Are The Key <br />{" "}
            <span className="Testimonials-title-highlight">
              To Happy Kids
            </span>
          </h2>
          <p className="Testimonials-subtitle">
            Hear from parents who have witnessed the transformative impact of our programs
          </p>
        </div>

        {/* Cards */}
        <div className="Testimonials-cards">
          {testimonials.map((item, index) => (
            <div
              key={item.id}
              className={`Testimonials-card Testimonials-${item.color} ${
                active === index ? "Testimonials-card-active" : ""
              }`}
              onClick={() => setActive(index)}
            >
              <div className="Testimonials-card-inner">
                <div className="Testimonials-card-header">
                  <span className="Testimonials-quote">"</span>
                  <div className="Testimonials-rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="Testimonials-text">{item.text}</p>

                <div className="Testimonials-author-container">
                  <div className="Testimonials-author-avatar">
                    {item.name.charAt(0)}
                  </div>
                  <div className="Testimonials-author-info">
                    <span className="Testimonials-author-name">
                      {item.name}
                    </span>
                    <span className="Testimonials-author-role">
                      Satisfied Parent
                    </span>
                  </div>
                </div>
              </div>

              <div className="Testimonials-card-decoration">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M20 20C22.2091 20 24 18.2091 24 16C24 13.7909 22.2091 12 20 12C17.7909 12 16 13.7909 16 16C16 18.2091 17.7909 20 20 20Z"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="Testimonials-pagination">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`Testimonials-dot ${
                active === index ? "Testimonials-dot-active" : ""
              }`}
              onClick={() => setActive(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

      </div>
      <div className="Testimonials-background-decoration"></div>
    </section>
  );
};

export default Testimonials;
