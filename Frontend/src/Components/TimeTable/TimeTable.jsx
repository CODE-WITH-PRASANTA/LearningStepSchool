<<<<<<< HEAD
import React, { useState, useRef, useEffect } from "react";
=======
import React, { useEffect, useRef, useState } from "react";
>>>>>>> 36f83a662d31011a0f711f9b464d2ae6bdf49baa
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 36f83a662d31011a0f711f9b464d2ae6bdf49baa
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
