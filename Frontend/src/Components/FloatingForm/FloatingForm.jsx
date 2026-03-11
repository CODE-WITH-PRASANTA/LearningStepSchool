import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import API, { IMAGE_URL } from "../../Api/Api";
import "./FloatingForm.css";

const FloatingForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const [ads, setAds] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    message: "",
  });

  const fetchAds = async () => {
    try {
      const res = await API.get("/advertisements/all");
      console.log(res.data.data);

      if (res.data.success) {
        const activeAds = res.data.data.filter((ad) => ad.active);
        setAds(activeAds);
      }
    } catch (error) {
      console.error("Failed to load ads");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  /* ===== Prevent slider crash when ads change ===== */

  useEffect(() => {
    if (currentAd >= ads.length) {
      setCurrentAd(0);
    }
  }, [ads]);

  /* ================= SHOW FORM AFTER 6 SECONDS ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  /* ================= AUTO SLIDE WHEN AD IS OPEN ================= */

  useEffect(() => {
    if (!showAd || ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [showAd, ads]);

  /* ================= CLOSE FORM ================= */

  const closeForm = () => {
    setShowForm(false);

    setTimeout(() => {
      setCurrentAd(0);
      setShowAd(true);
    }, 300);
  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

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

        closeForm();
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= FLOATING FORM ================= */}

      {showForm && (
        <div className="floatingform-overlay fade-in">
          <div className="floatingform-container scale-in">
            <button className="floatingform-close" onClick={closeForm}>
              ×
            </button>

            <div className="floatingform-header">
              <h2>Learning Step International School</h2>
              <span>Admission & Enquiry Form</span>
            </div>

            <div className="floatingform-info">
              <p>
                Give your child the best start in life. Fill in the form below
                and our team will reach out shortly.
              </p>
            </div>

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
                placeholder="Message"
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

            <div className="floatingform-divider">
              <span>OR</span>
            </div>

            <div className="floatingform-actions">
              <a href="tel:7014627894" className="floatingform-action call">
                <FaPhoneAlt /> Call Us
              </a>

              <a
                href="https://wa.me/919887868746"
                target="_blank"
                rel="noopener noreferrer"
                className="floatingform-action whatsapp"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADVERTISEMENT SLIDER ================= */}

      {showAd && ads.length > 0 && (
        <div className="ad-overlay fade-in">
          <div className="ad-container scale-in">
            <button className="ad-close" onClick={() => setShowAd(false)}>
              ✕
            </button>

            <img
              src={`${IMAGE_URL}/${ads[currentAd]?.image?.replace(/^\/+/, "")}`}
              alt="Advertisement"
              className="ad-image"
            />
            <div className="ad-controls">
              <button
                onClick={() =>
                  setCurrentAd((prev) =>
                    prev === 0 ? ads.length - 1 : prev - 1,
                  )
                }
              >
                ❮
              </button>

              <button
                onClick={() =>
                  setCurrentAd((prev) =>
                    prev === ads.length - 1 ? 0 : prev + 1,
                  )
                }
              >
                ❯
              </button>
            </div>

            <div className="ad-dots">
              {ads.map((_, index) => (
                <span
                  key={index}
                  className={index === currentAd ? "active-dot" : ""}
                  onClick={() => setCurrentAd(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingForm;
