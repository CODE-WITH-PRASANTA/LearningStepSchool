import React, { useState } from "react";
import "./Abouttestimonials.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import shape1 from "../../assets/shape-1.png";
import shape2 from "../../assets/shape-2.png";

const testimonials = [
  {
    text: `Nunc vulputate tempor leo quis accumsan Sed vel mauris bibendum dignissim nisl a dapibus tortor Fusce sagittis est fringilla auctor eros vitae aliquam mauris Ut et elit consectetur porta felis ac interdum dolor Maecenas neque mi ullamcorper id sapien ac elementum`,
    name: "Ronald Richards",
    role: "Co, Founder",
    img: "https://i.pravatar.cc/80?img=12",
  },
  {
    text: `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`,
    name: "Leslie Alexander",
    role: "Managing Director",
    img: "https://i.pravatar.cc/80?img=32",
  },
  {
    text: `Quis ipsum suspendisse ultrices gravida risus commodo viverra maecenas accumsan lacus vel facilisis sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare`,
    name: "Brooklyn Simmons",
    role: "CEO",
    img: "https://i.pravatar.cc/80?img=45",
  },
];

const Abouttestimonials = () => {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex(index === 0 ? testimonials.length - 1 : index - 1);
  };

  const next = () => {
    setIndex(index === testimonials.length - 1 ? 0 : index + 1);
  };

  const item = testimonials[index];

  return (
    <section className="Abouttestimonials-section">
      <div className="Abouttestimonials-wrapper">

        {/* DECORATION */}
        <div className="Abouttestimonials-scribble-left">
          <img src={shape1} alt="" />
        </div>
        <div className="Abouttestimonials-scribble-right">
          <img src={shape2} alt="" />
        </div>

        {/* HEADER */}
        <span className="Abouttestimonials-subtitle">Testimonials</span>
        <h2 className="Abouttestimonials-title">What Clients Say</h2>

        {/* MOBILE NAV (TOP) */}
        <div className="Abouttestimonials-nav-mobile">
          <button onClick={prev}><FaArrowLeft /></button>
          <button onClick={next}><FaArrowRight /></button>
        </div>

        {/* CONTENT */}
        <p className="Abouttestimonials-text">{item.text}</p>

        {/* AUTHOR */}
        <div className="Abouttestimonials-author">
          <img src={item.img} alt={item.name} />
          <div>
            <h4>{item.name}</h4>
            <span>{item.role}</span>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <button className="Abouttestimonials-nav left" onClick={prev}>
          <FaArrowLeft />
        </button>
        <button className="Abouttestimonials-nav right" onClick={next}>
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default Abouttestimonials;
