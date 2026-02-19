import React, { useEffect, useState } from "react";
import API from "../../Api/Api";
import "./VideoGallery.css";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH VIDEOS ================= */
  const fetchVideos = async () => {
    try {
      const res = await API.get("/video-gallery");
      setVideos(res.data || []);
    } catch (err) {
      console.error("FETCH VIDEO ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  /* ================= SLIDER ================= */

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? videos.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === videos.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <section className="video-gallery">
        <h2 className="gallery-title">VIDEO GALLERY</h2>
        <p>Loading videos...</p>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="video-gallery">
        <h2 className="gallery-title">VIDEO GALLERY</h2>
        <p>No videos available</p>
      </section>
    );
  }

  return (
    <section className="video-gallery">
      <h2 className="gallery-title">
        VIDEO GALLERY <span></span>
      </h2>

      <div className="video-container">
        <iframe
          src={videos[currentIndex].videoUrl}   
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

        {videos.map((video, index) => (
          <button
            key={video._id}
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