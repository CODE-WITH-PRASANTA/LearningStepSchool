import React from 'react'
import './WhyChooseUsAdmission.css'

// Images
import childImg from "../../assets/rg-1.webp";
import formBg from "../../assets/rg-2.webp";
import plane from "../../assets/vs-1.webp";
import bee from "../../assets/vs-2.webp";
import dots from "../../assets/vs-3.webp";



const WhyChooseUsAdmission = () => {
  return (
    <div>
        <section className="admission">
      <div className="admission-container">
        
        {/* LEFT IMAGE */}
        <div className="admission-left">
          <img src={childImg} alt="Child" />
        </div>

        {/* RIGHT FORM */}
        <div
          className="admission-right"
          style={{ backgroundImage: `url(${formBg})` }}
        >
          {/* Floating Icons */}
          <img src={plane} className="float plane" alt="plane" />
          <img src={bee} className="float bee" alt="bee" />
          <img src={dots} className="float dots" alt="dots" />

          <span className="admission-tag">ADMISSION</span>
          <h2>
            Apply For <span>Admission</span>
          </h2>

          <form className="admission-form">
            <input type="text" placeholder="Child's Name" />
            <input type="text" placeholder="mm / dd / yyyy" />
            <input type="text" placeholder="Parent Name" />
            <input type="text" placeholder="Grade Level" />
            <input type="text" placeholder="Parent's Address" />
            <input type="email" placeholder="Your Email" />
            <input type="tel" placeholder="Phone No" />

            <label className="checkbox">
              <input type="checkbox" />
              Notify Your Child Weekly Progress
            </label>

           <button type="submit">
  <span>APPLY NOW</span>
</button>

          </form>
        </div>

      </div>
    </section>
    </div>
  )
}

export default WhyChooseUsAdmission