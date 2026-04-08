import React, { useState } from "react";
import "./ProFilepicture.css";   

const ProFilePicture = () => {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@school.com",
    phone: "9876543210",
    role: "Administrator",
    bio: "Managing school operations and academic activities.",
    avatar: "https://i.pravatar.cc/150",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfile({
      ...profile,
      avatar: URL.createObjectURL(file),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="ProfilePage">
      <div className="ProfilePage__container">

        {/* Header */}
        <div className="ProfilePage__header">
          <h1 className="ProfilePage__title">Teacher Profile</h1>
          <p className="ProfilePage__subtitle">
            Manage your personal information
          </p>
        </div>

        {/* Content */}
        <div className="ProfilePage__content">

          {/* Left */}
          <div className="ProfilePage__sidebarCard">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="ProfilePage__avatar"
            />

            <h3 className="ProfilePage__name">{profile.name}</h3>

            <span className="ProfilePage__roleBadge">
              {profile.role}
            </span>

            <label className="ProfilePage__avatarBtn">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="ProfilePage__hiddenInput"
              />
            </label>
          </div>

          {/* Right */}
          <form className="ProfilePage__formCard" onSubmit={handleSubmit}>
            <div className="ProfilePage__grid">

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Full Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="ProfilePage__input"
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Email</label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="ProfilePage__input"
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Phone</label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="ProfilePage__input"
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Role</label>
                <input
                  name="role"
                  value={profile.role}
                  disabled
                  className="ProfilePage__input ProfilePage__input--disabled"
                />
              </div>
            </div>

            <div className="ProfilePage__field">
              <label className="ProfilePage__label">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="ProfilePage__input ProfilePage__textarea"
              />
            </div>

            <div className="ProfilePage__actions">
              <button type="submit" className="ProfilePage__saveBtn">
                Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProFilePicture;