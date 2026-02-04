import React, { useState, useEffect } from "react";

const AwardForm = ({ onSubmit, editAward }) => {

  const [formData, setFormData] = useState({
    id: Date.now(),
    title: "",
    image: ""
  });

  useEffect(() => {
    if (editAward) {
      setFormData(editAward);
    }
  }, [editAward]);

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
      setFormData({ ...formData, image: preview });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      id: formData.id || Date.now()
    });

    setFormData({
      id: Date.now(),
      title: "",
      image: ""
    });
  };

  return (
    <form className="award-form" onSubmit={handleSubmit}>

      <h2 className="award-form-title">
        {editAward ? "Edit Award" : "Add New Award"}
      </h2>

      <input 
        type="file"
        onChange={handleImageUpload}
        required={!editAward}
      />

      <input
        type="text"
        name="title"
        placeholder="Award Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <button className="award-submit-btn" type="submit">
        {editAward ? "Update Award" : "Submit Award"}
      </button>

    </form>
  );
};

export default AwardForm;
