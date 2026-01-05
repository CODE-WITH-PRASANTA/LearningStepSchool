import React, { useEffect, useRef } from "react";
import "./Newsletter.css";

export default function Newsletter() {
  const cardRef = useRef(null);

  // Smooth scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
  }, []);

  return (
    <section className="newsletter-section">
      <div ref={cardRef} className="newsletter-card scroll-reveal">
        <h2 className="text-reveal">Join Our Newsletter</h2>

        <p className="text-reveal delay-1">
          Subscribe our newsletter to get our latest update & news.
        </p>

        <form className="newsletter-form text-reveal delay-2">
          <input type="email" placeholder="Your email" required />
          <button type="submit" className="subscribe-btn">
            <span>✈</span> Subscribe Now
          </button>
        </form>
      </div>
    </section>
  );
}
