import React, { useState } from "react";
import { X } from "lucide-react";
import "./AddPayrollModal.css";

const AddPayrollModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    employee: "",
    payDate: "",
    basicSalary: "50000",
    hra: "10000",
    bonus: "5000",
    deduction: "4",
  });

  if (!show) return null;

  const totalPay =
    Number(formData.basicSalary) +
    Number(formData.hra) +
    Number(formData.bonus) -
    Number(formData.deduction);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = () => {
    alert("Payroll Generated Successfully");
    onClose();
  };

  return (
    <div className="payroll-modal-overlay">
      <div className="payroll-modal">
        <div className="modal-head">
          <h2>Add Payroll</h2>

          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          <div className="input-group full">
            <label>Employee Name</label>
            <input
              type="text"
              name="employee"
              placeholder="Enter employee name"
              value={formData.employee}
              onChange={handleChange}
            />
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
              <label>Bonus</label>
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

          <div className="input-group full">
            <label>Net Pay</label>
            <input type="text" value={`₹${totalPay}`} readOnly />
          </div>

          <button className="generate-btn" onClick={handleGenerate}>
            Generate Payroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPayrollModal;