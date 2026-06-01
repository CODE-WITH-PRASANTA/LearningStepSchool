import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./AddPayrollModal.css";
import API from "../../api/axios";

const AddPayrollModal = ({ show, onClose, onAdd, editData }) => {
  const [formData, setFormData] = useState({
    employee: "",
    payDate: "",
    basicSalary: "50000",
    hra: "10000",
    bonus: "5000",
    deduction: "4",
    totalDays: "0",
    workingDays: "0",
    overtimeHours: "0",
    city: "metro",
    status: "Pending",
  });
  const [teachers, setTeachers] = useState([]);

  const getMonthDays = (year, month) => new Date(year, month, 0).getDate();

  const fetchTeacherAttendanceSummary = async (teacherId, month, year) => {
    try {
      const res = await API.get(`/teacher-attendance?month=${month}&year=${year}`);
      const list = res.data?.data || [];
      const teacherRecords = Array.isArray(list)
        ? list.filter((item) => item.teacherId?._id === teacherId)
        : [];

      const present = teacherRecords.filter((item) => item.status === "Present").length;
      const leave = teacherRecords.filter((item) => item.status === "Leave").length;
      const totalDays = getMonthDays(year, month);
      const workingDays = present + leave;

      setFormData((prev) => ({
        ...prev,
        totalDays: String(totalDays),
        workingDays: String(workingDays),
      }));
    } catch (err) {
      console.error("Attendance summary fetch failed:", err.response?.data || err.message);
    }
  };

  // 🔥 PREFILL DATA (EDIT MODE)
  useEffect(() => {
    if (editData) {
      setFormData({
        employee: editData.teacherId?._id || "", // ✅ correct
        payDate:
          editData.year && editData.month
            ? `${editData.year}-${String(editData.month).padStart(2, "0")}-01`
            : "",
        basicSalary: editData.baseSalary || "",
        hra: "0",
        bonus: editData.overtimeAmount || "0",
        deduction: "0",
        totalDays: String(getMonthDays(editData.year, editData.month || 1)),
        workingDays: String(editData.workingDays || 0),
        overtimeHours: String(editData.overtimeHours || 0),
        city: editData.city || "metro",
        status: editData.status || "Pending",
      });
    }
  }, [editData]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // your route is /api/admin/teachers (with auth + permission)
        const res = await API.get("/admin/teachers");
        const list = res.data?.data || res.data; // handle both shapes
        setTeachers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(
          "Teacher fetch error:",
          err.response?.data || err.message,
        );
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!formData.employee || !formData.payDate) return;

    const date = new Date(formData.payDate);
    if (Number.isNaN(date.getTime())) return;

    fetchTeacherAttendanceSummary(
      formData.employee,
      date.getMonth() + 1,
      date.getFullYear(),
    );
  }, [formData.employee, formData.payDate]);

  if (!show) return null;

// 💰 CALCULATE ESTIMATED TOTAL (simplified preview)
  const estimatedGross = Number(formData.basicSalary) +
    (Number(formData.basicSalary) * (formData.city === 'metro' ? 0.5 : 0.4)) + // HRA
    1600 + // Conveyance
    (Number(formData.basicSalary) / 12) + // LTA
    (15000 / 12); // Medical

  const estimatedDeductions = (Number(formData.basicSalary) * 0.12) + // PF
    (Number(formData.basicSalary) < 21000 ? Number(formData.basicSalary) * 0.0075 : 0) + // ESI
    Math.max(0, ((estimatedGross * 12 - 50000 - (Number(formData.basicSalary) * (formData.city === 'metro' ? 0.5 : 0.4) * 12) - 19200) * 0.05) / 12); // Tax

  const estimatedNet = estimatedGross - estimatedDeductions;

  // 🔁 INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 CREATE + UPDATE API
  const handleGenerate = async () => {
    try {
      // ✅ validation
      if (!formData.employee || !formData.payDate) {
        alert("Please select teacher and date");
        return;
      }

      const date = new Date(formData.payDate);

      if (isNaN(date)) {
        alert("Invalid date");
        return;
      }

      // ✅ payload (aligned with backend)
      const payload = {
        teacherId: formData.employee,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        totalDays: Number(formData.totalDays) || 0,
        workingDays: Number(formData.workingDays) || 0,
        baseSalary: Number(formData.basicSalary) || 0,
        overtimeHours: Number(formData.overtimeHours) || 0,
        city: formData.city || "metro",
        status: formData.status || "Pending",
      };

      // ✅ API CALL
      if (editData) {
        await API.put(`/payroll/${editData._id}`, payload);
        alert("Payroll Updated Successfully");
      } else {
        await API.post("/payroll", payload);
        alert("Payroll Created Successfully");
      }

      // ✅ CORRECT RESET (NO useState here)
      setFormData({
        employee: "",
        payDate: "",
        basicSalary: "50000",
        hra: "10000",
        bonus: "5000",
        deduction: "4",
        totalDays: "0",
        workingDays: "0",
        overtimeHours: "0",
        city: "metro",
        status: "Pending",
      });

      onClose();
      onAdd();
    } catch (err) {
      console.error("Error saving payroll:", err.response?.data);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  console.log("Selected teacherId:", formData.employee);
  return (
    <div className="payroll-modal-overlay">
      <div className="payroll-modal">
        <div className="modal-head">
          <h2>{editData ? "Edit Payroll" : "Add Payroll"}</h2>

          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          <div className="input-group full">
            <label>Employee Name</label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group full">
            <label>Select Pay Date</label>
            <input
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleChange}
            />
          </div>

          {/* 🔥 NEW: DAYS INPUTS */}
          <div className="grid-2">
            <div className="input-group">
              <label>Total Days</label>
              <input
                type="number"
                name="totalDays"
                value={formData.totalDays}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="input-group">
              <label>Working Days</label>
              <input
                type="number"
                name="workingDays"
                value={formData.workingDays}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Basic Salary</label>
              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Overtime Hours</label>
              <input
                type="number"
                name="overtimeHours"
                value={formData.overtimeHours}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="input-group full">
            <label>City Type (for HRA calculation)</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
            >
              <option value="metro">Metro City (50% HRA)</option>
              <option value="non-metro">Non-Metro City (40% HRA)</option>
            </select>
          </div>

          {/* 🔥 NEW: STATUS */}
          <div className="input-group full">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          <div className="input-group full">
            <label>Estimated Net Pay (after deductions)</label>
            <input type="text" value={`₹${estimatedNet.toFixed(2)}`} readOnly />
          </div>

          <button className="generate-btn" onClick={handleGenerate}>
            {editData ? "Update Payroll" : "Generate Payroll"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPayrollModal;
