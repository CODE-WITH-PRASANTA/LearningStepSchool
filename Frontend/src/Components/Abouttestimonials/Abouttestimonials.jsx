import React, { useState, useEffect } from "react";
import "./Abouttestimonials.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import API, { IMAGE_URL } from "../../Api/Api";

import shape1 from "../../assets/shape-1.png";
import shape2 from "../../assets/shape-2.png";

const Abouttestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);

  /* ================= FETCH FROM BACKEND ================= */
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await API.get("/testimonials");
        setTestimonials(res.data.data || []);
      } catch (err) {
        console.error("FETCH TESTIMONIAL ERROR:", err);
      }
    };

    fetchTestimonials();
  }, []);

  const prev = () => {
    if (!testimonials.length) return;
    setIndex(index === 0 ? testimonials.length - 1 : index - 1);
  };

  const next = () => {
    if (!testimonials.length) return;
    setIndex(index === testimonials.length - 1 ? 0 : index + 1);
  };

  if (!testimonials.length) return null;

  const item = testimonials[index];

  return (
    <section className="Abouttestimonials-section">
      <div className="Abouttestimonials-wrapper">

        {/* DECORATION */}
        <div className="Abouttestimonials-scribble-left">
          <img src={shape1} alt="" />
        </div>
        <div className="Abouttestimonials-scribble-right">
          <img src={shape2} alt="" />
        </div>

        {/* HEADER */}
        <span className="Abouttestimonials-subtitle">Testimonials</span>
        <h2 className="Abouttestimonials-title">What Clients Say</h2>

        {/* MOBILE NAV (TOP) */}
        <div className="Abouttestimonials-nav-mobile">
          <button onClick={prev}><FaArrowLeft /></button>
          <button onClick={next}><FaArrowRight /></button>
        </div>

        {/* CONTENT */}
        <p className="Abouttestimonials-text">
          {item.feedback}
        </p>

        {/* AUTHOR */}
        <div className="Abouttestimonials-author">
          <img
            src={`${IMAGE_URL}${item.photo}`}
            alt={item.clientName}
          />
          <div>
            <h4>{item.clientName}</h4>
            <span>{item.designation}</span>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <button className="Abouttestimonials-nav left" onClick={prev}>
          <FaArrowLeft />
        </button>
        <button className="Abouttestimonials-nav right" onClick={next}>
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default Abouttestimonials;