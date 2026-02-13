import { useState } from "react";

const SubjectActionDropdown = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sp-action-wrapper">
      <button className="sp-action-btn" onClick={() => setOpen(!open)}>
        Action ▾
      </button>

      {open && (
        <div className="sp-action-menu">
          <div onClick={onEdit}>✏️ Edit</div>
          <div className="sp-action-delete" onClick={onDelete}>
            🗑 Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectActionDropdown;