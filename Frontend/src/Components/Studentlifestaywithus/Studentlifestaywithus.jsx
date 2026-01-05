import React from "react";
import "./Studentlifestaywithus.css";
import { FaArrowRight, FaRegHeart } from "react-icons/fa";
import staythumb from "../../assets/stay-thumb.webp";

const Studentlifestaywithus = () => {
  return (
    <section className="Studentlifestaywithus">
      <div className="Studentlifestaywithus-wrapper">

        {/* LEFT CONTENT */}
        <div className="Studentlifestaywithus-content">
          <span className="Studentlifestaywithus-tag">
            <FaRegHeart /> Stay With Us
          </span>

          <h2 className="Studentlifestaywithus-title">
            The path to success starts 
            with <span>education</span>
          </h2>

          <p className="Studentlifestaywithus-desc">
            Education is not just about lessons. It’s about inspiring curiosity,
            confidence, and lifelong learning in every child.
          </p>

          <button className="Studentlifestaywithus-btn">
            Read More <FaArrowRight />
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="Studentlifestaywithus-image">
          <div className="Studentlifestaywithus-imageCard">
            <img src={staythumb} alt="Learning illustration" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Studentlifestaywithus;
