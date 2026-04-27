import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { IMAGE_URL } from "../../api/axios";
import "./ProFilepicture.css";

const ProFilePicture = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
    avatar: "https://i.pravatar.cc/150",
    department: "",
    permissions: [],
  });

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";
    if (typeof imagePath !== "string") return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("/")) return `${IMAGE_URL}${imagePath}`;
    return `${IMAGE_URL}/${imagePath}`;
  };

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

    (async () => {
      try {
        const res = await API.get("/teacher/me");
        const me = res?.data;

        setImageError(false);
        setProfile((prev) => ({
          ...prev,
          name: me?.name || prev.name,
          email: me?.email || prev.email,
          role: me?.role || prev.role || "Teacher",
          phone: me?.contact || prev.phone || "",
          department: me?.department || prev.department || "",
          permissions: Array.isArray(me?.permissions) ? me.permissions : prev.permissions,
          avatar: me?.image ? getImageSrc(me.image) : prev.avatar,
        }));
      } catch (err) {
        console.log(err);
      }
    })();
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

    setSelectedImage(file);
    setProfile({
      ...profile,
      avatar: URL.createObjectURL(file),
    });
  };

  // ================= UPLOAD PROFILE IMAGE ONLY =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!selectedImage) {
        return alert("Please choose an image first");
      }

      const fd = new FormData();
      fd.append("image", selectedImage);

      await API.put("/teacher/me/image", fd);

      // refresh details (and server image url)
      const res = await API.get("/teacher/me");
      const me = res?.data;

      setImageError(false);
      setSelectedImage(null);
      setProfile((prev) => ({
        ...prev,
        avatar: me?.image ? getImageSrc(me.image) : prev.avatar,
      }));

      alert("Profile photo updated!");
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
              onError={() => setImageError(true)}
            />

            <h3 className="ProfilePage__name">{profile.name}</h3>

            <span className="ProfilePage__roleBadge">
              {profile.role}
            </span>

            {!imageError && profile.avatar?.includes("/uploads/") && (
              <p style={{ marginTop: 10, fontSize: 12, color: "rgba(15,23,42,0.55)" }}>
                Profile photo is loaded from server
              </p>
            )}

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
                  className="ProfilePage__input ProfilePage__input--disabled"
                  disabled
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Email</label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="ProfilePage__input ProfilePage__input--disabled"
                  disabled
                />
              </div>

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Phone</label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="ProfilePage__input ProfilePage__input--disabled"
                  disabled
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

              <div className="ProfilePage__field">
                <label className="ProfilePage__label">Department</label>
                <input
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  className="ProfilePage__input ProfilePage__input--disabled"
                  disabled
                />
              </div>
            </div>

            <div className="ProfilePage__field" style={{ marginTop: 14 }}>
              <label className="ProfilePage__label">Permissions</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {(profile.permissions || []).length === 0 ? (
                  <span style={{ color: "rgba(15,23,42,0.55)", fontSize: 13 }}>
                    No permissions assigned
                  </span>
                ) : (
                  profile.permissions.map((p) => (
                    <span
                      key={p}
                      style={{
                        background: "rgba(43, 106, 243, 0.10)",
                        border: "1px solid rgba(43, 106, 243, 0.18)",
                        color: "rgba(35, 79, 190, 0.95)",
                        borderRadius: 999,
                        padding: "5px 10px",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {p}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="ProfilePage__field">
              <label className="ProfilePage__label">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                className="ProfilePage__input ProfilePage__textarea ProfilePage__input--disabled"
                disabled
              />
            </div>

            <div className="ProfilePage__actions">
              <button className="ProfilePage__saveBtn">
                {loading ? "Uploading..." : "Upload Profile Photo"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProFilePicture;