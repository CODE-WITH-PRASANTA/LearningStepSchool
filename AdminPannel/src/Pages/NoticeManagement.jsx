import { useState } from "react";

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
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  /* ---------------- IMAGE ---------------- */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file, preview: URL.createObjectURL(file) });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updated = [...notices];
      updated[editIndex] = form;
      setNotices(updated);
      setEditIndex(null);
    } else {
      setNotices([{ ...form, createdAt: new Date() }, ...notices]);
    }

    resetForm();
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

  /* ---------------- ACTIONS ---------------- */
  const editNotice = (i) => {
    setForm(notices[i]);
    setEditIndex(i);
  };

  const deleteNotice = (i) => {
    setNotices(notices.filter((_, index) => index !== i));
  };

  const downloadPDF = (n) => {
    const blob = new Blob(
      [
        `NOTICE\n\nTitle: ${n.title}\nDate & Time: ${n.dateTime}\nLocation: ${n.location}\n\n${n.description}`,
      ],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${n.title}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------- HELPERS ---------------- */
  const filteredNotices = notices.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (expiry) =>
    expiry && new Date(expiry) < new Date();

  const previewTheme = getTheme(editIndex ?? 0);

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
            {editIndex !== null ? "Edit Notice" : "Create Notice"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Notice Title</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="input-premium"
                required
              />
            </div>

            <div>
              <label className="label">Date & Time</label>
              <input
                type="datetime-local"
                value={form.dateTime}
                onChange={(e) =>
                  setForm({ ...form, dateTime: e.target.value })
                }
                className="input-premium"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input-premium resize-none"
              rows="4"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="label">Location</label>
              <input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className="input-premium"
              />
            </div>

            <div>
              <label className="label">Expiry Date</label>
              <input
                type="date"
                value={form.expiry}
                onChange={(e) =>
                  setForm({ ...form, expiry: e.target.value })
                }
                className="input-premium"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImage} />
          </div>

          <button className="mt-6 w-full rounded-xl py-3 text-white bg-gradient-to-r from-indigo-600 to-violet-600">
            {editIndex !== null ? "Update Notice" : "Publish Notice"}
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

      {/* ================= MOBILE RECORDS ================= */}
      <div className="sm:hidden space-y-4">
        {filteredNotices.length === 0 && (
          <div className="text-center text-slate-400 py-6">
            No notices found
          </div>
        )}

        {filteredNotices.map((n, i) => {
          const t = getTheme(i);
          return (
            <div
              key={i}
              className={`rounded-xl border ${t.border}
              bg-gradient-to-br ${t.bg} p-4 space-y-2`}
            >
              <h3 className={`font-semibold ${t.text}`}>{n.title}</h3>

              <p className="text-xs text-slate-500">
                {new Date(n.dateTime).toLocaleString()}
              </p>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs
                ${
                  isExpired(n.expiry)
                    ? "bg-rose-100 text-rose-600"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {isExpired(n.expiry) ? "Expired" : "Active"}
              </span>

              <div className="flex gap-4 pt-2 text-sm">
                <button onClick={() => editNotice(i)} className="text-indigo-600">
                  Edit
                </button>
                <button onClick={() => deleteNotice(i)} className="text-rose-500">
                  Delete
                </button>
                <button onClick={() => downloadPDF(n)} className="text-emerald-600">
                  PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-md border border-indigo-100 overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredNotices.map((n, i) => (
              <tr key={i} className="border-b">
                <td className="px-6 py-4 font-medium">{n.title}</td>
                <td className="px-6 py-4">
                  {new Date(n.dateTime).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      isExpired(n.expiry)
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }
                  >
                    {isExpired(n.expiry) ? "Expired" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-4 justify-center">
                  <button onClick={() => editNotice(i)} className="text-indigo-600">
                    Edit
                  </button>
                  <button onClick={() => deleteNotice(i)} className="text-rose-500">
                    Delete
                  </button>
                  <button onClick={() => downloadPDF(n)} className="text-emerald-600">
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        `}
      </style>
    </div>
  );
}
