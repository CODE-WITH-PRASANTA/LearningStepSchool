import React, { useEffect, useState } from "react";
import API from "../../Api/Api";   // Make sure path is correct
import "./NewsTicker.css";

const NewsTicker = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await API.get("/latest-news");

        if (res?.data?.success && Array.isArray(res.data.data)) {
          // Only show active news
          const activeNews = res.data.data.filter(
            (item) => item.isActive === true
          );

          setNews(activeNews);
        }
      } catch (error) {
        console.error(
          "News Fetch Error:",
          error.response?.data || error.message
        );
      }
    };

    fetchNews();
  }, []);

  if (!news.length) return null;

  return (
    <div className="news-wrapper">
      <div className="news-label">
        🔔 Latest News
      </div>

      <div className="news-container">
        <div className="news-track">
          {[...news, ...news].map((item, index) => (
            <span key={item._id + index} className="news-item">
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
