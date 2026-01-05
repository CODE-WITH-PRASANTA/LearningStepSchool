import React, { useEffect, useRef, useState } from "react";
import "./Timetable.css";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const classesData = [
  { day: "Sunday", time: "8:00am - 8:30am", type: "Play" },
  { day: "Monday", time: "8:00am - 8:30am", type: "Sports" },
  { day: "Tuesday", time: "8:00am - 8:30am", type: "Sports" },
  { day: "Wednesday", time: "8:00am - 8:30am", type: "Sports" },
  { day: "Thursday", time: "8:00am - 8:30am", type: "Sports" },

  { day: "Sunday", time: "9:00am - 9:30am", type: "Dancing" },
  { day: "Tuesday", time: "9:00am - 9:30am", type: "Dancing" },
  { day: "Friday", time: "9:00am - 9:30am", type: "Dancing" },

  { day: "Monday", time: "10:00am - 10:30am", type: "Drawing" },
  { day: "Tuesday", time: "10:00am - 10:30am", type: "Drawing" },
  { day: "Thursday", time: "10:00am - 10:30am", type: "Drawing" },
];

const tabs = ["All", "Sports", "Dancing", "Drawing"];

export default function Timetable() {
  const [activeTab, setActiveTab] = useState("All");
  const tableRef = useRef(null);

  /* Scroll Reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      },
      { threshold: 0.2 }
    );

    if (tableRef.current) observer.observe(tableRef.current);
  }, []);

  const filtered =
    activeTab === "All"
      ? classesData
      : classesData.filter((item) => item.type === activeTab);

  return (
    <section className="timetable-section">
      {/* Text reveal */}
      <h1 className="reveal">All Classes Time Table</h1>
      <p className="reveal delay">
        Our multi-level kindergarten programs cater to the age group of 2–5
        years with a curriculum focussing children.
      </p>

      {/* Tabs */}
      <div className="tabs reveal delay2">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onMouseEnter={() => setActiveTab(tab)}
          >
            {tab} Class
          </span>
        ))}
      </div>

      {/* Timetable */}
      <div className="timetable scroll-reveal" ref={tableRef}>
        {days.map((day) => (
          <div key={day} className="day-col">
            <div className="day-head">{day}</div>

            {filtered
              .filter((item) => item.day === day)
              .map((item, i) => (
                <div
                  key={i}
                  className={`class-box ${item.type.toLowerCase()}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span>{item.time}</span>
                  <strong>{item.type} Class</strong>
                </div>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
