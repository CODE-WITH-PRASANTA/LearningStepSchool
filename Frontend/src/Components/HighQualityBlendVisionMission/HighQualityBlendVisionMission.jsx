import React, { useEffect, useRef } from "react";
import "./HighQualityBlendVisionMission.css";
import kidsImg from "../../assets/half-img.jpg";

export default function HighQualityBlend() {
  const sectionRef = useRef(null);

  // Smooth scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);

  return (
    <section className="blend-section scroll-reveal" ref={sectionRef}>
      <div className="blend-container">
        {/* Left Content */}
        <div className="blend-text">
          <h1 className="text-reveal">
            We offer a High Quality Blend of Co-Curricular Activities,
            Sports and Academics.
          </h1>

          <p className="text-reveal delay-1">
            Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
            Phasellus viverra nulla ut metus varius laoreet. Aliquam lorem
            ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
            viverra nulla ut metus varius laoreet. Etiam ultricies nisi vel
            augue.
          </p>

          <button className="join-btn text-reveal delay-2">
            Join Today
          </button>
        </div>

        {/* Right Image */}
        <div className="blend-image text-reveal delay-2">
          <img src={kidsImg} alt="Kids learning together" />
        </div>
      </div>
    </section>
  );
}
