import { useState } from "react";

const ActionDropdown = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="action-wrapper">
      <button className="action-btn" onClick={() => setOpen(!open)}>
        Action ▾
      </button>

      {open && (
        <div className="action-menu">
          <div onClick={onEdit}>✏️ Edit</div>
          <div onClick={() => alert("Assign Teacher Clicked")}>🏷 Assign Teacher</div>
          <div className="delete" onClick={onDelete}>🗑 Delete</div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;