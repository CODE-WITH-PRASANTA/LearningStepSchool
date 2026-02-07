import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import "./Visitorsbooksedit.css";

const VisitorBook = () => {
  const [activeVisitor, setActiveVisitor] = useState(null);
  const [openAction, setOpenAction] = useState(null);

  const visitors = [
    {
      id: 1,
      purpose: "Campus Visit",
      name: "Deepesh",
      email: "check@aepedu.in",
      phone: "9876543422",
    },
    {
      id: 2,
      purpose: "Checking",
      name: "Zayar",
      email: "",
      phone: "",
    },
    {
      id: 3,
      purpose: "Interview",
      name: "Varsha",
      email: "",
      phone: "",
    },
  ];

  return (
    <div className="visitor-page">
      {/* ================= VISITOR LIST TABLE ================= */}
      <div className="visitor-card">
        <h3>Visitor List</h3>

        <div className="table-wrap">
          <table className="visitor-table">
            <thead>
              <tr>
                <th>PURPOSE</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {visitors.map((v) => (
                <tr key={v.id}>
                  <td>{v.purpose}</td>
                  <td>{v.name}</td>
                  <td>{v.email || "-"}</td>
                  <td>{v.phone || "-"}</td>
                  <td className="action-cell">
                    <button
                      className="action-btn"
                      onClick={() =>
                        setOpenAction(openAction === v.id ? null : v.id)
                      }
                    >
                      <FiMoreVertical />
                    </button>

                    {openAction === v.id && (
                      <div className="action-menu">
                        <button
                          onClick={() => {
                            setActiveVisitor(v);
                            setOpenAction(null);
                          }}
                        >
                          Edit Visitor
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

      {/* ================= VISITOR EDIT TABLE ================= */}
      {activeVisitor && (
        <div className="visitor-card edit-card">
          <h3>Edit Visitor</h3>

          <table className="edit-table">
            <tbody>
              <tr>
                <th>Purpose</th>
                <td>
                  <input
                    value={activeVisitor.purpose}
                    onChange={(e) =>
                      setActiveVisitor({
                        ...activeVisitor,
                        purpose: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>

              <tr>
                <th>Name</th>
                <td>
                  <input
                    value={activeVisitor.name}
                    onChange={(e) =>
                      setActiveVisitor({
                        ...activeVisitor,
                        name: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>

              <tr>
                <th>Email</th>
                <td>
                  <input
                    value={activeVisitor.email}
                    onChange={(e) =>
                      setActiveVisitor({
                        ...activeVisitor,
                        email: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>

              <tr>
                <th>Phone</th>
                <td>
                  <input
                    value={activeVisitor.phone}
                    onChange={(e) =>
                      setActiveVisitor({
                        ...activeVisitor,
                        phone: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="edit-actions">
            <button className="btn-save">Update</button>
            <button className="btn-cancel" onClick={() => setActiveVisitor(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorBook;
