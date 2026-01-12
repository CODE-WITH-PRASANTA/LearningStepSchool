import React from "react";
import "./PrePrimeryMoreInformation.css";

import moreInfoImg from "../../assets/details-2.webp"; 
export default function PrePrimeryMoreInformation() {
  return (
    <section className="more-info">
      {/* LEFT IMAGE */}
      <div className="more-info__image">
        <img src={moreInfoImg} alt="More Information" />
      </div>

      {/* RIGHT CONTENT */}
      <div className="more-info__content">
        <h2>More Information</h2>

        <p>
          At Learning Step International School, we value clarity, quality, and academic excellence. Our structured academic system, recognized standards, and child-focused approach ensure a smooth and transparent learning journey for both students and parents.
        </p>

        <ul className="more-info__list">
          <li>Academic calendar, semesters, and holidays</li>
          <li>School accreditation &amp; institutional policies</li>
          <li>Grade progression and academic pathways</li>
          <li>Curriculum development and educational research</li>
          <li>Approved learning resources and textbooks</li>
        </ul>
      </div>
    </section>
  );
}
