import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./BlogSlider.css";
import API, { IMAGE_URL } from "../../Api/Api";

const VISIBLE = 3;

export default function BlogSlider() {
  const [blogs, setBlogs] = useState([]);
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const intervalRef = useRef(null);

  /* ================= FETCH BLOGS ================= */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs?limit=9");
        setBlogs(res.data.data || []);
      } catch (err) {
        console.error("FETCH BLOGS ERROR:", err);
      }
    };

    fetchBlogs();
  }, []);

  const total = blogs.length;

  /* ================= EXTENDED SLIDES ================= */
  const extendedSlides =
    total > VISIBLE
      ? [...blogs, ...blogs.slice(0, VISIBLE)]
      : blogs;

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (total <= VISIBLE) return;

    startAutoPlay();
    return stopAutoPlay;
  }, [blogs]);

  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3500);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  /* ================= RESET LOOP ================= */
  useEffect(() => {
    if (total <= VISIBLE) return;

    if (index === total) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(0);
      }, 700);
    } else {
      setIsAnimating(true);
    }
  }, [index, total]);

  if (!blogs.length) return null;

  return (
    <section className="blog-slider-section">
      <div className="blog-slider-wrapper">

        <div
          className="slider-window"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          <div
            className={`slider-track ${!isAnimating ? "no-transition" : ""}`}
            style={{
              transform: `translateX(-${(index * 100) / VISIBLE}%)`,
            }}
          >
            {extendedSlides.map((item, i) => (
              <div className="slide" key={i}>
                <div className="blog-card">

                  <div className="blog-img-wrap">
                    <span className="tag">
                      {item.category || "Blog"}
                    </span>

                    {item.image && (
                      <img
                        src={`${IMAGE_URL}${item.image}`}
                        alt={item.title}
                      />
                    )}
                  </div>

                  <div className="blog-meta">
                    <span>
                      📅 {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      👤 By {item.author || "Admin"}
                    </span>
                  </div>

                  <h3>{item.title}</h3>

                  {/* ✅ PARAM ROUTE FIXED HERE */}
                  <Link
                    to={`/blog/details/${item._id}`}
                    className="read-more"
                  >
                    Read More →
                  </Link>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        {total > 1 && (
          <div className="pagination-wrap">
            <span className="line" />
            <div className="dots">
              {blogs.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${
                    index % total === i ? "active" : ""
                  }`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <span className="line" />
          </div>
        )}

      </div>
    </section>
  );
}