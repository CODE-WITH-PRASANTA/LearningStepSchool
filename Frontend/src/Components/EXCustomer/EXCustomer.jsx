import React, { useEffect, useState } from "react";
import "./EXCustomer.css";

// Background & shapes
import bgImg from "../../assets/vs-bg12.webp";
import shapeImg from "../../assets/vs-bg.webp";
import quoteIcon from "../../assets/quote-icon.webp";

// Users
import user1 from "../../assets/vs-bg1.webp";
import user2 from "../../assets/vs-bg2.webp";

const data = [
  {
    img: user1,
    name: "Alex Aster",
    role: "Google CEO",
    text:
      "Pre-School Has Open Door Andso Offer Free Trial Sessionin Child. Mea Omneque Modo Alterum Nou Hones",
  },
  {
    img: user2,
    name: "Alex Aster",
    role: "Google CEO",
    text:
      "Pre-School Has Open Door Andso Offer Free Trial Sessionin Child. Mea Omneque Modo Alterum Nou Hones",
  },
  {
    img: user1,
    name: "Alex Aster",
    role: "Google CEO",
    text:
      "Pre-School Has Open Door Andso Offer Free Trial Sessionin Child. Mea Omneque Modo Alterum Nou Hones",
  },
  {
    img: user2,
    name: "Alex Aster",
    role: "Google CEO",
    text:
      "Pre-School Has Open Door Andso Offer Free Trial Sessionin Child. Mea Omneque Modo Alterum Nou Hones",
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 2) % data.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const visibleCards = [
    data[index],
    data[(index + 1) % data.length],
  ];

  return (
    <section
      className="ts-section"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="ts-overlay"></div>

      <img src={shapeImg} className="ts-shape shape-1" alt="" />
      <img src={shapeImg} className="ts-shape shape-2" alt="" />

      <div className="ts-container">
        <div className="ts-heading">
          <span>TESTIMONIALS</span>
          <h2>Our Happy Customers</h2>
        </div>

        <div className="ts-slider">
          <div key={index} className="ts-pair">
            {visibleCards.map((item, i) => (
              <div className="ts-card" key={i}>
                <div className="ts-user">
                  <img src={item.img} alt={item.name} />
                </div>

                <p className="ts-text">“{item.text}”</p>

                <h4>{item.name}</h4>
                <span>{item.role}</span>

                <img src={quoteIcon} className="ts-quote" alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
