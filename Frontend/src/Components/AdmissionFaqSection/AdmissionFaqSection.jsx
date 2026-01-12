import React, { useEffect, useState } from "react";
import "./AdmissionFaqSection.css";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const faqData = [
  {
    question: "How Can I Apply?",
    answer:
      "We denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment so blinded by desire ante odio dignissim quam vitae pulvinar turpis.",
  },
  {
    question: "How Can I Become A Member?",
    answer:
      "To become a member, simply fill out the registration form and submit it. Our team will get in touch with you shortly after reviewing your details.",
  },
  {
    question: "What Payment Gateway You Support?",
    answer:
      "We support all major payment gateways including PayPal, Stripe, and Razorpay for safe and secure transactions.",
  },
  {
    question: "How Can I Cancel My Request?",
    answer:
      "If you wish to cancel a request, please visit your dashboard or contact our support team for further assistance.",
  },
];

export default function AdmissionFaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  useEffect(() => {
    const section = document.querySelector(".admission-faq-section");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`admission-faq-section ${isVisible ? "animate" : ""}`}
      id="admission-faq"
    >
      <div className="faq-container">
        {/* LEFT SIDE (TEXT CONTENT) */}
        <div className="faq-left">
          <h6 className="faq-subtitle">
            <FaQuestionCircle className="faq-icon" /> FAQ'S
          </h6>
          <h2 className="faq-title">
            General <span>Frequently</span> Asked Questions
          </h2>
          <p className="faq-desc">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even.
          </p>
          <p className="faq-desc">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>

          <ul className="faq-checklist">
            <li>✔ Easy admission process</li>
            <li>✔ 24/7 student support</li>
            <li>✔ Secure payment gateway</li>
            <li>✔ Transparent cancellation policy</li>
          </ul>

          <button className="faq-btn" onClick={() => navigate("/faq")}>
            Have Any Question ?
          </button>
        </div>

        {/* RIGHT SIDE (FAQ ACCORDION) */}
        <div className="faq-right">
          {faqData.map((item, index) => (
            <div
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              key={index}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                role="button"
              >
                <span className="faq-qicon">
                  <FaQuestionCircle />
                </span>
                <h4>{item.question}</h4>
                <span className="faq-arrow">
                  {activeIndex === index ? "˄" : "˅"}
                </span>
              </div>
              <div
                className="faq-answer"
                style={{
                  maxHeight: activeIndex === index ? "160px" : "0",
                  opacity: activeIndex === index ? 1 : 0,
                  padding: activeIndex === index ? "0.8rem 1.5rem" : "0 1.5rem",
                }}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
