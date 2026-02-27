import React, { useEffect, useRef, useState } from "react";
import "./TeacherCard.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaShareAlt,
  FaStar
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

        console.log("API RESPONSE:", res.data);

        // Handle all possible response structures safely
        let teacherData = [];

        if (Array.isArray(res.data)) {
          teacherData = res.data;
        } else if (Array.isArray(res.data.teachers)) {
          teacherData = res.data.teachers;
        } else if (Array.isArray(res.data.data)) {
          teacherData = res.data.data;
        }

        setTeachers(teacherData);
      } catch (err) {
        console.error("FETCH TEACHERS ERROR:", err);
        setTeachers([]); // fallback safety
      }
    };

    fetchTeachers();
  }, []);

  /* ================= SCROLL REVEAL ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("teacher-card--reveal");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    // cleanup observer
    return () => {
      cardsRef.current.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, [teachers]);

  return (
    <section className="teacher-section">
      <div className="teacher-container">
        <div className="teacher-grid">

          {teachers.length === 0 ? (
            <p style={{ textAlign: "center", width: "100%" }}>
              No teachers found.
            </p>
          ) : (
            teachers.map((teacher, index) => (
              <div
                className="teacher-card"
                key={teacher._id || index}
                ref={el => (cardsRef.current[index] = el)}
              >
                {/* IMAGE */}
                <div className="teacher-card__image-wrapper">
                  <img
                    src={
                      teacher.photo
                        ? `${IMAGE_URL}${teacher.photo}`
                        : "/default-teacher.png"
                    }
                    alt={teacher.name || "Teacher"}
                    className="teacher-card__image"
                  />

                  {/* Wave Shape */}
                  <svg
                    className="teacher-card__wave"
                    viewBox="0 0 500 80"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,40 C80,80 160,0 250,30 340,60 420,40 500,20 L500,100 L0,100 Z" />
                  </svg>

                  {/* Share Box */}
                  <div className="teacher-card__share">
                    <div className="teacher-card__share-main">
                      <FaShareAlt />
                    </div>

                    <div className="teacher-card__social">
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

                {/* CONTENT */}
                <div className="teacher-card__content">
                  <h3 className="teacher-card__name">
                    {teacher.name || "Unnamed"}
                  </h3>

                  <p className="teacher-card__role">
                    {teacher.role || "Senior Instructor"}
                  </p>

                  {/* Rating */}
                  <div className="teacher-card__rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < (teacher.rating || 0)
                            ? "teacher-card__star teacher-card__star--active"
                            : "teacher-card__star"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </section>
  );
};

export default TeacherCard;