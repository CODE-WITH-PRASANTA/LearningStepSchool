import React, { useState } from "react";
import AwardForm from "../../Component/AwardForm";
import AwardList from "../../Component/AwardList";
import "./AwardAdminPage.css";

const AwardAdminPage = () => {
  const [awards, setAwards] = useState([]);
  const [editAward, setEditAward] = useState(null);

  const handleSaveAward = (award) => {
    if (editAward) {
      setAwards(
        awards.map((a) => (a.id === editAward.id ? award : a))
      );
      setEditAward(null);
    } else {
      setAwards([...awards, award]);
    }
  };

  const handleDeleteAward = (id) => {
    setAwards(awards.filter((a) => a.id !== id));
  };

  const handleEditAward = (award) => {
    setEditAward(award);
  };

  return (
    <div className="award-admin-container">

      <div className="award-admin-form-section">
        <AwardForm 
          onSubmit={handleSaveAward}
          editAward={editAward}
        />
      </div>

      <div className="award-admin-list-section">
        <AwardList
          awards={awards}
          onEdit={handleEditAward}
          onDelete={handleDeleteAward}
        />
      </div>

    </div>
  );
};

export default AwardAdminPage;
