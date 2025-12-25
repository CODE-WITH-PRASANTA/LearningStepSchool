import React, { useEffect } from "react";
import { FiPhoneCall } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa6";
import { HiOutlineHeart } from "react-icons/hi";
import { TbBible } from "react-icons/tb";
import './Myservices.css'
import { IoCheckmarkCircle } from "react-icons/io5";

const MyServices = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".service-item, .services-left");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleBookVisit = () => {
    const btn = document.querySelector(".btn-primary");
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 300);
    console.log("Booking visit...");
  };

  return (
    <section className="services">
      <div className="services-container">
        {/* Background elements */}
        <div className="background-elements">
          <div className="bg-circle circle-1"></div>
          <div className="bg-circle circle-2"></div>
          <div className="bg-circle circle-3"></div>
          <div className="bg-grid"></div>
        </div>

        {/* LEFT */}
        <div className="services-left">
          <div className="tag-wrapper">
            <span className="services-tag">Premium Services</span>
            <div className="tag-line"></div>
          </div>

          <h1>
            <span className="gradient-text">Learn To Play</span>
            <br />
            <span className="highlight-text">Converse With Confidence</span>
          </h1>

          <p className="description">
            Experience transformative learning through our innovative approach.
            We combine modern teaching methodologies with personalized care to
            help you achieve your full potential.
          </p>

          <div className="benefits-list">
            <div className="benefit-item">
              <IoCheckmarkCircle className="benefit-icon" />
              <span>Personalized Learning Plans</span>
            </div>
            <div className="benefit-item">
              <IoCheckmarkCircle className="benefit-icon" />
              <span>Certified Expert Instructors</span>
            </div>
            <div className="benefit-item">
              <IoCheckmarkCircle className="benefit-icon" />
              <span>Flexible Scheduling Options</span>
            </div>
          </div>

          <div className="services-actions">
            <button className="btn-primary" onClick={handleBookVisit}>
              <span className="btn-text">Book A Session</span>
              <span className="btn-arrow">→</span>
              <div className="btn-shine"></div>
            </button>

            <div className="call-box">
              <div className="call-icon-wrapper">
                <div className="call-icon-pulse"></div>
                <div className="call-icon">
                  <FiPhoneCall />
                </div>
              </div>
              <div className="call-info">
                <span>Call Us Now</span>
                <strong>+208-555-0112</strong>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="services-right">
          <div className="service-item">
            <div className="icon-container">
              <div className="icon-bg orange"></div>
              <div className="icon orange">
                <FaGraduationCap />
                <div className="icon-glow"></div>
              </div>
            </div>
            <div className="service-content">
              <div className="service-header">
                <h3>Mathematics</h3>
                <div className="service-badge">Popular</div>
              </div>
              <p>
                Master mathematical concepts through interactive lessons.
                Build confidence in problem-solving and analytical thinking.
              </p>
              <div className="service-stats">
                <div className="stat">
                  <span className="stat-value">24+</span>
                  <span className="stat-label">Modules</span>
                </div>
                <div className="stat">
                  <span className="stat-value">98%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="service-item">
            <div className="icon-container">
              <div className="icon-bg blue"></div>
              <div className="icon blue">
                <TbBible />
                <div className="icon-glow"></div>
              </div>
            </div>
            <div className="service-content">
              <div className="service-header">
                <h3>Bible Studies</h3>
                <div className="service-badge new">New</div>
              </div>
              <p>
                Explore spiritual teachings in a welcoming environment.
                Connect faith with daily life through meaningful discussions.
              </p>
              <div className="service-stats">
                <div className="stat">
                  <span className="stat-value">12+</span>
                  <span className="stat-label">Studies</span>
                </div>
                <div className="stat">
                  <span className="stat-value">Flexible</span>
                  <span className="stat-label">Schedule</span>
                </div>
              </div>
            </div>
          </div>

          <div className="service-item">
            <div className="icon-container">
              <div className="icon-bg green"></div>
              <div className="icon green">
                <HiOutlineHeart />
                <div className="icon-glow"></div>
              </div>
            </div>
            <div className="service-content">
              <div className="service-header">
                <h3>Flex-Care</h3>
                <div className="service-badge trending">Trending</div>
              </div>
              <p>
                Personalized care that adapts to your unique needs and schedule.
                A holistic approach to support and development.
              </p>
              <div className="service-stats">
                <div className="stat">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Customizable</span>
                </div>
                <div className="stat">
                  <span className="stat-value">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyServices;