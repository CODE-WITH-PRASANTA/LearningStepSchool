import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import API from "../../api/axios";
import "./AddPayrollModal.css";

const AddPayrollModal = ({ show, onClose, onAdd, editData }) => {
  const initialForm = {
    employee: "",

    year: new Date().getFullYear(),

    paymentDate: "",

    basicSalary: "50000",

    totalWorkingDays: "30",

    deductionAmount: "0",

    overtimeHours: "0",

    overtimeRate: "200",

    allowance: "0",

    otherDeduction: "0",

    notes: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [teachers, setTeachers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) return;

    const fetchTeachers = async () => {
      try {
        const res = await API.get("/admin/teachers");
        setTeachers(res.data?.data || []);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load teachers.");
      }
    };

    fetchTeachers();
  }, [show]);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...initialForm,
        ...editData,

        employee: editData.teacherId?._id || editData.teacherId,

        year: editData.year,

        paymentDate: editData.paymentDate
          ? editData.paymentDate.slice(0, 10)
          : "",

        basicSalary: String(editData.baseSalary || 0),

        totalWorkingDays: String(editData.payrollWorkingDays || 30),

        deductionAmount: String(editData.deductionAmount || 0),

        overtimeHours: String(editData.overtimeHours || 0),

        overtimeRate: String(editData.overtimeRate || 0),

        allowance: String(editData.allowance || 0),

        otherDeduction: String(editData.otherDeduction || 0),

        notes: editData.notes || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editData, show]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = async () => {
    if (saving) return;

   if (!formData.employee || !formData.paymentDate) {
  alert("Please select teacher and payment date.");
  return;
}

    const payload = {
      teacherId: formData.employee,

      year: Number(formData.year),

      paymentDate: formData.paymentDate,

      baseSalary: Number(formData.basicSalary),

      payrollWorkingDays: Number(formData.totalWorkingDays),

      deductionAmount: Number(formData.deductionAmount),

      overtimeHours: Number(formData.overtimeHours),

      overtimeRate: Number(formData.overtimeRate),

      allowance: Number(formData.allowance),

      otherDeduction: Number(formData.otherDeduction),

      notes: formData.notes,

      city: editData?.city || "metro",

      status: editData?.status || "Pending",
    };

    try {
      setSaving(true);

      if (editData?._id) {
        await API.put(`/payroll/${editData._id}`, payload);
      } else {
        await API.post("/payroll", payload);
      }

      if (onAdd) {
        onAdd();
      }

      alert(
        editData
          ? "Payroll Updated Successfully"
          : "Payroll Generated Successfully",
      );

      setFormData(initialForm);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save payroll.");
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  const basicSalary = Number(formData.basicSalary) || 0;
  const monthlyDeduction = Number(formData.deductionAmount) || 0;
  const overtimeHours = Number(formData.overtimeHours) || 0;
  const overtimeRate = Number(formData.overtimeRate) || 0;
  const additionalAllowance = Number(formData.allowance) || 0;
  const otherDeduction = Number(formData.otherDeduction) || 0;
  const overtimePay = overtimeHours * overtimeRate;
  const totalEarnings = basicSalary + additionalAllowance + overtimePay;
  const totalDeductions = monthlyDeduction + otherDeduction;
  const estimatedNet = Math.max(0, totalEarnings - totalDeductions);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="add-payroll-overlay">
      <div className="add-payroll-modal">
        {/* Header */}
        <div className="add-payroll-header">
          <h2 className="add-payroll-title">
            {editData ? "Edit Payroll" : "Add Payroll"}
          </h2>

          <button className="add-payroll-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="add-payroll-body">
          <div className="add-payroll-form">
            {/* Teacher */}
            <div className="add-payroll-group add-payroll-full">
              <label className="add-payroll-label">Select Teacher</label>

              <select
                className="add-payroll-select"
                name="employee"
                value={formData.employee}
                onChange={handleChange}
              >
                <option value="">Choose Teacher</option>

                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pay Date */}
            <div className="add-payroll-group add-payroll-full">
              <label>Year</label>

              <select name="year" value={formData.year} onChange={handleChange}>
                {Array.from({ length: 5 }, (_, i) => {
                  const y = new Date().getFullYear() + i;

                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="add-payroll-group">
              <label>First Salary Payment Date</label>

              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </div>

            {/* Duty Days */}
            <div className="add-payroll-group add-payroll-full">
              <label className="add-payroll-label">Total Working Days</label>

              <input
                className="add-payroll-input"
                type="number"
                name="totalWorkingDays"
                value={formData.totalWorkingDays}
                onChange={handleChange}
                placeholder="30"
              />
            </div>

            {/* Salary */}
            <div className="add-payroll-grid-2">
              <div className="add-payroll-group">
                <label className="add-payroll-label">Basic Salary (₹)</label>

                <input
                  className="add-payroll-input"
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                />
              </div>

              <div className="add-payroll-group">
                <label className="add-payroll-label">
                  Monthly Deduction (₹)
                </label>

                <input
                  className="add-payroll-input"
                  type="number"
                  name="deductionAmount"
                  value={formData.deductionAmount}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="add-payroll-group add-payroll-full">
              <label className="add-payroll-label">
                Overtime Rate (₹ / Hour)
              </label>

              <input
                className="add-payroll-input"
                type="number"
                name="overtimeRate"
                value={formData.overtimeRate}
                onChange={handleChange}
              />
            </div>

            {/* Overtime */}
            <div className="add-payroll-group add-payroll-full">
              <label className="add-payroll-label">Overtime Hours</label>

              <input
                className="add-payroll-input"
                type="number"
                name="overtimeHours"
                value={formData.overtimeHours}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            {/* Estimated Salary */}
            <div className="add-payroll-group add-payroll-full">
              <label className="add-payroll-label">Estimated Net Pay</label>

              <input
                className="add-payroll-input add-payroll-netpay"
                type="text"
                value={formatCurrency(estimatedNet)}
                readOnly
              />
            </div>

            <div className="add-payroll-breakdown">
              <div className="add-payroll-breakdown-col earnings">
                <h4>Earnings</h4>
                <p>
                  <span>Basic Salary</span>
                  <b>{formatCurrency(basicSalary)}</b>
                </p>
                <p>
                  <span>Additional Allowance</span>
                  <b>{formatCurrency(additionalAllowance)}</b>
                </p>
                <p>
                  <span>
                    Overtime ({overtimeHours} × {formatCurrency(overtimeRate)})
                  </span>
                  <b>{formatCurrency(overtimePay)}</b>
                </p>
                <p className="total-row">
                  <span>Total Earnings</span>
                  <b>{formatCurrency(totalEarnings)}</b>
                </p>
              </div>

              <div className="add-payroll-breakdown-col deductions">
                <h4>Deductions</h4>
                <p>
                  <span>Monthly Deduction</span>
                  <b>{formatCurrency(monthlyDeduction)}</b>
                </p>
                <p>
                  <span>Other Deduction</span>
                  <b>{formatCurrency(otherDeduction)}</b>
                </p>
                <p className="total-row">
                  <span>Total Deductions</span>
                  <b>{formatCurrency(totalDeductions)}</b>
                </p>
                <p className="net-row">
                  <span>Net Pay</span>
                  <b>{formatCurrency(estimatedNet)}</b>
                </p>
              </div>
            </div>

            <div className="add-payroll-grid-2">
              <div className="add-payroll-group">
                <label className="add-payroll-label">
                  Additional Allowance (₹)
                </label>

                <input
                  className="add-payroll-input"
                  type="number"
                  name="allowance"
                  value={formData.allowance}
                  onChange={handleChange}
                />
              </div>

              <div className="add-payroll-group">
                <label className="add-payroll-label">Other Deduction (₹)</label>

                <input
                  className="add-payroll-input"
                  type="number"
                  name="otherDeduction"
                  value={formData.otherDeduction}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Notes */}
            <div className="add-payroll-group add-payroll-full">
              <label className="add-payroll-label">Payroll Notes</label>

              <textarea
                className="add-payroll-textarea"
                rows="4"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter remarks, bonus details, leave information or any payroll notes..."
              />
            </div>

            {/* Button */}
            <button className="add-payroll-submit-btn" onClick={handleGenerate}>
              {editData ? "Update Payroll Record" : "Generate Payroll"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPayrollModal;
