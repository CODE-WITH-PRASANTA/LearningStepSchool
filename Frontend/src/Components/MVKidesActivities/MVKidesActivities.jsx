import React, { useEffect, useRef } from "react";
import "./MVKidesActivities.css";

/* Images */
import bgImg from "../../assets/vm-kids-activities--bg.webp";
import videoImg from "../../assets/kids-video-bg.jpg";
import tortoise from "../../assets/tortoise.webp";
import boy from "../../assets/boy-with-cycle.webp";

/* SVG icons */
import playground from "../../assets/play-ground.svg";
import earlyclub from "../../assets/early-club.svg";
import music from "../../assets/music-club.svg";
import lunch from "../../assets/lunch.svg";

const KidsActivities = () => {
  const counterRef = useRef(null);

  /* COUNTER ANIMATION */
  useEffect(() => {
    let started = false;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          let count = 8;

          const interval = setInterval(() => {
            count++;
            if (counterRef.current) {
              counterRef.current.innerText = `${count}+`;
            }
            if (count === 20) clearInterval(interval);
          }, 80);
        }
      },
      { threshold: 0.6 }
    );

    if (counterRef.current) observer.observe(counterRef.current);
  }, []);

  /* PARALLAX EFFECT */
  useEffect(() => {
    const handleMove = e => {
      document.querySelectorAll(".parallax").forEach(el => {
        const speed = el.getAttribute("data-speed");
        el.style.transform = `translate(${e.clientX * speed / 100}px, ${
          e.clientY * speed / 100
        }px)`;
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section
      className="kids-section"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Floating Images */}
      <img src={tortoise} className="parallax tortoise" data-speed="1" alt="" />
      <img src={boy} className="parallax boy" data-speed="2" alt="" />

      <div className="container">
        {/* TOP CONTENT */}
        <div className="top-area">
          <div className="text-area">
            <span className="intro">INTRODUCING PLAYROOM</span>
            <h2 className="title">
              Kids Activities And <br /> Fun
            </h2>
            <p>
              Engaging preschool activities that support learning, creativity, and overall child development.
            </p>
          </div>

          {/* VIDEO + EXPERIENCE */}
          <div className="room-video">
            <div className="experience-box">
              <h3 ref={counterRef}>8+</h3>
              <p>Years Of Experience</p>
              <span className="diamond"></span>
            </div>

            <div className="video-box">
              <img src={videoImg} alt="Kids Video" />
              <a
                href="https://www.youtube.com/watch?v=ScMzIvxBSi4"
                target="_blank"
                rel="noreferrer"
                className="play-btn"
              >
                ▶
              </a>
            </div>
          </div>
        </div>

        {/* ACTIVITY BOXES */}
        <div className="activity-grid">
          <div className="activity green">
            <img src={playground} alt="" />
            <h4>Play Ground</h4>
            <p>Safe outdoor play that improves physical development and social skills in children.</p>
          </div>

          <div className="activity purple">
            <img src={earlyclub} alt="" />
            <h4>Early Club</h4>
            <p>Structured early learning programs that build confidence and school readiness.</p>
          </div>

          <div className="activity pink">
            <img src={music} alt="" />
            <h4>Music Club</h4>
            <p>Music activities that enhance creativity, rhythm, and early communication skills.</p>
          </div>

          <div className="activity orange">
            <img src={lunch} alt="" />
            <h4>Lunch Club</h4>
            <p>Nutritious meal programs that support healthy growth and daily routines.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KidsActivities;
