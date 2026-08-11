import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiShield,
  FiX,
  FiCheck,
  FiChevronDown,
  FiUser,
  FiCamera,
  FiUsers,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";

import API from "../../api/axios";
import { IMAGE_URL } from "../../api/axios";
import "./CreateTeacher.css";

const CreateTeacher = () => {
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

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
  const [teacherLeaves, setTeacherLeaves] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);

  const [editId, setEditId] = useState(null);

  const [query, setQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

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

  /* =====================================================
     IMAGE
  ===================================================== */

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";

    if (typeof imagePath !== "string") {
      return "";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      return `${IMAGE_URL}${imagePath}`;
    }

    return `${IMAGE_URL}/${imagePath}`;
  };

  /* =====================================================
     FETCH TEACHERS
  ===================================================== */

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/admin/teachers");

      setTeachers(res?.data?.data || []);
    } catch (error) {
      console.error("FETCH TEACHERS:", error);
      alert("Failed to load teachers");
    }
  };

  /* =====================================================
     FETCH PERMISSIONS
  ===================================================== */

  const fetchPermissions = async () => {
    try {
      const res = await API.get("/permissions");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setPermissionsList(data);
    } catch (error) {
      console.error("FETCH PERMISSIONS:", error);
    }
  };

  /* =====================================================
     FETCH LEAVES
  ===================================================== */

  const fetchTeacherLeaves = async () => {
    try {
      const res = await API.get("/admin/leaves");

      setTeacherLeaves(
        res.data?.data || res.data || []
      );
    } catch (error) {
      console.error(
        "FETCH TEACHER LEAVES:",
        error
      );
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchPermissions();
    fetchTeacherLeaves();
  }, []);

  /* =====================================================
     OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      if (
        !event.target.closest(".teacher-menu-wrap")
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SELECT ALL
  ===================================================== */

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setForm((prev) => ({
        ...prev,
        permissions: permissionsList.map(
          (permission) => permission.name
        ),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        permissions: [],
      }));
    }
  };

  /* =====================================================
     CLEAR ALL
  ===================================================== */

  const handleClearAll = () => {
    setForm((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  /* =====================================================
     PERMISSION CHECKBOX
  ===================================================== */

  const handleCheckboxPermissions = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => {
      if (checked) {
        if (prev.permissions.includes(value)) {
          return prev;
        }

        return {
          ...prev,
          permissions: [
            ...prev.permissions,
            value,
          ],
        };
      }

      return {
        ...prev,
        permissions: prev.permissions.filter(
          (permission) =>
            permission !== value
        ),
      };
    });
  };

  /* =====================================================
     IMAGE
  ===================================================== */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  useEffect(() => {
    if (!form.image) {
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(
      form.image
    );

    setImagePreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [form.image]);

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter teacher name");
      return false;
    }

    if (!form.email.trim()) {
      alert("Please enter email");
      return false;
    }

    if (!editId && !form.password.trim()) {
      alert("Please enter password");
      return false;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append(
        "password",
        form.password
      );
      formData.append(
        "contact",
        form.contact
      );
      formData.append(
        "department",
        form.department
      );

      formData.append(
        "permissions",
        JSON.stringify(form.permissions)
      );

      if (form.image) {
        formData.append(
          "image",
          form.image
        );
      }

      if (editId) {
        await API.put(
          `/admin/teachers/${editId}`,
          formData
        );
      } else {
        await API.post(
          "/admin/teachers",
          formData
        );
      }

      await fetchTeachers();

      closeModal();

      return true;
    } catch (error) {
      console.error(
        "SAVE TEACHER:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to save teacher"
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    try {
      await API.delete(
        `/admin/teachers/${id}`
      );

      await fetchTeachers();
    } catch (error) {
      console.error(
        "DELETE TEACHER:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete teacher"
      );
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (teacher) => {
    setForm({
      name: teacher.name || "",
      email: teacher.email || "",
      password: "",
      contact: teacher.contact || "",
      department:
        teacher.department || "",
      image: null,
      imageUrl: teacher.image || "",
      permissions:
        teacher.permissions || [],
    });

    setEditId(teacher._id);

    setIsModalOpen(true);

    setOpenMenuId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

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

    setImagePreview("");
    setSearchTerm("");
    setShowDropdown(false);
  };

  /* =====================================================
     OPEN
  ===================================================== */

  const openCreateModal = () => {
    setEditId(null);
    resetForm();
    setIsModalOpen(true);
  };

  /* =====================================================
     CLOSE
  ===================================================== */

  const closeModal = () => {
    setIsModalOpen(false);
    setOpenMenuId(null);
    setEditId(null);
    resetForm();
  };

  /* =====================================================
     PERMISSION LABELS
  ===================================================== */

  const getPermissionLabels = (
    permissionArray
  ) => {
    return permissionArray?.map(
      (permission) => {
        const found =
          permissionsList.find(
            (item) =>
              item.name === permission
          );

        return found
          ? found.label
          : permission;
      }
    );
  };

  /* =====================================================
     GROUP PERMISSIONS
  ===================================================== */

  const groupedPermissions = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    const filtered =
      permissionsList.filter((permission) => {
        if (!search) return true;

        return (
          permission.label
            ?.toLowerCase()
            .includes(search) ||
          permission.name
            ?.toLowerCase()
            .includes(search) ||
          permission.group
            ?.toLowerCase()
            .includes(search)
        );
      });

    return filtered.reduce(
      (groups, permission) => {
        const group =
          permission.group ||
          "General";

        if (!groups[group]) {
          groups[group] = [];
        }

        groups[group].push(permission);

        return groups;
      },
      {}
    );
  }, [
    permissionsList,
    searchTerm,
  ]);

  /* =====================================================
     FILTER TEACHERS
  ===================================================== */

  const filteredTeachers = useMemo(() => {
    const search =
      query.trim().toLowerCase();

    if (!search) {
      return teachers;
    }

    return teachers.filter(
      (teacher) =>
        teacher?.name
          ?.toLowerCase()
          .includes(search) ||
        teacher?.email
          ?.toLowerCase()
          .includes(search) ||
        teacher?.department
          ?.toLowerCase()
          .includes(search)
    );
  }, [teachers, query]);

  /* =====================================================
     ACTIVE LEAVE
  ===================================================== */

  const getActiveLeave = (
    teacherId
  ) => {
    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    return teacherLeaves.find(
      (leave) => {
        const leaveTeacherId =
          typeof leave.teacher ===
          "object"
            ? leave.teacher?._id
            : leave.teacher;

        if (
          String(leaveTeacherId) !==
            String(teacherId) ||
          leave.status !==
            "approved"
        ) {
          return false;
        }

        const fromDate = new Date(
          leave.fromDate
        );

        const toDate = new Date(
          leave.toDate
        );

        fromDate.setHours(
          0,
          0,
          0,
          0
        );

        toDate.setHours(
          0,
          0,
          0,
          0
        );

        return (
          today >= fromDate &&
          today <= toDate
        );
      }
    );
  };

  /* =====================================================
     COUNTS
  ===================================================== */

  const activeTeachers = teachers.filter(
    (teacher) =>
      !getActiveLeave(teacher._id)
  ).length;

  const leaveTeachers =
    teachers.length -
    activeTeachers;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="teacher-shell"
      onClick={() =>
        setOpenMenuId(null)
      }
    >
      {/* ===============================================
          HEADER
      =============================================== */}

      <header className="teacher-page-header">

        <div className="teacher-header-left">

          <div className="teacher-header-icon">
            <FiUsers />
          </div>

          <div>
            <div className="teacher-breadcrumb">
              Administration
              <span>/</span>
              Teachers
            </div>

            <h1 className="teacher-title">
              Teachers
            </h1>

            <p className="teacher-subtitle">
              Manage teachers, departments
              and access permissions.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="topAddBtn"
          onClick={openCreateModal}
        >
          <FiPlus />
          <span>Add Teacher</span>
        </button>

      </header>

      {/* ===============================================
          STATS
      =============================================== */}

      <section className="teacher-stats">

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon purple">
            <FiUsers />
          </div>

          <div>
            <span>Total Teachers</span>
            <strong>
              {teachers.length}
            </strong>
          </div>

        </div>

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon green">
            <FiCheck />
          </div>

          <div>
            <span>Active</span>
            <strong>
              {activeTeachers}
            </strong>
          </div>

        </div>

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon orange">
            <FiCalendar />
          </div>

          <div>
            <span>On Leave</span>
            <strong>
              {leaveTeachers}
            </strong>
          </div>

        </div>

        <div className="teacher-stat-card">

          <div className="teacher-stat-icon blue">
            <FiShield />
          </div>

          <div>
            <span>Permissions</span>
            <strong>
              {permissionsList.length}
            </strong>
          </div>

        </div>

      </section>

      {/* ===============================================
          MAIN PANEL
      =============================================== */}

      <main className="teacher-panel">

        <div className="teacher-panel-header">

          <div className="teacher-panel-title">

            <div>
              <h2>
                Teacher Directory
              </h2>

              <p>
                {filteredTeachers.length}{" "}
                teachers available
              </p>
            </div>

          </div>

          <button
            type="button"
            className="mobile-add-btn"
            onClick={
              openCreateModal
            }
          >
            <FiPlus />
          </button>

        </div>

        {/* =============================================
            TOOLBAR
        ============================================= */}

        <div className="teacher-toolbar">

          <div className="teacher-tabs">

            <button
              type="button"
              className="teacher-tab active"
            >
              <FiUsers />
              Teachers
            </button>

            <button
              type="button"
              className="teacher-tab"
              onClick={() =>
                navigate(
                  "/admin/leave-management"
                )
              }
            >
              <FiCalendar />
              Leave Requests
            </button>

          </div>

          <div className="teacher-search-box">

            <FiSearch />

            <input
              type="text"
              placeholder="Search teacher, email or department..."
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  setQuery("")
                }
              >
                <FiX />
              </button>
            )}

          </div>

        </div>

        {/* =============================================
            TEACHER GRID
        ============================================= */}

        {filteredTeachers.length ===
        0 ? (

          <div className="teacher-empty">

            <div className="teacher-empty-icon">
              <FiUsers />
            </div>

            <h3>
              {teachers.length === 0
                ? "No teachers yet"
                : "No teachers found"}
            </h3>

            <p>
              {teachers.length === 0
                ? "Add your first teacher to get started."
                : "Try searching with a different name or email."}
            </p>

            {teachers.length === 0 && (
              <button
                type="button"
                onClick={
                  openCreateModal
                }
              >
                <FiPlus />
                Add Teacher
              </button>
            )}

          </div>

        ) : (

          <div className="teacher-grid">

            {filteredTeachers.map(
              (teacher) => {

                const perms =
                  getPermissionLabels(
                    teacher.permissions
                  ) || [];

                const activeLeave =
                  getActiveLeave(
                    teacher._id
                  );

                const initials =
                  String(
                    teacher.name ||
                      "Teacher"
                  )
                    .split(" ")
                    .map(
                      (word) =>
                        word[0]
                    )
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                return (
                  <article
                    key={teacher._id}
                    className="teacher-card"
                  >

                    {/* CARD TOP */}

                    <div className="teacher-card-top">

                      <div
                        className={`teacher-status ${
                          activeLeave
                            ? "leave"
                            : "active"
                        }`}
                      >
                        <span />
                        {activeLeave
                          ? "On Leave"
                          : "Active"}
                      </div>

                      <div className="teacher-menu-wrap">

                        <button
                          type="button"
                          className="teacher-menu-btn"
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            setOpenMenuId(
                              (prev) =>
                                prev ===
                                teacher._id
                                  ? null
                                  : teacher._id
                            );
                          }}
                        >
                          <FiMoreVertical />
                        </button>

                        {openMenuId ===
                          teacher._id && (
                          <div className="teacher-action-menu">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  teacher
                                )
                              }
                            >
                              <FiEdit2 />
                              Edit Teacher
                            </button>

                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                handleDelete(
                                  teacher._id
                                )
                              }
                            >
                              <FiTrash2 />
                              Delete Teacher
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                    {/* AVATAR */}

                    <div className="teacher-profile">

                      <div className="teacher-avatar">

                        {teacher.image ? (
                          <img
                            src={getImageSrc(
                              teacher.image
                            )}
                            alt={
                              teacher.name
                            }
                            loading="lazy"
                            onError={(
                              e
                            ) => {
                              e.currentTarget.style.display =
                                "none";

                              const parent =
                                e.currentTarget
                                  .parentElement;

                              if (
                                parent &&
                                !parent.querySelector(
                                  ".avatar-fallback"
                                )
                              ) {
                                const span =
                                  document.createElement(
                                    "span"
                                  );

                                span.className =
                                  "avatar-fallback";

                                span.textContent =
                                  initials;

                                parent.appendChild(
                                  span
                                );
                              }
                            }}
                          />
                        ) : (
                          <span className="avatar-fallback">
                            {initials}
                          </span>
                        )}

                        <div className="avatar-camera">
                          <FiCamera />
                        </div>

                      </div>

                      <h3 className="teacher-name">
                        {teacher.name}
                      </h3>

                      <span className="teacher-role">
                        <FiBriefcase />
                        Teacher
                      </span>

                    </div>

                    {/* INFO */}

                    <div className="teacher-info">

                      <div className="teacher-info-row">
                        <div className="teacher-info-icon">
                          <FiMail />
                        </div>

                        <div>
                          <span>Email</span>
                          <strong>
                            {teacher.email}
                          </strong>
                        </div>
                      </div>

                      <div className="teacher-info-row">
                        <div className="teacher-info-icon">
                          <FiPhone />
                        </div>

                        <div>
                          <span>Contact</span>
                          <strong>
                            {teacher.contact ||
                              "Not available"}
                          </strong>
                        </div>
                      </div>

                      <div className="teacher-info-row">
                        <div className="teacher-info-icon">
                          <FiBookOpen />
                        </div>

                        <div>
                          <span>Department</span>
                          <strong>
                            {teacher.department ||
                              "Not assigned"}
                          </strong>
                        </div>
                      </div>

                    </div>

                    {/* PERMISSIONS */}

                    <div className="teacher-permission-section">

                      <div className="permission-heading">

                        <span>
                          <FiShield />
                          Permissions
                        </span>

                        <strong>
                          {perms.length}
                        </strong>

                      </div>

                      {perms.length >
                      0 ? (
                        <div className="teacher-permissions">

                          {perms
                            .slice(0, 4)
                            .map(
                              (
                                label,
                                index
                              ) => (
                                <span
                                  key={
                                    index
                                  }
                                  className="permission-chip"
                                >
                                  {
                                    label
                                  }
                                </span>
                              )
                            )}

                          {perms.length >
                            4 && (
                            <span className="permission-chip more">
                              +
                              {perms.length -
                                4}{" "}
                              more
                            </span>
                          )}

                        </div>
                      ) : (
                        <span className="no-permission">
                          No permissions assigned
                        </span>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </main>

      {/* ===============================================
          MODAL
      =============================================== */}

      {isModalOpen && (
        <div
          className="teacher-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="teacher-modal">

            {/* MODAL HEADER */}

            <div className="teacher-modal-header">

              <div className="modal-heading">

                <div className="modal-heading-icon">
                  {editId ? (
                    <FiEdit2 />
                  ) : (
                    <FiPlus />
                  )}
                </div>

                <div>
                  <h2>
                    {editId
                      ? "Edit Teacher"
                      : "Add New Teacher"}
                  </h2>

                  <p>
                    {editId
                      ? "Update teacher information and access."
                      : "Create a teacher profile and assign permissions."}
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeModal
                }
              >
                <FiX />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="teacher-modal-body">

              <form
                className="teacher-form"
                onSubmit={
                  handleSubmit
                }
              >

                {/* BASIC INFORMATION */}

                <div className="form-section">

                  <div className="form-section-title">

                    <div>
                      <h3>
                        Basic Information
                      </h3>

                      <p>
                        Enter teacher profile details.
                      </p>
                    </div>

                  </div>

                  <div className="teacher-form-grid">

                    <div className="teacher-field full">

                      <label>
                        Full Name
                        <span>*</span>
                      </label>

                      <div className="field-input">

                        <FiUser />

                        <input
                          name="name"
                          value={
                            form.name
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Enter full name"
                        />

                      </div>

                    </div>

                    <div className="teacher-field">

                      <label>
                        Email Address
                        <span>*</span>
                      </label>

                      <div className="field-input">

                        <FiMail />

                        <input
                          type="email"
                          name="email"
                          value={
                            form.email
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !!editId
                          }
                          placeholder="teacher@example.com"
                        />

                      </div>

                    </div>

                    <div className="teacher-field">

                      <label>
                        Contact Number
                      </label>

                      <div className="field-input">

                        <FiPhone />

                        <input
                          name="contact"
                          value={
                            form.contact
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="+91 XXXXX XXXXX"
                        />

                      </div>

                    </div>

                    <div className="teacher-field">

                      <label>
                        Department
                      </label>

                      <div className="field-input">

                        <FiBookOpen />

                        <select
                          name="department"
                          value={
                            form.department
                          }
                          onChange={
                            handleChange
                          }
                        >
                          <option value="">
                            Select Department
                          </option>

                          {departments.map(
                            (
                              department
                            ) => (
                              <option
                                key={
                                  department
                                }
                                value={
                                  department
                                }
                              >
                                {
                                  department
                                }
                              </option>
                            )
                          )}
                        </select>

                        <FiChevronDown className="select-arrow" />

                      </div>

                    </div>

                    <div className="teacher-field">

                      <label>
                        Password
                        {!editId && (
                          <span>*</span>
                        )}
                      </label>

                      <div className="field-input">

                        <FiShield />

                        <input
                          type="password"
                          name="password"
                          value={
                            form.password
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !!editId
                          }
                          placeholder={
                            editId
                              ? "Password locked"
                              : "Enter password"
                          }
                        />

                      </div>

                    </div>

                  </div>

                </div>

                {/* PROFILE IMAGE */}

                <div className="form-section">

                  <div className="form-section-title">

                    <div>
                      <h3>
                        Profile Photo
                      </h3>

                      <p>
                        Upload a professional teacher image.
                      </p>
                    </div>

                  </div>

                  <div className="profile-upload">

                    <div className="upload-preview">

                      {imagePreview ||
                      form.imageUrl ? (
                        <img
                          src={
                            imagePreview ||
                            getImageSrc(
                              form.imageUrl
                            )
                          }
                          alt="Preview"
                        />
                      ) : (
                        <FiUser />
                      )}

                    </div>

                    <div className="upload-content">

                      <label
                        htmlFor="teacher-image"
                        className="upload-button"
                      >
                        <FiCamera />
                        Choose Photo
                      </label>

                      <input
                        id="teacher-image"
                        type="file"
                        accept="image/*"
                        onChange={
                          handleImageChange
                        }
                      />

                      <span>
                        JPG, PNG or WEBP
                      </span>

                    </div>

                  </div>

                </div>

                {/* PERMISSIONS */}

                <div className="form-section">

                  <div className="form-section-title">

                    <div>
                      <h3>
                        Access Permissions
                      </h3>

                      <p>
                        Control which modules this teacher can access.
                      </p>
                    </div>

                    <div className="permission-selected-counter">
                      <FiShield />
                      {form.permissions.length} selected
                    </div>

                  </div>

                  <div
                    className={`premium-permission-dropdown ${
                      showDropdown
                        ? "is-open"
                        : ""
                    }`}
                    ref={dropdownRef}
                  >

                    <button
                      type="button"
                      className="permission-dropdown-trigger"
                      onClick={() =>
                        setShowDropdown(
                          (prev) =>
                            !prev
                        )
                      }
                    >

                      <div className="permission-trigger-left">

                        <div className="permission-trigger-icon">
                          <FiShield />
                        </div>

                        <div>

                          <strong>
                            {form.permissions.length >
                            0
                              ? `${form.permissions.length} permissions selected`
                              : "Select Permissions"}
                          </strong>

                          <span>
                            Choose module access
                          </span>

                        </div>

                      </div>

                      <FiChevronDown />

                    </button>

                    {showDropdown && (
                      <div className="permission-dropdown-menu">

                        <div className="permission-search-row">

                          <div className="permission-search">

                            <FiSearch />

                            <input
                              value={
                                searchTerm
                              }
                              onChange={(
                                e
                              ) =>
                                setSearchTerm(
                                  e.target
                                    .value
                                )
                              }
                              placeholder="Search permissions..."
                            />

                            {searchTerm && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSearchTerm(
                                    ""
                                  )
                                }
                              >
                                <FiX />
                              </button>
                            )}

                          </div>

                        </div>

                        <div className="permission-actions">

                          <label>

                            <input
                              type="checkbox"
                              checked={
                                permissionsList.length >
                                  0 &&
                                form.permissions.length ===
                                  permissionsList.length
                              }
                              onChange={
                                handleSelectAll
                              }
                            />

                            <span className="custom-check">
                              <FiCheck />
                            </span>

                            Select All
                          </label>

                          {form.permissions.length >
                            0 && (
                            <button
                              type="button"
                              onClick={
                                handleClearAll
                              }
                            >
                              Clear All
                            </button>
                          )}

                        </div>

                        <div className="permission-dropdown-content">

                          {Object.keys(
                            groupedPermissions
                          ).length ===
                          0 ? (

                            <div className="permission-empty">
                              <FiSearch />
                              <span>
                                No permissions found
                              </span>
                            </div>

                          ) : (

                            Object.entries(
                              groupedPermissions
                            ).map(
                              ([
                                group,
                                items,
                              ]) => (
                                <div
                                  key={
                                    group
                                  }
                                  className="permission-group"
                                >

                                  <div className="permission-group-title">

                                    <span>
                                      {
                                        group
                                      }
                                    </span>

                                    <small>
                                      {
                                        items.length
                                      }
                                    </small>

                                  </div>

                                  <div className="permission-group-grid">

                                    {items.map(
                                      (
                                        permission
                                      ) => {

                                        const selected =
                                          form.permissions.includes(
                                            permission.name
                                          );

                                        return (
                                          <label
                                            key={
                                              permission._id ||
                                              permission.name
                                            }
                                            className={`permission-item ${
                                              selected
                                                ? "selected"
                                                : ""
                                            }`}
                                          >

                                            <input
                                              type="checkbox"
                                              value={
                                                permission.name
                                              }
                                              checked={
                                                selected
                                              }
                                              onChange={
                                                handleCheckboxPermissions
                                              }
                                            />

                                            <span className="custom-check">
                                              <FiCheck />
                                            </span>

                                            <span className="permission-item-content">

                                              <strong>
                                                {
                                                  permission.label
                                                }
                                              </strong>

                                              <small>
                                                {
                                                  permission.name
                                                }
                                              </small>

                                            </span>

                                          </label>
                                        );
                                      }
                                    )}

                                  </div>

                                </div>
                              )
                            )

                          )}

                        </div>

                      </div>
                    )}

                  </div>

                  {form.permissions.length >
                    0 && (
                    <div className="selected-permissions">

                      {getPermissionLabels(
                        form.permissions
                      ).map(
                        (
                          label,
                          index
                        ) => (
                          <span
                            key={
                              index
                            }
                            className="selected-permission-chip"
                          >
                            <FiCheck />
                            {label}
                          </span>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* ACTIONS */}

                <div className="teacher-modal-actions">

                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={
                      closeModal
                    }
                    disabled={
                      loading
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="modal-save-btn"
                    disabled={
                      loading
                    }
                  >

                    {loading ? (
                      <>
                        <span className="save-spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiCheck />

                        {editId
                          ? "Update Teacher"
                          : "Create Teacher"}
                      </>
                    )}

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