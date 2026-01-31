import React from "react";
import { Link } from "react-router-dom";
import "./sectionArea1.css";

// ✅ Import your image from assets
//import eventImage from "../../assets/event-icon.png"; // <-- change the filename as per your image name

const SectionArea1 = () => {
  return (
    <>
      {/* ===== TOP TITLE ===== */}
      <section className="events-header">
        <h2>OUR EVENTS</h2>
        <p>At Learning Step International School, we organize engaging school events that encourage creativity, confidence, and social development. Our events provide children with opportunities to express themselves, participate in group activities, and build meaningful connections in a joyful learning environment.</p>
        <div className="ztl-divider">
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
              <p>We’re Here to Support Parents Every Step of the Way</p>
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

