import React, { useEffect, useRef } from "react";
import "./Aboutus.css";

import { FaBasketballBall, FaBookOpen, FaPhoneAlt } from "react-icons/fa";

import aboutImg from "../../assets/about.webp";
import shapeImg from "../../assets/radius-shape.png";
import zebraImg from "../../assets/zebra-01.webp";
import sun from "../../assets/shape-2.png";
import circle from "../../assets/circle.png";

const Aboutus = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add("show");
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="about-container">

        {/* DECORATIVE ICONS */}
        <img src={sun} alt="sun" className="sun-icon reveal" />
        <img src={circle} alt="circle" className="circle-icon reveal" />

        {/* LEFT IMAGE */}
        <div className="about-image-wrapper reveal">
          <img src={shapeImg} alt="shape" className="bg-shape" />
          <div className="image-blob">
            <img src={aboutImg} alt="about" />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">

          <span className="about-tag reveal">About Us</span>

          <h2 className="reveal">
            Learn To Play, Converse <br /> With Confidence.
          </h2>

          <p className="about-desc reveal">
            Luctus. Curabitur nibh justo imperdiet non ex non tempus faucibus
            urna. Aliquam elit vitae dui sagittis maximus eget vitae diam.
          </p>

          {/* FEATURES */}
          <div className="about-features">
            <div className="feature reveal">
              <div className="icon premium-icon">
                <FaBasketballBall />
              </div>
              <div>
                <h4>Sport Program</h4>
                <p>Aliquam erat volutpat nullam imperdiet.</p>
              </div>
            </div>

            <div className="feature reveal">
              <div className="icon premium-icon">
                <FaBookOpen />
              </div>
              <div>
                <h4>Easy To Learn</h4>
                <p>Ut vehicula dictumst maecenas ante.</p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="about-footer">
            <div className="founder reveal">
              <img src="https://i.pravatar.cc/60" alt="founder" />
              <div>
                <h5>Ronald Richards</h5>
                <span>Founder</span>
              </div>
            </div>

            <div className="call-box reveal">
              <div className="call-icon">
                <FaPhoneAlt />
              </div>
              <div>
                <span>Call Us Now</span><br />
                <strong>8117048317</strong>
              </div>
            </div>
          </div>

        </div>

        {/* ZEBRA */}
        <img src={zebraImg} alt="zebra" className="zebra-img reveal" />

      </div>
    </section>
  );
};

export default Aboutus;
