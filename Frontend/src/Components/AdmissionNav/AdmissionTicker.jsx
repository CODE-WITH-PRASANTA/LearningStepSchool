//jsx//

import React, { useEffect, useState } from "react";
import API from "../../Api/Api";
import "./AdmissionTicker.css";
import newGif from "../../assets/new.gif"; // ✅ adjust path if needed

const AdmissionTicker = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        if (res?.data?.success && Array.isArray(res.data.data)) {
          const published = res.data.data.filter(
            (item) => item.isPublished === true
          );
          setNotifications(published);
        }
      } catch (error) {
        console.error(
          "Ticker Fetch Error:",
          error.response?.data || error.message
        );
      }
    };

    fetchNotifications();
  }, []);

  if (!notifications.length) return null;

  return (
    <div className="admission-ticker">
      <div className="ticker-track">
        {[...notifications, ...notifications].map((item, index) => (
          <button key={item._id + index} className="ticker-btn">
            
            {/* ✅ NEW GIF */}
            <img src={newGif} alt="new" className="ticker-new-icon" />

            {item.title} {item.session}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdmissionTicker;