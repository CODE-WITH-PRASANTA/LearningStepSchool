import React from "react";
import "./PrimeryFeature.css";

import ageIcon from "../../assets/children.png";
import daysIcon from "../../assets/calendar.png";
import timeIcon from "../../assets/clock.png";
import classIcon from "../../assets/classroom.png";

export default function PrimeryFeature() {
  return (
    <div className="primery-feature">
      <div className="primery-feature__card highlight">
        <div className="primery-feature__icon bg-green">
          <img src={ageIcon} alt="Age" />
        </div>
        <h4>2–2.5 years</h4>
        <p>age</p>
      </div>

      <div className="primery-feature__card highlight">
        <div className="primery-feature__icon bg-orange">
          <img src={daysIcon} alt="Days" />
        </div>
        <h4>5 Days</h4>
        <p>weekly</p>
      </div>

      <div className="primery-feature__card highlight">
        <div className="primery-feature__icon bg-teal">
          <img src={timeIcon} alt="Time" />
        </div>
        <h4>3.30 Hrs</h4>
        <p>period</p>
      </div>

      <div className="primery-feature__card highlight">
        <div className="primery-feature__icon bg-pink">
          <img src={classIcon} alt="Class Size" />
        </div>
        <h4>Class Size</h4>
        <p>24</p>
      </div>
    </div>
  );
}
