import React, { useEffect, useRef, useState } from "react";
import "./FaqTabs.css";

const FAQ_DATA = {
  "Trust & Safety": [
    {
      q: "What Skills Will My Child Learn By Using Kinder?",
      a: "Children develop cognitive, emotional, and social skills through structured activities."
    },
    {
      q: "What Is Included In Your Services?",
      a: "We provide monitoring, learning tools, progress tracking, and safety systems."
    },
    {
      q: "What Type Of Company Is Measured?",
      a: "We evaluate educational institutions and learning platforms."
    },
    {
      q: "Are The Tours Included With Meals?",
      a: "Some plans include meals depending on location."
    },
    {
      q: "What Activities Are Done In The Development?",
      a: "Creative thinking, teamwork, storytelling, and guided play."
    },
    {
      q: "What Ages Is Prodigies Designed For?",
      a: "Designed for children aged 3–12."
    }
  ],

  General: [
    {
      q: "What Skills Will My Child Learn By Using Kinder?",
      a: "Children gain communication, creativity, and logical thinking skills."
    },
    {
      q: "What Is Included In Your Services?",
      a: "Learning programs, supervision, reports, and digital resources."
    },
    {
      q: "What Type Of Company Is Measured?",
      a: "Educational organizations and learning platforms."
    },
    {
      q: "Are The Tours Included With Meals?",
      a: "Depends on your selected service package."
    },
    {
      q: "What Activities Are Done In The Development?",
      a: "Hands-on learning, creativity, and collaboration."
    },
    {
      q: "What Ages Is Prodigies Designed For?",
      a: "Designed for children aged 4–12."
    }
  ],

  Programs: [
    {
      q: "What Skills Will My Child Learn By Using Kinder?",
      a: "Confidence, creativity, leadership and teamwork skills."
    },
    {
      q: "What Is Included In Your Services?",
      a: "Structured educational programs with guidance."
    },
    {
      q: "What Type Of Company Is Measured?",
      a: "Education-focused organizations."
    },
    {
      q: "Are The Tours Included With Meals?",
      a: "Some programs include meals."
    },
    {
      q: "What Activities Are Done In The Development?",
      a: "Learning games, challenges, and group activities."
    },
    {
      q: "What Ages Is Prodigies Designed For?",
      a: "Children between 4–12 years."
    }
  ],

  Kindergarten: [
    {
      q: "What Skills Will My Child Learn By Using Kinder?",
      a: "Early literacy, numbers, creativity, and social development."
    },
    {
      q: "What Is Included In Your Services?",
      a: "Daily learning programs and supervision."
    },
    {
      q: "What Type Of Company Is Measured?",
      a: "Early childhood institutions."
    },
    {
      q: "Are The Tours Included With Meals?",
      a: "Optional meal plans available."
    },
    {
      q: "What Activities Are Done In The Development?",
      a: "Storytelling, art, games, and guided play."
    },
    {
      q: "What Ages Is Prodigies Designed For?",
      a: "Children aged 3–6."
    }
  ]
};

export default function FaqTabs() {
  const [activeTab, setActiveTab] = useState("Trust & Safety");
  const [openIndex, setOpenIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setAnimate(true),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate when tab changes
  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 60);
    return () => clearTimeout(t);
  }, [activeTab]);

  return (
    <section ref={sectionRef} className={`faq-wrapper ${animate ? "reveal" : ""}`}>
      <div className="faq-layout">

        {/* LEFT STICKY TABS */}
        <div className="faq-tabs">
          {Object.keys(FAQ_DATA).map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setOpenIndex(0);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className={`faq-content ${animate ? "animate-in" : ""}`}>
          {FAQ_DATA[activeTab].map((item, index) => (
            <div
              key={index}
              className={`faq-item ${
                openIndex === index ? "open active" : ""
              }`}
              onClick={() =>
                setOpenIndex(openIndex === index ? -1 : index)
              }
            >
              <div className="faq-question">
                <h4>{item.q}</h4>
                <span className="arrow">{openIndex === index ? "⌃" : "›"}</span>
              </div>

              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
