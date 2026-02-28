import React, { useEffect, useRef, useState } from "react";
import "./Aboutfollowinstagram.css";
import { FaInstagram } from "react-icons/fa";
import API, { IMAGE_URL } from "../../Api/Api";

const CARD_WIDTH = 260; // must match CSS width + gap

const Aboutfollowinstagram = () => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const isResetting = useRef(false);

  /* ================= FETCH TEACHERS ================= */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await API.get("/teachers");

        const data = (res.data.data || []).map(item => ({
          photo: item.photo,
        }));

        setImages(data);
      } catch (err) {
        console.error("FETCH TEACHERS ERROR:", err);
      }
    };

    fetchTeachers();
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setIndex(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [images]);

  /* ================= SEAMLESS RESET ================= */
  useEffect(() => {
    if (!images.length) return;

    if (index === images.length) {
      isResetting.current = true;

      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
        }
        setIndex(0);
      }, 800);
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
  }, [index, images]);

  if (!images.length) return null;

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
          {[...images, ...images].map((item, i) => (
            <div className="Aboutfollowinstagram-card" key={i}>
              <img
                src={`${IMAGE_URL}${item.photo}`}
                alt="Instagram"
              />

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