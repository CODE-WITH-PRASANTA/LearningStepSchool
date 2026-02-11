import React, { useState } from "react";
import "./PhotoGalleryPage.css";

// Dummy Images
import pgImg1 from "../../assets/galleryimg1.webp";
import pgImg2 from "../../assets/galleryimg2.webp";
import pgImg3 from "../../assets/galleryimg3.webp";
import pgImg4 from "../../assets/galleryimg4.webp";
import pgImg5 from "../../assets/galleryimg5.webp";
import pgImg6 from "../../assets/galleryimg6.webp";
import pgImg7 from "../../assets/galleryimg7.webp";
import pgImg8 from "../../assets/certifigate-1.webp";

const PhotoGalleryPage = () => {
  const imagesPerPage = 6;

  const pgData = [
    { id: 1, category: "news", image: pgImg1, title: "News Paper" },
    { id: 2, category: "photos", image: pgImg2, title: "Photos" },
    { id: 3, category: "photos", image: pgImg3, title: "Photos" },
    { id: 4, category: "online", image: pgImg4, title: "Online News" },
    { id: 5, category: "photos", image: pgImg5, title: "Photos" },
    { id: 6, category: "news", image: pgImg6, title: "News Paper" },
    { id: 7, category: "online", image: pgImg7, title: "Online News" },
    { id: 8, category: "photos", image: pgImg8, title: "Photos" },
  ];

  const [pgCurrentPage, setPgCurrentPage] = useState(1);
  const [pgActiveCategory, setPgActiveCategory] = useState("all");

  const pgFiltered =
    pgActiveCategory === "all"
      ? pgData
      : pgData.filter((item) => item.category === pgActiveCategory);

  const pgTotalPages = Math.ceil(pgFiltered.length / imagesPerPage);

  const pgLastIndex = pgCurrentPage * imagesPerPage;
  const pgFirstIndex = pgLastIndex - imagesPerPage;
  const pgCurrentImages = pgFiltered.slice(pgFirstIndex, pgLastIndex);

  const handlePageChange = (num) => setPgCurrentPage(num);

  const handleCategoryChange = (cat) => {
    setPgActiveCategory(cat);
    setPgCurrentPage(1);
  };

  return (
    <div className="pg-page-wrapper">

      {/* ===== Heading Section ===== */}
      <div className="pg-heading-wrapper">
        <h2 className="pg-heading-title">OUR PHOTO GALLERY</h2>
        <div className="pg-heading-underline"></div>
      </div>

      {/* ===== Filter Buttons ===== */}
      <div className="pg-filter-buttons">
        <button
          className={pgActiveCategory === "all" ? "pg-btn-active" : ""}
          onClick={() => handleCategoryChange("all")}
        >
          All Photos
        </button>

        <button
          className={pgActiveCategory === "news" ? "pg-btn-active" : ""}
          onClick={() => handleCategoryChange("news")}
        >
          News Paper
        </button>

        <button
          className={pgActiveCategory === "online" ? "pg-btn-active" : ""}
          onClick={() => handleCategoryChange("online")}
        >
          Online News
        </button>

        <button
          className={pgActiveCategory === "photos" ? "pg-btn-active" : ""}
          onClick={() => handleCategoryChange("photos")}
        >
          Photos
        </button>
      </div>

      {/* ===== Gallery Grid ===== */}
      <div className="pg-grid-container">
        {pgCurrentImages.map((item) => (
          <div className="pg-card-box" key={item.id}>
            <img src={item.image} alt="gallery" />
            <div className="pg-card-content">
              <h3>{item.title}</h3>
              <p>
                Link:{" "}
                <a
                  href="https://ouruniverse.in/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://ouruniverse.in/
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Pagination ===== */}
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

    </div>
  );
};

export default PhotoGalleryPage;
