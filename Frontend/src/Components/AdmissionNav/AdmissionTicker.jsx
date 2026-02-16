import React, { useEffect, useState } from "react";
import API from "../../Api/Api";   // make sure path is correct
import "./AdmissionTicker.css";

const AdmissionTicker = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        console.log("API RESPONSE:", res.data.data);

        if (res?.data?.success && Array.isArray(res.data.data)) {
          // Only show published notifications
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

  // If nothing published, don't render ticker
  if (!notifications.length) return null;

  return (
    <div className="admission-ticker">
      <div className="ticker-track">
        {[...notifications, ...notifications].map((item, index) => (
          <button key={item._id + index} className="ticker-btn">
            {item.title} {item.session}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdmissionTicker;
