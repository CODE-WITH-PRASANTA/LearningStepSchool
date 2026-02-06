import React from "react";
import NewsSection from "../../Component/Advirtisement/NewsSection";
import AdsSection from "../../Component/Advirtisement/AdsSection";
import "./AdvirtisementPage.css";

export default function AdminPostsPage() {
  return (
    <div className="admin-posts-wrapper">
      <NewsSection />
      <AdsSection />
    </div>
  );
}
