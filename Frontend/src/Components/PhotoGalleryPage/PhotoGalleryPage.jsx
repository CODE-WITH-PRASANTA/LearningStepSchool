import React, { useState, useEffect, useMemo } from "react";
import API, { IMAGE_URL } from "../../Api/Api";
import "./PhotoGalleryPage.css";

const PhotoGalleryPage = () => {
  const imagesPerPage = 6;

  const [photos, setPhotos] = useState([]);
  const [pgCurrentPage, setPgCurrentPage] = useState(1);
  const [pgActiveCategory, setPgActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PHOTOS ================= */
  const fetchPhotos = async () => {
    try {
      const res = await API.get("/photo-gallery");
      setPhotos(res.data?.data || res.data || []);
    } catch (err) {
      console.error("FETCH PHOTO ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  /* ================= GET UNIQUE CATEGORIES ================= */
  const categories = useMemo(() => {
    const unique = [...new Set(photos.map((p) => p.category).filter(Boolean))];
    return ["all", ...unique];
  }, [photos]);

  /* ================= FILTER ================= */
  const pgFiltered =
    pgActiveCategory === "all"
      ? photos
      : photos.filter((item) => item.category === pgActiveCategory);

  const pgTotalPages = Math.ceil(pgFiltered.length / imagesPerPage);

  const pgLastIndex = pgCurrentPage * imagesPerPage;
  const pgFirstIndex = pgLastIndex - imagesPerPage;
  const pgCurrentImages = pgFiltered.slice(pgFirstIndex, pgLastIndex);

  const handlePageChange = (num) => setPgCurrentPage(num);

  const handleCategoryChange = (cat) => {
    setPgActiveCategory(cat);
    setPgCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="pg-page-wrapper">
        <h2 className="pg-heading-title">Loading Photos...</h2>
      </div>
    );
  }

  return (
    <div className="pg-page-wrapper">

      {/* ===== Heading ===== */}
      <div className="pg-heading-wrapper">
        <h2 className="pg-heading-title">OUR PHOTO GALLERY</h2>
        <div className="pg-heading-underline"></div>
      </div>

      {/* ===== Dynamic Filter Buttons ===== */}
      <div className="pg-filter-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={pgActiveCategory === cat ? "pg-btn-active" : ""}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat === "all"
              ? "All Photos"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* ===== Gallery Grid ===== */}
      <div className="pg-grid-container">
        {pgCurrentImages.length === 0 ? (
          <div className="pg-empty">
            <p>No photos available in this category</p>
          </div>
        ) : (
          pgCurrentImages.map((item) => (
            <div className="pg-card-box" key={item._id}>
              {item.image && (
                <img
                  src={IMAGE_URL + item.image}
                  alt={item.title}
                />
              )}

              <div className="pg-card-content">
                <h3>{item.title}</h3>

                {item.link && (
                  <p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Link →
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== Pagination ===== */}
      {pgTotalPages > 1 && (
        <div className="pg-pagination-area">
          <button
            disabled={pgCurrentPage === 1}
            onClick={() => handlePageChange(pgCurrentPage - 1)}
          >
            Prev
          </button>

          {[...Array(pgTotalPages)].map((_, index) => (
            <button
              key={index}
              className={
                pgCurrentPage === index + 1 ? "pg-page-active" : ""
              }
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={pgCurrentPage === pgTotalPages}
            onClick={() => handlePageChange(pgCurrentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default PhotoGalleryPage;