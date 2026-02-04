import React, { useState } from "react";

const DashboardDropdown = ({ value, onChange }) => {

  const [open, setOpen] = useState(false);

  const options = ["Daily", "Weekly", "Monthly"];

  return (
    <div className="dashboard-dropdown">

      <button onClick={() => setOpen(!open)}>
        {value}
      </button>

      {open && (
        <div className="dashboard-dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DashboardDropdown;
