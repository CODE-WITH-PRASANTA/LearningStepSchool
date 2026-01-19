import React, { useState } from "react";
import "./FeesFAQ.css";

const faqData = {
  "Preschool Level": [
    {
      color: "purple",
      icon: "😊",
      title: "Which type of meals are provided by the school?",
      text:
        "At Learning Step School, every child receives nutritious, freshly prepared meals designed by our certified dietitian. Meals include seasonal fruits, healthy snacks, and balanced lunch options, ensuring your little ones stay active and focused throughout the day.",
    },
    {
      color: "green",
      icon: "📘",
      title: "What type of curriculum is followed?",
      text:
        "Our Kinder Garden curriculum blends Montessori-inspired activities with interactive learning. We focus on language development, creative play, early numeracy, and social skills to lay a strong foundation for lifelong learning.",
    },
    {
      color: "blue",
      icon: "💳",
      title: "What payment options do you support?",
      text:
        "We offer multiple secure payment methods, including credit/debit cards, UPI, net banking, and EMI plans. All transactions are processed through encrypted gateways to ensure safety and transparency.",
    },
    {
      color: "yellow",
      icon: "≡",
      title: "Can I cancel or modify my admission request?",
      text:
        "Yes. If you wish to withdraw or make changes before final confirmation, please contact our admissions office. Refunds or adjustments follow our fair and transparent cancellation policy, ensuring parents’ peace of mind.",
    },
    {
      color: "pink",
      icon: "🚌",
      title: "Does the school provide 24/7 support?",
      text:
        "Absolutely. Our student support team and parent help desk are available round-the-clock to assist with admissions, learning schedules, and technical issues related to online classes.",
    },
    {
      color: "violet",
      icon: "🧩",
      title: "How can I schedule a school visit before enrolling?",
      text:
        "You can book a campus visit appointment directly from our website or by contacting our admissions counselor. We encourage parents to experience our learning environment before enrollment.",
    },
  ],

  "Primary School": [
    {
      color: "blue",
      icon: "🍽️",
      title: "What type of curriculum is followed in the primary section?",
      text:
        "The primary curriculum at Learning Step School follows the CBSE-integrated framework, emphasizing conceptual understanding, activity-based learning, and skill-building through projects, storytelling, and real-world examples.",
    },
    {
      color: "green",
      icon: "📘",
      title: "Are there any additional activity fees?",
      text:
        "Our school fees are inclusive of major co-curricular programs, including art, sports, music, and yoga. Specialized clubs (like robotics or dance) may have minimal additional charges, communicated transparently at the start of each term.",
    },
    {
      color: "pink",
      icon: "📚",
      title: "What payment options are available for parents?",
      text:
        "Parents can pay through online banking, UPI, debit/credit cards, or EMI-supported fee plans. Learning Step School ensures secure and flexible payment options with instant receipt generation.",
    },
    {
      color: "yellow",
      icon: "🪑",
      title: "What facilities are available for primary students?",
      text:
        "Primary students enjoy access to STEM labs, digital learning classrooms, sports facilities, and language labs — all aimed at building confidence, discipline, and a love for learning.",
    },
    {
      color: "violet",
      icon: "🚐",
      title: "Does the school offer any scholarships or discounts?",
      text:
        "Yes. We provide merit-based and sibling scholarships to encourage academic excellence and family enrollment. Our financial aid program ensures that quality education remains accessible to all.",
    },
    {
      color: "red",
      icon: "🏢",
      title: "How skilled are the teachers at this level?",
      text:
        "Our teachers are subject experts who integrate digital tools and experiential learning to make lessons engaging and result-oriented. Continuous training and workshops ensure they remain up-to-date with the latest teaching methods.",
    },
  ],

  "Mid School": [
    {
      color: "blue",
      icon: "👩‍🏫",
      title: "How much experience do teachers have?",
      text:
        "All our middle school educators hold professional teaching certifications and possess 5–15 years of classroom experience. They undergo continuous training to stay aligned with new-age pedagogies, digital teaching tools, and emotional learning techniques.",
    },
    {
      color: "green",
      icon: "🏫",
      title: "What type of curriculum is followed?",
      text:
        "Learning Step School follows a CBSE-aligned, concept-based curriculum that emphasizes understanding rather than memorization. We integrate STEM education, creative writing, and life-skill programs to prepare students for real-world challenges.",
    },
    {
      color: "pink",
      icon: "📚",
      title: "How do you assess the students’ activity?",
      text:
        "Our evaluation system blends academic and co-curricular assessments, including classroom participation, projects, leadership roles, and sports involvement. Progress is reviewed quarterly, with detailed feedback shared through parent-teacher meetings and online dashboards.",
    },
    {
      color: "yellow",
      icon: "🪑",
      title: "What kind of learning happens inside the classroom?",
      text:
        "Our classrooms combine interactive whiteboards, group discussions, and hands-on experiments. Teachers encourage analytical thinking, communication, and collaboration — skills that are crucial for students’ intellectual growth.",
    },
    {
      color: "violet",
      icon: "🎒",
      title: "Can my child leave the school campus during school hours?",
      text:
        "For safety reasons, students are not permitted to leave campus during academic hours unless accompanied by a parent or authorized guardian. A formal written request and approval from the administration are mandatory.",
    },
    {
      color: "red",
      icon: "🏢",
      title: "What other kinds of facilities are available?",
      text:
        "Middle School students benefit from science and computer labs, a digital library, robotics clubs, art studios, and sports facilities. We also offer a career-orientation program to help students identify their strengths early.",
    },
  ],

  "High School": [
    {
      color: "blue",
      icon: "👩‍🏫",
      title: "Is your school child-centered or teacher-centered?",
      text:
        "Learning Step School follows a child-centered approach, where students are encouraged to explore, question, and learn independently. Teachers act as mentors, guiding them through experiential and inquiry-based learning.",
    },
    {
      color: "green",
      icon: "🏠",
      title: "What do my kids learn in school and at home?",
      text:
        "Our blended learning system combines classroom teaching with guided home-based learning. Students develop strong academic knowledge, life skills, and digital literacy through structured study plans and parental engagement.",
    },
    {
      color: "pink",
      icon: "🚐",
      title: "What are the safety facilities in the pick-up van?",
      text:
        "All school buses are equipped with GPS tracking, CCTV surveillance, and trained attendants to ensure every child’s safety. Parents can monitor bus routes in real-time through our secure mobile app.",
    },
    {
      color: "yellow",
      icon: "⌂",
      title: "Can my child leave the school campus anytime?",
      text:
        "For security reasons, students are not permitted to leave campus during school hours without prior written approval from parents and school authorities. Attendance is tracked digitally for complete safety.",
    },
    {
      color: "violet",
      icon: "👤",
      title: "What are the qualifications of your teachers?",
      text:
        "Our teachers are highly qualified, holding postgraduate degrees and certifications in modern pedagogy. They bring years of CBSE and competitive exam teaching experience to ensure holistic academic excellence.",
    },
    {
      color: "red",
      icon: "📖",
      title: "How can my child be academically successful this year?",
      text:
        "We ensure every student’s success through personalized mentorship, exam-readiness programs, and stress-free learning sessions. Academic counseling and mock assessments help students perform with confidence and clarity.",
    },
  ],
};

const FeesFAQ = () => {
  const [activeTab, setActiveTab] = useState("Preschool Level");

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
