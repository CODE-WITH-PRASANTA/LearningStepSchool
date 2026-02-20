import React, { useState } from "react";

const PublishNotification = () => {
  const [input, setInput] = useState("");
  const [notifications, setNotifications] = useState([
    "Admissions Open 2024–25",
    "Admissions Open 2025–26",
    "Admissions Open 2026–27",
    "Admissions Open 2027–28",
  ]);

  const handlePublish = () => {
    if (!input.trim()) return;

    setNotifications([...notifications, input]);
    setInput("");
  };

  return (
    <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Publish Notification
      </h2>

      {/* Input Section */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Enter notification..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 min-w-[220px] px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={handlePublish}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg transition"
        >
          Publish
        </button>
      </div>

      {/* Notification Pills */}
      <div className="flex flex-wrap gap-3">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="px-5 py-2 border border-orange-300 rounded-full bg-white text-orange-500 font-semibold text-sm whitespace-nowrap"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublishNotification;
