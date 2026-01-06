import React, { useState } from "react";
import "./FeesFAQ.css";

const faqData = {
  "Kinder Garden": [
    {
      color: "purple",
      icon: "😊",
      title: "Which type of meals provided by the school?",
      text:
        "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus.",
    },
    {
      color: "green",
      icon: "?",
      title: "Does learning happen outside the classroom?",
      text:
        "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus.",
    },
    {
      color: "blue",
      icon: "?",
      title: "What type of curriculum is followed?",
      text:
        "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus.",
    },
    {
      color: "yellow",
      icon: "≡",
      title: "How skilled are the teachers of the school?",
      text:
        "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus.",
    },
    {
      color: "pink",
      icon: "🚌",
      title: "How safe are the school van and bus?",
      text:
        "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus.",
    },
    {
      color: "violet",
      icon: "🧩",
      title: "What other kinds of facilities available?",
      text:
        "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus.",
    },
  ],

  "Small School": [
    {
      color: "blue",
      icon: "🍽️",
      title: "Which type of meals provided by the school?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
   {
      color: "green",
      icon: "📘",
      title: "Does learning happen outside the classroom?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
       {
      color: "pink",
      icon: "📚",
      title: "What type of curriculum is followed?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
    {
      color: "yellow",
      icon: "🪑",
      title: "Does learning happen outside the classroom?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
    {
      color: "violet",
      icon: "🚐",
      title: "How safe are the school van and bus?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
     {
      color: "red",
      icon: "🏢",
      title: "What other kinds of facilities available?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
  ],

  "Mid School": [
    {
      color: "blue",
      icon: "👩‍🏫",
      title: "How much experience do teachers have?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
   {
      color: "green",
      icon: "🏫",
      title: "Can my child leave the school campus now?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
       {
      color: "pink",
      icon: "📚",
      title: "What type of curriculum is followed?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
    {
      color: "yellow",
      icon: "🪑",
      title: "What kind of learning followed in the classroom?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
    {
      color: "violet",
      icon: "🎒",
      title: "How do you assess the students activity?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
     {
      color: "red",
      icon: "🏢",
      title: "What other kinds of facilities available?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
  ],

  "High School": [
   {
      color: "blue",
      icon: "👩‍🏫",
      title: "Is your school a child-centered, a teacher-centered?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
   {
      color: "green",
      icon: "🏠",
      title: "What do my kid learn in school and home?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
       {
      color: "pink",
      icon: "🚐",
      title: "What are the safety facilities in pick up van?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
    {
      color: "yellow",
      icon: "⌂",
      title: "Can my child leave the school campus anytime?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
    {
      color: "violet",
      icon: "👤",
      title: "What is the qualifications of your teachers?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
     {
      color: "red",
      icon: "📖",
      title: "How my child be academically successful this year?",
      text: "Cum sociis natoque penatibus et magnis dis parturient montes. nascetur ridiculus mus. Donec quam felis, ultricies nec, pellente sque eu, pretium quis.",
    },
  ],
};

const FeesFAQ = () => {
  const [activeTab, setActiveTab] = useState("Kinder Garden");

  return (
    <section className="fees-faq">
      <h2 className="fees-faq-title">Questions About Fees</h2>
      <span className="fees-faq-line"></span>

      {/* Tabs */}
      <div className="fees-faq-tabs">
        {Object.keys(faqData).map((tab) => (
          <button
            key={tab}
            className={`fees-faq-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FAQ Content */}
      <div className="fees-faq-grid">
        {faqData[activeTab].map((item, index) => (
          <div className="fees-faq-item" key={index}>
            <div className={`fees-faq-icon ${item.color}`}>{item.icon}</div>
            <div>
              <h4 className={`${item.color}-text`}>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeesFAQ;
