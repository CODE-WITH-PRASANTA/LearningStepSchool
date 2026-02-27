import React, { useEffect, useState } from "react";
import "./HomeGallery.css";
import API, { IMAGE_URL } from "../../Api/Api";

const HomeGallery = () => {
  const [images, setImages] = useState([]);
  const [activeImg, setActiveImg] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FROM BACKEND ================= */
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await API.get("/photo-gallery");

        const formatted =
          (res.data.data || []).map((item) => ({
            id: item._id,
            image: IMAGE_URL + item.image,
            title: item.title,
          })) || [];

        setImages(formatted);
      } catch (error) {
        console.error("FETCH GALLERY ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) return null;
  if (!images.length) return null;

  return (
    <section className="gallery-section">
      {/* ===== Heading ===== */}
      <section className="gallery-heading">
        <div className="heading-badge">
          <span className="line" />
          <span className="badge-text">OUR GALLERY</span>
          <span className="line" />
        </div>

        <h2 className="main-title">
          Happy Moments at <span>Our School</span>
        </h2>

        <p className="subtitle">
          Explore real moments from Learning Step School through our gallery,
          showcasing student activities, classroom learning, celebrations,
          and a safe, child-friendly school environment.
        </p>
      </section>

      {/* ===== Auto Moving Gallery ===== */}
      <section className="auto-gallery">
        <div className="gallery-track">
          {[...images, ...images].map((img, index) => (
            <div
              className="gallery-item"
              key={index}
              onClick={() => setActiveImg(img.image)}
            >
              <img
                src={img.image}
                alt={img.title || `Gallery ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ===== Image Modal ===== */}
      {activeImg && (
        <div className="gallery-modal" onClick={() => setActiveImg(null)}>
          <span className="close-btn">&times;</span>
          <img src={activeImg} alt="Preview" />
        </div>
      )}
    </section>
  );
};

export default HomeGallery;