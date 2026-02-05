import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";

const TestimonialForm = ({ addTestimonial, editItem, updateTestimonial }) => {

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (editItem) {
      setPhoto(editItem.photo);
      setPreview(editItem.photo);
      setFeedback(editItem.feedback);
      setRating(editItem.rating);
    }
  }, [editItem]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPhoto(imgUrl);
      setPreview(imgUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      photo,
      feedback,
      rating,
      id: editItem?.id
    };

    if (editItem) {
      updateTestimonial(data);
    } else {
      addTestimonial(data);
    }

    setPhoto(null);
    setPreview("");
    setFeedback("");
    setRating(0);
  };

  return (
    <form className="adm-testimonial-form" onSubmit={handleSubmit}>

      <h2 className="adm-form-title">
        {editItem ? "Edit Testimonial" : "Add Testimonial"}
      </h2>

      <div className="adm-form-group">
        <label>Upload Photo</label>
        <input type="file" onChange={handleImage} />
        {preview && (
          <img src={preview} alt="preview" className="adm-preview-img" />
        )}
      </div>

      <div className="adm-form-group">
        <label>Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter client feedback..."
          required
        />
      </div>

      <div className="adm-form-group">
        <label>Rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <button className="adm-submit-btn" type="submit">
        {editItem ? "Update Testimonial" : "Submit Testimonial"}
      </button>

    </form>
  );
};

export default TestimonialForm;
