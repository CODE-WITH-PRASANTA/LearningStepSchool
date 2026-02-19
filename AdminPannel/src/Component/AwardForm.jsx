import React, { useState, useEffect } from "react";
import API from "../api/axios";

const AwardForm = ({ editAward, setEditAward, refreshAwards }) => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });

  useEffect(() => {
    if (editAward) {
      setFormData({
        title: editAward.title,
        image: null,
      });
    }
  }, [editAward]);

  const handleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editAward) {
        await API.put(`/awards/${editAward._id}`, data);
        setEditAward(null);
      } else {
        await API.post("/awards", data);
      }

      setFormData({ title: "", image: null });
      refreshAwards();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  return (
    <form className="award-form" onSubmit={handleSubmit}>
      <h2>
        {editAward ? "Edit Award" : "Add New Award"}
      </h2>

      <input
        type="file"
        onChange={handleImageUpload}
        required={!editAward}
      />

      <input
        type="text"
        placeholder="Award Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {editAward ? "Update Award" : "Submit Award"}
      </button>
    </form>
  );
};

export default AwardForm;