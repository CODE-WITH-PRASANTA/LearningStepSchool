import React, { useEffect, useRef } from "react";
import "./VMAboutUs.css";

const AboutVideoSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("avs-visible");
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="avs-wrapper" ref={sectionRef}>
      {/* TOP WAVE */}
      <div className="avs-wave avs-wave-top">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,40 C120,70 240,10 360,20 480,30 600,80 720,70 840,60 960,20 1080,25 1200,30 1320,60 1440,50 L1440,0 L0,0 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* CONTENT */}
      <div className="avs-content">
        <h2>About Us</h2>
        <p>
          Learning Step International School is a child-focused early education institution dedicated to nurturing young minds through quality learning, care, and creativity. We provide a safe, supportive environment where children develop strong academic foundations, confidence, and essential life skills through guided learning and play-based experiences.
        </p>
      </div>

      {/* VIDEO */}
      <div className="avs-video-box">
        <div className="avs-video-inner">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* BOTTOM WAVE */}
      <div className="avs-wave avs-wave-bottom">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,30 C150,80 300,0 450,25 600,50 750,80 900,60 1050,40 1200,20 1440,35 L1440,100 L0,100 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
};

export default AboutVideoSection;
