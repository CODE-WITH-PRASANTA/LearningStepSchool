import React, { useEffect, useRef, useState } from "react";
import "./Testimonials.css";
import API from "../../Api/Api";
import { IMAGE_URL } from "../../Api/Api";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [active, setActive] = useState(0);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await API.get("/testimonials");
        const colors = ["dark", "teal", "orange"];

        const formatted = (res.data.data || []).map((item, index) => ({
          id: item._id,
          name: item.clientName,
          text: item.feedback,
          rating: item.rating || 5,
          photo: item.photo,
          color: colors[index % colors.length],
        }));

        setTestimonials(formatted);
      } catch (error) {
        console.error("FETCH TESTIMONIAL ERROR:", error);
      }
    };

    fetchTestimonials();
  }, []);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(window.innerWidth <= 768 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCards = 1;
  const total = testimonials.length;

  /* ================= MOBILE INFINITE ================= */

  const slides =
    cardsToShow === 1 && total > 0
      ? [
          ...testimonials.slice(-visibleCards),
          ...testimonials,
          ...testimonials.slice(0, visibleCards),
        ]
      : testimonials;

  const [index, setIndex] = useState(visibleCards);
  const trackRef = useRef(null);
  const isAnimating = useRef(false);

  const enableTransition = () => {
    if (trackRef.current) {
      trackRef.current.style.transition =
        "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    }
  };

  const disableTransition = () => {
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
  };

  const nextSlide = () => {
    if (isAnimating.current || cardsToShow !== 1) return;
    isAnimating.current = true;
    enableTransition();
    setIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    if (cardsToShow !== 1) return;

    isAnimating.current = false;

    if (index === total + visibleCards) {
      disableTransition();
      setIndex(visibleCards);
    }

    if (index === 0) {
      disableTransition();
      setIndex(total);
    }
  };

  useEffect(() => {
    if (cardsToShow !== 1 || total === 0) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [cardsToShow, total]);

  /* ================= DESKTOP AUTO SLIDE ================= */
  useEffect(() => {
    if (cardsToShow !== 3 || testimonials.length <= 3) return;

    const interval = setInterval(() => {
      setActive((prev) =>
        prev + 1 >= testimonials.length - 2 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [testimonials, cardsToShow]);

  /* ================= PAGINATION ================= */

  const currentPage =
    cardsToShow === 1
      ? (index - 1 + total) % total
      : active;

  const totalPages =
    cardsToShow === 1
      ? total
      : testimonials.length - 2;

  const handleDotClick = (i) => {
    if (cardsToShow === 1) {
      enableTransition();
      setIndex(i + 1);
    } else {
      setActive(i);
    }
  };

  return (
    <section className="Testimonials-section">
      <div className="Testimonials-container">

        {/* ================= HEADER ================= */}
        <div className="Testimonials-header">
          <div className="Testimonials-label-wrapper">
            <span className="Testimonials-label-line"></span>
            <span className="Testimonials-label">Testimonials</span>
            <span className="Testimonials-label-line"></span>
          </div>

          <h2 className="Testimonials-title">
            Parent's Words Are The Key <br />
            <span className="Testimonials-title-highlight">
              To Happy Kids
            </span>
          </h2>

          <p className="Testimonials-subtitle">
            Hear from parents who have witnessed the transformative impact
            of our programs
          </p>
        </div>

        {/* ================= CARDS ================= */}
        <div className="Testimonials-cards">

          {cardsToShow === 1 ? (
            <div
              className="Testimonials-slider"
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
              style={{
                display: "flex",
                transform: `translateX(-${index * 100}%)`,
              }}
            >
              {slides.map((item, i) => (
                <div
                  key={i}
                  className={`Testimonials-card Testimonials-${item.color}`}
                  style={{ flex: "0 0 100%" }}
                >
                  <CardContent item={item} />
                </div>
              ))}
            </div>
          ) : (
            testimonials
              .slice(active, active + 3)
              .map((item, i) => (
                <div
                  key={item.id}
                  className={`Testimonials-card Testimonials-${item.color} ${
                    i === 1 ? "Testimonials-card-active" : ""
                  }`}
                >
                  <CardContent item={item} />
                </div>
              ))
          )}
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="Testimonials-pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`Testimonials-dot ${
                currentPage === i
                  ? "Testimonials-dot-active"
                  : ""
              }`}
              onClick={() => handleDotClick(i)}
            />
          ))}
        </div>

      </div>

      <div className="Testimonials-background-decoration"></div>
    </section>
  );
};

const CardContent = ({ item }) => (
  <div className="Testimonials-card-inner">
    <div className="Testimonials-card-header">
      <span className="Testimonials-quote">"</span>
      <div className="Testimonials-rating">
        {[...Array(item.rating)].map((_, i) => (
          <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        ))}
      </div>
    </div>

    <p className="Testimonials-text">{item.text}</p>

    <div className="Testimonials-author-container">
      <div className="Testimonials-author-avatar">
        {item.photo ? (
          <img
            src={`${IMAGE_URL}${item.photo}`}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        ) : (
          item.name?.charAt(0)
        )}
      </div>

      <div className="Testimonials-author-info">
        <span className="Testimonials-author-name">{item.name}</span>
        <span className="Testimonials-author-role">Satisfied Parent</span>
      </div>
    </div>
  </div>
);

export default Testimonials;