import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./PermissionManager.css";

const PermissionManager = () => {
  const [form, setForm] = useState({
    name: "",
    label: "",
  });

  const [permissions, setPermissions] = useState([]);
  const [editId, setEditId] = useState(null);

  // ================= FETCH =================
  const fetchPermissions = async () => {
    try {
      const res = await API.get("/permissions");
      setPermissions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/permissions/${editId}`, form);
        setEditId(null);
      } else {
        await API.post("/permissions", form);
      }

      setForm({ name: "", label: "" });
      fetchPermissions();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this permission?");
    if (!confirm) return;

    await API.delete(`/permissions/${id}`);
    fetchPermissions();
  };

  // ================= EDIT =================
  const handleEdit = (perm) => {
    setForm({
      name: perm.name,
      label: perm.label,
    });
    setEditId(perm._id);
  };

  return (
    <div className="permission-page">
      {/* FORM */}
      <div className="card form-card">
        <h2>{editId ? "Edit Permission" : "Create Permission"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Permission Name (e.g. VIEW_STUDENTS)"
            value={form.name}
            onChange={handleChange}
            className="input"
          />

          <input
            name="label"
            placeholder="Label (e.g. View Students)"
            value={form.label}
            onChange={handleChange}
            className="input"
          />

          <div className="form-actions">
            <button className="button">
              {editId ? "Update" : "Create"}
            </button>

            {editId && (
              <button
                type="button"
                className="button cancel-btn"
                onClick={() => {
                  setForm({ name: "", label: "" });
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
        <h2>Permissions</h2>

        {permissions.length === 0 ? (
          <p className="empty">No permissions found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Label</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {permissions.map((p) => (
                <tr key={p._id}>
                  <td>
                    <span className="code">{p.name}</span>
                  </td>
                  <td>{p.label}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PermissionManager;