import React from "react";
import "./PrimeryWayToLearn.css";

import wayToLearnImg from "../../assets/details-1.webp";

export default function PrimeryWayToLearn() {
  return (
    <section className="way-to-learn">
      {/* LEFT CONTENT */}
      <div className="way-to-learn__content">
        <h2>Way to Learn</h2>

        <p>
          As a result, the child should have a reasonable amount of freedom to
          do as they please, while at the same time being wholly immersed in an
          environment which stimulates their senses as well as exercising their
          creativity. Literally their classroom is their world, providing
          exposure to materials and experiences that foster greater intellectual
          growth. You will love it.
        </p>

        <p>
          Please take a moment to read this website, and I’m sure that you will
          come to agree that there would be better place.
        </p>

        <button className="way-to-learn__btn">Know More</button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="way-to-learn__image">
        <img src={wayToLearnImg} alt="Way to Learn" />
      </div>
    </section>
  );
}
