import { useEffect, useState } from "react";
import API from "../../api/axios";
import { IMAGE_URL } from "../../api/axios";
import "./CreateTeacher.css";

const CreateTeacher = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    department: "",
    image: null,
    imageUrl: "",
    permissions: [],
  });


  

  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [permissionsList, setPermissionsList] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";
    if (typeof imagePath !== "string") return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("/")) return `${IMAGE_URL}${imagePath}`;
    return `${IMAGE_URL}/${imagePath}`;
  };

  const departments = [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "MECH",
    "CIVIL",
    "BBA",
    "MBA",
    "MCA",
    "PHD",
  ];

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


  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setForm((prev) => ({
        ...prev,
        permissions: permissionsList.map((p) => p.name),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        permissions: [],
      }));
    }
  };

  const handleClearAll = () => {
    setForm((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []); 
  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxPermissions = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setForm((prev) => ({
        ...prev,
        permissions: [...prev.permissions, value],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((p) => p !== value),
      }));
    }
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  useEffect(() => {
    if (!form.image) {
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(form.image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("contact", form.contact);
    formData.append("department", form.department);
    formData.append("permissions", JSON.stringify(form.permissions));

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      setLoading(true);

      if (editId) {
        await API.put(`/admin/teachers/${editId}`, formData);
      } else {
        await API.post("/admin/teachers", formData);
      }

      fetchTeachers();
      closeModal();
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
      contact: teacher.contact || "",
      department: teacher.department || "",
      image: null, // keep null (file can't preload)
      imageUrl: teacher.image || "",
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

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      contact: "",
      department: "",
      image: null,
      imageUrl: "",
      permissions: [],
    });
  };

  const openCreateModal = () => {
    setEditId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOpenMenuId(null);
    setEditId(null);
    resetForm();
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (t?.name || "").toLowerCase().includes(q) ||
      (t?.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="teacher-shell" onClick={() => setOpenMenuId(null)}>
      <div className="teacher-pageTop">
        <div className="teacher-topLeft">
          <h1 className="teacher-title">Teachers</h1>
          <p className="teacher-subtitle">
            Dashboard / Administration / Teachers
          </p>
        </div>
        <button type="button" className="topAddBtn" onClick={openCreateModal}>
          <span className="topAddBtnPlus">+</span> Add Teacher
        </button>
      </div>

      <div className="teacher-panel">
        <div className="teacher-panelTop">
          <div className="teacher-tabs">
            <button type="button" className="tab tab--active">
              Teachers
            </button>
            <button type="button" className="tab tab--disabled" disabled>
              Leave Request
            </button>
          </div>

          <div className="teacher-toolbar">
            <div className="viewPills" aria-hidden="true">
              <button
                type="button"
                className="viewPill viewPill--active"
                title="Grid view"
              >
                ▦
              </button>
              <button
                type="button"
                className="viewPill"
                title="List view"
                disabled
              >
                ≡
              </button>
            </div>

            <div className="searchWrap">
              <span className="searchIcon" aria-hidden="true">
                🔍
              </span>
              <input
                className="searchInput"
                placeholder="Search Teacher"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="emptyState">
            <p className="emptyTitle">
              {teachers.length === 0 ? "No teachers found" : "No results"}
            </p>
            <p className="emptySubtitle">
              {teachers.length === 0
                ? "Click “Add Teacher” to create your first teacher."
                : "Try searching by name or email."}
            </p>
          </div>
        ) : (
          <div className="teacher-gridCards">
            {filteredTeachers.map((t) => {
              const perms = getPermissionLabels(t.permissions) || [];
              return (
                <div key={t._id} className="teacher-card">
                  <div className="teacher-cardTop">
                    <span className="statusPill statusPill--active">
                      Active
                    </span>

                    <div
                      className="menuWrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) =>
                          prev === t._id ? null : t._id,
                        );
                      }}
                    >
                      <button
                        type="button"
                        className="kebabBtn"
                        aria-label="More actions"
                      >
                        ⋯
                      </button>
                      {openMenuId === t._id && (
                        <div className="menu">
                          <button
                            type="button"
                            className="menuItem"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(t);
                              setIsModalOpen(true);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="menuItem menuItem--danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              handleDelete(t._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="teacher-avatar">
                    {t.image ? (
                      <img
                        src={getImageSrc(t.image)}
                        alt={t.name}
                        loading="lazy"
                        onError={(e) => {
                          // fallback to letter avatar if image fails
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      String(t?.name || "T")
                        .slice(0, 1)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="teacher-name">{t.name}</div>
                  <div className="teacher-role">Teacher</div>

                  <div className="teacher-cardDivider" />

                  <div className="teacher-info">
                    <div className="infoRow">
                      <span className="infoIcon" aria-hidden="true">
                        ✉
                      </span>
                      <span className="infoText">{t.email}</span>
                    </div>
                    <div className="infoRow">
                      <span className="infoIcon">📞</span>
                      <span className="infoText">{t.contact || "N/A"}</span>
                    </div>

                    <div className="infoRow">
                      <span className="infoIcon">🏫</span>
                      <span className="infoText">{t.department || "N/A"}</span>
                    </div>

                    <div className="infoRow">
                      <span className="infoIcon" aria-hidden="true">
                        🔐
                      </span>
                      <span className="infoText">
                        {perms.length} permissions
                      </span>
                    </div>
                  </div>

                  {perms.length > 0 && (
                    <div className="badge-container">
                      {perms.slice(0, 6).map((label, i) => (
                        <span key={i} className="badge badge--sm">
                          {label}
                        </span>
                      ))}
                      {perms.length > 6 && (
                        <span className="badge badge--sm badge--muted">
                          +{perms.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="modalOverlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="modalCard">
            <div className="modalHead">
              <h2 className="modalTitle">
                {editId ? "Edit Teacher" : "Add Teacher"}
              </h2>
              <button
                type="button"
                className="modalClose"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modalBody">
              <form
                onSubmit={async (e) => {
                  const ok = await handleSubmit(e);
                  if (ok) closeModal();
                }}
                className="modalForm"
              >
                <div className="modalGrid">
                  <div className="field field--full">
                    <label className="label" htmlFor="m-name">
                      Full Name
                    </label>
                    <input
                      id="m-name"
                      name="name"
                      className="input"
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="m-email">
                      Email Address
                    </label>
                    <input
                      id="m-email"
                      name="email"
                      className="input"
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={handleChange}
                      disabled={editId}
                      autoComplete="email"
                    />
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="m-contact">
                      Phone Number
                    </label>
                    <input
                      id="m-contact"
                      name="contact"
                      className="input"
                      placeholder="Enter contact number"
                      value={form.contact}
                      onChange={handleChange}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="m-department">
                      Department
                    </label>
                    <select
                      id="m-department"
                      name="department"
                      className="input"
                      value={form.department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="m-password">
                      Password
                    </label>
                    <input
                      id="m-password"
                      name="password"
                      className="input"
                      placeholder={
                        editId ? "Locked in edit mode" : "Enter password"
                      }
                      value={form.password}
                      onChange={handleChange}
                      disabled={editId}
                      autoComplete={editId ? "off" : "new-password"}
                    />
                  </div>

                  <div className="field field--full">
                    <label className="label" htmlFor="m-image">
                      Profile Photo
                    </label>
                    <input
                      id="m-image"
                      type="file"
                      name="image"
                      className="input input--file"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    {(imagePreview || form.imageUrl) && (
                      <div className="imagePreview">
                        <img
                          src={imagePreview || getImageSrc(form.imageUrl)}
                          alt="Teacher preview"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="field field--full">
  <label className="label">Permissions</label>

  <div className={`dropdown ${showDropdown ? "open" : ""}`}>
    
    {/* Toggle */}
    <div
      className="dropdown-toggle"
      onClick={() => setShowDropdown((prev) => !prev)}
    >
      {form.permissions.length > 0
        ? `${form.permissions.length} selected`
        : "Select Permissions"}
    </div>

    {/* Menu */}
    {showDropdown && (
      <div className="dropdown-menu">
        
        {/* 🔍 Search (Premium Feature) */}
        <input
          type="text"
          placeholder="Search permissions..."
          className="dropdown-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* ✅ Select All */}
        <label className="dropdown-item select-all">
          <input
            type="checkbox"
            checked={
              permissionsList.length > 0 &&
              form.permissions.length === permissionsList.length
            }
            onChange={handleSelectAll}
          />
          <span>Select All</span>
        </label>

        {/* Divider */}
        <div className="dropdown-divider"></div>

        {/* Permission List */}
        {permissionsList
          .filter((perm) =>
            perm.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((perm) => (
            <label key={perm._id} className="dropdown-item">
              <input
                type="checkbox"
                value={perm.name}
                checked={form.permissions.includes(perm.name)}
                onChange={handleCheckboxPermissions}
              />
              <span>{perm.label}</span>
            </label>
          ))}

        {/* ❌ Clear All */}
        {form.permissions.length > 0 && (
          <>
            <div className="dropdown-divider"></div>
            <div className="dropdown-clear" onClick={handleClearAll}>
              Clear All
            </div>
          </>
        )}
      </div>
    )}
  </div>

  {/* Badges */}
  <div className="badge-container">
    {getPermissionLabels(form.permissions)?.map((label, i) => (
      <span key={i} className="badge">
        {label}
      </span>
    ))}
  </div>
</div>
                </div>

                <div className="modalActions">
                  <button className="modalSubmit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : editId
                        ? "Update Teacher"
                        : "Add Teacher"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTeacher;
