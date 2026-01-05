import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import "./FloatingForm.css";

const FloatingForm = () => {
  const [floatingformVisible, setFloatingformVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFloatingformVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const floatingformClose = () => {
    setFloatingformVisible(false);
  };

  const floatingformSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Our admission team will contact you shortly.");
    setFloatingformVisible(false);
  };

  if (!floatingformVisible) return null;

  return (
    <div className="floatingform-overlay">
      <div className="floatingform-container">
        <button className="floatingform-close" onClick={floatingformClose}>
          ×
        </button>

        {/* Header */}
        <div className="floatingform-header">
          <h2>Learning Step School</h2>
          <span>Admission & Enquiry Form</span>
        </div>

        {/* Info */}
        <div className="floatingform-info">
          <p>
            Give your child the best start in life.  
            Fill in the form below and our team will reach out to you shortly.
          </p>
        </div>

        {/* Form */}
        <form className="floatingform-form" onSubmit={floatingformSubmit}>
          <input
            type="text"
            className="floatingform-input"
            placeholder="Parent / Student Name"
            required
          />
          <input
            type="text"
            className="floatingform-input"
            placeholder="Address / City"
            required
          />
          <input
            type="tel"
            className="floatingform-input"
            placeholder="Phone Number"
            maxLength="10"
            required
          />
          <textarea
            className="floatingform-textarea"
            rows="3"
            placeholder="Message (Class, Admission Query, etc.)"
            required
          />

          <button type="submit" className="floatingform-submit">
            Submit Enquiry
          </button>
        </form>

        {/* Divider */}
        <div className="floatingform-divider">
          <span>OR</span>
        </div>

        {/* Quick Contact */}
        <div className="floatingform-actions">
          <a href="tel:7014627894" className="floatingform-action call">
            <FaPhoneAlt /> Call Us
          </a>

          <a
            href="https://wa.me/919887868746?text=Hello%20!%20Learning%20Step%20International%20School"
            target="_blank"
            rel="noopener noreferrer"
            className="floatingform-action whatsapp"
          >
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default FloatingForm;
