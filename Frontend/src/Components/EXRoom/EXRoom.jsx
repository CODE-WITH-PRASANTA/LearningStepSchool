import React from "react";
import "./EXRoom.css";

// Images
import childImg from "../../assets/a-2.webp";
import bgImg from "../../assets/room-bg.webp"; // ✅ BACKGROUND IMPORT

// Icons
import playgroundIcon from "../../assets/home.webp";
import bagIcon from "../../assets/bag.webp";
import micIcon from "../../assets/mic.webp";
import lunchIcon from "../../assets/tea.webp";

const KidsActivities = () => {
  return (
    <section
      className="ka-section"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="ka-container">
        {/* LEFT CONTENT */}
        <div className="ka-left">
          <span className="ka-subtitle">INTRODUCING PLAYROOM</span>
          <h2 className="ka-title">
            Kids Activities And <br /> Fun
          </h2>
          <p className="ka-desc">
            Pre-School Has Open Doors A Offer Constantly Expanding
            Children Our Goal Is To Carefully Educate.
          </p>
        </div>

        {/* RIGHT CONTENT */}
        <div className="ka-right">
          <div className="ka-experience">
            <h3>20+</h3>
            <p>Years Of Experience</p>
            <span className="ka-diamond"></span>
          </div>

          <div className="ka-video">
            <img src={childImg} alt="Child Activity" />
            <button className="ka-play">▶</button>
          </div>
        </div>
      </div>

      {/* ACTIVITY CARDS */}
      <div className="ka-cards">
        <div className="ka-card green">
          <img src={playgroundIcon} alt="Play Ground" />
          <h4>Play Ground</h4>
          <p>Pre-School Has Open Doors Constantly Expand</p>
        </div>

        <div className="ka-card purple">
          <img src={bagIcon} alt="Early Club" />
          <h4>Early Club</h4>
          <p>Pre-School Has Open Doors Constantly Expand</p>
        </div>

        <div className="ka-card pink">
          <img src={micIcon} alt="Music Club" />
          <h4>Music Club</h4>
          <p>Pre-School Has Open Doors Constantly Expand</p>
        </div>

        <div className="ka-card orange">
          <img src={lunchIcon} alt="Lunch Club" />
          <h4>Lunch Club</h4>
          <p>Pre-School Has Open Doors Constantly Expand</p>
        </div>
      </div>
    </section>
  );
};

export default KidsActivities;
