import React, { useEffect, useRef, useState } from "react";
import "./TimeTable.css";

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("TimeTable-scrollShow");
        }
      },
      { threshold: 0.2 }
    );

    if (tableRef.current) observer.observe(tableRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered =
    activeTab === "All"
      ? classesData
      : classesData.filter((item) => item.type === activeTab);

  return (
    <section className="TimeTable-section">
      {/* Heading */}
      <h1 className="TimeTable-heading TimeTable-reveal">
        All Classes Time Table
      </h1>

      <p className="TimeTable-description TimeTable-reveal TimeTable-delay">
        Our multi-level kindergarten programs cater to the age group of 2–5
        years with a curriculum focusing on children.
      </p>

      {/* Tabs */}
      <div className="TimeTable-tabs TimeTable-reveal TimeTable-delay2">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={`TimeTable-tab ${
              activeTab === tab ? "TimeTable-tabActive" : ""
            }`}
            onMouseEnter={() => setActiveTab(tab)}
          >
            {tab} Class
          </span>
        ))}
      </div>

      {/* Timetable */}
      <div className="TimeTable-grid TimeTable-scroll" ref={tableRef}>
        {days.map((day) => (
          <div key={day} className="TimeTable-dayColumn">
            <div className="TimeTable-dayHeader">{day}</div>

            {filtered
              .filter((item) => item.day === day)
              .map((item, i) => (
                <div
                  key={i}
                  className={`TimeTable-classBox TimeTable-${item.type.toLowerCase()}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="TimeTable-classTime">{item.time}</span>
                  <strong className="TimeTable-classType">
                    {item.type} Class
                  </strong>
                </div>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
