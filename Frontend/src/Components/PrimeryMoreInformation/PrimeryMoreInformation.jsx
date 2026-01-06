import React from "react";
import "./PrimeryMoreInformation.css";

import moreInfoImg from "../../assets/details-2.webp";

export default function PrimeryMoreInformation() {
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
          The past thirteen years have been memorable for the free kinder
          garden movement in the United States. Previous to that time, the work
          was largely private, experimental.
        </p>

        <ul className="more-info__list">
          <li>Semester start and end dates, holidays</li>
          <li>Accreditation &amp; Bear Facts</li>
          <li>Graduate Division</li>
          <li>Research at Our School</li>
          <li>Textbooks: Cal Student Store</li>
        </ul>
      </div>
    </section>
  );
}
