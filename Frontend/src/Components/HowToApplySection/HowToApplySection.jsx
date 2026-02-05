import React, { useEffect, useState } from "react";
import "./HowToApplySection.css";
import { FaCheckCircle, FaBookOpen } from "react-icons/fa";
import applyImage from "../../assets/how-to-apply.jpg"; // ⚠️ Replace with your image path

export default function HowToApplySection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = document.querySelector(".how-apply-section");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`how-apply-section ${isVisible ? "animate" : ""}`}
      id="how-to-apply"
    >
      <div className="how-apply-container">
        {/* LEFT SIDE CONTENT */}
        <div className="how-apply-left">
          <h6 className="apply-subtitle">
            <FaBookOpen className="apply-icon" /> HOW TO APPLY
          </h6>
          <h2 className="apply-title">
            Details About <span>How To Apply</span> Eduka.
          </h2>

          <p className="apply-desc">
            There are many variations of passages available but the majority
            have suffered alteration in some form by injected humour randomised
            words which don't look even slightly believable. If you are going to
            use a passage, make sure there isn't anything embarrassing first
            true generator on the Internet.
          </p>
          <p className="apply-desc">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium veritatis et quasi architecto beatae vitae dicta sunt
            explicabo.
          </p>

          <div className="apply-checklist">
            <ul>
              <li>
                <FaCheckCircle /> Start Online Submission
              </li>
              <li>
                <FaCheckCircle /> Submit The Form
              </li>
              <li>
                <FaCheckCircle /> Review The Submission
              </li>
            </ul>
            <ul>
              <li>
                <FaCheckCircle /> Gather Necessary Documents
              </li>
              <li>
                <FaCheckCircle /> Interviewing Process
              </li>
              <li>
                <FaCheckCircle /> Last Decision
              </li>
            </ul>
          </div>

          <button className="apply-btn">Apply Now →</button>
        </div>

        {/* RIGHT SIDE IMAGE WITH BACKGROUND SHAPE */}
        <div className="how-apply-right">
          <div className="image-wrapper">
            <div className="image-bg-shape"></div>
            <div className="content-img">
              <img src={applyImage} alt="How to Apply" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
