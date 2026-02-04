import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

const ThreeDotMenu = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className="three-dot-menu">

      <FaEllipsisV onClick={() => setOpen(!open)} />

      {open && (
        <div className="three-dot-dropdown">
          <div>View Detail</div>
          <div>Edit</div>
          <div>Delete</div>
        </div>
      )}

    </div>
  );
};

export default ThreeDotMenu;
