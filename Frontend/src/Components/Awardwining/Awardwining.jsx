import React, { useEffect, useRef, useState } from "react";
import API, { IMAGE_URL } from "../../Api/Api";
import "./Awardwining.css";

const AwardWinning = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH AWARDS ================= */
  const fetchAwards = async () => {
    try {
      const res = await API.get("/awards");
      setCertificates(res.data.data || res.data || []);
    } catch (err) {
      console.error("FETCH AWARDS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  /* ================= SLIDER LOGIC ================= */

  const visibleCards = 3;
  const total = certificates.length;

  const slides =
    total > 0
      ? [
          ...certificates.slice(-visibleCards),
          ...certificates,
          ...certificates.slice(0, visibleCards),
        ]
      : [];

  const [index, setIndex] = useState(visibleCards);
  const trackRef = useRef(null);
  const isAnimating = useRef(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const enableTransition = () => {
    if (trackRef.current) {
      trackRef.current.style.transition =
        "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    }
  };

  const disableTransition = () => {
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
  };

  const nextSlide = () => {
    if (isAnimating.current || total === 0) return;
    isAnimating.current = true;
    enableTransition();
    setIndex((prev) => prev + 1);
    setActiveSlide((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    if (isAnimating.current || total === 0) return;
    isAnimating.current = true;
    enableTransition();
    setIndex((prev) => prev - 1);
    setActiveSlide((prev) => (prev - 1 + total) % total);
  };

  const handleTransitionEnd = () => {
    isAnimating.current = false;

    if (index === total + visibleCards) {
      disableTransition();
      setIndex(visibleCards);
      setActiveSlide(0);
    }

    if (index === 0) {
      disableTransition();
      setIndex(total);
      setActiveSlide(total - 1);
    }
  };

  useEffect(() => {
    if (total === 0) return;

    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [total]);

  if (loading) return null;
  if (certificates.length === 0) return null;

  return (
    <section className="Awardwining-section">
      <div className="Awardwining-container">

        {/* ================= HEADER ================= */}
        <div className="Awardwining-header">
          <div className="Awardwining-label">
            <span className="Awardwining-label-line"></span>
            <span className="Awardwining-label-text">
              Accolades & Recognition
            </span>
          </div>
          <h2 className="Awardwining-title">
            Award-
            <span className="Awardwining-highlight">Winning</span> Excellence
          </h2>
          <p className="Awardwining-subtitle">
            Recognized for innovation and impact in education technology
          </p>
        </div>

        {/* ================= MARQUEE ================= */}
        <div className="Awardwining-marquee-container">
          <div className="Awardwining-marquee-wrapper">
            <div className="Awardwining-marquee-track">
              {[...certificates, ...certificates].map((c, i) => (
                <div className="Awardwining-marquee-item" key={i}>
                  <span className="Awardwining-marquee-star">✦</span>
                  <span className="Awardwining-marquee-text">
                    {c.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SLIDER ================= */}
        <div className="Awardwining-slider-wrapper">
          <div
            className="Awardwining-slider-track"
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {slides.map((cert, i) => (
              <div className="Awardwining-slide" key={i}>
                <div className="Awardwining-certificate-card">
                  <div className="Awardwining-certificate-image">
                    <img
                      src={IMAGE_URL + cert.image}
                      alt={cert.title}
                    />
                  </div>
                  <div className="Awardwining-certificate-info">
                    <h4 className="Awardwining-certificate-title">
                      {cert.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AwardWinning;