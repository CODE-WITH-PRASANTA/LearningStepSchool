import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { IMAGE_URL } from "../../Api/Api";
import "./ViewNotice.css";

const ViewNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotice = async () => {
    try {
      const res = await API.get(`/notices/${id}`);
      setNotice(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="vn-loader">
        <div className="vn-spinner"></div>
      </div>
    );
  }

  if (!notice) {
    return <div className="vn-loader">Notice not found</div>;
  }

  const isExpired =
    notice.expiry && new Date(notice.expiry) < new Date();

  return (
    <div className="vn-wrapper">

      {/* ===== HERO ===== */}
      <div className="vn-hero">
        {notice.image && (
          <img
            src={IMAGE_URL + notice.image}
            alt={notice.title}
            className="vn-hero-img"
          />
        )}

        <div className="vn-hero-gradient" />

        <div className="vn-hero-content">
          <h1>{notice.title}</h1>

          <div className="vn-meta">
            {notice.dateTime && (
              <span>📅 {new Date(notice.dateTime).toLocaleString()}</span>
            )}
            {notice.location && <span>📍 {notice.location}</span>}
          </div>

          <span className={`vn-status ${isExpired ? "expired" : "active"}`}>
            {isExpired ? "Expired" : "Active"}
          </span>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="vn-container">
        <div className="vn-card">
          <p>{notice.description}</p>

          <div className="vn-actions no-print">
            <button onClick={() => navigate(-1)} className="vn-btn back">
              ← Back
            </button>
            <button onClick={() => window.print()} className="vn-btn print">
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotice;