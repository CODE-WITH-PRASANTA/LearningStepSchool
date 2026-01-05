import React, { useEffect, useRef, useState } from "react";
import {
  FaUsers,
  FaStar,
  FaAward,
  FaCheckCircle,
} from "react-icons/fa";
import "./Studentlifecounter.css";

const COUNTERS = [
  {
    icon: <FaUsers />,
    value: 1230,
    label: "Team Members",
  },
  {
    icon: <FaStar />,
    value: 210,
    label: "Client Reviews",
  },
  {
    icon: <FaAward />,
    value: 1200,
    label: "Winning Awards",
  },
  {
    icon: <FaCheckCircle />,
    value: 230,
    label: "Completed Projects",
  },
];

const CounterCard = ({ icon, value, label, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    let current = 0;
    const duration = 1600;
    const step = Math.max(1, Math.floor(value / (duration / 16)));

    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        current = value;
        clearInterval(timer);
      }
      setCount(current);
    }, 16);

    return () => clearInterval(timer);
  }, [start, value]);

  return (
    <div className="Studentlifecounter-card">
      <div className="Studentlifecounter-icon">
        {icon}
      </div>

      <h3 className="Studentlifecounter-number">
        {count}+
      </h3>

      <p className="Studentlifecounter-label">
        {label}
      </p>
    </div>
  );
};

const Studentlifecounter = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="Studentlifecounter-section"
      ref={sectionRef}
    >
      <div className="Studentlifecounter-wrapper">
        {COUNTERS.map((item, index) => (
          <CounterCard
            key={index}
            {...item}
            start={visible}
          />
        ))}
      </div>
    </section>
  );
};

export default Studentlifecounter;
