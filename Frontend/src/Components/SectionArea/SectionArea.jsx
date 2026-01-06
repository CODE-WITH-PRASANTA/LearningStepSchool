import React from "react";
import "./SectionArea.css";

const SectionArea = () => {
  return (
    <section className="enfant-school">
      {/* ===== TOP HEADING ===== */}
      <div className="enfant-header">
        <h2>Learning Step</h2>
        <p>
          We want children at Enfant to learn, to lead and to make a difference
        </p>
        <div className="divider">
          <span></span>
        </div>
      </div>

      {/* ===== CONTENT GRID ===== */}
      <div className="enfant-content">
        {/* LEFT COLUMN */}
        <div className="left">
          <h3>OUR HISTORY</h3>
          <h4>QUALITY CHILDREN EDUCATION</h4>

          <p>
            Alterum accommodare duo cu. Ius labore luptatum efficiendi ex,
            ne vim enim rebum honestatis, ad his consulatu pertinacia
            deterruisset. Te bonorum ancillae nec. Mea errem alterum in,
            harum iudico vel et, nec atqui propriae id.
          </p>

          <p>
            Alterum accommodare duo cu. Ius labore luptatum efficiendi ex,
            ne vim enim rebum honestatis, ad his consulatu pertinacia
            deterruisset. Te bonorum ancillae nec. Mea errem alterum in,
            harum iudico vel et, nec atqui propriae id.
          </p>

          <ul className="check-list">
            <li>Learning program with after-school</li>
            <li>Positive learning environment</li>
            <li>Learning through play</li>
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right">
          <h3>SCHOOL FEATURES</h3>
          <h4>POPULAR EDUCATION FOR YOUR CHILD</h4>

          <div className="Infrastructure-feature open">
            <span className="symbol">−</span>
            <strong>Award for Best School 2017</strong>
            <p>
              Alterum accommodare duo cu. Ius labore luptatum efficiendi ex,
              ne vim enim rebum honestatis, ad his consulatu pertinacia
              deterruisset. Te bonorum ancillae nec.
            </p>
          </div>

          <div className="Infrastructure-feature">
            <span className="symbol">+</span>
            <span>Great Facilities at Enfant</span>
          </div>

          <div className="Infrastructure-feature">
            <span className="symbol">+</span>
            <span>Writing and Reading Classes</span>
          </div>

          <div className="Infrastructure-feature">
            <span className="symbol">+</span>
            <span>Individual Attention in Small Classes</span>
          </div>

          <div className="Infrastructure-feature">
            <span className="symbol">+</span>
            <span>Positive Learning Environment</span>
          </div>

          <div className="Infrastructure-feature">
            <span className="symbol">+</span>
            <span>Opportunities to Scientific Experiments</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionArea;
