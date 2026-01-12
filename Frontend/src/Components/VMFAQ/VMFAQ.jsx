import React, { useState } from "react";
import "./VMFAQ.css";
import faqImage from "../../assets/vmfaq.jpg";

const faqs = [
  {
    question: "How and when do I register for Admission?",
    answer:
      "Admissions at Learning Step International School are open year-round, subject to seat availability. Parents can register online or visit the campus to complete the admission process."
  },
  {
    question: "What are the safety standards followed by the school?",
    answer:
      "We follow strict child safety standards, including secure campus access, trained staff supervision, hygienic facilities, and child-friendly safety protocols."
  },
  {
    question: "What programs and age groups do you offer",
    answer:
      "We offer early childhood education programs for toddlers, preschool, and kindergarten, designed to support learning, social development, and school readiness."
  },
  {
    question: "How can I apply to become a teacher at Learning Step School?",
    answer:
      "Qualified and experienced early childhood educators can apply by submitting their resume through our official contact channels or visiting the school office."
  },
  {
    question: "When will my child receive certificates or progress reports",
    answer:
      "Children receive regular progress updates, and completion certificates are provided at the end of each academic level or learning program."
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
