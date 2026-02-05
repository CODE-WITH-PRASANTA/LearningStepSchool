import React, { useEffect } from "react";
import "./VMVideoHero.css";

import plane from "../../assets/vm-aeroplane.webp";
import cloud from "../../assets/vm-cloud.webp";
import tree from "../../assets/vmtree.webp";
import overlayImg from "../../assets/vm-video-bg-image-overlay.webp"; // 🔹 overlay image
import childImg from "../../assets/Preschoolbg.webp";

const VMVideoHero = () => {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach(el => observer.observe(el));
  }, []);

  return (
    <section className="vm-video-hero">
      {/* YOUTUBE BACKGROUND (NO AUTOPLAY) */}
      <iframe
        className="video-bg"
        src="https://www.youtube.com/embed/ScMzIvxBSi4?mute=1&controls=0&rel=0"
        title="Background Video"
        frameBorder="0"
        allow="fullscreen"
      />

      {/* CHILD IMAGE */}
      <img src={childImg} alt="Child" className="child-img" />

      {/* OVERLAY IMAGE */}
      <img src={overlayImg} alt="" className="overlay-img" />

      {/* FLOATING DECOR */}
      <img src={plane} alt="" className="float plane" />
      <img src={cloud} alt="" className="float cloud" />
      <img src={tree} alt="" className="float tree" />

      {/* CONTENT */}
      <div className="content">
        <a
          href="https://www.youtube.com/watch?v=ScMzIvxBSi4"
          target="_blank"
          rel="noreferrer"
          className="play-btn reveal"
        >
          ▶
        </a>

        <p className="subtitle reveal delay-1">NEED SOME HELP?</p>

        <h1 className="title reveal delay-2">
          Our <span>Preschool</span> Classes
        </h1>

        <div className="divider reveal delay-3"></div>

        <div className="actions reveal delay-4">
          <button className="admission-btn">
            ADMISSION
          </button>

          <div className="contact">
            <span className="phone-icon">📞</span>
            <div>
              <span class="icon-call-title">Call Support</span>
              <a href="tel:+1344688955" class="icon-call-number">+1 344 688 955</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VMVideoHero;
