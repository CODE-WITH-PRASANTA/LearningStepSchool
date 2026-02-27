import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminColdLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH LEADS ================= */
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

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/enquiries/${id}/status`, { status });
      fetchLeads();
    } catch (error) {
      console.error("STATUS ERROR:", error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Cold Leads / Enquiries</h2>

      {loading ? (
        <p>Loading...</p>
      ) : leads.length === 0 ? (
        <p>No enquiries found.</p>
      ) : (
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
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td style={tdStyle}>{lead.name}</td>
                  <td style={tdStyle}>{lead.phone}</td>
                  <td style={tdStyle}>{lead.address}</td>
                  <td style={tdStyle}>{lead.message}</td>

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
                    <button
                      onClick={() => deleteLead(lead._id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ================= SIMPLE TABLE STYLES ================= */

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

export default AdminColdLeads;