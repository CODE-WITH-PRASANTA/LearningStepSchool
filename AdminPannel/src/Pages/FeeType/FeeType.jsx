import React, { useState, useEffect } from "react";
import "./FeeType.css";
import API from "../../api/axios"; // ✅ your axios instance
import {
  FiMoreVertical,
  FiSearch,
  FiDownload,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const FeeType = () => {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [page, setPage] = useState(1);

  const rowsPerPage = 5;

  // ✅ BACKEND DATA
  const [data, setData] = useState([]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexLast = page * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;
  const currentRows = data.slice(indexFirst, indexLast);

  const [form, setForm] = useState({
    name: "",
    status: "Active",
  });

  // ================= API =================

  // ✅ GET DATA
  const fetchData = async () => {
    try {
      const res = await API.get("/feetypes");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------- ADD ----------

  const openAdd = () => {
    setEditItem(null);
    setForm({
      name: "",
      status: "Active",
    });
    setShowModal(true);
  };

  // ---------- EDIT ----------

  const openEdit = (item) => {
    setEditItem(item);

    setForm({
      name: item.name,
      status: item.status,
    });

    setShowModal(true);
    setMenuOpen(null);
  };

  // ---------- DELETE ----------

  const deleteRow = async (id) => {
    try {
      await API.delete(`/feetypes/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
    setMenuOpen(null);
  };

  // ---------- SAVE ----------

  const saveData = async () => {
    try {
      if (editItem) {
        // UPDATE
        await API.put(`/feetypes/${editItem._id}`, form);
      } else {
        // CREATE
        await API.post("/feetypes", form);
      }

      fetchData();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="FeeType">
      {/* HEADER */}

      <div className="FeeType-header">
        <div>
          <h1>Fees Type</h1>
        </div>

        <button className="FeeType-addBtn" onClick={openAdd}>
          + Add Fees Type
        </button>
      </div>

      {/* TABLE */}

      <div className="FeeType-tableWrapper">
        <table className="FeeType-table">
          <thead>
            <tr>
              <th>S.L</th>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((item, index) => (
              <tr key={item._id}> 
                <td>{indexFirst + index + 1}</td>

                <td>{item.name}</td>

                <td>
                  <span className={`FeeType-status ${item.status}`}>
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className="FeeType-action">
                    <button
                      className="FeeType-actionBtn"
                      onClick={() =>
                        setMenuOpen(
                          menuOpen === item._id ? null : item._id
                        )
                      }
                    >
                      <FiMoreVertical />
                    </button>

                    {menuOpen === item._id && (
                      <div className="FeeType-actionMenu">
                        <button onClick={() => openEdit(item)}>
                          <FiEdit2 /> Edit
                        </button>

                        <button
                          className="delete"
                          onClick={() => deleteRow(item._id)}
                        >
                          <FiTrash2 /> Delete
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

      {/* PAGINATION */}

      <div className="FeeType-pagination">
        <button
          className="FeeType-pageBtn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ‹
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`FeeType-pageBtn ${page === i + 1 ? "active" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="FeeType-pageBtn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          ›
        </button>
      </div>

      {/* MODAL */}

      {showModal && (
        <div className="FeeType-modal">
          <div className="FeeType-modalContent">
            <FiX className="close" onClick={() => setShowModal(false)} />

            <h3>{editItem ? "Edit Fees Type" : "Add New Fees Type"}</h3>

            <label>Fees Name</label>

            <input
              placeholder="Enter Fees Type name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <label>Status</label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="FeeType-modalBtns">
              <button
                className="cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="save" onClick={saveData}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeType;