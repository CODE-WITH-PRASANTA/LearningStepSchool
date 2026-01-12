import React from "react";
import "./EXNew.css";

import bgImg from "../../assets/k-1.webp";
import blog1 from "../../assets/blog-h1.webp";
import blog2 from "../../assets/blog-h2.webp";
import blog3 from "../../assets/blog-h3.webp";

const newsData = [
  { img: blog1, title: "Learn And Play" },
  { img: blog2, title: "Indoor Class Rooms" },
  { img: blog3, title: "Filled Fun & Games" },
];

const NewsArticle = () => {
  return (
    <section
      className="news-section"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="news-container">
        {/* Heading */}
        <div className="news-heading">
          <span>OUR NEW</span>
          <h2>Our News & Article</h2>
        </div>

        {/* Cards */}
        <div className="news-grid">
          {newsData.map((item, index) => (
            <div className="news-card" key={index}>
              
              <div className="news-img">
  <img src={item.img} alt={item.title} />
</div>

{/* SHARE ICON – reference position */}
<div className="news-share">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
  </svg>
</div>


                
               
             

              <div className="news-content">
                <div className="news-date">📅 26. September 2025</div>
                <h3>{item.title}</h3>
                <p>
                  Pre-School Has Open Door Andosol Offer Free Trial Session In
                  Child.
                </p>

                <a href="#" className="news-read">
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsArticle;
