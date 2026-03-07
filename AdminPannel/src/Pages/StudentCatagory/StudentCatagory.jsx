// StudentCatagory.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./StudentCatagory.css";
import { FaUsers, FaPen, FaList, FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";

const StudentCatagory = () => {
  const base = "student-category";

  const [name, setName] = useState("");
  const [rows, setRows] = useState([
    { id: 1, category: "Hindi-Jain" },
    { id: 2, category: "Gujrati-Jain" },
    { id: 3, category: "Marathi-Jain" },
    { id: 4, category: "ST" },
    { id: 5, category: "SBC" },
    { id: 6, category: "OBC" },
  ]);

  const [search, setSearch] = useState("");
  const [openActionId, setOpenActionId] = useState(null);

  const actionWrapRef = useRef(null);

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (actionWrapRef.current && !actionWrapRef.current.contains(e.target)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.category.toLowerCase().includes(q));
  }, [rows, search]);

  const handleSave = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return;

    const exists = rows.some((r) => r.category.toLowerCase() === v.toLowerCase());
    if (exists) return;

    setRows((p) => [
      { id: p.length ? Math.max(...p.map((x) => x.id)) + 1 : 1, category: v },
      ...p,
    ]);
    setName("");
  };

  const handleEdit = (id) => {
    const r = rows.find((x) => x.id === id);
    if (!r) return;
    setName(r.category);
    setRows((p) => p.filter((x) => x.id !== id));
    setOpenActionId(null);
  };

  const handleDelete = (id) => {
    setRows((p) => p.filter((x) => x.id !== id));
    setOpenActionId(null);
  };

  return (
    <div className={base}>
      <div className={`${base}__inner`}>
        {/* TOP TITLE */}
        <div className={`${base}__topbar`}>
          <div className={`${base}__title`}>
            <span className={`${base}__titleIcon`}>
              <FaUsers />
            </span>
            <h1>Student Category List</h1>
          </div>
        </div>

        <div className={`${base}__grid`}>
          {/* LEFT FORM */}
          <div className={`${base}__card`}>
            <div className={`${base}__cardHead`}>
              <span className={`${base}__cardIcon`}>
                <FaPen />
              </span>
              <h2>Add Student Category</h2>
            </div>

            <form className={`${base}__form`} onSubmit={handleSave}>
              <label className={`${base}__label`}>
                Name <span className={`${base}__req`}>*</span>
              </label>

              <input
                className={`${base}__input`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category"
              />

              <button className={`${base}__btnSave`} type="submit">
                Save
              </button>
            </form>
          </div>

          {/* RIGHT TABLE */}
          <div className={`${base}__card ${base}__tableCard`}>
            <div className={`${base}__cardHead ${base}__tableHead`}>
              <div className={`${base}__cardHeadLeft`}>
                <span className={`${base}__cardIcon`}>
                  <FaList />
                </span>
                <h2>Student Category List</h2>
              </div>

              {/* SEARCH */}
              <div className={`${base}__searchBox`}>
                <FaSearch className={`${base}__searchIcon`} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search category..."
                />
              </div>
            </div>

            <div className={`${base}__tableWrap`} ref={actionWrapRef}>
              <table className={`${base}__table`}>
                <thead>
                  <tr>
                    <th className={`${base}__thId`}>
                      ID <span className={`${base}__sortIcon`}>↓↑</span>
                    </th>
                    <th className={`${base}__thCat`}>CATEGORY</th>
                    <th className={`${base}__thAction`}>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={r.id} className={idx % 2 ? `${base}__rowAlt` : ""}>
                      <td className={`${base}__tdId`}>{r.id}</td>
                      <td className={`${base}__tdCat`}>{r.category}</td>

                      <td className={`${base}__tdAction`}>
                        <div className={`${base}__dotsWrap`}>
                          <button
                            type="button"
                            className={`${base}__dotsBtn`}
                            onClick={() => setOpenActionId((p) => (p === r.id ? null : r.id))}
                            aria-label="More"
                          >
                            <FiMoreVertical />
                          </button>

                          {openActionId === r.id && (
                            <div className={`${base}__menu`}>
                              <button
                                type="button"
                                className={`${base}__menuItem`}
                                onClick={() => handleEdit(r.id)}
                              >
                                <FaEdit /> Edit
                              </button>

                              <button
                                type="button"
                                className={`${base}__menuItem ${base}__danger`}
                                onClick={() => handleDelete(r.id)}
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!filtered.length && (
                    <tr>
                      <td colSpan="3" className={`${base}__empty`}>
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCatagory;