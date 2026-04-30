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
    totalDays: "30",
    workingDays: "28",
    status: "Pending",
  });
  const [teachers, setTeachers] = useState([]);

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

  if (!show) return null;

  // 💰 CALCULATE TOTAL
  const totalPay =
    Number(formData.basicSalary) +
    Number(formData.hra) +
    Number(formData.bonus) -
    Number(formData.deduction);

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
        overtimeAmount: Number(formData.bonus) || 0,
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
        totalDays: "30",
        workingDays: "28",
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
              />
            </div>

            <div className="input-group">
              <label>Working Days</label>
              <input
                type="number"
                name="workingDays"
                value={formData.workingDays}
                onChange={handleChange}
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
              <label>HRA</label>
              <input
                type="number"
                name="hra"
                value={formData.hra}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Bonus (Overtime)</label>
              <input
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Deductions</label>
              <input
                type="number"
                name="deduction"
                value={formData.deduction}
                onChange={handleChange}
              />
            </div>
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
            <label>Net Pay</label>
            <input type="text" value={`₹${totalPay}`} readOnly />
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
