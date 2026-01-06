import React, { useState, useRef, useEffect } from "react";
import "./TimeTable.css";

const cttDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const cttTabs = ["All", "Sports", "Dancing", "Drawing"];

const cttSchedule = [
  {
    time: "8:00am - 8:30am",
    classes: [
      { name: "Play Class", type: "Play", color: "ctt-orange" },
      { name: "Play Class", type: "Play", color: "ctt-teal" },
      { name: "Play Class", type: "Play", color: "ctt-purple" },
      { name: "Play Class", type: "Play", color: "ctt-orange" },
      { name: "Play Class", type: "Play", color: "ctt-blue" },
      { name: "Play Class", type: "Play", color: "ctt-pink" }
    ]
  },
  {
    time: "9:00am - 9:30am",
    classes: [
      { name: "Dancing Class", type: "Dancing", color: "ctt-purple" },
      { name: "Dancing Class", type: "Dancing", color: "ctt-blue" },
      { name: "Dancing Class", type: "Dancing", color: "ctt-pink" },
      { name: "Dancing Class", type: "Dancing", color: "ctt-teal" },
      { name: "Dancing Class", type: "Dancing", color: "ctt-salmon" },
      { name: "Dancing Class", type: "Dancing", color: "ctt-purple" }
    ]
  },
  {
    time: "10:00am - 10:30am",
    classes: [
      { name: "Sports", type: "Sports", color: "ctt-teal" },
      { name: "Sports", type: "Sports", color: "ctt-orange" },
      { name: "Sports", type: "Sports", color: "ctt-salmon" },
      { name: "Sports", type: "Sports", color: "ctt-blue" },
      { name: "Sports", type: "Sports", color: "ctt-teal" },
      { name: "Sports", type: "Sports", color: "ctt-blue" }
    ]
  },
  {
    time: "11:00am - 11:30am",
    classes: [
      { name: "Drawing Class", type: "Drawing", color: "ctt-pink" },
      { name: "Drawing Class", type: "Drawing", color: "ctt-teal" },
      { name: "Drawing Class", type: "Drawing", color: "ctt-purple" },
      { name: "Drawing Class", type: "Drawing", color: "ctt-teal" },
      { name: "Drawing Class", type: "Drawing", color: "ctt-orange" },
      { name: "Drawing Class", type: "Drawing", color: "ctt-salmon" }
    ]
  }
];

const ClassTimeTable = () => {
  const [cttActiveTab, setCttActiveTab] = useState("All");
  const cttTabRefs = useRef([]);
  const cttUnderlineRef = useRef(null);

  useEffect(() => {
    const index = cttTabs.indexOf(cttActiveTab);
    const tab = cttTabRefs.current[index];

    if (tab && cttUnderlineRef.current) {
      cttUnderlineRef.current.style.width = `${tab.offsetWidth}px`;
      cttUnderlineRef.current.style.transform = `translateX(${tab.offsetLeft}px)`;
    }
  }, [cttActiveTab]);

  return (
    <section className="ctt-section">
      <h2 className="ctt-title">All Classes Time Table</h2>
      <p className="ctt-subtitle">
        Our multi-level kindergarten programs cater to the age group of 2–5 years
        with a curriculum focussing children.
      </p>

      {/* Sticky Tabs */}
      <div className="ctt-tabs-wrapper">
        <div className="ctt-tabs">
          {cttTabs.map((tab, index) => (
            <button
              key={tab}
              ref={(el) => (cttTabRefs.current[index] = el)}
              className={`ctt-tab-btn ${
                cttActiveTab === tab ? "ctt-tab-active" : ""
              }`}
              onClick={() => setCttActiveTab(tab)}
            >
              {tab} Class
            </button>
          ))}
          <span ref={cttUnderlineRef} className="ctt-tab-underline" />
        </div>
      </div>

      {/* Grid */}
      <div className="ctt-grid">
        {cttDays.map((day) => (
          <div key={day} className="ctt-day-header">
            {day}
          </div>
        ))}

        {cttSchedule.map((row, rIndex) =>
          row.classes.map((item, cIndex) => {
            if (cttActiveTab !== "All" && item.type !== cttActiveTab) return null;

            return (
              <div
                key={`${rIndex}-${cIndex}`}
                className={`ctt-time-box ${item.color}`}
              >
                <span className="ctt-time">{row.time}</span>
                <strong className="ctt-class-name">{item.name}</strong>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default ClassTimeTable;
