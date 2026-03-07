import React, { useState } from "react";
import Swal from "sweetalert2";

const EnquiryListForm = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showView, setShowView] = useState(false);

  const [openActionId, setOpenActionId] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    reference: "",
    source: "",
    className: "",
    date: "07-02-2026",
    assigned: "",
    noOfChild: "",
    address: "",
    description: "",
    note: "",
    fatherName: "",
    studentName: "",
    lastClassPercentage: "",
    dob: "",
    aadhar: "",
    status: "Active",
    createdBy: "Demo User",
  });

  /* ================= ADD ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    setRows([...rows, { ...formData, id: Date.now() }]);
    setShowAdd(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = () => {
    if (!selectedIds.length) {
      Swal.fire("Warning", "Please select at least one record!", "warning");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setRows(rows.filter((r) => !selectedIds.includes(r.id)));
        setSelectedIds([]);
        Swal.fire("Deleted!", "", "success");
      }
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* ================= MAIN CARD ================= */}
      <div className="EnquiryListForm-Card">

        <div className="EnquiryListForm-Header">
          <h2 className="EnquiryListForm-Title">📋 Enquiry List</h2>

          <div className="EnquiryListForm-HeaderActions">
            <button
              className="EnquiryListForm-Btn EnquiryListForm-BtnDanger"
              onClick={handleBulkDelete}
            >
              🗑 Bulk Delete
            </button>

            <button
              className="EnquiryListForm-Btn EnquiryListForm-BtnSecondary"
              onClick={() => setShowImport(true)}
            >
              ⬆ Import
            </button>

            <button
              className="EnquiryListForm-Btn EnquiryListForm-BtnPrimary"
              onClick={() => setShowAdd(true)}
            >
              + Add
            </button>
          </div>
        </div>

        <div className="EnquiryListForm-TableWrapper">
          <table className="EnquiryListForm-Table">
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Class</th>
                <th>Address</th>
                <th>Source</th>
                <th>Date</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.phone}</td>
                  <td>{row.className}</td>
                  <td>{row.address}</td>
                  <td>{row.source}</td>
                  <td>{row.date}</td>
                  <td>{row.status}</td>
                  <td>{row.createdBy}</td>

                  <td className="EnquiryListForm-ActionCell">
                    <button
                      className="EnquiryListForm-ActionBtn"
                      onClick={() =>
                        setOpenActionId(
                          openActionId === row.id ? null : row.id
                        )
                      }
                    >
                      Action ▾
                    </button>

                    {openActionId === row.id && (
                      <div className="EnquiryListForm-Dropdown">
                        <button
                          onClick={() => {
                            setActiveRow(row);
                            setShowFollowUp(true);
                            setOpenActionId(null);
                          }}
                        >
                          📞 Follow Up
                        </button>

                        <button
                          onClick={() => {
                            setActiveRow(row);
                            setShowView(true);
                            setOpenActionId(null);
                          }}
                        >
                          👁 View
                        </button>

                        <button
                          className="EnquiryListForm-Danger"
                          onClick={() => handleDelete(row.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!rows.length && (
                <tr>
                  <td colSpan="11" className="EnquiryListForm-NoData">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ADD POPUP ================= */}
      {showAdd && (
        <div className="EnquiryListForm-Overlay">
          <form
            className="EnquiryListForm-AddCard"
            onSubmit={handleSubmit}
          >
            <div className="EnquiryListForm-PopupHeader">
              <span>Add Enquiry</span>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="EnquiryListForm-Close"
              >
                ✕
              </button>
            </div>

            <div className="EnquiryListForm-FormGrid">
              <div className="EnquiryListForm-FormGroup">
                <label>Name *</label>
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="EnquiryListForm-FormGroup">
                <label>Phone *</label>
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="EnquiryListForm-FormGroup">
                <label>Email</label>
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="EnquiryListForm-FormGroup">
                <label>Source</label>
                <select
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                >
                  <option>Select</option>
                  <option>Website</option>
                  <option>Phone</option>
                  <option>Social Media</option>
                </select>
              </div>
            </div>

            <div className="EnquiryListForm-Footer">
              <button className="EnquiryListForm-Btn EnquiryListForm-BtnPrimary">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= VIEW POPUP ================= */}
      {showView && activeRow && (
        <div className="EnquiryListForm-Overlay">
          <div className="EnquiryListForm-ViewCard">
            <div className="EnquiryListForm-PopupHeader">
              <span>Enquiry Details</span>
              <button
                onClick={() => setShowView(false)}
                className="EnquiryListForm-Close"
              >
                ✕
              </button>
            </div>

            <div className="EnquiryListForm-ViewBody">
              <p><strong>Name:</strong> {activeRow.name}</p>
              <p><strong>Phone:</strong> {activeRow.phone}</p>
              <p><strong>Email:</strong> {activeRow.email}</p>
              <p><strong>Class:</strong> {activeRow.className}</p>
              <p><strong>Address:</strong> {activeRow.address}</p>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default EnquiryListForm;