import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "./NewsletterSection.css";

import img1 from "../../assets/news1.jpg";
import img2 from "../../assets/news2.jpg";
import img3 from "../../assets/news3.jpg";
import img4 from "../../assets/news4.jpg";
import img5 from "../../assets/news5.jpg";

const NewsletterSection = () => {
  const navigate = useNavigate(); // ✅ Create navigation function

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    const emailValue = e.target.email.value.trim();

    if (emailValue) {
      navigate("/login"); // ✅ Redirect to login page
    } else {
      alert("Please enter a valid email address.");
    }
  };

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
        <h2>Want to Hear From Us?</h2>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
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
