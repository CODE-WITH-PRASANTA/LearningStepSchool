import React from "react";
import "./NewsTicker.css";

const NewsTicker = () => {
  const news = [
    "📢 Admissions Open for 2026 Session – Apply Now!",
    "📰 Annual Sports Day on 15th Feb – Parents Invited",
    "🔔 Unit Test Starts from 10th Feb for Classes I–X",
    "🎓 Smart Classrooms & Digital Learning Now Available",
    "🏆 Learning Step Ranked Among Best RBSE Schools in Rajgarh",
  ];

  return (
    <div className="news-wrapper">
      <div className="news-label">
        🔔 Latest News
      </div>

      <div className="news-container">
        <div className="news-track">
          {news.concat(news).map((item, index) => (
            <span key={index} className="news-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
