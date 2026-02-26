import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import API from "../../Api/Api"; // ✅ use your axios instance
import "./FloatingForm.css";

const FloatingForm = () => {
  const [floatingformVisible, setFloatingformVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    message: "",
  });

  /* ================= SHOW AFTER 4 SECONDS ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setFloatingformVisible(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  /* ================= CLOSE ================= */
  const floatingformClose = () => {
    setFloatingformVisible(false);
  };

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers in phone field
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  /* ================= SUBMIT ================= */
  const floatingformSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/enquiries", formData);

      if (res.data.success) {
        alert("Thank you! Our admission team will contact you shortly.");

        setFormData({
          name: "",
          address: "",
          phone: "",
          message: "",
        });

        setFloatingformVisible(false);
      }
    } catch (error) {
      console.error("ENQUIRY ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <h2>Learning Step International School</h2>
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="floatingform-input"
            placeholder="Parent / Student Name"
            required
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="floatingform-input"
            placeholder="Address / City"
            required
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="floatingform-input"
            placeholder="Phone Number"
            maxLength="10"
            required
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="floatingform-textarea"
            rows="3"
            placeholder="Message (Class, Admission Query, etc.)"
            required
          />

          <button
            type="submit"
            className="floatingform-submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
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