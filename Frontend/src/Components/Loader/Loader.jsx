import React from "react";
import "./Loader.css";

const PageLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="pyramid-loader">
          <div className="wrapper">
            <span className="side side1"></span>
            <span className="side side2"></span>
            <span className="side side3"></span>
            <span className="side side4"></span>
            <span className="shadow"></span>
          </div>
        </div>

        <h1 className="school-name">
          LearningStep <span>International School</span>
        </h1>

        <p className="tagline">
          Empowering Young Minds for a Brighter Tomorrow
        </p>
      </div>
    </div>
  );
};

export default PageLoader;