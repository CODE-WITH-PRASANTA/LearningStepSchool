import React, { useEffect, useState } from "react";
import "./Activity.css";

const initialActivities = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  activity: "dance",
  type: "Scholastic",
  checked: false,
}));

export default function ActivityAdmin() {
  const [form, setForm] = useState({
    className: "",
    section: "",
    subject: "",
    type: "Scholastic",
  });

  const [activities, setActivities] = useState(initialActivities);
  const [openActionId, setOpenActionId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  /* ================= HANDLERS ================= */

  const handleSave = () => {
    alert("Activity saved successfully ✔");
  };

  const handleEdit = (row) => {
    setForm({
      className: "1st",
      section: "A",
      subject: row.activity,
      type: row.type,
    });
    setOpenActionId(null);
  };

  const handleDelete = (id) => {
    setActivities(activities.filter((item) => item.id !== id));
    setOpenActionId(null);
  };

  const handleBulkDelete = () => {
    setActivities(activities.filter((a) => !a.checked));
  };

  const toggleSelectAll = (checked) => {
    setSelectAll(checked);
    setActivities(
      activities.map((a) => ({ ...a, checked }))
    );
  };

  /* CLOSE ACTION MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const close = () => setOpenActionId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="adm-page">
      {/* HEADER */}
      <div className="adm-header">
        <h2>👥 Activity</h2>
        <span>Primary Evaluation / Activity</span>
      </div>

      <div className="adm-layout">
        {/* ================= LEFT FORM ================= */}
        <div className="adm-card adm-form">
          <h3>✏️ Add / Add Activity</h3>

          <label>Class *</label>
          <select
            value={form.className}
            onChange={(e) =>
              setForm({ ...form, className: e.target.value })
            }
          >
            <option value="">Select Class</option>
            <option>1st</option>
            <option>2nd</option>
          </select>

          <label>Section *</label>
          <select
            value={form.section}
            onChange={(e) =>
              setForm({ ...form, section: e.target.value })
            }
          >
            <option value="">Select Section</option>
            <option>A</option>
            <option>B</option>
          </select>

          <label>Subject *</label>
          <select
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
          >
            <option value="">Select Subjects</option>
            <option>English</option>
            <option>Math</option>
          </select>

          <label>Type</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option>Scholastic</option>
            <option>Co-Scholastic</option>
          </select>

          <p className="adm-note">*Only for template 4 purpose</p>

          <button className="adm-save-btn" onClick={handleSave}>
            Save
          </button>
        </div>

        {/* ================= RIGHT TABLE ================= */}
        <div className="adm-card adm-table-card">
          {/* TABLE HEADER */}
          <div className="adm-table-top">
            <h3>📋 Activity List</h3>
            <button className="adm-bulk-btn" onClick={handleBulkDelete}>
              Bulk Delete
            </button>
          </div>

          {/* TOOLBAR */}
          

          {/* TABLE */}
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr className="adm-table-head-row">
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) =>
                        toggleSelectAll(e.target.checked)
                      }
                    />
                  </th>
                  <th>
                    ACTIVITY
                    <span className="adm-sort">↕</span>
                  </th>
                  <th>
                    TYPE
                    <span className="adm-sort">↕</span>
                  </th>
                  <th className="adm-th-action">
                    ACTION
                    <span className="adm-sort">↕</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {activities.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.checked}
                        onChange={(e) =>
                          setActivities(
                            activities.map((a) =>
                              a.id === row.id
                                ? { ...a, checked: e.target.checked }
                                : a
                            )
                          )
                        }
                      />
                    </td>

                    <td>{row.activity}</td>
                    <td>{row.type}</td>

                    <td className="adm-td-action">
                      <div
                        className="adm-action-wrapper"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="adm-action-btn"
                          onClick={() =>
                            setOpenActionId(
                              openActionId === row.id
                                ? null
                                : row.id
                            )
                          }
                        >
                          Action ▾
                        </button>

                        {openActionId === row.id && (
                          <div className="adm-action-menu">
                            <div onClick={() => handleEdit(row)}>
                              Edit
                            </div>
                            <div onClick={() => handleDelete(row.id)}>
                              Delete
                            </div>
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
}
