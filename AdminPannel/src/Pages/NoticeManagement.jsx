import { useState } from "react";

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

    setForm({
      ...form,
      image: file,
      preview: URL.createObjectURL(file),
    });
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
    const content = `
NOTICE

Title: ${n.title}
Date & Time: ${n.dateTime}
Location: ${n.location}

Description:
${n.description}
    `;
    const blob = new Blob([content], { type: "application/pdf" });
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

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md border border-slate-100 
        p-5 sm:p-6 lg:p-8 max-w-4xl w-full"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6">
          {editIndex !== null ? "Edit Notice" : "Create Notice"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <input
            placeholder="Notice Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="input-premium"
            required
          />

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

        <textarea
          placeholder="Notice Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="input-premium mt-4 sm:mt-5 resize-none"
          rows="4"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="input-premium"
          />

          <input
            type="date"
            value={form.expiry}
            onChange={(e) =>
              setForm({ ...form, expiry: e.target.value })
            }
            className="input-premium"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mt-4 sm:mt-5 text-sm w-full"
        />

        <button
          className="mt-6 sm:mt-8 w-full rounded-xl py-3 text-white font-medium
          bg-gradient-to-r from-indigo-600 to-violet-600
          hover:opacity-90 transition"
        >
          {editIndex !== null ? "Update Notice" : "Publish Notice"}
        </button>
      </form>

      {/* ================= SEARCH ================= */}
      <input
        placeholder="Search notice..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-premium w-full sm:max-w-md"
      />

      {/* ================= MOBILE CARDS ================= */}
      <div className="sm:hidden space-y-4">
        {filteredNotices.length === 0 && (
          <div className="text-center text-slate-400 py-6">
            No notices found
          </div>
        )}

        {filteredNotices.map((n, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-2"
          >
            <h3 className="font-semibold text-slate-800">
              {n.title}
            </h3>

            <p className="text-xs text-slate-500">
              {new Date(n.dateTime).toLocaleString()}
            </p>

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium
              ${
                isExpired(n.expiry)
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {isExpired(n.expiry) ? "Expired" : "Active"}
            </span>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => editNotice(i)}
                className="text-indigo-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNotice(i)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => downloadPDF(n)}
                className="text-green-600 text-sm"
              >
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-md border border-slate-100 overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-slate-600">
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredNotices.length === 0 && (
              <tr>
                <td colSpan="4" className="py-10 text-center text-slate-400">
                  No notices found
                </td>
              </tr>
            )}

            {filteredNotices.map((n, i) => (
              <tr
                key={i}
                className="border-b last:border-none hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {n.title}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(n.dateTime).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      isExpired(n.expiry)
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {isExpired(n.expiry) ? "Expired" : "Active"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => editNotice(i)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNotice(i)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => downloadPDF(n)}
                      className="text-green-600 hover:underline"
                    >
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= INPUT STYLE ================= */}
      <style>
        {`
          .input-premium {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid #e2e8f0;
            padding: 0.6rem 1rem;
            outline: none;
            transition: all 0.2s ease;
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
