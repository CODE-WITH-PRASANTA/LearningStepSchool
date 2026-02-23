import React from "react";
import { IMAGE_URL } from "../../api/axios";

const TestimonialList = ({ testimonials = [], onEdit, onDelete }) => {
  return (
    <div className="adm-testimonial-list">
      <h2 className="adm-list-title">Manage Testimonials</h2>

      {testimonials.length === 0 && (
        <p className="adm-empty-text">No testimonials added yet.</p>
      )}

      {Array.isArray(testimonials) &&
        testimonials.map((item) => (
          <div className="adm-testimonial-card" key={item._id}>
            {item.photo && (
              <img
                src={`${IMAGE_URL}${item.photo}`}
                alt="client"
                className="adm-client-photo"
              />
            )}

            <div className="adm-card-content">
              <h4 className="adm-client-name">{item.clientName}</h4>
              <p className="adm-client-designation">{item.designation}</p>
              <p className="adm-feedback-text">{item.feedback}</p>

              <div className="adm-rating-view">
                {"★".repeat(Number(item.rating))}
              </div>

              <div className="adm-card-actions">
                <button
                  className="adm-edit-btn"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="adm-delete-btn"
                  onClick={() => onDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TestimonialList;