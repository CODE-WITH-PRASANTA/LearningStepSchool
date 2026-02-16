import React, { useState } from "react";
import "./HomeGallery.css";

/* ✅ IMPORT IMAGES PROPERLY */
import img1 from "../../assets/galleryimg1.webp";
import img2 from "../../assets/galleryimg2.webp";
import img3 from "../../assets/galleryimg3.webp";
import img4 from "../../assets/galleryimg4.webp";
import img5 from "../../assets/galleryimg5.webp";
import img6 from "../../assets/galleryimg6.webp";
import img7 from "../../assets/galleryimg7.webp";

/* ✅ IMAGE ARRAY */
const images = [img1, img2, img3, img4, img5, img6, img7];

const HomeGallery = () => {
  const [activeImg, setActiveImg] = useState(null);

  return (
    <>
    <section className="gallery-section">
      {/* ===== Heading ===== */}
      <section className="gallery-heading">
        <div className="heading-badge">
          <span className="line" />
          <span className="badge-text">OUR GALLERY</span>
          <span className="line" />
        </div>

        <h2 className="main-title">
          Happy Moments at <span>Our School </span>
        </h2>

        <p className="subtitle">
          Explore real moments from Learning Step School through our gallery, showcasing student activities, classroom learning, celebrations, and a safe, child-friendly school environment.
        </p>
      </section>

      {/* ===== Auto Moving Gallery ===== */}
      <section className="auto-gallery">
        <div className="gallery-track">
          {[...images, ...images].map((img, index) => (
            <div
              className="gallery-item"
              key={index}
              onClick={() => setActiveImg(img)}
            >
              <img src={img} alt={`Gallery ${index + 1}`} loading="lazy" />
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
    </>
  );
};

export default HomeGallery;
