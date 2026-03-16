import React, { useState, useEffect } from "react";
import API, { IMAGE_URL } from "../../api/axios";

export default function SubjectAdmin() {

  const emptyForm = {
    subjectName: "",
    className: "",
    teacher: "",
    description: "",
    image: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [subjects, setSubjects] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);

  /* ================= FETCH SUBJECTS ================= */

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subjects");
      setSubjects(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  /* ================= HANDLE INPUT ================= */

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
        image: URL.createObjectURL(file)
      });
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("subjectName", form.subjectName);
      formData.append("className", form.className);
      formData.append("teacher", form.teacher);
      formData.append("description", form.description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editId) {
        await API.put(`/subjects/${editId}`, formData);
      } else {
        await API.post("/subjects", formData);
      }

      fetchSubjects();

      setForm(emptyForm);
      setImageFile(null);
      setEditIndex(null);
      setEditId(null);

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

  const deleteSubject = async (id) => {
    try {
      await API.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */

  const editSubject = (subject, index) => {

    setForm({
      ...subject,
      image: subject.image ? IMAGE_URL + subject.image : ""
    });

    setEditIndex(index);
    setEditId(subject._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= SEARCH ================= */

  const filteredSubjects = subjects.filter((s) =>
    s.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Subject Admin Panel
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4"
        >

          <h2 className="text-xl font-semibold">
            {editIndex !== null ? "Edit Subject" : "Add Subject"}
          </h2>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Subject Name
            </label>

            <input
              name="subjectName"
              value={form.subjectName}
              onChange={handleChange}
              placeholder="Example: Mathematics"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Class
            </label>

            <select
              name="className"
              value={form.className}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Class</option>
              <option>Nursery</option>
              <option>LKG</option>
              <option>UKG</option>
              <option>Class 1</option>
              <option>Class 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Subject Teacher
            </label>

            <input
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              placeholder="Teacher Name"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Subject details"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Subject Image
            </label>

            <input
              type="file"
              onChange={handleImage}
              className="w-full"
            />
          </div>

          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {editIndex !== null ? "Update Subject" : "Post Subject"}
          </button>

        </form>

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-semibold mb-4">
            Live Preview
          </h2>

          <div className="border rounded-lg overflow-hidden bg-gray-50">

            {form.image && (
              <img
                src={form.image}
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-4">

              <h3 className="text-lg font-bold">
                {form.subjectName || "Subject Name"}
              </h3>

              <p className="text-sm text-gray-600">
                Class: {form.className || "Class"}
              </p>

              <p className="text-sm text-gray-600">
                Teacher: {form.teacher || "Teacher Name"}
              </p>

              <p className="mt-2 text-sm text-gray-700">
                {form.description || "Subject description"}
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-8">

        <div className="flex justify-between mb-4">

          <h2 className="text-xl font-semibold">
            Subject List
          </h2>

          <input
            placeholder="Search subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border min-w-[600px]">

            <thead className="bg-gray-200">

              <tr>
                <th className="p-2">Image</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Class</th>
                <th className="p-2">Teacher</th>
                <th className="p-2">Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredSubjects.map((s, index) => (

                <tr key={s._id} className="text-center border-t">

                  <td className="p-2">
                    {s.image && (
                      <img
                        src={IMAGE_URL + s.image}
                        className="w-12 h-12 object-cover rounded mx-auto"
                      />
                    )}
                  </td>

                  <td>{s.subjectName}</td>
                  <td>{s.className}</td>
                  <td>{s.teacher}</td>

                  <td className="p-2 space-x-2">

                    <button
                      onClick={() => editSubject(s, index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSubject(s._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}