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
          Secondary education encourages independent thinking, problem-solving,
          and deeper subject understanding through structured and interactive
          learning environments.
        </p>

        <p>
          Students are guided to explore concepts critically, collaborate with
          peers, and build skills essential for academic and personal growth.
        </p>

        <button className="secondary-way-to-learn__btn">Know More</button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="secondary-way-to-learn__image">
        <img src={wayToLearnImg} alt="Way to Learn" />
      </div>
    </section>
  );
}
