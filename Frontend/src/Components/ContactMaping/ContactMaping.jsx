import React from "react";
import "./ContactMaping.css";

const ContactMaping = () => {
  return (
    <section className="contact-map">
      <div className="contact-map__container">

        {/* Section Heading */}
        <div className="contact-map__header">
          <h2 className="contact-map__title">
            LearningStep International School
          </h2>
          <p className="contact-map__subtitle">
            Tehla Bypass, Alwar Road, Rajgarh, Rajasthan – 301408
          </p>
        </div>

        {/* Map Area */}
        <div className="contact-map__area">

          {/* Overlay Card */}
          <div className="contact-map__overlay">
            <h3 className="contact-map__overlay-title">
              LearningStep International School
            </h3>
            <p className="contact-map__overlay-address">
              Tehla Bypass, Alwar Road<br />
              Rajgarh, Rajasthan – 301408
            </p>
          </div>

          {/* Google Map */}
          <iframe
            className="contact-map__iframe"
            title="LearningStep International School Location"
            src="https://www.google.com/maps?q=Tehla%20Bypass,%20Alwar%20Road,%20Rajgarh,%20Rajasthan%20301408&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

        </div>

      </div>
    </section>
  );
};

export default ContactMaping;
