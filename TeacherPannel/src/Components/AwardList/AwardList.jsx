import React from "react";
import { IMAGE_URL } from "../../api/axios";
import "./AwardList.css";

const AwardList = ({ awards = [], onEdit, onDelete }) => {
  return (
    <div className="awardList">

      <div className="awardList__header">
        <h2 className="awardList__title">Award List</h2>
      </div>

      {awards.length === 0 ? (
        <div className="awardList__empty">
          No awards added
        </div>
      ) : (
        <div className="awardList__grid">

          {awards.map((award) => (
            <div key={award._id} className="awardList__card">

              {/* IMAGE */}
              <div className="awardList__imageWrap">
                <img
                  src={`${IMAGE_URL}${award.image}`}
                  alt={award.title}
                  className="awardList__image"
                />
              </div>

              {/* CONTENT */}
              <div className="awardList__content">
                <h4 className="awardList__name">
                  {award.title}
                </h4>
              </div>

              {/* ACTIONS */}
              <div className="awardList__actions">
                <button
                  className="awardList__editBtn"
                  onClick={() => onEdit(award)}
                >
                  Edit
                </button>

                <button
                  className="awardList__deleteBtn"
                  onClick={() => onDelete(award._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AwardList;