import React from "react";
import { IMAGE_URL } from "../api/axios";

const AwardList = ({ awards, onEdit, onDelete }) => {
  return (
    <div className="award-list-container">
      <h2>Award List</h2>

      {awards.length === 0 && (
        <p>No awards added</p>
      )}

      {awards.map((award) => (
        <div key={award._id} className="award-list-card">
          <img
            src={IMAGE_URL + award.image}
            alt={award.title}
            className="award-list-image"
          />

          <div>
            <h4>{award.title}</h4>
          </div>

          <div>
            <button onClick={() => onEdit(award)}>
              Edit
            </button>

            <button onClick={() => onDelete(award._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AwardList;