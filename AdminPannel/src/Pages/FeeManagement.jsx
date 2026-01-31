import { useState } from "react";

export default function FeeManagement() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [feature, setFeature] = useState("");
  const [features, setFeatures] = useState([]);

  const [fees, setFees] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { title, price, features };

    if (editIndex !== null) {
      const updated = [...fees];
      updated[editIndex] = data;
      setFees(updated);
      setEditIndex(null);
    } else {
      setFees([...fees, data]);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setFeatures([]);
    setFeature("");
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (index) => {
    const fee = fees[index];
    setTitle(fee.title);
    setPrice(fee.price);
    setFeatures(fee.features);
    setEditIndex(index);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = (index) => {
    setFees(fees.filter((_, i) => i !== index));
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

  return (
    <div className="space-y-10">
      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm max-w-3xl"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editIndex !== null ? "Edit Fee Plan" : "Create Fee Plan"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Class Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg px-4 py-2"
            required
          />

          <input
            type="number"
            placeholder="Per Year Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            placeholder="Feature"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            type="button"
            onClick={addFeature}
            className="bg-indigo-600 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        {features.length > 0 && (
          <ul className="mt-3 space-y-2">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex justify-between bg-slate-100 px-3 py-2 rounded"
              >
                <span>{f}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg"
        >
          {editIndex !== null ? "Update Fee Plan" : "Save Fee Plan"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3">Class</th>
              <th className="text-left px-4 py-3">Yearly Fee</th>
              <th className="text-left px-4 py-3">Features</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fees.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-slate-400">
                  No fee plans added
                </td>
              </tr>
            )}

            {fees.map((fee, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3 font-medium">{fee.title}</td>
                <td className="px-4 py-3">₹{fee.price}</td>
                <td className="px-4 py-3">
                  {fee.features.length}
                </td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(i)}
                    className="text-indigo-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => downloadPDF(fee)}
                    className="text-green-600"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
