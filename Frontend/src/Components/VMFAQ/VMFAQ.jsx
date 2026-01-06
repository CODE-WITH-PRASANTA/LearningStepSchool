import React, { useState } from "react";
import "./VMFAQ.css";
import faqImage from "../../assets/vmfaq.jpg";

const faqs = [
  {
    question: "How and when do I register for courses?",
    answer:
      "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec."
  },
  {
    question: "What are the safety standards?",
    answer:
      "Our school follows strict safety and hygiene standards to ensure a safe learning environment for all children."
  },
  {
    question: "What are my offer of admission?",
    answer:
      "Admission offers depend on age eligibility, availability of seats, and documentation verification."
  },
  {
    question: "How can I become a teacher in PA?",
    answer:
      "You can apply through our careers page by submitting your qualifications and experience."
  },
  {
    question: "When will I receive my diploma?",
    answer:
      "Diplomas are issued after successful completion of the academic program."
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="faqq-section">
      <div className="faqq-container">
        {/* Left Image */}
        <div className="faqq-image">
          <img src={faqImage} alt="Child playing" />
        </div>

        {/* Right FAQ */}
        <div className="faqq-content">
          <h2>Frequently Asked Questions?</h2>

          <div className="faqq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faqq-item ${
                  activeIndex === index ? "active" : ""
                }`}
              >
                <div
                  className="faqq-question-row"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <span className="question-text">{faq.question}</span>
                  <span className="icon">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </div>

                <div className="faqq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
