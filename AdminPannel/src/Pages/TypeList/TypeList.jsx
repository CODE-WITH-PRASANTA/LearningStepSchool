import React, { useState, useRef, useEffect } from "react";
import "./TypeList.css";
import { FaEdit, FaTrash, FaChevronDown, FaList } from "react-icons/fa";

const TypeList = () => {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const menuRef = useRef();

  const types = [
    { id: 1, name: "Long Descriptive" },
    { id: 2, name: "Very Short Answer" },
    { id: 3, name: "Short Answer" },
    { id: 4, name: "Case-Based Questions" },
    { id: 5, name: "Long Answer" },
    { id: 6, name: "MCQ Type" },
  ];

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    window.addEventListener("scroll", () => setOpenMenuId(null), true);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("scroll", () => setOpenMenuId(null), true);
    };
  }, []);

  const handleMenu = (e, id) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    setMenuPos({
      top: rect.bottom,
      left: rect.right - 120,
    });

    setOpenMenuId(id);
  };

  const filteredTypes = types.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="typePage">
      <div className="mainGrid">
        {/* LEFT FORM */}
        <div className="leftCard">
          <div className="cardHeader">Add / Edit Type</div>
          <div className="cardBody">
            <label>
              Name <span>*</span>
            </label>
            <input type="text" placeholder="Enter type name" />
            <button className="saveBtn">Save</button>
          </div>
        </div>

        {/* RIGHT TABLE */}
        <div className="rightCard">
          <div className="rightTopBar">
            <h2 className="rightTitle">
              <FaList /> Type List
            </h2>
            <input
              type="text"
              className="searchInput"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="tableWrapper">
            <table className="typeTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="actionCol">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="actionCell">
                      <button
                        className="rowActionBtn"
                        onClick={(e) => handleMenu(e, item.id)}
                      >
                        Action <FaChevronDown />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openMenuId && (
        <div
          className="rowDropdown"
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
          }}
        >
          <button>
            <FaEdit /> Edit
          </button>
          <button className="deleteBtn">
            <FaTrash /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TypeList;