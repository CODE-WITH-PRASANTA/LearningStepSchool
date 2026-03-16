import React, { useState, useEffect } from "react";
import API, { IMAGE_URL } from "../../api/axios"; // adjust path if needed

export default function ClassesAdmin() {
  const emptyForm = {
    className: "",
    ageGroup: "",
    classTime: "",
    classSize: "",
    tuitionFees: "",
    description: "",
    image: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
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

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE IMAGE ================= */

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      setForm({
        ...form,
        image: URL.createObjectURL(file),
      });
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("className", form.className);
      formData.append("ageGroup", form.ageGroup);
      formData.append("classTime", form.classTime);
      formData.append("classSize", form.classSize);
      formData.append("tuitionFees", form.tuitionFees);
      formData.append("description", form.description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editId) {
        await API.put(`/classes/${editId}`, formData);
      } else {
        await API.post("/classes", formData);
      }

      fetchClasses();

      setForm(emptyForm);
      setImageFile(null);
      setEditIndex(null);
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

  const editClass = (c, index) => {
    setForm({
      ...c,
      image: c.image ? IMAGE_URL + c.image : "",
    });

    setEditIndex(index);
    setEditId(c._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= SEARCH ================= */

  const filteredClasses = classes.filter((c) =>
    c.className?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Classes Admin Panel
      </h1>

      {/* FORM + PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 md:p-6 rounded-lg shadow space-y-4"
        >
          <h2 className="text-xl font-semibold">
            {editIndex !== null ? "Edit Class" : "Add Class"}
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <input
              name="className"
              value={form.className}
              onChange={handleChange}
              placeholder="Example: Nursery"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Age Group</label>
            <input
              name="ageGroup"
              value={form.ageGroup}
              onChange={handleChange}
              placeholder="Example: 2-3 Years"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class Time</label>
            <input
              name="classTime"
              value={form.classTime}
              onChange={handleChange}
              placeholder="Example: 9:00 AM - 12:00 PM"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class Size</label>
            <input
              name="classSize"
              value={form.classSize}
              onChange={handleChange}
              placeholder="Example: 20 Students"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tuition Fees
            </label>
            <input
              name="tuitionFees"
              value={form.tuitionFees}
              onChange={handleChange}
              placeholder="Example: ₹2000 / Month"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Class Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write class activities..."
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Class Image
            </label>
            <input type="file" onChange={handleImage} className="w-full text-sm" />
          </div>

          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            {editIndex !== null ? "Update Class" : "Post Class"}
          </button>
        </form>

        {/* LIVE PREVIEW */}
        <div className="bg-white p-5 md:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

          <div className="border rounded-lg overflow-hidden bg-gray-50">
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-4 space-y-1">
              <h3 className="text-lg font-bold">
                {form.className || "Class Name"}
              </h3>

              <p className="text-sm text-gray-600">
                Age: {form.ageGroup || "Age Group"}
              </p>

              <p className="text-sm text-gray-600">
                Time: {form.classTime || "Class Time"}
              </p>

              <p className="text-sm text-gray-600">
                Size: {form.classSize || "Class Size"}
              </p>

              <p className="text-sm text-gray-600">
                Fees: {form.tuitionFees || "Fees"}
              </p>

              <p className="text-gray-700 pt-2 text-sm">
                {form.description || "Class description preview"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white p-5 md:p-6 rounded-lg shadow mt-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold">Class List</h2>

          <input
            placeholder="Search class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border min-w-[600px]">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Image</th>
                <th className="p-2">Class</th>
                <th className="p-2">Age</th>
                <th className="p-2">Time</th>
                <th className="p-2">Fees</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredClasses.map((c, index) => (
                <tr key={c._id} className="text-center border-t">
                  <td className="p-2">
                    {c.image && (
                      <img
                        src={IMAGE_URL + c.image}
                        alt=""
                        className="w-12 h-12 object-cover rounded mx-auto"
                      />
                    )}
                  </td>

                  <td className="p-2">{c.className}</td>
                  <td className="p-2">{c.ageGroup}</td>
                  <td className="p-2">{c.classTime}</td>
                  <td className="p-2">{c.tuitionFees}</td>

                  <td className="p-2 flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => editClass(c, index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteClass(c._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-gray-500 text-center">
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