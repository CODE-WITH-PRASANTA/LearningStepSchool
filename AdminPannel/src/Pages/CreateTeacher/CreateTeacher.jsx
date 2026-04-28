import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./CreateTeacher.css";

const CreateTeacher = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    permissions: [],
  });

  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [permissionsList, setPermissionsList] = useState([]);

  // ================= FETCH =================
  const fetchTeachers = async () => {
    try {
      const res = await API.get("/admin/teachers");
      setTeachers(res?.data?.data || []);
    } catch {
      alert("Failed to load teachers");
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await API.get("/permissions");
      setPermissionsList(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchPermissions();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectPermissions = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );

    setForm((prev) => ({ ...prev, permissions: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editId) {
        await API.put(`/admin/teachers/${editId}`, form);
        setEditId(null);
      } else {
        await API.post("/admin/teachers", form);
      }

      setForm({ name: "", email: "", password: "", permissions: [] });
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this teacher?");
    if (!confirm) return;

    await API.delete(`/admin/teachers/${id}`);
    fetchTeachers();
  };

  const handleEdit = (teacher) => {
    setForm({
      name: teacher.name,
      email: teacher.email,
      password: "",
      permissions: teacher.permissions || [],
    });
    setEditId(teacher._id);
  };

  const getPermissionLabels = (permArray) => {
    return permArray?.map((p) => {
      const found = permissionsList.find((x) => x.name === p);
      return found ? found.label : p;
    });
  };

  return (
    <div className="teacher-page">
      {/* FORM */}
      <div className="card form-card">
        <h2>{editId ? "Edit Teacher" : "Create Teacher"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            className="input"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="email"
            className="input"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            disabled={editId}
          />

          <input
            name="password"
            className="input"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={editId}
          />

          <label className="label">Permissions</label>

          <select
            multiple
            className="input select-box"
            value={form.permissions}
            onChange={handleSelectPermissions}
          >
            {permissionsList.map((perm) => (
              <option key={perm._id} value={perm.name}>
                {perm.label}
              </option>
            ))}
          </select>

          {/* Selected badges */}
          <div className="badge-container">
            {getPermissionLabels(form.permissions)?.map((label, i) => (
              <span key={i} className="badge">
                {label}
              </span>
            ))}
          </div>

          <div className="form-actions">
            <button className="button">
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </button>

            {editId && (
              <button
                type="button"
                className="button cancel-btn"
                onClick={() => {
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    permissions: [],
                  });
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="card table-card">
        <h2>Teachers</h2>

        {teachers.length === 0 ? (
          <p className="empty">No teachers found</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {teachers.map((t) => (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td>{t.email}</td>
                    <td>
                      <div className="badge-container">
                        {getPermissionLabels(t.permissions)?.map(
                          (label, i) => (
                            <span key={i} className="badge small">
                              {label}
                            </span>
                          )
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTeacher;