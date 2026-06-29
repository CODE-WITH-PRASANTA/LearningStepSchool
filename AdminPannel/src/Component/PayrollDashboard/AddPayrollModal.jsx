import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import API from "../../api/axios";
import "./AddPayrollModal.css";

const currentDate = new Date();

const initialForm = {
  teacherId: "",
  month: String(currentDate.getMonth() + 1),
  year: String(currentDate.getFullYear()),
  baseSalary: "",
  overtimeHours: "0",
  city: "metro",
  status: "Pending",
};

const AddPayrollModal = ({ show, onClose, onAdd, editData }) => {
  const [formData, setFormData] = useState(initialForm);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) return;

    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        const res = await API.get("/admin/teachers");
        setTeachers(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load teachers.");
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, [show]);

  useEffect(() => {
    if (editData) {
      setFormData({
        teacherId: editData.teacherId?._id || editData.teacherId || "",
        month: String(editData.month || currentDate.getMonth() + 1),
        year: String(editData.year || currentDate.getFullYear()),
        baseSalary: String(editData.baseSalary || ""),
        overtimeHours: String(editData.overtimeHours || 0),
        city: editData.city || "metro",
        status: editData.status || "Pending",
      });
    } else {
      setFormData(initialForm);
    }

    setError("");
  }, [editData, show]);

  const selectedTeacher = useMemo(
    () => teachers.find((teacher) => teacher._id === formData.teacherId),
    [teachers, formData.teacherId],
  );

  const estimatedNet = useMemo(() => {
    const base = Number(formData.baseSalary) || 0;
    const overtimeHours = Number(formData.overtimeHours) || 0;
    const totalDays = new Date(Number(formData.year), Number(formData.month), 0).getDate();
    const hourlyRate = base / totalDays / 8;
    return base + hourlyRate * 2 * overtimeHours;
  }, [formData.baseSalary, formData.month, formData.overtimeHours, formData.year]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.teacherId || !formData.month || !formData.year || !formData.baseSalary) {
      setError("Please select teacher, month, year, and base salary.");
      return;
    }

    const payload = {
      teacherId: formData.teacherId,
      month: Number(formData.month),
      year: Number(formData.year),
      baseSalary: Number(formData.baseSalary),
      overtimeHours: Number(formData.overtimeHours) || 0,
      city: formData.city,
      status: formData.status,
    };

    try {
      setSaving(true);

      if (editData?._id) {
        await API.put(`/payroll/${editData._id}`, payload);
      } else {
        await API.post("/payroll", payload);
      }

      onAdd?.();
      setFormData(initialForm);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save payroll.");
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="add-payroll-overlay">
      <div className="add-payroll-modal">
        <div className="add-payroll-header">
          <h2 className="add-payroll-title">
            {editData ? "Edit Payroll" : "Add Payroll"}
          </h2>

          <button className="add-payroll-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="add-payroll-body">
          <form className="add-payroll-form" onSubmit={handleGenerate}>
            {error && <div className="add-payroll-error">{error}</div>}

            <div className="add-payroll-group add-payroll-full">
              <label className="add-payroll-label">Select Teacher</label>
              <select
                className="add-payroll-select"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                disabled={loadingTeachers || saving}
              >
                <option value="">
                  {loadingTeachers ? "Loading teachers..." : "Choose Teacher"}
                </option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} {teacher.department ? `- ${teacher.department}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-payroll-grid-2">
              <div className="add-payroll-group">
                <label className="add-payroll-label">Payroll Month</label>
                <select
                  className="add-payroll-select"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  disabled={saving}
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {new Date(2026, index, 1).toLocaleString("en-IN", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-payroll-group">
                <label className="add-payroll-label">Payroll Year</label>
                <input
                  className="add-payroll-input"
                  type="number"
                  min="2020"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="add-payroll-grid-2">
              <div className="add-payroll-group">
                <label className="add-payroll-label">Base Salary (Rs.)</label>
                <input
                  className="add-payroll-input"
                  type="number"
                  min="0"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="add-payroll-group">
                <label className="add-payroll-label">Overtime Hours</label>
                <input
                  className="add-payroll-input"
                  type="number"
                  min="0"
                  name="overtimeHours"
                  value={formData.overtimeHours}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="add-payroll-grid-2">
              <div className="add-payroll-group">
                <label className="add-payroll-label">City Type</label>
                <select
                  className="add-payroll-select"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="metro">Metro</option>
                  <option value="non-metro">Non Metro</option>
                </select>
              </div>

              <div className="add-payroll-group">
                <label className="add-payroll-label">Status</label>
                <select
                  className="add-payroll-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Reject">Reject</option>
                </select>
              </div>
            </div>

            <div className="add-payroll-group add-payroll-full">
              <label className="add-payroll-label">Estimated Pay Before Attendance</label>
              <input
                className="add-payroll-input add-payroll-netpay"
                type="text"
                value={`Rs. ${estimatedNet.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
                readOnly
              />
            </div>

            {selectedTeacher && (
              <div className="add-payroll-note">
                Attendance and approved leave are calculated from backend records for this month.
              </div>
            )}

            <button className="add-payroll-submit-btn" type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editData
                  ? "Update Payroll Record"
                  : "Generate Payroll"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPayrollModal;
