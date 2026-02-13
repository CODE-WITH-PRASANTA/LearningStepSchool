import React, { useState } from "react";
import "./VideoGallery.css";

const videos = [
  {
    id: 1,
    title: "Science की ऐसी अनोखी Theory",
    url: "https://www.youtube.com/embed/VIDEO_ID_1",
  },
  {
    id: 2,
    title: "Universe Secrets Explained",
    url: "https://www.youtube.com/embed/VIDEO_ID_2",
  },
  {
    id: 3,
    title: "Why Time Never Stops",
    url: "https://www.youtube.com/embed/VIDEO_ID_3",
  },
];

const VideoGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="video-gallery">
      <h2 className="gallery-title">
        VIDEO GALLERY <span></span>
      </h2>

      <div className="video-container">
        <iframe
          src={videos[currentIndex].url}
          title={videos[currentIndex].title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Prev / Next Buttons */}
        <button className="nav-btn prev" onClick={handlePrev}>
          ❮
        </button>
        <button className="nav-btn next" onClick={handleNext}>
          ❯
        </button>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePrev}>Prev</button>

        {videos.map((_, index) => (
          <button
            key={index}
            className={currentIndex === index ? "active" : ""}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}
          </button>
        ))}

        <button onClick={handleNext}>Next</button>
      </div>
    </section>
  );
};

export default VideoGallery;
