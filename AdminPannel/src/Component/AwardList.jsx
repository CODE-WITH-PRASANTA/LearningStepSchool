import React from "react";
import BASE_URL, { IMAGE_URL } from "../api/axios";

const AwardList = ({ awards, onEdit, onDelete }) => {
  return (
    <div className="award-list-container">
      <h2 className="award-form-title">Award List</h2>

      <div className="award-list-scroll">
        {awards.length === 0 && <p>No awards added</p>}

        {awards.map((award) => (
          <div key={award._id} className="award-list-card">
            <img
              src={`${IMAGE_URL}${award.image}`}
              alt={award.title}
              className="award-list-image"
            />

            <div className="award-list-content">
              <h4>{award.title}</h4>
            </div>

            <div className="award-list-actions">
              <button className="award-edit-btn" onClick={() => onEdit(award)}>
                Edit
              </button>

              <button
                className="award-delete-btn"
                onClick={() => onDelete(award._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwardList;
