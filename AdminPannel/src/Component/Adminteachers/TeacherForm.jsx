import React, { useState, useEffect } from "react";

const TeacherForm = ({ onSubmit, editTeacher }) => {
  const [formData, setFormData] = useState({
    id: Date.now(),
    name: "",
    review: "",
    rating: 0,
    photo: "",
    instagram: "",
    facebook: "",
    linkedin: ""
  });

  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (editTeacher) {
      setFormData(editTeacher);
    }
  }, [editTeacher]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData({ ...formData, photo: preview });
    }
  };

  const handleStarClick = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      alert("Please select star rating");
      return;
    }

    onSubmit({ ...formData, id: formData.id || Date.now() });

    setFormData({
      id: Date.now(),
      name: "",
      review: "",
      rating: 0,
      photo: "",
      instagram: "",
      facebook: "",
      linkedin: ""
    });
  };

  return (
    <form className="teacher-form" onSubmit={handleSubmit}>
      <h2 className="teacher-form-title">
        {editTeacher ? "Edit Teacher" : "Add New Teacher"}
      </h2>

      <input type="file" onChange={handleImageUpload} />

      <input
        type="text"
        name="name"
        placeholder="Teacher Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="review"
        placeholder="Teacher Review"
        value={formData.review}
        onChange={handleChange}
        required
      />

      {/* STAR RATING */}

     <div className="teacher-star-rating">
  <span className="teacher-rating-label">Rating</span>

  <div className="teacher-stars-wrapper">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`teacher-star ${
          (hoverRating || formData.rating) >= star
            ? "teacher-star-filled"
            : ""
        }`}
        onClick={() => handleStarClick(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
      >
        ★
      </span>
    ))}
  </div>
</div>

      <input
        type="text"
        name="instagram"
        placeholder="Instagram Link"
        value={formData.instagram}
        onChange={handleChange}
      />

      <input
        type="text"
        name="facebook"
        placeholder="Facebook Link"
        value={formData.facebook}
        onChange={handleChange}
      />

      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn Link"
        value={formData.linkedin}
        onChange={handleChange}
      />

      <button className="teacher-submit-btn" type="submit">
        {editTeacher ? "Update Teacher" : "Add Teacher"}
      </button>
    </form>
  );
};

export default TeacherForm;
