import React, { useState } from "react";
import "./SectionArea.css";

const SectionArea = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      title: "Award-Recognized School Excellence",
      description:
        "Learning Step International School is recognized for its commitment to quality early childhood education, maintaining high academic standards and a strong focus on overall child development.",
    },
    {
      title: "Modern Classrooms & Child-Friendly Facilities",
      description:
        "Our school offers well-designed classrooms, safe play areas, and age-appropriate facilities that support comfortable, engaging, and effective learning for young children.",
    },
    {
      title: "Writing and Reading Skill Development Programs",
      description:
        "We focus on early literacy through structured reading and writing activities that strengthen language skills, vocabulary, and communication from the foundation level.",
    },
    {
      title: "Individual Attention in Small Class Sizes",
      description:
        "Small class sizes allow our experienced teachers to give personal attention, understand each child’s learning needs, and support steady academic progress.",
    },
    {
      title: "Positive, Safe, and Supportive Learning Environment",
      description:
        "We provide a secure and nurturing school environment where children feel confident, valued, and encouraged to explore and learn at their own pace.",
    },
    {
      title: "Hands-On Learning & Scientific Exploration Activities",
      description:
        "Children engage in hands-on activities and simple scientific exploration that promote curiosity, critical thinking, and problem-solving skills.",
    },
  ];

  const toggleFeature = (index) => {
    setActiveFeature(activeFeature === index ? null : index);
  };

  return (
    <section className="enfant-school">
      {/* ===== TOP HEADING ===== */}
      <div className="enfant-header">
        <h2>Learning Step International School</h2>
        <p>A leading preschool in Tehla byepass, Alwar Road, Rajgarh for confident early learners.</p>
        <div className="ztl-divider">
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
            Learning Step International School was established with a clear vision to provide high-quality early childhood education in a safe, nurturing, and engaging environment. Over the years, we have focused on building strong learning foundations through structured academics, play-based learning, and personalized care for every child.
          </p>

          <p>
           Our approach combines modern teaching methods with traditional values, helping children develop confidence, curiosity, and essential life skills. With experienced educators and child-friendly facilities, we continue to support each child’s academic, emotional, and social growth.
          </p>

          <ul className="check-list">
            <li>Learning program with after-school support</li>
            <li>Positive and child-friendly learning environment</li>
            <li>Learning through play and hands-on activities</li>
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
