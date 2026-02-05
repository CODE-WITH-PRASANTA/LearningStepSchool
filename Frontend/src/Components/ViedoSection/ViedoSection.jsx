import React, { useState } from "react";
import "./ViedoSection.css";
import { FaPlay } from "react-icons/fa";
import backgroundImage from "../../assets/apply.jpg"; // ✅ Your background image

export default function ViedoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="video-section">
      <div
        className="video-wrapper"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Play Button */}
        {!isPlaying && (
          <div
            className="play-button"
            onClick={() => setIsPlaying(true)}
            role="button"
          >
            <FaPlay />
          </div>
        )}

        {/* Video Popup Modal */}
        {isPlaying && (
          <div className="video-overlay">
            <div className="video-popup" onClick={(e) => e.stopPropagation()}>
              {/* ✅ Exit Button */}
              <button
                className="close-video-btn"
                onClick={() => setIsPlaying(false)}
              >
                <IoClose />
              </button>

              <div className="player-wrapper">
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=ckHzmP1evNU"
                  className="react-player"
                  title="Intro Video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  playing={isPlaying}
                  config={{
                    youtube: {
                      playerVars: {
                        autoplay: 1,
                        rel: 0,
                        modestbranding: 1,
                        playsinline: 1,
                      },
                    },
                  }}
                  onReady={() => console.log("Player ready")}
                  onPlay={() => console.log("Playing")}
                  onError={(e) =>
                    console.error("ReactPlayer error:", e)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
