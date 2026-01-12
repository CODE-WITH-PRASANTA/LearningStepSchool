import React, { useEffect } from "react";
import "./KnowAndAid.css";
import { FaCheckCircle, FaFileAlt } from "react-icons/fa";

const KnowAndAid = () => {
  useEffect(() => {
    // Animation for the "FEATURES" label
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.5 }
    );

    const label = document.querySelector(".features-label span");
    if (label) observer.observe(label);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="know-section">
      <div className="know-container">
        {/* LEFT COLUMN */}
        <div className="know-left">
          <h2>Things To Know First</h2>
          <p>
            There are many variations of passages of Lorem Ipsum available, but the
            majority have suffered alteration in some form, by injected humour, or
            randomised words which don't look even slightly believable. If you are
            going to use a passage of Lorem Ipsum, you need to be sure there isn't
            anything embarrassing hidden in the middle of text.
          </p>
          <p>
            It is a long established fact that a reader will be distracted by the
            readable content of a page when looking at its layout. The point of
            using Lorem Ipsum is that it has a more-or-less normal distribution of
            letters, as opposed to using Content here content here making it look
            like readable English.
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="know-right">
          <div className="know-right-header">
          
            <h2>Documents And Financial Aid</h2>
          </div>

          {/* Paragraph under heading */}
          <p className="right-desc">
            There are many variations of passages of Lorem Ipsum available, but the
            majority have suffered alteration in some form, by injected humour, or
            randomised words which don't look even slightly believable.
          </p>

          {/* Checklist points */}
          <ul className="know-checklist">
            <li>
              <FaCheckCircle className="check-icon" />
              Sed ut perspiciatis unde omnis iste natus error sit doloremque
              laudantium.
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Totam rem aperiam eaque ipsa quae ab illo inventore veritatis.
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Dolores eos qui ratione voluptatem sequi nesciunte porro quisquam est.
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Adipisci velit sed quia non numquam eius modi tempora incidunt.
            </li>
          </ul>
        </div>
      </div>

    </section>
  );
};

export default KnowAndAid;
