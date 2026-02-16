import React, { useState, useEffect } from "react";
import AwardForm from "../../Component/AwardForm";
import AwardList from "../../Component/AwardList";
import API from "../../api/axios";
import "./AwardAdminPage.css";

const AwardAdminPage = () => {
  const [awards, setAwards] = useState([]);
  const [editAward, setEditAward] = useState(null);

  /* ================= FETCH ================= */
  const fetchAwards = async () => {
    try {
      const res = await API.get("/awards");
      setAwards(res.data.data || res.data);
    } catch (err) {
      console.error("FETCH AWARD ERROR:", err);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handleDeleteAward = async (id) => {
    if (!window.confirm("Delete this award?")) return;

    try {
      await API.delete(`/awards/${id}`);
      fetchAwards();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="award-admin-container">
      <div className="award-admin-form-section">
        <AwardForm
          editAward={editAward}
          setEditAward={setEditAward}
          refreshAwards={fetchAwards}
        />
      </div>

      <div className="award-admin-list-section">
        <AwardList
          awards={awards}
          onEdit={setEditAward}
          onDelete={handleDeleteAward}
        />
      </div>
    </div>
  );
};

export default AwardAdminPage;