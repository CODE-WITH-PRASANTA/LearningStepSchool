import React from "react";
import "./SecondaryJoinNewSession.css";

import bgImage from "../../assets/blog3.png";

export default function SecondaryJoinNewSession() {
  return (
    <section
      className="secondary-join-session"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="secondary-join-session__overlay">
        <h2>Join Our New Session</h2>

        <p>
          Secondary programs are designed to challenge students academically
          while nurturing leadership, creativity, and confidence for the future.
        </p>

        <button className="secondary-join-session__btn">Apply Now</button>

        {/* Decorative shapes */}
        <span className="secondary-decor secondary-decor-left">~</span>
        <span className="secondary-decor secondary-decor-right">~</span>
      </div>
    </section>
  );
}
