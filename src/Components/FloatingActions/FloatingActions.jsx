import React, { useState, useEffect, useRef } from "react";
import { FaPhoneAlt, FaWhatsapp, FaComments } from "react-icons/fa";
import "./FloatingActions.css";

const FloatingActions = () => {
  const [open, setOpen] = useState(false);
  const userInteracted = useRef(false);

  useEffect(() => {
    // AUTO OPEN after 3.5 sec
    const openTimer = setTimeout(() => {
      if (!userInteracted.current) {
        setOpen(true);
      }
    }, 3500);

    // AUTO CLOSE after 8 sec
    const closeTimer = setTimeout(() => {
      if (!userInteracted.current) {
        setOpen(false);
      }
    }, 8000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleToggle = () => {
    userInteracted.current = true;
    setOpen((prev) => !prev);
  };

  const stopAuto = () => {
    userInteracted.current = true;
  };

  return (
    <div className={`floating-actions ${open ? "open" : ""}`}>
      {/* 📞 Call */}
      <a
        href="tel:7014627894"
        className="floating-btn call-btn"
        onClick={stopAuto}
        aria-label="Call Us"
      >
        <FaPhoneAlt />
        <span className="label">Call: 7014627894</span>
      </a>

      {/* 💬 WhatsApp */}
      <a
        href="https://wa.me/919887868746?text=Hello%20!%20Learning%20Step%20International%20School"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn whatsapp-btn"
        onClick={stopAuto}
        aria-label="WhatsApp Chat"
      >
        <FaWhatsapp />
        <span className="label">WhatsApp: 9887868746</span>
      </a>

      {/* 🔘 Toggle */}
      <button
        className="floating-btn toggle-btn"
        onClick={handleToggle}
        aria-label="Toggle Actions"
      >
        <FaComments />
      </button>
    </div>
  );
};

export default FloatingActions;
