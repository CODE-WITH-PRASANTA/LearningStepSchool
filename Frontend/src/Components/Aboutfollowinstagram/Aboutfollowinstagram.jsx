import React, { useEffect, useRef, useState } from "react";
import "./Aboutfollowinstagram.css";
import { FaInstagram } from "react-icons/fa";

// IMAGES
import img1 from "../../assets/ab.webp";
import img2 from "../../assets/aj.webp";
import img3 from "../../assets/ac.webp";
import img4 from "../../assets/ad.webp";
import img5 from "../../assets/ae.webp";
import img6 from "../../assets/af.webp";

const images = [img1, img2, img3, img4, img5, img6];

const CARD_WIDTH = 260; // must match CSS width + gap

const Aboutfollowinstagram = () => {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const isResetting = useRef(false);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // SEAMLESS RESET (NO JUMP)
  useEffect(() => {
    if (index === images.length) {
      isResetting.current = true;

      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
        }
        setIndex(0);
      }, 800); // must match transition duration
    }

    if (index === 0 && isResetting.current) {
      requestAnimationFrame(() => {
        if (trackRef.current) {
          trackRef.current.style.transition =
            "transform 0.8s cubic-bezier(0.4,0,0.2,1)";
        }
        isResetting.current = false;
      });
    }
  }, [index]);

  return (
    <section className="Aboutfollowinstagram-section">
      {/* HEADER */}
      <div className="Aboutfollowinstagram-header">
        <span></span>
        <h3>Follow Instagram</h3>
        <span></span>
      </div>

      {/* SLIDER */}
      <div className="Aboutfollowinstagram-slider">
        <div
          ref={trackRef}
          className="Aboutfollowinstagram-track"
          style={{
            transform: `translateX(-${index * CARD_WIDTH}px)`,
          }}
        >
          {[...images, ...images].map((img, i) => (
            <div className="Aboutfollowinstagram-card" key={i}>
              <img src={img} alt="Instagram" />

              {/* HOVER EFFECT */}
              <div className="Aboutfollowinstagram-hover">
                <div className="Aboutfollowinstagram-icon">
                  <FaInstagram />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutfollowinstagram;
