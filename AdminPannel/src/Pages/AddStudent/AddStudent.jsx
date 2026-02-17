import React, { useState, useRef, useEffect } from "react";
import "./AddStudent.css";
import { FaUserPlus, FaList, FaEdit, FaTrash } from "react-icons/fa";

const initialStaff = [
  { id: 1, card: "EMP-1", name: "Nlet Initiatives LLP", email: "ims@nletsolutions.in", dob: "1970-01-01", phone: "9982716888" },
  { id: 6, card: "EMP-101", name: "Driver", email: "driver@gmail.com", dob: "2023-10-17", phone: "809436469" },
  { id: 7, card: "EMP-202", name: "Test1", email: "ansh@gmail.com", dob: "2023-05-22", phone: "9772119901" },
  { id: 9, card: "EMP-201", name: "Demo", email: "demo@nlet.in", dob: "2023-05-31", phone: "1234567890" },
];

export default function AddStudent() {
  const [staffData, setStaffData] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAdd = () => {
    const name = prompt("Enter Staff Name:");
    if (!name) return;

    const newStaff = {
      id: Date.now(),
      card: "EMP-" + Math.floor(Math.random() * 1000),
      name,
      email: "new@gmail.com",
      dob: "2000-01-01",
      phone: "0000000000",
    };

    setStaffData([...staffData, newStaff]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this staff?")) {
      setStaffData(staffData.filter((s) => s.id !== id));
      setOpenMenu(null);
    }
  };

  const handleEdit = (staff) => {
    const newName = prompt("Edit Staff Name:", staff.name);
    if (newName) {
      setStaffData(
        staffData.map((s) =>
          s.id === staff.id ? { ...s, name: newName } : s
        )
      );
      setOpenMenu(null);
    }
  };

  const filtered = staffData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="staff-page">
      <div className="page-header">
        <h2><FaUserPlus /> Staff Management</h2>
        <span className="breadcrumb">Library / Staff</span>
      </div>

      <div className="staff-card">
        <div className="staff-card-header">
          <h3><FaList /> Staff List</h3>
        </div>

        <div className="staff-toolbar">
          <button className="add-btn" onClick={handleAdd}>
            <FaUserPlus /> Add Staff
          </button>

          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Library Card</th>
                <th>Name</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.id}</td>
                  <td>
                    <div className="barcode">|||||||||||||</div>
                    {staff.card}
                  </td>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.dob}</td>
                  <td>{staff.phone}</td>

                  {/* ACTION BUTTON */}
                  <td ref={menuRef}>
                    <button
                      className="action-btn"
                      onClick={() =>
                        setOpenMenu(openMenu === staff.id ? null : staff.id)
                      }
                    >
                      Action ▾
                    </button>

                    {openMenu === staff.id && (
                      <div className="action-menu">
                        <button onClick={() => handleEdit(staff)}>
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDelete(staff.id)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}