
import { useState, useEffect } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";

import {
  FiUser,
  FiLock,
  FiBell,
  FiSun,
  FiMoon,
  FiSave,
} from "react-icons/fi";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
    theme: "light",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ==========================================
  // FETCH ADMIN PROFILE
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);

        const res = await API.get("/auth/profile");

        const user = res.data.user;

        setForm((prev) => ({
          ...prev,
          name: user?.name || "",
          email: user?.email || "",
          notifications:
            typeof user?.notifications === "boolean"
              ? user.notifications
              : true,
          theme: user?.theme || "light",
        }));
      } catch (error) {
        console.error("PROFILE FETCH ERROR:", error);

        if (error.response?.status === 401) {
          await Swal.fire({
            title: "Session Expired",
            text: "Please login again.",
            icon: "warning",
            confirmButtonColor: "#6366f1",
          });

          localStorage.clear();
          window.location.href = "/login";
        } else {
          Swal.fire(
            "Error",
            error.response?.data?.message ||
              "Unable to load profile",
            "error"
          );
        }
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  const updateProfile = async () => {
    const res = await API.put("/auth/profile", {
      name: form.name.trim(),
      email: form.email.trim(),
      notifications: form.notifications,
      theme: form.theme,
    });

    return res.data;
  };

  // ==========================================
  // UPDATE PASSWORD
  // ==========================================
  const updatePassword = async () => {
    if (!form.oldPassword) {
      throw new Error("Please enter your old password.");
    }

    if (!form.newPassword) {
      throw new Error("Please enter your new password.");
    }

    if (form.newPassword.length < 6) {
      throw new Error(
        "New password must be at least 6 characters."
      );
    }

    if (!form.confirmPassword) {
      throw new Error("Please confirm your new password.");
    }

    if (form.newPassword !== form.confirmPassword) {
      throw new Error("New passwords do not match.");
    }

    if (form.oldPassword === form.newPassword) {
      throw new Error(
        "New password must be different from old password."
      );
    }

    const res = await API.put("/auth/update-password", {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

    return res.data;
  };

  // ==========================================
  // SAVE ALL CHANGES
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------
    // BASIC PROFILE VALIDATION
    // -------------------------------
    if (!form.name.trim()) {
      Swal.fire(
        "Error",
        "Please enter your name.",
        "error"
      );
      return;
    }

    if (!form.email.trim()) {
      Swal.fire(
        "Error",
        "Please enter your email address.",
        "error"
      );
      return;
    }

    // -------------------------------
    // CHECK PASSWORD SECTION
    // Only validate password if user
    // started entering password fields.
    // -------------------------------
    const changingPassword =
      form.oldPassword ||
      form.newPassword ||
      form.confirmPassword;

    if (changingPassword) {
      if (!form.oldPassword) {
        Swal.fire(
          "Error",
          "Please enter your old password.",
          "error"
        );
        return;
      }

      if (!form.newPassword) {
        Swal.fire(
          "Error",
          "Please enter your new password.",
          "error"
        );
        return;
      }

      if (form.newPassword.length < 6) {
        Swal.fire(
          "Error",
          "New password must be at least 6 characters.",
          "error"
        );
        return;
      }

      if (!form.confirmPassword) {
        Swal.fire(
          "Error",
          "Please confirm your new password.",
          "error"
        );
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        Swal.fire(
          "Error",
          "New passwords do not match.",
          "error"
        );
        return;
      }

      if (form.oldPassword === form.newPassword) {
        Swal.fire(
          "Error",
          "New password must be different from old password.",
          "error"
        );
        return;
      }
    }

    try {
      setLoading(true);

      // ==========================================
      // 1. UPDATE PROFILE + PREFERENCES
      // ==========================================
      await updateProfile();

      // ==========================================
      // 2. UPDATE PASSWORD ONLY IF REQUIRED
      // ==========================================
      if (changingPassword) {
        await updatePassword();
      }

      // ==========================================
      // UPDATE LOCAL STORAGE ADMIN DATA
      // ==========================================
      try {
        const currentAdmin =
          JSON.parse(localStorage.getItem("admin")) || {};

        localStorage.setItem(
          "admin",
          JSON.stringify({
            ...currentAdmin,
            name: form.name.trim(),
            email: form.email.trim(),
            notifications: form.notifications,
            theme: form.theme,
          })
        );
      } catch (storageError) {
        console.warn(
          "Unable to update local admin data:",
          storageError
        );
      }

      // ==========================================
      // CLEAR PASSWORD FIELDS
      // ==========================================
      setForm((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // ==========================================
      // SUCCESS MESSAGE
      // ==========================================
      await Swal.fire({
        title: "Settings Updated 🎉",
        text: changingPassword
          ? "Profile, preferences and password updated successfully."
          : "Profile and preferences updated successfully.",
        icon: "success",
        confirmButtonColor: "#6366f1",
      });
    } catch (error) {
      console.error("SETTINGS UPDATE ERROR:", error);

      // ==========================================
      // SESSION EXPIRED
      // ==========================================
      if (error.response?.status === 401) {
        await Swal.fire({
          title: "Session Expired",
          text: "Please login again.",
          icon: "warning",
          confirmButtonColor: "#6366f1",
        });

        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      // ==========================================
      // SERVER ERROR
      // ==========================================
      Swal.fire(
        "Update Failed",
        error.response?.data?.message ||
          error.message ||
          "Unable to update settings.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-indigo-700">
          Settings
        </h1>

        <p className="text-sm text-slate-500">
          Manage your account preferences
        </p>
      </div>

      {/* MAIN FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-indigo-50 via-white to-violet-50
        rounded-2xl border border-indigo-100 shadow-md p-6 lg:p-8 space-y-8"
      >
        {/* ==========================================
            PROFILE
        ========================================== */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
            <FiUser />
            Profile Settings
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="label">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={fetching}
                className="input-premium"
                placeholder="Enter your name"
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
                value={form.email}
                onChange={handleChange}
                disabled={fetching}
                className="input-premium"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </section>

        {/* ==========================================
            PASSWORD
        ========================================== */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
            <FiLock />
            Security
          </h2>

          {/* OLD PASSWORD */}
          <div>
            <label className="label">
              Old Password
            </label>

            <input
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              className="input-premium"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="label">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="input-premium"
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <p className="text-xs text-slate-400 mt-1">
              Password must contain at least 6 characters.
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="label">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="input-premium"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </section>

        {/* ==========================================
            PREFERENCES
        ========================================== */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
            <FiBell />
            Preferences
          </h2>

          {/* NOTIFICATIONS */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-indigo-100 p-4">
            <div>
              <p className="font-medium text-slate-700">
                Email Notifications
              </p>

              <p className="text-sm text-slate-500">
                Receive system alerts & updates
              </p>
            </div>

            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
              className="w-5 h-5 accent-indigo-600"
            />
          </div>

          {/* THEME */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-indigo-100 p-4">
            <div>
              <p className="font-medium text-slate-700">
                Theme Mode
              </p>

              <p className="text-sm text-slate-500">
                Light / Dark appearance
              </p>
            </div>

            <div className="flex gap-3">
              {/* LIGHT */}
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    theme: "light",
                  }))
                }
                className={`icon-toggle ${
                  form.theme === "light"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-600"
                }`}
              >
                <FiSun />
              </button>

              {/* DARK */}
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    theme: "dark",
                  }))
                }
                className={`icon-toggle ${
                  form.theme === "dark"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-600"
                }`}
              >
                <FiMoon />
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================
            SAVE
        ========================================== */}
        <button
          type="submit"
          disabled={loading || fetching}
          className="w-full rounded-xl py-3 text-white font-medium
          bg-gradient-to-r from-indigo-600 to-violet-600
          hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 transition"
        >
          <FiSave />

          {fetching
            ? "Loading..."
            : loading
            ? "Updating..."
            : "Save Changes"}
        </button>
      </form>

      {/* ==========================================
          LOCAL STYLES
      ========================================== */}
      <style>{`
        .label {
          font-size: 13px;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 4px;
          display: block;
        }

        .input-premium {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          padding: 0.6rem 1rem;
          outline: none;
          background: white;
          color: #334155;
          transition: all 0.2s ease;
        }

        .input-premium:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
        }

        .input-premium:disabled {
          background: #f8fafc;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .icon-toggle {
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .icon-toggle:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
