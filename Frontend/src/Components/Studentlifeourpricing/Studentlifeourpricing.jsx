import React from "react";
import "./Studentlifeourpricing.css";

const plans = [
  {
    name: "Starter Plan",
    price: "₹1,590",
    highlight: false,
    features: [
      { text: "Access to foundational learning modules", ok: true },
      { text: "Homework and concept support", ok: true },
      { text: "Monthly progress report", ok: true },
      { text: "Parent–teacher consultation sessions", ok: true },
      { text: "Limited access to digital learning tools", ok: true },
      { text: "Weekend doubt-solving classes", ok: false },
      { text: "Skill-building workshops", ok: false },
      { text: "Personal mentorship", ok: false },
    ],
  },
  {
    name: "Golden Plan",
    price: "₹3,290",
    highlight: true,
    features: [
      { text: "Everything in Starter Plan", ok: true },
      { text: "Weekly one-on-one tutoring sessions", ok: true },
      { text: "Access to creative and language programs", ok: true },
      { text: "Weekly performance feedback", ok: true },
      { text: "Comprehensive exam preparation", ok: true },
      { text: "Skill-building and personality workshops", ok: true },
      { text: "Parent counseling and academic guidance", ok: true },
      { text: "Access to e-learning resources", ok: true },
    ],
  },
  {
    name: "Platinum Plan",
    price: "₹6,490",
    highlight: false,
    features: [
      { text: "All features of the Golden Plan", ok: true },
      { text: "Dedicated academic mentor", ok: true },
      { text: "Advanced exam preparation and testing", ok: true },
      { text: "Leadership and communication training", ok: true },
      { text: "24/7 student academic support", ok: true },
      { text: "Exclusive access to premium workshops", ok: true },
      { text: "Yearly skill assessment and career counseling", ok: true },
      { text: "Priority access to school events and competitions", ok: true },
    ],
  },
];

const Studentlifeourpricing = () => {
  return (
    <section className="Studentlifeourpricing-section">
      <div className="Studentlifeourpricing-wrapper">

        {/* ===== ADVANCED HEADING ===== */}
        <div className="Studentlifeourpricing-header">
          <span className="Studentlifeourpricing-eyebrow">Our Pricing</span>

          <h2 className="Studentlifeourpricing-title">
            Transforming lives through
            <span> knowledge & education</span>
          </h2>

          <div className="Studentlifeourpricing-divider">
            <span></span>
          </div>

          <p className="Studentlifeourpricing-subtitle">
            Transparent and flexible plans designed to nurture every learner’s growth—whether starting strong, learning consistently, or striving for excellence.
          </p>
        </div>

        {/* ===== CARDS ===== */}
        <div className="Studentlifeourpricing-cards">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`Studentlifeourpricing-card ${
                plan.highlight ? "highlight" : ""
              }`}
            >
              <div className="Studentlifeourpricing-cardHead">
                <h3>{plan.name}</h3>
              </div>

              <div className="Studentlifeourpricing-price">
                <span className="Studentlifeourpricing-amount">
                  {plan.price}
                </span>
                <span className="Studentlifeourpricing-duration">/month</span>
              </div>

              <ul className="Studentlifeourpricing-features">
                {plan.features.map((f, i) => (
                  <li key={i} className={f.ok ? "ok" : "no"}>
                    {f.ok ? "✔" : "✖"} {f.text}
                  </li>
                ))}
              </ul>

              <button className="Studentlifeourpricing-btn">
                Buy Now
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Studentlifeourpricing;
