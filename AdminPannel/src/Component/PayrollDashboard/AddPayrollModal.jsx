import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./AddPayrollModal.css";

const AddPayrollModal = ({ show, onClose, onAdd, editData }) => {
const initialForm = {
  employee: "",
  payDate: "",

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

  const teachers = [
    {
      _id: "1",
      name: "Sanatan Nayak",
    },
    {
      _id: "2",
      name: "Santosh Ku Nayak",
    },
    {
      _id: "3",
      name: "Natabar Nayak",
    },
    {
      _id: "4",
      name: "Subrat Kumar Nayak",
    },
  ];

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData(initialForm);
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = () => {
    if (!formData.employee || !formData.payDate) {
      alert("Please select teacher and pay date.");
      return;
    }

    if (onAdd) {
      onAdd(formData);
    }

    alert(
      editData
        ? "Payroll Updated Successfully"
        : "Payroll Generated Successfully"
    );

    setFormData(initialForm);
    onClose();
  };

  if (!show) return null;


  const salaryPerDay =
  (Number(formData.basicSalary) || 0) /
  (Number(formData.totalWorkingDays) || 1);

const presentSalary =
  salaryPerDay *
  (Number(formData.daysPresent) || 0);

const absentDeduction =
  (Number(formData.daysAbsent) || 0) *
  (Number(formData.deductionPerDay) || 0);

const overtimePay =
  (Number(formData.overtimeHours) || 0) *
  (Number(formData.overtimeRate) || 0);

const estimatedNet =
  (Number(formData.basicSalary) || 0)
  - (Number(formData.deductionAmount) || 0)
  + overtimePay
  + (Number(formData.allowance) || 0)
  - (Number(formData.otherDeduction) || 0);

  return (
    <div className="add-payroll-overlay">
      <div className="add-payroll-modal">

        {/* Header */}
        <div className="add-payroll-header">
          <h2 className="add-payroll-title">
            {editData ? "Edit Payroll" : "Add Payroll"}
          </h2>

          <button
            className="add-payroll-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="add-payroll-body">
          <div className="add-payroll-form">

                {/* Teacher */}
                <div className="add-payroll-group add-payroll-full">
                  <label className="add-payroll-label">
                    Select Teacher
                  </label>

                  <select
                    className="add-payroll-select"
                    name="employee"
                    value={formData.employee}
                    onChange={handleChange}
                  >
                    <option value="">Choose Teacher</option>

                    {teachers.map((teacher) => (
                      <option
                        key={teacher._id}
                        value={teacher._id}
                      >
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pay Date */}
                <div className="add-payroll-group add-payroll-full">
                  <label className="add-payroll-label">
                    Payroll Date
                  </label>

                  <input
                    className="add-payroll-input"
                    type="date"
                    name="payDate"
                    value={formData.payDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Duty Days */}
                <div className="add-payroll-group add-payroll-full">
                  <label className="add-payroll-label">
                    Total Working Days
                  </label>

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
                    <label className="add-payroll-label">
                      Basic Salary (₹)
                    </label>

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
                  <label className="add-payroll-label">
                    Overtime Hours
                  </label>

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
                  <label className="add-payroll-label">
                    Estimated Net Pay
                  </label>

                  <input
                    className="add-payroll-input add-payroll-netpay"
                    type="text"
                    value={`₹${estimatedNet.toLocaleString("en-IN")}`}
                    readOnly
                  />
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
                      <label className="add-payroll-label">
                        Other Deduction (₹)
                      </label>

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
                  <label className="add-payroll-label">
                    Payroll Notes
                  </label>

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
                <button
                  className="add-payroll-submit-btn"
                  onClick={handleGenerate}
                >
                  {editData ? "Update Payroll Record" : "Generate Payroll"}
                </button>

              </div>
        </div>
      </div>
    </div>
  );
};

export default AddPayrollModal;