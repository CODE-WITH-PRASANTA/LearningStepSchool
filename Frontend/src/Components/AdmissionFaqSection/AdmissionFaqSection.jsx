import React, { useEffect, useState } from "react";
import "./AdmissionFaqSection.css";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const faqData = [
  {
    question: "How Can I Apply For Admission?",
    answer:
      "You can start the admission process online through our Apply Now form on the official website. Once submitted, our admission counselor will contact you to guide you through the next steps, including document submission and orientation.",
  },
  {
    question: "How can I become a member of Learning Step School?",
    answer:
      "Once your child’s admission is confirmed, you automatically become part of the Learning Step Parent Community. Members receive updates on academic programs, events, and exclusive parent-teacher workshops.",
  },
  {
    question: "What payment options do you support?",
    answer:
      "We offer multiple secure payment methods, including credit/debit cards, UPI, net banking, and EMI plans. All transactions are processed through encrypted gateways to ensure safety and transparency..",
  },
  {
    question: "Can I cancel or modify my admission request?",
    answer:" Yes. If you wish to withdraw or make changes before final confirmation, please contact our admissions office. Refunds or adjustments follow our fair and transparent cancellation policy, ensuring parents’ peace of mind.",
  },
   {
    question: "Does the school provide 24/7 support?",
    answer:
      "Absolutely. Our student support team and parent help desk are available round-the-clock to assist with admissions, learning schedules, and technical issues related to online classes.",
   },
  {
    question: "How can I schedule a school visit before enrolling?",
    answer:
      "You can book a campus visit appointment directly from our website or by contacting our admissions counselor. We encourage parents to experience our learning environment before enrolling.",
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
            At Learning Step School, we believe in maintaining complete transparency with parents and students.
Our FAQs are designed to answer the most common queries about admissions, fees, support, and learning options, helping families make informed decisions with confidence.
          </p>
          <p className="faq-desc">
           Our admission process is simple, our communication is clear, and our support team is always available to guide you every step of the way.
          </p>

          <ul className="faq-checklist">
            <li>✔ Easy and hassle-free admission process</li>
            <li>✔ 24 × 7 student and parent support</li>
            <li>✔ Secure and transparent fee payment gateway</li>
            <li>✔ Clear refund and cancellation policy</li>
          </ul>

          <button className="faq-btn" onClick={() => navigate("/faq")}>
            Need More Help ?
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
