import { useState, useEffect } from "react";
import API from "../api/axios";

/* ================= COLOR THEMES ================= */
const themes = [
  {
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-400",
  },
  {
    bg: "from-sky-50 to-blue-50",
    border: "border-sky-200",
    text: "text-sky-700",
    dot: "bg-sky-400",
  },
  {
    bg: "from-emerald-50 to-green-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  {
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
];

const getTheme = (i) => themes[i % themes.length];

export default function FeeManagement() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [feature, setFeature] = useState("");
  const [features, setFeatures] = useState([]);
  const [fees, setFees] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  /* ================= FETCH FROM BACKEND ================= */
  const fetchFees = async () => {
    try {
      const res = await API.get("/fees");
      setFees(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  /* ---------------- FEATURES ---------------- */
  const addFeature = () => {
    if (!feature.trim()) return;
    setFeatures([...features, feature]);
    setFeature("");
  };

  const removeFeature = (i) => {
    setFeatures(features.filter((_, index) => index !== i));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, price, features };

    try {
      if (editIndex !== null) {
        await API.put(`/fees/${fees[editIndex]._id}`, data);
        setEditIndex(null);
      } else {
        await API.post("/fees", data);
      }

      setTitle("");
      setPrice("");
      setFeatures([]);
      setFeature("");
      fetchFees();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (i) => {
    const fee = fees[i];
    setTitle(fee.title);
    setPrice(fee.price);
    setFeatures(fee.features);
    setEditIndex(i);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (i) => {
    if (!window.confirm("Delete this fee plan?")) return;

    try {
      await API.delete(`/fees/${fees[i]._id}`);
      fetchFees();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  /* ---------------- PDF ---------------- */
  const downloadPDF = (fee) => {
    const content = `
Fee Receipt

Class : ${fee.title}
Yearly Fee : ₹${fee.price}

Features:
${fee.features.map((f) => `- ${f}`).join("\n")}
    `;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fee.title}-fee.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewTheme = getTheme(editIndex ?? 0);

  return (
    <div className="space-y-12">
      {/* ================= FORM + PREVIEW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ---------- FORM ---------- */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-indigo-50 via-white to-violet-50
          p-6 lg:p-8 rounded-2xl shadow-md border border-indigo-100"
        >
          <h2 className="text-xl font-semibold mb-6 text-indigo-700">
            {editIndex !== null ? "Edit Fee Plan" : "Create Fee Plan"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Class Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-premium"
                required
              />
            </div>

            <div>
              <label className="label">Per Year Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-premium"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Add Feature</label>
            <div className="flex gap-2">
              <input
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                className="input-premium flex-1"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
              >
                Add
              </button>
            </div>
          </div>

          {features.length > 0 && (
            <ul className="mt-4 space-y-2">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-sky-50 px-3 py-2 rounded-lg"
                >
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-rose-500 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl py-3 text-white
            bg-gradient-to-r from-indigo-600 to-violet-600"
          >
            {editIndex !== null ? "Update Fee Plan" : "Save Fee Plan"}
          </button>
        </form>

        {/* ---------- LIVE PREVIEW ---------- */}
        <div
          className={`bg-gradient-to-br ${previewTheme.bg}
          p-6 lg:p-8 rounded-2xl shadow-md border ${previewTheme.border}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${previewTheme.text}`}>
            Live Preview
          </h2>

          <div className="bg-white rounded-xl p-6">
            <h3 className={`text-lg font-semibold ${previewTheme.text}`}>
              {title || "Class Title"}
            </h3>

            <p className="text-3xl font-bold text-indigo-600 mt-2">
              ₹{price || "0"}
              <span className="text-sm font-normal text-slate-500">
                {" "}
                / year
              </span>
            </p>

            <ul className="mt-4 space-y-2">
              {features.length > 0 ? (
                features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${previewTheme.dot}`}
                    />
                    {f}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-400">
                  No features added yet
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}

      <div className="sm:hidden space-y-4">
        {fees.map((fee, i) => {
          const t = getTheme(i);
          return (
            <div
              key={i}
              className={`rounded-xl border ${t.border}
              bg-gradient-to-br ${t.bg} p-4`}
            >
              <h3 className={`font-semibold ${t.text}`}>{fee.title}</h3>
              <p className="text-indigo-600 font-bold">₹{fee.price} / year</p>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEdit(i)}
                  className="text-indigo-600"
                >
                  Edit
                </button>
                <button onClick={handleDelete} className="text-rose-500">
                  Delete
                </button>
                <button
                  onClick={() => downloadPDF(fee)}
                  className="text-emerald-600"
                >
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
          <thead className="bg-indigo-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4">Yearly Fee</th>
              <th className="px-6 py-4">Features</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fees.map((fee, i) => {
              const t = getTheme(i);
              return (
                <tr key={i} className="border-b hover:bg-sky-50">
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      bg-white border ${t.border} ${t.text}`}
                    >
                      {fee.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">₹{fee.price}</td>
                  <td className="px-6 py-4">{fee.features.length}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => handleEdit(i)}
                        className="text-indigo-600"
                      >
                        Edit
                      </button>
                      <button onClick={handleDelete} className="text-rose-500">
                        Delete
                      </button>
                      <button
                        onClick={() => downloadPDF(fee)}
                        className="text-emerald-600"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
