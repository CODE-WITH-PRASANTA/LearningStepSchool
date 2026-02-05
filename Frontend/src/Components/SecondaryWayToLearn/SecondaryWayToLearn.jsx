import React from "react";
import "./SecondaryWayToLearn.css";

import wayToLearnImg from "../../assets/details-1.webp";

export default function SecondaryWayToLearn() {
  return (
    <section className="secondary-way-to-learn">
      {/* LEFT CONTENT */}
      <div className="secondary-way-to-learn__content">
        <h2>Way to Learn</h2>

        <p>
          At Learning Step International School, our secondary learning approach is built around developing independent thinkers with strong academic discipline. We combine structured teaching with interactive learning to deepen subject understanding and analytical skills.
        </p>

        <p>
          Students are encouraged to question concepts, collaborate with peers, and apply knowledge in practical ways. Through guided instruction and a supportive academic environment, we help learners build confidence, responsibility, and the skills essential for academic and personal growth.
        </p>

        <button className="secondary-way-to-learn__btn">Contact Us</button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="secondary-way-to-learn__image">
        <img src={wayToLearnImg} alt="Way to Learn" />
      </div>
    </section>
  );
}
