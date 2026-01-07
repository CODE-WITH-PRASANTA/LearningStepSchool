import React from "react";
import { Link } from "react-router-dom";
import "./SectionArea1.css";

// ✅ Import your image from assets
//import eventImage from "../../assets/event-icon.png"; // <-- change the filename as per your image name

const SectionArea1 = () => {
  return (
    <>
      {/* ===== TOP TITLE ===== */}
      <section className="events-header">
        <h2>OUR EVENTS</h2>
        <p>We do all the work, you get all the credit</p>
        <div className="divider">
          <span></span>
        </div>
      </section>

      {/* ===== CTA BAR ===== */}
      <section className="cta-bar">
        <div className="cta-content">
          <div className="cta-left">
            {/* ✅ Replace icon with image 
            <div className="cta-image">
              <img src={eventImage} alt="Find out more" />
            </div>*/}

            <div>
              <h3>FIND OUT MORE</h3>
              <p>We'll be happy to answer any questions</p>
            </div>
          </div>

          <Link to="/contact" className="cta-button">
            CONTACT US
          </Link>
        </div>
      </section>
    </>
  );
};

export default SectionArea1;

