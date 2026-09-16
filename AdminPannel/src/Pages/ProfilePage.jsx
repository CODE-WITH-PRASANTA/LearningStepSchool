
import { useEffect, useState } from "react";

import API, { IMAGE_URL } from "../api/axios";

import Swal from "sweetalert2";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Administrator",
    bio: "",
    avatar: "",
  });

  // Actual selected image file
  const [avatarFile, setAvatarFile] = useState(null);

  // Loading profile
  const [loading, setLoading] = useState(true);

  // Saving profile
  const [saving, setSaving] = useState(false);

  /* =====================================================
     GET PROFILE
  ===================================================== */

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await API.get("/auth/profile");

      const user = res.data.user;

      setProfile({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "Administrator",
        bio: user?.bio || "",
        avatar: user?.avatar || "",
      });

      // Clear selected file when profile is loaded
      setAvatarFile(null);
    } catch (error) {
      console.error("FETCH PROFILE ERROR:", error);

      if (error.response?.status === 401) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
          confirmButtonColor: "#6366f1",
        }).then(() => {
          localStorage.clear();
          window.location.href = "/login";
        });

        return;
      }

      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Unable to load profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     AVATAR SELECT
  ===================================================== */

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    /* ---------- FILE TYPE ---------- */

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "Invalid File",
        text: "Please select a valid image file.",
        icon: "error",
        confirmButtonColor: "#6366f1",
      });

      e.target.value = "";
      return;
    }

    /* ---------- FILE SIZE ---------- */

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        title: "File Too Large",
        text: "Profile image must be less than 10MB.",
        icon: "error",
        confirmButtonColor: "#6366f1",
      });

      e.target.value = "";
      return;
    }

    // Save actual file for Multer
    setAvatarFile(file);

    // Temporary preview
    const previewUrl = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      avatar: previewUrl,
    }));
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ---------- NAME VALIDATION ---------- */

    if (!profile.name.trim()) {
      Swal.fire(
        "Error",
        "Name is required",
        "error"
      );

      return;
    }

    /* ---------- EMAIL VALIDATION ---------- */

    if (!profile.email.trim()) {
      Swal.fire(
        "Error",
        "Email is required",
        "error"
      );

      return;
    }

    try {
      setSaving(true);

      /* =================================================
         FORM DATA

         IMPORTANT:
         We use FormData because avatar is a file.
      ================================================= */

      const formData = new FormData();

      formData.append(
        "name",
        profile.name.trim()
      );

      formData.append(
        "email",
        profile.email.trim()
      );

      formData.append(
        "phone",
        profile.phone.trim()
      );

      formData.append(
        "bio",
        profile.bio.trim()
      );

      /* ---------- AVATAR ---------- */

      if (avatarFile) {
        formData.append(
          "avatar",
          avatarFile
        );
      }

      /* =================================================
         SEND TO BACKEND

         Backend:
         protect
         ↓
         upload.single("avatar")
         ↓
         convertToWebp
         ↓
         updateAdminProfile
      ================================================= */

      const res = await API.put(
        "/auth/profile",
        formData
      );

      /* =================================================
         UPDATE PROFILE FROM DATABASE RESPONSE
      ================================================= */

      const updatedUser = res.data.user;

      setProfile({
        name: updatedUser?.name || "",
        email: updatedUser?.email || "",
        phone: updatedUser?.phone || "",
        role:
          updatedUser?.role ||
          "Administrator",
        bio: updatedUser?.bio || "",
        avatar:
          updatedUser?.avatar || "",
      });

      // The file has now been permanently uploaded
      setAvatarFile(null);

      /* =================================================
         UPDATE LOCAL STORAGE
      ================================================= */

      try {
        const currentAdmin =
          JSON.parse(
            localStorage.getItem("admin")
          ) || {};

        localStorage.setItem(
          "admin",
          JSON.stringify({
            ...currentAdmin,
            id: updatedUser?._id || updatedUser?.id,
            name: updatedUser?.name || "",
            email: updatedUser?.email || "",
            phone: updatedUser?.phone || "",
            role:
              updatedUser?.role ||
              "Administrator",
            bio: updatedUser?.bio || "",
            avatar:
              updatedUser?.avatar || "",
            notifications:
              updatedUser?.notifications ??
              true,
            theme:
              updatedUser?.theme ||
              "light",
          })
        );
      } catch (storageError) {
        console.warn(
          "LOCAL STORAGE UPDATE ERROR:",
          storageError
        );
      }

      /* =================================================
         SUCCESS
      ================================================= */

      Swal.fire({
        title: "Profile Updated 🎉",
        text:
          "Your profile has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#6366f1",
      });
    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );

      /* ---------- SESSION EXPIRED ---------- */

      if (error.response?.status === 401) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
          confirmButtonColor: "#6366f1",
        }).then(() => {
          localStorage.clear();
          window.location.href = "/login";
        });

        return;
      }

      /* ---------- ERROR ---------- */

      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Profile update failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-indigo-600 font-medium">
          Loading profile...
        </div>
      </div>
    );
  }

  /* =====================================================
     AVATAR URL
  ===================================================== */

  const getAvatarUrl = () => {
    if (!profile.avatar) {
      return "";
    }

    // Temporary selected image
    if (profile.avatar.startsWith("blob:")) {
      return profile.avatar;
    }

    // Existing database image
    if (profile.avatar.startsWith("http")) {
      return profile.avatar;
    }

    return `${IMAGE_URL}${profile.avatar}`;
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          rounded-2xl
          p-6
          bg-gradient-to-r
          from-indigo-50
          via-white
          to-violet-50
          border
          border-indigo-100
        "
      >
        <h1 className="text-2xl font-bold text-indigo-700">
          Admin Profile
        </h1>

        <p className="text-sm text-slate-600">
          Manage your personal information
        </p>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* =================================================
            AVATAR
        ================================================= */}

        <div
          className="
            bg-white
            rounded-2xl
            shadow-md
            border
            border-slate-100
            p-6
            flex
            flex-col
            items-center
            text-center
          "
        >
          {/* AVATAR */}

          {profile.avatar ? (
            <img
              src={getAvatarUrl()}
              alt="Avatar"
              className="
                w-32
                h-32
                rounded-full
                border-4
                border-indigo-200
                object-cover
              "
            />
          ) : (
            <div
              className="
                w-32
                h-32
                rounded-full
                border-4
                border-indigo-200
                bg-indigo-100
                flex
                items-center
                justify-center
                text-4xl
                font-bold
                text-indigo-600
              "
            >
              {profile.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>
          )}

          {/* NAME */}

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            {profile.name}
          </h3>

          {/* ROLE */}

          <span
            className="
              mt-1
              text-xs
              px-3
              py-1
              rounded-full
              bg-indigo-100
              text-indigo-700
              font-medium
            "
          >
            {profile.role}
          </span>

          {/* CHANGE AVATAR */}

          <label
            className="
              mt-5
              cursor-pointer
              text-sm
              font-medium
              text-indigo-600
              hover:underline
            "
          >
            Change Avatar

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatar}
              className="hidden"
            />
          </label>

          {/* SELECTED FILE */}

          {avatarFile && (
            <p className="mt-2 text-xs text-slate-400 max-w-[200px] truncate">
              {avatarFile.name}
            </p>
          )}

          {/* UPLOAD INFO */}

          <p className="mt-2 text-xs text-slate-400">
            JPG, PNG, WEBP • Max 10MB
          </p>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            lg:col-span-2
            bg-white
            rounded-2xl
            shadow-md
            border
            border-slate-100
            p-6
            lg:p-8
            space-y-6
          "
        >

          {/* NAME + EMAIL */}

          <div className="grid sm:grid-cols-2 gap-5">

            {/* NAME */}

            <div>
              <label className="label">
                Full Name
              </label>

              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your name"
                disabled={saving}
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="label">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter email"
                disabled={saving}
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="label">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="input"
                placeholder="Enter phone number"
                disabled={saving}
              />
            </div>

            {/* ROLE */}

            <div>
              <label className="label">
                Role
              </label>

              <input
                name="role"
                value={profile.role}
                disabled
                className="input bg-slate-50"
              />
            </div>
          </div>

          {/* BIO */}

          <div>
            <label className="label">
              Bio
            </label>

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
              className="input resize-none"
              placeholder="Tell something about yourself..."
              disabled={saving}
            />
          </div>

          {/* SAVE */}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="
                px-8
                py-3
                rounded-xl
                text-white
                font-medium
                bg-gradient-to-r
                from-indigo-600
                to-violet-600
                hover:opacity-90
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`
        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 4px;
        }

        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          padding: 0.6rem 1rem;
          outline: none;
          transition: all 0.2s ease;
          background: white;
          color: #334155;
        }

        .input:focus {
          border-color: #6366f1;
          box-shadow:
            0 0 0 2px
            rgba(99, 102, 241, 0.15);
        }

        .input:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

