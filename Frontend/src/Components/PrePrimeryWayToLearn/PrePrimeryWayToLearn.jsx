import React from "react";
import "./PrePrimeryWayToLearn.css";

import wayToLearnImg from "../../assets/details-1.webp"; // replace with your image path

export default function PrePrimeryWayToLearn() {
  return (
    <section className="way-to-learn">
      {/* LEFT CONTENT */}
      <div className="way-to-learn__content">
        <h2>Way to Learn</h2>

        <p>
          At Learning Step International School, we believe children learn best when they are given the freedom to explore within a well-structured and supportive environment. Our learning approach encourages curiosity, creativity, and independent thinking while maintaining strong academic foundations.
        </p>

        <p>
         Classrooms are designed to stimulate young minds through hands-on experiences, meaningful activities, and guided instruction. By combining sensory learning with age-appropriate structure, we help children develop confidence, problem-solving skills, and a genuine love for learning.
        </p>

        <button className="way-to-learn__btn">Contact Us</button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="way-to-learn__image">
        <img src={wayToLearnImg} alt="Way to Learn" />
      </div>
    </section>
  );
}
