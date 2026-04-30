import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import API from "../../api/axios";

const TestimonialForm = ({ editItem, setEditItem, refreshTestimonials }) => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [clientName, setClientName] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    if (editItem) {
      setPreview(editItem.photo ? editItem.photo : "");
      setFeedback(editItem.feedback || "");
      setRating(editItem.rating || 0);
      setClientName(editItem.clientName || "");
      setDesignation(editItem.designation || "");
    }
  }, [editItem]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("clientName", clientName);
      formData.append("designation", designation);
      formData.append("feedback", feedback);
      formData.append("rating", rating);

      if (photo) {
        formData.append("photo", photo);
      }

      if (editItem) {
        await API.put(`/testimonials/${editItem._id}`, formData);
        setEditItem(null);
      } else {
        await API.post("/testimonials", formData);
      }

      resetForm();
      refreshTestimonials();

    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  const resetForm = () => {
    setPhoto(null);
    setPreview("");
    setFeedback("");
    setRating(0);
    setClientName("");
    setDesignation("");
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
        <label>Client Name</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div className="adm-form-group">
        <label>Designation</label>
        <input
          type="text"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
        />
      </div>

      <div className="adm-form-group">
        <label>Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
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