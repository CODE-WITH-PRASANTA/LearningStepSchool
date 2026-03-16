import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function ClassesAdmin() {
  const emptyForm = {
    className: "",
    sectionName: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  /* ================= FETCH CLASSES ================= */

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");
      setClasses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value || "",
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/classes/${editId}`, form);
      } else {
        await API.post("/classes", form);
      }

      fetchClasses();
      setForm(emptyForm);
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

  const deleteClass = async (id) => {
    try {
      await API.delete(`/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */

  const editClass = (c) => {
    setForm({
      className: c.className || "",
      sectionName: c.sectionName || "",
    });

    setEditId(c._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= SEARCH ================= */

  const filteredClasses = classes.filter((c) =>
    (c.className || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center md:text-left">
        Classes Admin Panel
      </h1>

      {/* FORM */}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">
            {editId ? "Edit Class" : "Add Class"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Class Name
              </label>

              <input
                name="className"
                value={form.className || ""}
                onChange={handleChange}
                placeholder="Example: Class 1"
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Section Name
              </label>

              <input
                name="sectionName"
                value={form.sectionName || ""}
                onChange={handleChange}
                placeholder="Example: A"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {editId ? "Update Class" : "Post Class"}
          </button>
        </form>
      </div>

      {/* TABLE */}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Class List</h2>

          <input
            placeholder="Search class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border min-w-[400px]">
            <thead className="bg-gray-200">
              <tr className="text-sm md:text-base">
                <th className="p-2">Class</th>
                <th className="p-2">Section</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredClasses.map((c) => (
                <tr
                  key={c._id}
                  className="text-center border-t text-sm md:text-base"
                >
                  <td className="p-2">{c.className}</td>
                  <td className="p-2">{c.sectionName}</td>

                  <td className="p-2">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => editClass(c)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteClass(c._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-gray-500 text-center">
                    No classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
