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

    const elements = document.querySelectorAll(".Myservices-homepage__service-item, .Myservices-homepage__left");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleBookVisit = () => {
    const btn = document.querySelector(".Myservices-homepage__btn-primary");
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 300);
    console.log("Booking visit...");
  };

  return (
    <section className="Myservices-homepage">
      <div className="Myservices-homepage__container">
        {/* Background elements */}
        <div className="Myservices-homepage__background-elements">
          <div className="Myservices-homepage__bg-circle Myservices-homepage__circle-1"></div>
          <div className="Myservices-homepage__bg-circle Myservices-homepage__circle-2"></div>
          <div className="Myservices-homepage__bg-circle Myservices-homepage__circle-3"></div>
          <div className="Myservices-homepage__bg-grid"></div>
        </div>

        {/* LEFT */}
        <div className="Myservices-homepage__left">
          <div className="Myservices-homepage__tag-wrapper">
            <span className="Myservices-homepage__services-tag">Premium Services</span>
            <div className="Myservices-homepage__tag-line"></div>
          </div>

         <h1>
            <span className="Myservices-homepage__gradient-text">Our Core Values</span>
            <br />
            <span className="Myservices-homepage__highlight-text">Shaping Young Minds for a Better Future</span>
          </h1>


         <p className="Myservices-homepage__description">
            At our school, we believe that education is the foundation of a successful
            and meaningful life. Through quality teaching, strong moral values, and
            modern learning practices, we prepare students to face academic challenges
            with confidence and integrity.
          </p>


       <div className="Myservices-homepage__benefits-list">
            <div className="Myservices-homepage__benefit-item">
              <IoCheckmarkCircle className="Myservices-homepage__benefit-icon" />
              <span>Quality Education with Strong Values</span>
            </div>
            <div className="Myservices-homepage__benefit-item">
              <IoCheckmarkCircle className="Myservices-homepage__benefit-icon" />
              <span>Safe, Supportive & Student-Friendly Environment</span>
            </div>
            <div className="Myservices-homepage__benefit-item">
              <IoCheckmarkCircle className="Myservices-homepage__benefit-icon" />
              <span>Creative Learning with Life Skills</span>
            </div>
          </div>

          <div className="Myservices-homepage__actions">
            <button className="Myservices-homepage__btn-primary" onClick={handleBookVisit}>
              <span className="Myservices-homepage__btn-text">Register Now</span>
              <span className="Myservices-homepage__btn-arrow">→</span>
              <div className="Myservices-homepage__btn-shine"></div>
            </button>

            <div className="Myservices-homepage__call-box">
              <div className="Myservices-homepage__call-icon-wrapper">
                <div className="Myservices-homepage__call-icon-pulse"></div>
                <div className="Myservices-homepage__call-icon">
                  <FiPhoneCall />
                </div>
              </div>
              <div className="Myservices-homepage__call-info">
                <span>Call Us Now</span>
                <a href="tel:+917014627894" className="Myservices-homepage__call-number">
                  <strong>+91 70146 27894</strong>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="Myservices-homepage__right">
          <div className="Myservices-homepage__service-item">
            <div className="Myservices-homepage__icon-container">
              <div className="Myservices-homepage__icon-bg orange"></div>
              <div className="Myservices-homepage__icon orange">
                <FaGraduationCap />
                <div className="Myservices-homepage__icon-glow"></div>
              </div>
            </div>
            <div className="Myservices-homepage__service-content">
              <div className="Myservices-homepage__service-header">
              <h3>Value of Education</h3>
                <div className="Myservices-homepage__service-badge">Popular</div>
              </div>
             <p>
              We believe education shapes character, builds confidence, and sparks
              curiosity. Our teaching approach focuses on academic excellence,
              discipline, ethics, and essential life skills to help students grow into
              responsible and successful individuals.
            </p>

              <div className="Myservices-homepage__service-stats">
                <div className="Myservices-homepage__stat">
                 <span className="Myservices-homepage__stat-value">100%</span>
                <span className="Myservices-homepage__stat-label">Focused Learning</span>
                </div>
                <div className="Myservices-homepage__stat">
                 <span className="Myservices-homepage__stat-value">Holistic</span>
                  <span className="Myservices-homepage__stat-label">Development</span>

                </div>
              </div>
            </div>
          </div>

          <div className="Myservices-homepage__service-item">
            <div className="Myservices-homepage__icon-container">
              <div className="Myservices-homepage__icon-bg blue"></div>
              <div className="Myservices-homepage__icon blue">
                <TbBible />
                <div className="Myservices-homepage__icon-glow"></div>
              </div>
            </div>
            <div className="Myservices-homepage__service-content">
              <div className="Myservices-homepage__service-header">
              <h3>Best Environment</h3>
                <div className="Myservices-homepage__service-badge new">New</div>
              </div>
             <p>
                We provide a safe, welcoming, and motivating environment where children
                feel confident to explore, learn, and grow. Our campus promotes emotional
                well-being, discipline, and positivity in a joyful and secure atmosphere.
              </p>

              <div className="Myservices-homepage__service-stats">
                <div className="Myservices-homepage__stat">
                 <span className="Myservices-homepage__stat-value">Safe</span>
                 <span className="Myservices-homepage__stat-label">Campus</span>
                </div>
                <div className="Myservices-homepage__stat">
                 <span className="Myservices-homepage__stat-value">Positive</span>
                  <span className="Myservices-homepage__stat-label">Learning Space</span>
                </div>
              </div>
            </div>
          </div>

          <div className="Myservices-homepage__service-item">
            <div className="Myservices-homepage__icon-container">
              <div className="Myservices-homepage__icon-bg green"></div>
              <div className="Myservices-homepage__icon green">
                <HiOutlineHeart />
                <div className="Myservices-homepage__icon-glow"></div>
              </div>
            </div>
            <div className="Myservices-homepage__service-content">
              <div className="Myservices-homepage__service-header">
                <h3>Creative Curriculum</h3>
                <div className="Myservices-homepage__service-badge trending">Trending</div>
              </div>
             <p>
                Our creative curriculum blends academics with arts, activities, and
                innovation. It encourages curiosity, critical thinking, and
                problem-solving, making learning engaging, meaningful, and enjoyable for
                every child.
              </p>

              <div className="Myservices-homepage__service-stats">
                <div className="Myservices-homepage__stat">
                 <span className="Myservices-homepage__stat-value">Activity</span>
                  <span className="Myservices-homepage__stat-label">Based Learning</span>
                </div>
                <div className="Myservices-homepage__stat">
                 <span className="Myservices-homepage__stat-value">Skill</span>
                  <span className="Myservices-homepage__stat-label">Oriented</span>
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