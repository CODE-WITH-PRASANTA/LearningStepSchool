import React, { useEffect, useRef } from "react";
import "./Aboutus.css";

import { FaBasketballBall, FaBookOpen, FaPhoneAlt } from "react-icons/fa";

import aboutImg from "../../assets/about.webp";
import shapeImg from "../../assets/radius-shape.png";
import zebraImg from "../../assets/zebra-01.webp";
import sun from "../../assets/shape-2.png";
import circle from "../../assets/circle.png";
import founderavater from '../../assets/author.jpeg'

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
        <img src={sun} alt="decorative sun icon" className="sun-icon About-reveal" />
        <img src={circle} alt="decorative circle" className="circle-icon About-reveal" />

        {/* LEFT IMAGE */}
        <div className="about-image-wrapper About-reveal">
          <img src={shapeImg} alt="background shape" className="bg-shape" />
          <div className="image-blob">
            <img src={aboutImg} alt="Learning Step International School classroom activity" />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">

          <span className="about-tag About-reveal">About Us</span>

          <h2 className="About-reveal">
            Learning Step <br /> International School
          </h2>

          <p className="about-desc About-reveal">
            Learning Step International School is committed to providing quality education in a warm, safe, and nurturing environment. 
            We focus on building strong academic fundamentals while encouraging creativity, confidence, and effective communication from an early age.
          </p>

          <p className="about-desc About-reveal">
            Our teaching approach blends structured learning with practical activities, helping children develop curiosity, discipline, 
            and a lifelong love for learning. Every child is guided with care, attention, and respect to help them reach their full potential.
          </p>

          {/* FEATURES */}
          <div className="about-features">

            <div className="feature About-reveal">
              <div>
                <h4>Strong Academic Foundation</h4>
                <p>
                  Our curriculum is designed to strengthen core subjects such as English, Mathematics, Science, and Social Studies, 
                  while promoting logical thinking and problem-solving skills.
                </p>
              </div>
            </div>

            <div className="feature About-reveal">
              <div>
                <h4>Engaging & Activity-Based Learning</h4>
                <p>
                  Through interactive teaching methods, visual aids, sports, art, and group activities, 
                  students enjoy learning in a way that improves understanding and long-term retention.
                </p>
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="about-footer">

            <div className="founder About-reveal">
              <img src={founderavater} alt="Founder of Learning Step International School" />
              <div>
                <h5>Mr. Vishnu Sharma</h5>
                <span>Founder</span>
              </div>
            </div>

            <a href="tel:9887868746" className="call-box About-reveal">
              <div className="call-icon">
                <FaPhoneAlt />
              </div>
              <div>
                <span>Call Us Now</span><br />
                <strong>9887868746</strong>
              </div>
            </a>

          </div>

        </div>

        {/* ZEBRA */}
        <img src={zebraImg} alt="decorative school illustration" className="zebra-img About-reveal" />

      </div>
    </section>
  );
};

export default Aboutus;
