import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBell,
  FiSun,
  FiMoon,
  FiSave,
} from "react-icons/fi";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "Admin User",
    email: "admin@school.com",
    password: "",
    notifications: true,
    theme: "light",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings saved successfully ✅");
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

      {/* SETTINGS CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-indigo-50 via-white to-violet-50
        rounded-2xl border border-indigo-100 shadow-md p-6 lg:p-8 space-y-8"
      >
        {/* ================= PROFILE ================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
            <FiUser /> Profile Settings
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-premium"
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-premium"
              />
            </div>
          </div>
        </section>

        {/* ================= PASSWORD ================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
            <FiLock /> Security
          </h2>

          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-premium"
              placeholder="••••••••"
            />
          </div>
        </section>

        {/* ================= PREFERENCES ================= */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
            <FiBell /> Preferences
          </h2>

          {/* Notifications */}
          <div className="flex items-center justify-between bg-white rounded-xl
            border border-indigo-100 p-4"
          >
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

          {/* Theme */}
          <div className="flex items-center justify-between bg-white rounded-xl
            border border-indigo-100 p-4"
          >
            <div>
              <p className="font-medium text-slate-700">
                Theme Mode
              </p>
              <p className="text-sm text-slate-500">
                Light / Dark appearance
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, theme: "light" })}
                className={`icon-toggle ${
                  form.theme === "light"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-600"
                }`}
              >
                <FiSun />
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, theme: "dark" })}
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

        {/* ================= SAVE ================= */}
        <button
          type="submit"
          className="w-full rounded-xl py-3 text-white font-medium
          bg-gradient-to-r from-indigo-600 to-violet-600
          hover:opacity-90 flex items-center justify-center gap-2"
        >
          <FiSave /> Save Changes
        </button>
      </form>

      {/* ================= STYLES ================= */}
      <style>
        {`
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
          }

          .input-premium:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
          }

          .icon-toggle {
            width: 38px;
            height: 38px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
        `}
      </style>
    </div>
  );
}
