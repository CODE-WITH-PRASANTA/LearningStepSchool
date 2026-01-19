import React from "react";
import "./PrimeryWayToLearn.css";

import wayToLearnImg from "../../assets/details-1.webp";

export default function PrimeryWayToLearn() {
  return (
    <section className="primery-way-to-learn">
      {/* LEFT CONTENT */}
      <div className="primery-way-to-learn__content">
        <h2>Way to Learn</h2>

        <p>
          At Learning Step International School, we believe meaningful learning
          happens when children are given the freedom to explore within a
          structured and supportive environment. Our approach encourages
          curiosity and creativity while maintaining strong academic focus.
        </p>

        <p>
          Each classroom is thoughtfully designed to stimulate the senses,
          inspire imagination, and promote active participation. Through
          hands-on experiences, guided instruction, and real-world learning
          opportunities, students develop critical thinking skills, confidence,
          and intellectual growth.
        </p>

        <button className="primery-way-to-learn__btn">
          Contact Us
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="primery-way-to-learn__image">
        <img src={wayToLearnImg} alt="Way to Learn" />
      </div>
    </section>
  );
}
