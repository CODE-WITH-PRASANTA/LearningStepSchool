import React, { useState, useRef, useEffect } from "react";
import "./HomeClasses.css";
import API, { IMAGE_URL } from "../../Api/Api";

import Homeclsbg from "../../assets/clases-bg.webp";
import waveimg from "../../assets/clases-top-shape.webp";

const getCardsPerView = () => {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
};

const HomeClasses = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());
  const startX = useRef(0);

  /* ================= FETCH FROM BACKEND ================= */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/class-data");
        setData(res.data.data || []);
      } catch (err) {
        console.error("FETCH CLASS DATA ERROR:", err);
      }
    };

    fetchClasses();
  }, []);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
      setPage(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data.length) return null;

  const TOTAL_PAGES = Math.ceil(data.length / cardsPerView);

  /* ================= TOUCH SWIPE ================= */
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50 && page < TOTAL_PAGES - 1) setPage(page + 1);
    if (diff < -50 && page > 0) setPage(page - 1);
  };

  return (
    <>
      <div className="homeclasses-wave">
        <img src={waveimg} alt="wave" />
      </div>

      <section
        className="homeclasses"
        style={{ backgroundImage: `url(${Homeclsbg})` }}
      >
        <div className="homeclasses-container">
          <div className="homeclasses-header">
            <span className="homeclasses-subtitle">
              Learning Step International School
            </span>

            <h2 className="homeclasses-title">
              Building Strong Foundations <br />
              For Every Child’s Future
            </h2>
          </div>

          <div className="homeclasses-slider">
            <div
              className="homeclasses-track"
              style={{
                width: `${TOTAL_PAGES * 100}%`,
                transform: `translateX(-${page * (100 / TOTAL_PAGES)}%)`,
              }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {Array.from({ length: TOTAL_PAGES }).map((_, pageIndex) => (
                <div className="homeclasses-page" key={pageIndex}>
                  {data
                    .slice(
                      pageIndex * cardsPerView,
                      pageIndex * cardsPerView + cardsPerView
                    )
                    .map((item) => (
                      <div className="homeclasses-card" key={item._id}>
                        <img
                          src={`${IMAGE_URL}${item.image}`}
                          alt={item.title}
                        />

                        <h4>{item.title}</h4>
                        <p>{item.description}</p>

                        <div className="homeclasses-meta">
                          <div>
                            <span>Age</span>
                            <strong>{item.age} Years</strong>
                          </div>
                          <div>
                            <span>Weekly</span>
                            <strong>{item.weekly}</strong>
                          </div>
                          <div>
                            <span>Time</span>
                            <strong>{item.timeManagement}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <div className="homeclasses-pagination">
            {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
              <span
                key={i}
                className={`pagination-dot ${i === page ? "active" : ""}`}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeClasses;