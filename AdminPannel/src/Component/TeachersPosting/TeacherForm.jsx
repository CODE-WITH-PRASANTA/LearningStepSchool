import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const TeacherForm = ({ editTeacher, setEditTeacher, refreshTeachers }) => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    review: "",
    rating: 0,
    photo: null,
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (editTeacher) {
      setFormData({ ...editTeacher, photo: null });
    }
  }, [editTeacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) formDataObj.append(key, formData[key]);
    });

    if (editTeacher) {
      await API.put(`/teachers/${editTeacher._id}`, formDataObj);
      setEditTeacher(null);
    } else {
      await API.post("/teachers", formDataObj);
    }

    setFormData({
      name: "",
      designation: "",
      review: "",
      rating: 0,
      photo: null,
      instagram: "",
      facebook: "",
      linkedin: "",
    });

    refreshTeachers();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <h2 className="text-2xl font-semibold">
        {editTeacher ? "Edit Teacher" : "Add Teacher"}
      </h2>

      {/* Photo */}
      <div>
        <label className="block text-sm font-medium mb-1">Teacher Photo</label>
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, photo: e.target.files[0] })
          }
          className="w-full border rounded-lg p-2"
          required={!editTeacher}
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Teacher Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full border rounded-lg p-2"
          required
        />
      </div>

      {/* Designation */}
      <div>
        <label className="block text-sm font-medium mb-1">Designation</label>
        <input
          type="text"
          value={formData.designation}
          onChange={(e) =>
            setFormData({ ...formData, designation: e.target.value })
          }
          className="w-full border rounded-lg p-2"
          required
        />
      </div>

      {/* Review */}
      <div>
        <label className="block text-sm font-medium mb-1">Review</label>
        <textarea
          value={formData.review}
          onChange={(e) =>
            setFormData({ ...formData, review: e.target.value })
          }
          className="w-full border rounded-lg p-2 min-h-[100px]"
          required
        />
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-2">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              onClick={() => setFormData({ ...formData, rating: star })}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-2xl cursor-pointer ${
                (hoverRating || formData.rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium mb-1">Instagram</label>
        <input
          type="text"
          value={formData.instagram}
          onChange={(e) =>
            setFormData({ ...formData, instagram: e.target.value })
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Facebook</label>
        <input
          type="text"
          value={formData.facebook}
          onChange={(e) =>
            setFormData({ ...formData, facebook: e.target.value })
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">LinkedIn</label>
        <input
          type="text"
          value={formData.linkedin}
          onChange={(e) =>
            setFormData({ ...formData, linkedin: e.target.value })
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
        {editTeacher ? "Update Teacher" : "Add Teacher"}
      </button>
    </form>
  );
};

export default TeacherForm;