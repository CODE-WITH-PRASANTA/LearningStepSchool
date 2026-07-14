import React, { useState } from "react";
import "./LeaveSettings.css";
import {
  FaHome,
  FaChevronRight,
} from "react-icons/fa";

const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Work From Home",
];

const departments = [
  "Human Resource",
  "Accounts",
  "IT Department",
  "Marketing",
  "Sales",
  "Admin",
];

const workflows = [
  "Manager",
  "HR",
  "Manager → HR",
  "Manager → HR → Director",
];

const LeaveSettings = () => {
  const [formData, setFormData] = useState({
    policyName: "",
    leaveType: "",
    duration: "",
    carryForward: 0,
    quota: 12,
    department: "",
    workflow: "Manager",
    notes: "",
    encashment: false,
    halfDay: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const isValid =
    formData.policyName !== "" &&
    formData.leaveType !== "" &&
    formData.duration !== "" &&
    formData.department !== "" &&
    formData.workflow !== "" &&
    (formData.encashment ||
      formData.halfDay);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid) {
      alert(
        "Please complete all required fields."
      );
      return;
    }

    console.log(formData);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="leaveSettings">

      {/* Header */}

      <div className="leaveSettings__top">

        <h2>Leave Settings</h2>

        <div className="leaveSettings__breadcrumb">

          <FaHome />

          <FaChevronRight />

          <span>Leaves</span>

          <FaChevronRight />

          <span className="active">
            Leave Settings
          </span>

        </div>

      </div>

      {/* Card */}

      <div className="leaveSettings__card">

        <h3 className="leaveSettings__heading">
          Leave Settings
        </h3>

        <form
          onSubmit={handleSubmit}
          className="leaveSettings__form"
        >

          <div className="leaveSettings__grid">

            {/* Policy */}

            <div className="leaveSettings__field">

              <label>
                Leave Policy Name *
              </label>

              <input
                type="text"
                name="policyName"
                placeholder="Enter Leave Policy Name"
                value={formData.policyName}
                onChange={handleChange}
              />

            </div>

            {/* Leave Type */}

            <div className="leaveSettings__field">

              <label>
                Leave Type *
              </label>

              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
              >

                <option value="">
                  Select Leave Type
                </option>

                {leaveTypes.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

            {/* Duration */}

            <div className="leaveSettings__field">

              <label>
                Leave Duration (Days) *
              </label>

              <input
                type="number"
                name="duration"
                placeholder="Enter Duration"
                value={formData.duration}
                onChange={handleChange}
              />

            </div>

            {/* Carry Forward */}

            <div className="leaveSettings__field">

              <label>
                Carry Forward Limit *
              </label>

              <input
                type="number"
                name="carryForward"
                value={formData.carryForward}
                onChange={handleChange}
              />

            </div>

            {/* Quota */}

            <div className="leaveSettings__field">

              <label>
                Leave Quota (Days) *
              </label>

              <input
                type="number"
                name="quota"
                value={formData.quota}
                onChange={handleChange}
              />

            </div>

            {/* Department */}

            <div className="leaveSettings__field">

              <label>
                Select Department *
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >

                <option value="">
                  Select Department
                </option>

                {departments.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>
                        {/* Leave Approval Workflow */}

            <div className="leaveSettings__field">

              <label>
                Leave Approval Workflow
              </label>

              <select
                name="workflow"
                value={formData.workflow}
                onChange={handleChange}
              >
                {workflows.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

            </div>

            {/* Empty Column */}

            <div className="leaveSettings__field leaveSettings__field--empty"></div>

            {/* Notes */}

            <div className="leaveSettings__field leaveSettings__field--full">

              <label>
                Notes (Optional)
              </label>

              <textarea
                name="notes"
                rows="5"
                placeholder="Write notes here..."
                value={formData.notes}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* Checkboxes */}

          <div className="leaveSettings__checkboxSection">

            <label className="leaveSettings__checkbox">

              <input
                type="checkbox"
                name="encashment"
                checked={formData.encashment}
                onChange={handleChange}
              />

              <span className="leaveSettings__checkmark"></span>

              Enable Leave Encashment

            </label>

            <label className="leaveSettings__checkbox">

              <input
                type="checkbox"
                name="halfDay"
                checked={formData.halfDay}
                onChange={handleChange}
              />

              <span className="leaveSettings__checkmark"></span>

              Enable Half Day Leave

            </label>

          </div>

          {/* Bottom Section */}

          <div className="leaveSettings__footer">

            <button
              type="submit"
              className="leaveSettings__saveBtn"
              disabled={!isValid}
            >
              Save Settings
            </button>

            {saved && (

              <div className="leaveSettings__success">

                <div className="leaveSettings__successIcon">
                  ✓
                </div>

                <div>

                  <h4>Success!</h4>

                  <p>
                    Leave settings saved successfully.
                  </p>

                </div>

                <button
                  type="button"
                  className="leaveSettings__successClose"
                  onClick={() => setSaved(false)}
                >
                  ×
                </button>

              </div>

            )}

          </div>

        </form>

      </div>

    </div>

  );
};

export default LeaveSettings;