import React, { useState, useRef, useEffect } from "react";
import "./TypeList.css";
import { FaEdit, FaTrash, FaChevronDown, FaList } from "react-icons/fa";

const TypeList = () => {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
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
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

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
                  <th className="nameCol">Name</th>
                  <th className="actionCol">Action</th>
                </tr>
              </thead>

              <tbody>
                {types.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>

                    <td className="actionCell">
                      <div className="actionWrapper">
                        <button
                          className="rowActionBtn"
                          onClick={() =>
                            setOpenMenuId(openMenuId === item.id ? null : item.id)
                          }
                        >
                          Action <FaChevronDown />
                        </button>

                        {openMenuId === item.id && (
                          <div className="rowDropdown" ref={menuRef}>
                            <button>
                              <FaEdit /> Edit
                            </button>
                            <button className="deleteBtn">
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TypeList;