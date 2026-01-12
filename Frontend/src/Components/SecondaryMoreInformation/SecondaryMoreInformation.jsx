import React from "react";
import "./SecondaryMoreInformation.css";

import moreInfoImg from "../../assets/details-2.webp";

export default function SecondaryMoreInformation() {
  return (
    <section className="secondary-more-info">
      {/* LEFT IMAGE */}
      <div className="secondary-more-info__image">
        <img src={moreInfoImg} alt="More Information" />
      </div>

      {/* RIGHT CONTENT */}
      <div className="secondary-more-info__content">
        <h2>More Information</h2>

        <p>
          At Learning Step International School, our secondary program offers a structured academic framework supported by strong student guidance, enrichment opportunities, and future-focused learning pathways.
        </p>

        <ul className="secondary-more-info__list">
          <li>Academic calendar & examination schedule</li>
          <li>Curriculum & assessment structure</li>
          <li>Student support services</li>
          <li>Clubs, sports & extracurricular activities</li>
          <li>University & career guidance</li>
        </ul>
      </div>
    </section>
  );
}
