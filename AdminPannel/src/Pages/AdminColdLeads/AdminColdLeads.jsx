import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";

const AdminColdLeads = () => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  /* ================= FETCH ================= */
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await API.get("/enquiries");
      setLeads(res.data.data || []);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= DELETE ================= */
  const deleteLead = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;

    try {
      await API.delete(`/enquiries/${id}`);
      fetchLeads();
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  /* ================= STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/enquiries/${id}/status`, { status });
      fetchLeads();
    } catch (error) {
      console.error("STATUS ERROR:", error);
    }
  };

  /* ================= FEEDBACK ================= */
  const giveFeedback = async (lead) => {
    const { value: text } = await Swal.fire({
      title: "Admin Feedback",
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your feedback here...",
      inputValue: lead.feedback || "",
      showCancelButton: true,
    });

    if (text !== undefined) {
      try {
        await API.put(`/enquiries/${lead._id}/feedback`, {
          feedback: text,
        });

        Swal.fire("Saved!", "Feedback updated", "success");
        fetchLeads();
      } catch (error) {
        console.error("FEEDBACK ERROR:", error);
        Swal.fire("Error", "Failed to save feedback", "error");
      }
    }
  };

  /* ================= WHATSAPP ================= */
  const openWhatsApp = (lead) => {
    let phone = lead.phone.replace(/\D/g, "");

    if (!phone.startsWith("91")) {
      phone = "91" + phone;
    }

    const message = `Hello ${lead.name}, regarding your enquiry: ${lead.message}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  /* ================= FILTER ================= */

  const uniqueAddresses = [
    ...new Set(leads.map((lead) => lead.address)),
  ];

  const filteredLeads = selectedAddress
    ? leads.filter((lead) => lead.address === selectedAddress)
    : leads;

  /* ================= PAGINATION ================= */

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;

  const currentLeads = filteredLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Cold Leads / Enquiries</h2>

      {loading ? (
        <p>Loading...</p>
      ) : leads.length === 0 ? (
        <p>No enquiries found.</p>
      ) : (
        <>
          {/* ✅ FILTER UI */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ marginRight: "10px" }}>
              Filter by Address:
            </label>

            <select
              value={selectedAddress}
              onChange={(e) => {
                setSelectedAddress(e.target.value);
                setCurrentPage(1);
              }}
              style={{ padding: "6px", borderRadius: "4px" }}
            >
              <option value="">All</option>

              {uniqueAddresses.map((addr, index) => (
                <option key={index} value={addr}>
                  {addr}
                </option>
              ))}
            </select>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={thStyle}>SL No.</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Address</th>
                  <th style={thStyle}>Message</th>
                  <th style={thStyle}>Feedback</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentLeads.map((lead, index) => (
                  <tr key={lead._id}>
                    <td style={tdStyle}>
                      {indexOfFirstLead + index + 1}
                    </td>

                    <td style={tdStyle}>{lead.name}</td>
                    <td style={tdStyle}>{lead.phone}</td>
                    <td style={tdStyle}>{lead.address}</td>
                    <td style={tdStyle}>{lead.message}</td>

                    <td style={tdStyle}>
                      {lead.feedback ? (
                        lead.feedback
                      ) : (
                        <span style={{ color: "#9ca3af" }}>
                          No feedback
                        </span>
                      )}
                    </td>

                    <td style={tdStyle}>
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(lead._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td style={tdStyle}>
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>

                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        
                        {/* WhatsApp */}
                        <button
                          onClick={() => openWhatsApp(lead)}
                          style={whatsappBtn}
                        >
                          <FaWhatsapp />
                        </button>

                        {/* Feedback */}
                        <button
                          onClick={() => giveFeedback(lead)}
                          style={feedbackBtn}
                        >
                          {lead.feedback ? "Edit" : "Add"}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteLead(lead._id)}
                          style={deleteBtn}
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={pageBtn}
            >
              Prev
            </button>

            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={pageBtn}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const thStyle = {
  padding: "10px",
  border: "1px solid #e5e7eb",
  textAlign: "left",
  fontWeight: "600",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #e5e7eb",
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

const feedbackBtn = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

const whatsappBtn = {
  background: "#25D366",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const pageBtn = {
  padding: "6px 12px",
  margin: "0 5px",
  cursor: "pointer",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

export default AdminColdLeads;