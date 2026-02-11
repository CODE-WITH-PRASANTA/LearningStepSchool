import React from "react";

const AwardList = ({ awards, onEdit, onDelete }) => {
  return (
    <div className="award-list-container">

      <h2 className="award-list-title">Award List</h2>

      {awards.length === 0 && (
        <p className="award-empty-text">No awards added</p>
      )}

      {awards.map((award) => (
        <div className="award-list-card" key={award.id}>

          <img 
            src={award.image}
            alt={award.title}
            className="award-list-image"
          />

          <div className="award-list-info">
            <h4>{award.title}</h4>
          </div>

          <div className="award-list-actions">

            <button 
              className="award-edit-btn"
              onClick={() => onEdit(award)}
            >
              Edit
            </button>

            <button 
              className="award-delete-btn"
              onClick={() => onDelete(award.id)}
            >
              Delete
            </button>

          </div>

        </div>
      ))}

    </div>
  );
};

export default AwardList;
