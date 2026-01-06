import React from "react";
import "./NewsletterSection.css";

import img1 from "../../assets/news1.jpg";
import img2 from "../../assets/news2.jpg";
import img3 from "../../assets/news3.jpg";
import img4 from "../../assets/news4.jpg";
import img5 from "../../assets/news5.jpg"

const NewsletterSection = () => {
  return (
    <section className="newsletter-section">
      {/* ===== IMAGE COLLAGE ===== */}
      <div className="image-collage">
        <div className="collage-left">
          <img src={img1} alt="classroom learning" />
        </div>

        <div className="collage-right">
          <img src={img2} alt="student" />
          <img src={img3} alt="child smiling" />
          <img src={img4} alt="teacher" />
          <img src={img5} alt="students writing" />
        </div>
      </div>

      {/* ===== NEWSLETTER ===== */}
      <div className="newsletter-box">
        <div className="mail-icon">
          ✉️
        </div>

        <h2>Want to Hear From Us?</h2>

        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
            required
          />
          <button type="submit">SIGN UP</button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
