import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import "./ProFilepicture.css";

const ProFilePicture = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    avatar: "https://i.pravatar.cc/150",
  });

  const [loading, setLoading] = useState(false);

  // ================= LOAD TEACHER =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("teacher"));

    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Teacher",
      }));
    }
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ================= AVATAR =================
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfile({
      ...profile,
      avatar: URL.createObjectURL(file),
    });
  };

  // ================= UPDATE PROFILE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("teacher"));

      await API.put(`/admin/teachers/${user.id}`, {
        name: profile.name,
        email: profile.email,
      });

      alert("Profile updated successfully!");

      // ✅ update localStorage
      localStorage.setItem(
        "teacher",
        JSON.stringify({
          ...user,
          name: profile.name,
          email: profile.email,
        })
      );
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
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

        <div className="ProfilePage__content">

          {/* LEFT CARD */}
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

          {/* RIGHT FORM */}
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
              <button className="ProfilePage__saveBtn">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProFilePicture;