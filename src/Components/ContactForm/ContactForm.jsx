import React from "react";
import "./ContactForm.css";

// Assets
import ContactImg from "../../assets/Contact-video (1).webp";

const ContactForm = () => {
  return (
    <section className="contact-sec">
      <div className="contact__container">

        {/* LEFT PANEL */}
        <div className="contact__left">

          <div className="contact__info">

            {/* PHONE */}
            <div className="contact__info-item">
              <div className="contact__icon">
                📞
              </div>
              <div>
                <span>Call Us for Admissions</span>
                <h4>
                  <a href="tel:+917014627894" style={{ color: "inherit", textDecoration: "none" }}>
                    +91 70146 27894
                  </a>
                </h4>
                <h4>
                  <a href="tel:+919887868746" style={{ color: "inherit", textDecoration: "none" }}>
                    +91 98878 68746
                  </a>
                </h4>
              </div>
            </div>

            {/* EMAIL */}
            <div className="contact__info-item">
              <div className="contact__icon">
                ✉️
              </div>
              <div>
                <span>Email Address</span>
                <h4>
                  <a
                    href="mailto:learningstep19@gmail.com"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    learningstep19@gmail.com
                  </a>
                </h4>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="contact__info-item">
              <div className="contact__icon">
                📍
              </div>
              <div>
                <span>School Campus Address</span>
                <h4>Tehla Bypass, Alwar Road</h4>
                <h4>Rajgarh – 301408, Rajasthan</h4>
              </div>
            </div>

          </div>

          {/* VIDEO IMAGE */}
          <div className="contact__video">
            <img
              src={ContactImg}
              alt="LearningStep International School Campus, Rajgarh Rajasthan"
            />
            <button className="contact__play-btn">
              ▶
            </button>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div className="contact__right">
          <h2 className="contact__title">
            Connect with LearningStep International School
          </h2>

          <p className="contact__desc">
            LearningStep International School, located at Tehla Bypass, Alwar Road,
            Rajgarh, Rajasthan, offers quality education in a safe and nurturing
            environment. Contact us today for admissions, fee details, curriculum
            information, and campus visits.
          </p>

          <form className="contact__form">

            <div className="contact__form-row">
              <div className="contact__field">
                <label>Parent / Guardian Name*</label>
                <input
                  type="text"
                  placeholder="Enter Parent or Guardian Name"
                />
              </div>

            <div className="contact__field">
                <label>Phone Number*</label>
                <input
                    type="tel"
                    placeholder="Enter Phone Number"
                />
                </div>

            </div>

            <div className="contact__field">
              <label>Your Message*</label>
              <textarea
                placeholder="Write your enquiry regarding admission, fees, classes, or school facilities"
              ></textarea>
            </div>

            <button className="contact__btn">
              Send Enquiry →
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactForm;
