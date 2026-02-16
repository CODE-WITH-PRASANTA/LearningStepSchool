import { useState, useEffect } from "react";
import API, { IMAGE_URL } from "../api/axios";

/* ================= COLOR THEMES ================= */
const themes = [
  { bg: "from-rose-50 to-pink-50", border: "border-rose-200", text: "text-rose-700" },
  { bg: "from-sky-50 to-blue-50", border: "border-sky-200", text: "text-sky-700" },
  { bg: "from-emerald-50 to-green-50", border: "border-emerald-200", text: "text-emerald-700" },
  { bg: "from-violet-50 to-purple-50", border: "border-violet-200", text: "text-violet-700" },
];

const getTheme = (i) => themes[i % themes.length];

export default function NoticeManagement() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    expiry: "",
    image: null,
    preview: null,
  });

  const [notices, setNotices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchNotices = async () => {
    try {
      const res = await API.get("/notices");
      setNotices(res.data.data || res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      image: file,
      preview: URL.createObjectURL(file),
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("dateTime", form.dateTime);
      formData.append("location", form.location);
      formData.append("expiry", form.expiry);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editId) {
        await API.put(`/notices/${editId}`, formData);
        setEditId(null);
      } else {
        await API.post("/notices", formData);
      }

      resetForm();
      fetchNotices();

    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      dateTime: "",
      location: "",
      expiry: "",
      image: null,
      preview: null,
    });
  };

  /* ================= ACTIONS ================= */
  const editNotice = (notice) => {
    setForm({
      title: notice.title || "",
      description: notice.description || "",
      dateTime: notice.dateTime || "",
      location: notice.location || "",
      expiry: notice.expiry || "",
      image: null,
      preview: notice.image ? IMAGE_URL + notice.image : null,
    });

    setEditId(notice._id);
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await API.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  /* ================= HELPERS ================= */
  const filteredNotices = notices.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (expiry) =>
    expiry && new Date(expiry) < new Date();

  const previewTheme = getTheme(0);

  return (
    <div className="space-y-12">

      {/* ================= FORM + PREVIEW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ---------- FORM ---------- */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-indigo-50 via-white to-violet-50
          rounded-2xl shadow-md border border-indigo-100 p-6 lg:p-8"
        >
          <h2 className="text-xl font-semibold mb-6 text-indigo-700">
            {editId ? "Edit Notice" : "Create Notice"}
          </h2>

          <input
            placeholder="Notice Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-premium mb-4"
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-premium mb-4"
            required
          />

          <input
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
            className="input-premium mb-4"
            required
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="input-premium mb-4"
          />

          <input
            type="date"
            value={form.expiry}
            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            className="input-premium mb-4"
          />

          <input type="file" onChange={handleImage} className="mb-4" />

          <button className="w-full bg-indigo-600 text-white py-2 rounded-xl">
            {editId ? "Update Notice" : "Publish Notice"}
          </button>
        </form>

        {/* ---------- LIVE PREVIEW ---------- */}
        <div
          className={`bg-gradient-to-br ${previewTheme.bg}
          rounded-2xl shadow-md border ${previewTheme.border} p-6 lg:p-8`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${previewTheme.text}`}>
            Live Preview
          </h2>

          <div className="bg-white rounded-xl overflow-hidden">
            {form.preview && (
              <img
                src={form.preview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5 space-y-2">
              <h3 className={`font-semibold ${previewTheme.text}`}>
                {form.title || "Notice Title"}
              </h3>
              <p className="text-sm text-slate-600">
                {form.description || "Notice description will appear here."}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ================= SEARCH ================= */}
      <input
        placeholder="Search notice..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-premium w-full sm:max-w-md"
      />

      {/* ================= LIST ================= */}
      <div className="space-y-4">
        {filteredNotices.map((n, i) => {
          const t = getTheme(i);

          return (
            <div
              key={n._id}
              className={`rounded-xl border ${t.border} bg-gradient-to-br ${t.bg} p-4`}
            >
              {n.image && (
                <img
                  src={IMAGE_URL + n.image}
                  alt=""
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}

              <h3 className={`font-semibold ${t.text}`}>{n.title}</h3>

              <p className="text-sm text-slate-600">
                {new Date(n.dateTime).toLocaleString()}
              </p>

              <span
                className={`text-xs ${
                  isExpired(n.expiry)
                    ? "text-rose-600"
                    : "text-emerald-600"
                }`}
              >
                {isExpired(n.expiry) ? "Expired" : "Active"}
              </span>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => editNotice(n)}
                  className="text-indigo-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNotice(n._id)}
                  className="text-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT STYLE */}
      <style>
        {`
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
        `}
      </style>
    </div>
  );
}