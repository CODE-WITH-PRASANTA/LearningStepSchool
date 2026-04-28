import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./PermissionManager.css";

const PermissionManager = () => {
  const [form, setForm] = useState({
    name: "",
    label: "",
  });

  const PERMISSION_OPTIONS = [
    { name: "VIEW_LEADS", label: "Cold Lead" },
    { name: "NEWS_POST", label: "News Posting" },
    { name: "VIEW_STUDENT_DETAILS", label: "Student Hub" },
    { name: "FEE_MANAGEMENT", label: "Student Paytrack" },
    { name: "CLASS_POST", label: "Class Post" },
    { name: "SUBJECT_POST", label: "Subject Post" },
    { name: "CLASSWISE_SUBJECT", label: "Classwise Subject" },
  ];

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
          <select
            name="name"
            value={form.name}
            onChange={(e) => {
              const selected = PERMISSION_OPTIONS.find(
                (p) => p.name === e.target.value,
              );

              setForm({
                name: selected.name,
                label: selected.label,
              });
            }}
            className="input"
          >
            <option value="">Select Permission</option>

            {PERMISSION_OPTIONS.map((p) => (
              <option
              key={p.name}
              value={p.name}
              disabled={permissions.some((perm) => perm.name === p.name)}
            >
              {p.label}
            </option>
            ))}
          </select>

          <div className="form-actions">
            <button className="button">{editId ? "Update" : "Create"}</button>

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
                  <td>{p.label}</td>
                  <td>
                    <span className="code">{p.name}</span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(p)}>
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
