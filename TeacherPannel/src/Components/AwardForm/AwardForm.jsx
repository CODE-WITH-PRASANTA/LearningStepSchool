import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "./AwardForm.css";

const AwardForm = ({ editAward, setEditAward, refreshAwards }) => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    preview: null,
  });

  useEffect(() => {
    if (editAward) {
      setFormData({
        title: editAward.title,
        image: null,
        preview: editAward.image || null,
      });
    }
  }, [editAward]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      image: file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.image) data.append("image", formData.image);

      if (editAward) {
        await API.put(`/awards/${editAward._id}`, data);
        setEditAward(null);
      } else {
        await API.post("/awards", data);
      }

      setFormData({ title: "", image: null, preview: null });
      refreshAwards();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="awardUI">

      <form className="awardUI__card" onSubmit={handleSubmit}>
        <h2 className="awardUI__title">
          {editAward ? "Edit Award" : "Add New Award"}
        </h2>

        {/* IMAGE UPLOAD */}
        <div className="awardUI__upload">
          <label className="awardUI__uploadBox">
            {formData.preview ? (
              <img
                src={formData.preview}
                alt="preview"
                className="awardUI__previewImg"
              />
            ) : (
              <span>Upload Image</span>
            )}

            <input type="file" onChange={handleImage} hidden />
          </label>
        </div>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Award Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="awardUI__input"
        />

        {/* BUTTON */}
        <button className="awardUI__btn">
          {editAward ? "Update Award" : "Submit Award"}
        </button>
      </form>

    </div>
  );
};

export default AwardForm;