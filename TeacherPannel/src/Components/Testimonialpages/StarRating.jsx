import React from "react";

const StarRating = ({ rating, setRating }) => {

  return (
    <div className="adm-star-rating-box">
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          className={`adm-star ${rating >= star ? "active" : ""}`}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
