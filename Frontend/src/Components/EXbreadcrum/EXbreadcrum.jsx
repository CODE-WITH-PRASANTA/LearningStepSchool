import React from "react";
import "./EXbreadcrum.css";

import bg from "../../assets/breadcrumb.webp";
import arrowimg from "../../assets/arrow line.webp";
import beeimg from "../../assets/bee-2.webp";
import dollimg from "../../assets/doll.webp";
import parachutimg from "../../assets/parasuit.webp";

const ContactBreadcrum = () => {
  return (
    <section className="contact-breadcrumb">
      {/* Background Image (curve included) */}
      <img src={bg} alt="" className="cb-bg" />

      {/* Decorative Items */}
      <img src={arrowimg} alt="" className="cb-arrow" />
      <img src={dollimg} alt="" className="cb-doll" />
      <img src={parachutimg} alt="" className="cb-balloon" />
      <img src={beeimg} alt="" className="cb-bee" />

      {/* Center Content */}
      <div className="cb-content">
        <h1>Examination System</h1>
        <p>
          Home <span>›</span> Academics  <span>›</span> Examination System 
        </p>
      </div>
    </section>
  );
};

export default ContactBreadcrum;
