import React from "react";
import "./EXCard.css";

// Import your downloaded icons
import learningIcon from "../../assets/f-1.webp";
import onlineIcon from "../../assets/f-2.webp";
import playgroundIcon from "../../assets/f-3.webp";

const FeatureCards = () => {
  const cards = [
    {
      id: 1,
      title: "Learning & Fun",
      description: "Pre-school has open doors free sessis child.",
      icon: learningIcon,
      variant: "green",
    },
    {
      id: 2,
      title: "Online Class",
      description: "Pre-school has open doors free sessis child.",
      icon: onlineIcon,
      variant: "purple",
    },
    {
      id: 3,
      title: "Own Playground",
      description: "Pre-school has open doors free sessis child.",
      icon: playgroundIcon,
      variant: "orange",
    },
  ];

  return (
    <section className="edu-feature-wrapper">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`edu-feature-card edu-feature-card--${card.variant}`}
        >
          <span className="edu-feature-pin" />
          <span className="edu-feature-pin edu-feature-pin--second" />

          <div className="edu-feature-icon">
            <img src={card.icon} alt={card.title} />
          </div>

          <div className="edu-feature-content">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeatureCards;
