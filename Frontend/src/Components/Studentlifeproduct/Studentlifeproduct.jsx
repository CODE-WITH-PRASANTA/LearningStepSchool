import React from "react";
import "./Studentlifeproduct.css";
import car from "../../assets/car.webp";
import sun from "../../assets/clone-sun.png";
import object from "../../assets/clone-object.png";

import partner1 from "../../assets/partner-1.1d0a4f94.svg";
import partner2 from "../../assets/partner-2.81deec19.svg";
import partner3 from "../../assets/partner-3.dc1adcc2.svg";
import partner4 from "../../assets/partner-4.2335c4c7.svg";
import partner5 from "../../assets/partner-5.e3f54b41.svg";

const logos = [
  partner1,
  partner2,
  partner3,
  partner4,
  partner5,
];

const Studentlifeproduct = () => {
  return (
    <section className="Studentlifeproduct">

      {/* ✅ BACK-TO-BACK LOGO SLIDER */}
      <div className="Studentlifeproduct-logoSlider">
        <div className="Studentlifeproduct-logoTrack">
          {[...logos, ...logos].map((logo, index) => (
            <div className="Studentlifeproduct-logoItem" key={index}>
              <img src={logo} alt="partner logo" />
            </div>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="Studentlifeproduct-hero">
        <div className="Studentlifeproduct-content">
          <span className="Studentlifeproduct-tag">Products</span>

          <h1 className="Studentlifeproduct-title">
            Invest in your future <br />
            invest in <span>education</span>
          </h1>

          <h3 className="Studentlifeproduct-subtitle">
            Empowering Children Through <br />
            Education Igniting Curiosity
          </h3>

          <div className="Studentlifeproduct-price">29.80$</div>

          <p className="Studentlifeproduct-desc">
            Our learning tools inspire creativity, curiosity, and hands-on
            exploration—making education joyful and meaningful.
          </p>

          <div className="Studentlifeproduct-actions">
            <button className="primary">Read More</button>
            <button className="secondary">Contact Us</button>
          </div>
        </div>

        {/* IMAGE WITH FADE */}
        <div className="Studentlifeproduct-imageWrap">
          <img src={car} alt="Product" />
          <div className="Studentlifeproduct-imageFade" />
        </div>
      </div>

      {/* ILLUSTRATION */}
      <div className="Studentlifeproduct-illustration">
        <img src={sun} className="sun" alt="Sun" />
        <img src={object} className="object" alt="Object" />
      </div>

    </section>
  );
};

export default Studentlifeproduct;
