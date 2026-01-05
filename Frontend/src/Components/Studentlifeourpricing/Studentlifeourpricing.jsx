import React from "react";
import "./Studentlifeourpricing.css";

const plans = [
  {
    name: "Starter Plan",
    price: 19,
    highlight: false,
    features: [
      { text: "Mistakes To Avoid", ok: true },
      { text: "Your Startup", ok: true },
      { text: "Knew About Fonts", ok: false },
      { text: "Winning Metric", ok: false },
      { text: "Your Startup", ok: true },
      { text: "Knew About Fonts", ok: true },
      { text: "Winning Metric for Your Startup", ok: true },
      { text: "Your Startup", ok: true },
    ],
  },
  {
    name: "Golden Plan",
    price: 39,
    highlight: true,
    features: [
      { text: "Mistakes To Avoid", ok: true },
      { text: "Your Startup", ok: true },
      { text: "Knew About Fonts", ok: true },
      { text: "Winning Metric", ok: false },
      { text: "Your Startup", ok: true },
      { text: "Knew About Fonts", ok: true },
      { text: "Winning Metric for Your Startup", ok: true },
      { text: "Your Startup", ok: true },
    ],
  },
  {
    name: "Platinum Plan",
    price: 79,
    highlight: false,
    features: [
      { text: "Mistakes To Avoid", ok: true },
      { text: "Your Startup", ok: true },
      { text: "Knew About Fonts", ok: true },
      { text: "Winning Metric", ok: true },
      { text: "Your Startup", ok: true },
      { text: "Knew About Fonts", ok: true },
      { text: "Winning Metric for Your Startup", ok: true },
      { text: "Your Startup", ok: true },
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
            Simple and transparent plans designed to support every stage of learning.
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
                  ${plan.price}
                </span>
                <span className="Studentlifeourpricing-duration">/mo</span>
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
