import React, { useEffect, useRef } from "react";
import "./VisionMission.css";

export default function VisionMission() {
  const vmSectionRef = useRef(null);

  // Smooth scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("vm-show");
        }
      },
      { threshold: 0.25 }
    );

    if (vmSectionRef.current) observer.observe(vmSectionRef.current);
  }, []);

  return (
    <section className="vm-section" ref={vmSectionRef}>
      {/* Title */}
      <h1 className="vm-text-reveal">Vision & Mission</h1>
      <span className="vm-title-line vm-text-reveal vm-delay-1"></span>

      {/* Cards */}
      <div className="vm-grid">
        {/* Card 1 */}
        <div className="vm-card vm-blue vm-scroll-card vm-delay-1">
          <div className="vm-icon vm-blue-icon">🍎</div>
          <h3 className="vm-card-title">Day Care</h3>
          <p className="vm-card-text">
            Cum sociis natoque penatibus et magnis dis parturient montes,
            nascetur aur ridiculus mus.
          </p>
        </div>

        {/* Card 2 */}
        <div className="vm-card vm-pink vm-scroll-card vm-delay-2">
          <div className="vm-icon vm-pink-icon">✏️</div>
          <h3 className="vm-card-title">Education</h3>
          <p className="vm-card-text">
            Cum sociis natoque penatibus et magnis dis parturient montes,
            nascetur aur ridiculus mus.
          </p>
        </div>

        {/* Card 3 */}
        <div className="vm-card vm-green vm-scroll-card vm-delay-3">
          <div className="vm-icon vm-green-icon">🌍</div>
          <h3 className="vm-card-title">International</h3>
          <p className="vm-card-text">
            Cum sociis natoque penatibus et magnis dis parturient montes,
            nascetur aur ridiculus mus.
          </p>
        </div>
      </div>
    </section>
  );
}
