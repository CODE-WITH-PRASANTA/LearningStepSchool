import React, { useState } from "react";
import "./SectionArea.css";

const SectionArea = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      title: "Award for Best School 2017",
      description:
        "Alterum accommodare duo cu. Ius labore luptatum efficiendi ex, ne vim enim rebum honestatis, ad his consulatu pertinacia deterruisset. Te bonorum ancillae nec.",
    },
    {
      title: "Great Facilities at Enfant",
      description:
        "Our modern facilities provide children with a safe, clean, and inspiring learning environment.",
    },
    {
      title: "Writing and Reading Classes",
      description:
        "We strengthen literacy through engaging reading and writing activities designed for every skill level.",
    },
    {
      title: "Individual Attention in Small Classes",
      description:
        "Each child receives focused support and encouragement from teachers in small classroom settings.",
    },
    {
      title: "Positive Learning Environment",
      description:
        "Our teachers foster curiosity and confidence by creating joyful and inclusive learning spaces.",
    },
    {
      title: "Opportunities to Scientific Experiments",
      description:
        "Hands-on science projects help children develop curiosity, problem-solving, and discovery skills.",
    },
  ];

  const toggleFeature = (index) => {
    setActiveFeature(activeFeature === index ? null : index);
  };

  return (
    <section className="enfant-school">
      {/* ===== TOP HEADING ===== */}
      <div className="enfant-header">
        <h2>Learning Step</h2>
        <p>We want children at Enfant to learn, to lead and to make a difference</p>
        <div className="divider">
          <span></span>
        </div>
      </div>

      {/* ===== CONTENT GRID ===== */}
      <div className="enfant-content">
        {/* LEFT COLUMN - HISTORY */}
        <div className="left">
          <h3>OUR HISTORY</h3>
          <h4>QUALITY CHILDREN EDUCATION</h4>

          <p>
            Alterum accommodare duo cu. Ius labore luptatum efficiendi ex, ne vim enim
            rebum honestatis, ad his consulatu pertinacia deterruisset. Te bonorum
            ancillae nec. Mea errem alterum in, harum iudico vel et, nec atqui propriae id.
          </p>

          <p>
            Alterum accommodare duo cu. Ius labore luptatum efficiendi ex, ne vim enim
            rebum honestatis, ad his consulatu pertinacia deterruisset. Te bonorum
            ancillae nec. Mea errem alterum in, harum iudico vel et, nec atqui propriae id.
          </p>

          <ul className="check-list">
            <li>Learning program with after-school</li>
            <li>Positive learning environment</li>
            <li>Learning through play</li>
          </ul>
        </div>

        {/* RIGHT COLUMN - SCHOOL FEATURES AS FAQ */}
        <div className="right">
          <h3>SCHOOL FEATURES</h3>
          <h4>POPULAR EDUCATION FOR YOUR CHILD</h4>

          <div className="feature-container">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-item ${activeFeature === index ? "active" : ""}`}
              >
                <div
                  className="feature-header"
                  onClick={() => toggleFeature(index)}
                >
                  <span className="symbol">
                    {activeFeature === index ? "−" : "+"}
                  </span>
                  <span>{feature.title}</span>
                </div>

                <div
                  className="feature-body"
                  style={{
                    maxHeight: activeFeature === index ? "200px" : "0",
                  }}
                >
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionArea;
