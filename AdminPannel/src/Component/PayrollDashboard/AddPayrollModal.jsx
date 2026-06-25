import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./AddPayrollModal.css";
import API from "../../api/axios";

const AddPayrollModal = ({ show, onClose, onAdd, editData }) => {
  const initialForm = {
    employee: "",
    payDate: "",
    basicSalary: "50000",
    totalDays: "0",
    workingDays: "0",
    overtimeHours: "0",
    status: "Pending",
  };

  const [formData, setFormData] = useState(initialForm);
  const [teachers, setTeachers] = useState([]);

  const dummyTeachers = [
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

  const getMonthDays = (year, month) =>
    new Date(year, month, 0).getDate();

  // ===========================
  // Fetch Teachers
  // ===========================
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await API.get("/admin/teachers");
        const list = res.data?.data || res.data;

        if (Array.isArray(list) && list.length > 0) {
          setTeachers(list);
        } else {
          setTeachers(dummyTeachers);
        }
      } catch (err) {
        console.log(err);
        setTeachers(dummyTeachers);
      }
    };

    fetchTeachers();
  }, []);

  // ===========================
  // Edit Mode
  // ===========================
  useEffect(() => {
    if (editData) {
      setFormData({
        employee: editData.teacherId?._id || "",
        payDate:
          editData.year && editData.month
            ? `${editData.year}-${String(
                editData.month
              ).padStart(2, "0")}-01`
            : "",
        basicSalary: editData.baseSalary || "50000",
        totalDays: String(
          getMonthDays(
            editData.year,
            editData.month || 1
          )
        ),
        workingDays: String(
          editData.workingDays || 0
        ),
        overtimeHours: String(
          editData.overtimeHours || 0
        ),
        status: editData.status || "Pending",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editData]);

  // ===========================
  // Attendance Summary
  // ===========================
  const fetchTeacherAttendanceSummary = async (
    teacherId,
    month,
    year
  ) => {
    try {
      const res = await API.get(
        `/teacher-attendance?month=${month}&year=${year}`
      );

      const list = res.data?.data || [];

      const teacherRecords = list.filter(
        (item) => item.teacherId?._id === teacherId
      );

      const present =
        teacherRecords.filter(
          (item) => item.status === "Present"
        ).length;

      const leave =
        teacherRecords.filter(
          (item) => item.status === "Leave"
        ).length;

      const totalDays = getMonthDays(
        year,
        month
      );

      const workingDays =
        present + leave;

      setFormData((prev) => ({
        ...prev,
        totalDays: String(totalDays),
        workingDays: String(workingDays),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (
      !formData.employee ||
      !formData.payDate
    )
      return;

    const date = new Date(
      formData.payDate
    );

    fetchTeacherAttendanceSummary(
      formData.employee,
      date.getMonth() + 1,
      date.getFullYear()
    );
  }, [
    formData.employee,
    formData.payDate,
  ]);

  // ===========================
  // Input Change
  // ===========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ===========================
  // Estimated Net Salary
  // ===========================
  const basic =
    Number(formData.basicSalary) || 0;

  const overtime =
    Number(formData.overtimeHours) *
    200;

  const gross =
    basic + overtime;

  const pf = basic * 0.12;

  const estimatedNet =
    gross - pf;

  // ===========================
  // Submit
  // ===========================
  const handleGenerate = async () => {
    try {
      if (
        !formData.employee ||
        !formData.payDate
      ) {
        alert(
          "Please select teacher and pay date."
        );
        return;
      }

      const date = new Date(
        formData.payDate
      );

      const payload = {
        teacherId:
          formData.employee,
        month:
          date.getMonth() + 1,
        year:
          date.getFullYear(),
        totalDays:
          Number(
            formData.totalDays
          ) || 0,
        workingDays:
          Number(
            formData.workingDays
          ) || 0,
        baseSalary:
          Number(
            formData.basicSalary
          ) || 0,
        overtimeHours:
          Number(
            formData.overtimeHours
          ) || 0,
        status:
          formData.status,
      };

      if (editData) {
        await API.put(
          `/payroll/${editData._id}`,
          payload
        );

        alert(
          "Payroll Updated Successfully"
        );
      } else {
        await API.post(
          "/payroll",
          payload
        );

        alert(
          "Payroll Created Successfully"
        );
      }

      setFormData(initialForm);

      onClose();

      if (onAdd) {
        onAdd();
      }
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data
          ?.message ||
          "Something went wrong"
      );
    }
  };

  if (!show) return null;

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
            <option value="">Select Teacher</option>

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

        {/* Date */}
        <div className="add-payroll-group add-payroll-full">
          <label className="add-payroll-label">
            Pay Date
          </label>

          <input
            className="add-payroll-input"
            type="date"
            name="payDate"
            value={formData.payDate}
            onChange={handleChange}
          />
        </div>

        {/* Total Days & Working Days */}
        <div className="add-payroll-grid-2">
          <div className="add-payroll-group">
            <label className="add-payroll-label">
              Total Days
            </label>

            <input
              className="add-payroll-input"
              type="number"
              value={formData.totalDays}
              readOnly
            />
          </div>

          <div className="add-payroll-group">
            <label className="add-payroll-label">
              Working Days
            </label>

            <input
              className="add-payroll-input"
              type="number"
              value={formData.workingDays}
              readOnly
            />
          </div>
        </div>

        {/* Salary & Overtime */}
        <div className="add-payroll-grid-2">
          <div className="add-payroll-group">
            <label className="add-payroll-label">
              Basic Salary
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
        </div>

        {/* Status */}
        <div className="add-payroll-group add-payroll-full">
          <label className="add-payroll-label">
            Status
          </label>

          <select
            className="add-payroll-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">
              Pending
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Reject">
              Reject
            </option>
          </select>
        </div>

        {/* Net Pay */}
        <div className="add-payroll-group add-payroll-full">
          <label className="add-payroll-label">
            Estimated Net Pay
          </label>

          <input
            className="add-payroll-input add-payroll-netpay"
            type="text"
            value={`₹${estimatedNet.toFixed(2)}`}
            readOnly
          />
        </div>

        {/* Button */}
        <button
          className="add-payroll-submit-btn"
          onClick={handleGenerate}
        >
          {editData
            ? "Update Payroll"
            : "Generate Payroll"}
        </button>

      </div>
    </div>
  </div>
</div>
  );
};

export default AddPayrollModal;