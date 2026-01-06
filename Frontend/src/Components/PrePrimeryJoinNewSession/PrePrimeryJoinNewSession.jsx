import React from "react";
import "./PrePrimeryJoinNewSession.css";

import bgImage from "../../assets/blog3.png"; 

export default function PrePrimeryJoinNewSession() {
  return (
    <section
      className="join-session"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="join-session__overlay">
        <h2>Join Our New Session</h2>

        <p>
          Kindedo believes that good questions drive good answers. Whether it's a
          query about the world around us or a challenge.
        </p>

        <button className="join-session__btn">Apply Now</button>

        {/* Decorative shapes (optional) */}
        <span className="decor decor-left">~</span>
        <span className="decor decor-right">~</span>
      </div>
    </section>
  );
}
