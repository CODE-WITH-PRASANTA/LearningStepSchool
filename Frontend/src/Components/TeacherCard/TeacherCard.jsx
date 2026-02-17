import React, { useEffect, useRef, useState } from "react";
import "./TeacherCard.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaShareAlt
} from "react-icons/fa";

import API, { IMAGE_URL } from "../../Api/Api";

const TeacherCard = () => {
  const [teachers, setTeachers] = useState([]);
  const cardsRef = useRef([]);

  /* ================= FETCH TEACHERS ================= */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await API.get("/teachers");
        setTeachers(res.data);
      } catch (err) {
        console.error("FETCH TEACHERS ERROR:", err);
      }
    };

    fetchTeachers();
  }, []);

  /* ================= ANIMATION ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });
  }, [teachers]);

  return (
    <section className="instructor-section">
      <div className="instructor-grid">

        {teachers.map((teacher, index) => (
          <div
            className="instructor-card"
            key={teacher._id}
            ref={el => (cardsRef.current[index] = el)}
          >
            <div className="img-wrap">
              <img
                src={`${IMAGE_URL}${teacher.photo}`}
                alt={teacher.name}
              />

              {/* Wave */}
              <svg
                className="wave-shape"
                viewBox="0 0 500 80"
                preserveAspectRatio="none"
              >
                <path d="M0,40 C80,80 160,0 250,30 340,60 420,40 500,20 L500,100 L0,100 Z" />
              </svg>

              {/* Share */}
              <div className="share-box">
                <FaShareAlt className="share-main" />

                <div className="share-icons">
                  {teacher.facebook && (
                    <a href={teacher.facebook} target="_blank" rel="noreferrer">
                      <FaFacebookF />
                    </a>
                  )}

                  {teacher.instagram && (
                    <a href={teacher.instagram} target="_blank" rel="noreferrer">
                      <FaInstagram />
                    </a>
                  )}

                  {teacher.linkedin && (
                    <a href={teacher.linkedin} target="_blank" rel="noreferrer">
                      <FaLinkedinIn />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <h3>{teacher.name}</h3>
            <p>Instructor</p>

            {/* ⭐ Rating Display */}
            <div style={{ marginTop: "6px" }}>
              {Array.from({ length: teacher.rating }).map((_, i) => (
                <span key={i} style={{ color: "#ffb703" }}>★</span>
              ))}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default TeacherCard;