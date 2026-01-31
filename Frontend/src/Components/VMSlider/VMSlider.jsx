import React, { useState } from "react";
import "./VMSlider.css";

const vmsItems = [
  {
    title: "Language Skills",
    desc: "Early language development that strengthens communication, reading, and vocabulary skills.",
    icon: "📘",
    colors: ["#6c8cff", "#b983ff", "#6ecbff"]
  },
  {
    title: "Art & Drawing",
    desc: "Creative art activities that encourage imagination, expression, and fine motor skills.",
    icon: "🎸",
    colors: ["#7bbf00", "#ffb703", "#6ecbff"]
  },
  {
    title: "Certificate",
    desc: "Recognized certificates that celebrate learning progress and early achievements.",
    icon: "🎓",
    colors: ["#8d6e63", "#7e57c2", "#9ccc65"]
  },
  {
    title: "Staff",
    desc: "Experienced and caring teachers dedicated to early childhood education and child development.",
    icon: "👩‍🏫",
    colors: ["#7bbf00", "#ffb703", "#6ecbff"]
  }
];

const VMSlider = () => {
  const [vmsIndex, setVmsIndex] = useState(0);

  const vmsPrev = () =>
    setVmsIndex((prev) => (prev === 0 ? vmsItems.length - 1 : prev - 1));

  const vmsNext = () =>
    setVmsIndex((prev) => (prev === vmsItems.length - 1 ? 0 : prev + 1));

  const vmsVisibleItems = [
    vmsItems[vmsIndex % vmsItems.length],
    vmsItems[(vmsIndex + 1) % vmsItems.length],
    vmsItems[(vmsIndex + 2) % vmsItems.length]
  ];

  return (
    <section className="vms-section">
      {/* ===== HEADING ===== */}
      <div className="vms-heading">
        <span className="vms-small-title">Curriculum</span>
        <div className="vms-divider">
          <span></span>
        </div>
      </div>

      {/* ===== SLIDER ===== */}
      <div className="vms-track">
        {vmsVisibleItems.map((item, i) => (
          <div className="vms-card" key={i}>
            <div
              className="vms-blob"
              style={{
                background: `
                  radial-gradient(circle at top left, ${item.colors[0]}, transparent 60%),
                  radial-gradient(circle at bottom right, ${item.colors[1]}, transparent 60%),
                  radial-gradient(circle at center, ${item.colors[2]}, transparent 60%)
                `
              }}
            >
              <span className="vms-icon">{item.icon}</span>
            </div>

            <h3 className="vms-card-title">{item.title}</h3>
            <p className="vms-card-desc">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ===== ARROWS ===== */}
      <div className="vms-controls">
        <button className="vms-arrow vms-left" onClick={vmsPrev}>
          ‹
        </button>
        <button className="vms-arrow vms-right" onClick={vmsNext}>
          ›
        </button>
      </div>
    </section>
  );
};

export default VMSlider;
