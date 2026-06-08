import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaPrint,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import API, { IMAGE_URL } from "../../api/axios";

import "./StaffgatePass.css";

const emptyForm = {
  teacherId: "",
  date: new Date().toISOString().split("T")[0],
  time: "",
  reason: "",
  remark: "",
};

const fallbackPhoto = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const getImageUrl = (path) => {
  if (!path) return fallbackPhoto;
  if (path.startsWith("http")) return path;
  return `${IMAGE_URL}${path}`;
};

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
};

const StaffgatePass = () => {
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [gatePasses, setGatePasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const fetchGatePasses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/staff-gate-pass/all");
      setGatePasses(res.data?.data || []);
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to load staff gate passes",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/admin/teachers");
      setTeachers(res.data?.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load teacher staff");
    }
  };

  useEffect(() => {
    fetchGatePasses();
    fetchTeachers();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setStaffSearch("");
    setSelectedTeacher(null);
    setSelectedPass(null);
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const teacherSuggestions = useMemo(() => {
    const query = staffSearch.trim().toLowerCase();
    if (!query) return [];

    return teachers
      .filter((teacher) =>
        [teacher.name, teacher.email, teacher.contact, teacher.department]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 6);
  }, [staffSearch, teachers]);

  const filteredPasses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return gatePasses;

    return gatePasses.filter((item) =>
      [item.name, item.department, item.designation, item.reason, item.remark]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [gatePasses, search]);

  const selectTeacher = (teacher) => {
    setSelectedTeacher(teacher);

    setStaffSearch(""); // hide suggestions

    setFormData((prev) => ({
      ...prev,
      teacherId: teacher._id,
    }));
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setSelectedPass(item);
    setSelectedTeacher({
      _id: item.teacherId,
      name: item.name,
      email: "",
      contact: item.contact,
      department: item.department,
      image: item.photo,
      role: item.designation,
    });
    setStaffSearch(item.name || "");
    setFormData({
      teacherId: item.teacherId,
      date: formatDateForInput(item.date),
      time: item.time || "",
      reason: item.reason || "",
      remark: item.remark || "",
    });
    setShowEditModal(true);
  };

  const closeAddModal = () => {
    resetForm();
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    resetForm();
    setShowEditModal(false);
  };

  const validateForm = () => {
    if (!formData.teacherId) {
      alert("Please select staff from suggestions");
      return false;
    }

    if (!formData.date || !formData.time || !formData.reason) {
      alert("Please fill date, time and reason");
      return false;
    }

    return true;
  };

  const handleAdd = async () => {
    try {
      if (!validateForm()) return;

      await API.post("/staff-gate-pass/create", formData);
      alert("Staff gate pass added successfully");
      closeAddModal();
      fetchGatePasses();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add staff gate pass");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!selectedPass || !validateForm()) return;

      await API.put(`/staff-gate-pass/update/${selectedPass._id}`, {
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        remark: formData.remark,
      });

      alert("Staff gate pass updated successfully");
      closeEditModal();
      fetchGatePasses();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update staff gate pass",
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this staff gate pass?")) return;

      await API.delete(`/staff-gate-pass/delete/${id}`);
      alert("Staff gate pass deleted successfully");
      fetchGatePasses();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete staff gate pass",
      );
    }
  };

  const openPdf = (item) => {
    navigate("/staff-gate-pass/pdf", { state: item });
  };

  const renderStaffProfile = (staff) => {
    if (!staff) return null;

    return (
      <div className="staffgatepass__staff-profile-card">
        <img
          src={getImageUrl(staff.image || staff.photo)}
          alt={staff.name}
          className="staffgatepass__staff-avatar"
        />

        <div className="staffgatepass__staff-information">
          <p>
            <strong>Name :</strong> {staff.name || "-"}
          </p>
          <p>
            <strong>Department :</strong> {staff.department || "-"}
          </p>
          <p>
            <strong>Designation :</strong>{" "}
            {staff.designation ||
              (staff.role === "admin" ? "Admin" : "Teacher")}
          </p>
          <p>
            <strong>Contact :</strong> {staff.contact || "-"}
          </p>
        </div>
      </div>
    );
  };

  const renderForm = (isEdit = false) => (
    <div className="staffgatepass__modal-body">
      {!isEdit && (
        <div className="staffgatepass__staff-search-wrap">
          <div className="staffgatepass__staff-search-section">
            <FaSearch />

            <input
              type="text"
              placeholder="Staff Search.."
              className="staffgatepass__staff-search-input"
              value={staffSearch}
              onChange={(event) => {
                setStaffSearch(event.target.value);
                setSelectedTeacher(null);
                setFormData((prev) => ({ ...prev, teacherId: "" }));
              }}
            />
          </div>

          {teacherSuggestions.length > 0 && (
            <div className="staffgatepass__suggestions">
              {teacherSuggestions.map((teacher) => (
                <button
                  key={teacher._id}
                  type="button"
                  className="staffgatepass__suggestion"
                  onClick={() => selectTeacher(teacher)}
                >
                  <img src={getImageUrl(teacher.image)} alt={teacher.name} />
                  <span>
                    <strong>{teacher.name}</strong>
                    <small>
                      {teacher.department || "No Department"} |{" "}
                      {teacher.contact || teacher.email || "No Contact"}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {renderStaffProfile(selectedTeacher)}

      <div className="staffgatepass__form-grid">
        <div className="staffgatepass__field-group">
          <label className="staffgatepass__field-label">Date :</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={updateForm}
            className="staffgatepass__field-input"
          />
        </div>

        <div className="staffgatepass__field-group">
          <label className="staffgatepass__field-label">Time :</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={updateForm}
            className="staffgatepass__field-input"
          />
        </div>

        <div className="staffgatepass__field-group staffgatepass__field-group--full">
          <label className="staffgatepass__field-label">
            Reason For Leaving :
          </label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={updateForm}
            className="staffgatepass__field-input"
          />
        </div>
      </div>

      <div className="staffgatepass__remark-section">
        <label className="staffgatepass__field-label">Remark :</label>
        <textarea
          rows="3"
          name="remark"
          value={formData.remark}
          onChange={updateForm}
          className="staffgatepass__remark-input"
        />
      </div>

      <div className="staffgatepass__footer-actions">
        {isEdit && (
          <button
            className="staffgatepass__print"
            onClick={() => selectedPass && openPdf(selectedPass)}
          >
            <FaPrint />
            Print
          </button>
        )}

        <button
          className="staffgatepass__cancel-button"
          onClick={isEdit ? closeEditModal : closeAddModal}
        >
          Cancel
        </button>

        <button
          className="staffgatepass__save-button"
          onClick={isEdit ? handleUpdate : handleAdd}
        >
          {isEdit ? "Modify" : "Add"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="staffgatepass">
      <div className="staffgatepass__topbar">
        <div className="staffgatepass__search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Staff..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <button className="staffgatepass__addbtn" onClick={openAddModal}>
          <FaPlus />
        </button>
      </div>

      <div className="staffgatepass__tablewrapper">
        <table className="staffgatepass__table">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>PHOTO</th>
              <th>NAME</th>
              <th>DESIGNATION</th>
              <th>DEPARTMENT</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading staff gate passes...</td>
              </tr>
            ) : filteredPasses.length === 0 ? (
              <tr>
                <td colSpan="8">No staff gate pass found</td>
              </tr>
            ) : (
              filteredPasses.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={getImageUrl(item.photo)}
                      alt={item.name}
                      className="staffgatepass__photo"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.designation}</td>
                  <td>{item.department || "-"}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.time}</td>
                  <td>
                    <div className="staffgatepass__actions">
                      <button
                        className="staffgatepass__edit"
                        onClick={() => openEditModal(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="staffgatepass__delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FaTrash />
                      </button>

                      <button
                        className="staffgatepass__print"
                        onClick={() => openPdf(item)}
                      >
                        <FaPrint />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="staffgatepass__pagination">
        <div className="staffgatepass__pageleft">
          Records
          <strong>{filteredPasses.length}</strong>
        </div>

        <div className="staffgatepass__pageright">
          <span>{filteredPasses.length} total</span>
        </div>
      </div>

      {showAddModal && (
        <div className="staffgatepass__overlay">
          <div className="staffgatepass__modal">
            <div className="staffgatepass__modal-header">
              <h2 className="staffgatepass__modal-title">STAFF GATE PASS</h2>
              <button
                className="staffgatepass__modal-close"
                onClick={closeAddModal}
              >
                <FaTimes />
              </button>
            </div>

            {renderForm(false)}
          </div>
        </div>
      )}

      {showEditModal && selectedPass && (
        <div className="staffgatepass__overlay">
          <div className="staffgatepass__modal">
            <div className="staffgatepass__modal-header">
              <h2 className="staffgatepass__modal-title">STAFF GATE PASS</h2>
              <button
                className="staffgatepass__modal-close"
                onClick={closeEditModal}
              >
                <FaTimes />
              </button>
            </div>

            {renderForm(true)}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffgatePass;
