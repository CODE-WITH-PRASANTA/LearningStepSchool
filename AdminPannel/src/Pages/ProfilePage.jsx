import { useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@school.com",
    phone: "9876543210",
    role: "Administrator",
    bio: "Managing school operations and academic activities.",
    avatar: "https://i.pravatar.cc/150",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
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
    <div className="max-w-5xl mx-auto space-y-10">
      {/* ================= HEADER ================= */}
      <div
        className="rounded-2xl p-6
        bg-gradient-to-r from-indigo-50 via-white to-violet-50
        border border-indigo-100"
      >
        <h1 className="text-2xl font-bold text-indigo-700">
          Admin Profile
        </h1>
        <p className="text-sm text-slate-600">
          Manage your personal information
        </p>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- LEFT : AVATAR ---------- */}
        <div
          className="bg-white rounded-2xl shadow-md border border-slate-100
          p-6 flex flex-col items-center text-center"
        >
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-indigo-200 object-cover"
          />

          <h3 className="mt-4 text-lg font-semibold text-slate-800">
            {profile.name}
          </h3>

          <span className="mt-1 text-xs px-3 py-1 rounded-full
            bg-indigo-100 text-indigo-700 font-medium">
            {profile.role}
          </span>

          <label className="mt-5 cursor-pointer text-sm font-medium
            text-indigo-600 hover:underline">
            Change Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatar}
              className="hidden"
            />
          </label>
        </div>

        {/* ---------- RIGHT : FORM ---------- */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl shadow-md
          border border-slate-100 p-6 lg:p-8 space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Role</label>
              <input
                name="role"
                value={profile.role}
                disabled
                className="input bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
              className="input resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-white font-medium
              bg-gradient-to-r from-indigo-600 to-violet-600
              hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* ================= STYLES ================= */}
      <style>
        {`
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
          }
          .input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
          }
        `}
      </style>
    </div>
  );
}
