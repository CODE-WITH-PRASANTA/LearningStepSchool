import React, { useState, useEffect } from "react";
import "./Aboutteachercard.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaShareAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import API, { IMAGE_URL } from "../../Api/Api";

const Aboutteachercard = () => {
  const [instructors, setInstructors] = useState([]);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  /* ================= FETCH TEACHERS ================= */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await API.get("/teachers");
        setInstructors(res.data.data || []);
      } catch (err) {
        console.error("FETCH TEACHERS ERROR:", err);
      }
    };

    fetchTeachers();
  }, []);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIndex(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCards = isMobile ? 1 : 4;
  const maxIndex = Math.max(instructors.length - visibleCards, 0);

  const nextSlide = () => {
    if (index < maxIndex) setIndex(index + 1);
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!instructors.length) return null;

  return (
    <section className="Aboutteachercard-section">
      {/* HEADER */}
      <div className="Aboutteachercard-header">
        <div className="Aboutteachercard-header-text">
          <span className="Aboutteachercard-subtitle">Our Experts</span>
          <h2 className="Aboutteachercard-title">Our Expert Instructors</h2>
        </div>

        <div className="Aboutteachercard-header-right">
          <button
            className="Aboutteachercard-nav"
            onClick={prevSlide}
            disabled={index === 0}
          >
            <FaArrowLeft />
          </button>
          <button
            className="Aboutteachercard-nav Aboutteachercard-next"
            onClick={nextSlide}
            disabled={index >= maxIndex}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* SLIDER */}
      <div className="Aboutteachercard-slider">
        <div
          className="Aboutteachercard-track"
          style={{
            transform: `translateX(-${index * (isMobile ? 100 : 25)}%)`,
          }}
        >
          {instructors.map((item) => (
            <div className="Aboutteachercard-card" key={item._id}>
              <div className="Aboutteachercard-img-wrap">
                <img
                  src={`${IMAGE_URL}${item.photo}`}
                  alt={item.name}
                />

                <svg
                  className="Aboutteachercard-wave"
                  viewBox="0 0 500 80"
                  preserveAspectRatio="none"
                >
                  <path d="M0,40 C80,80 160,0 250,30 340,60 420,40 500,20 L500,100 L0,100 Z" />
                </svg>

                <div className="Aboutteachercard-share">
                  <FaShareAlt className="Aboutteachercard-share-main" />
                  <div className="Aboutteachercard-share-icons">
                    <span>
                      <FaFacebookF />
                    </span>
                    <span>
                      <FaInstagram />
                    </span>
                    <span>
                      <FaLinkedinIn />
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="Aboutteachercard-name">
                {item.name}
              </h3>

              <p className="Aboutteachercard-role">
                {item.designation || "Instructor"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutteachercard;