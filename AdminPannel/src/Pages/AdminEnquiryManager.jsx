import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AdminEnquiryManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ENQUIRIES ================= */
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await API.get("/enquiries");
      setEnquiries(res.data.data || []);
    } catch (err) {
      console.error("FETCH ENQUIRY ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/enquiries/${id}/status`, { status });
      fetchEnquiries();
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
    }
  };

  /* ================= DELETE ================= */
  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;

    try {
      await API.delete(`/enquiries/${id}`);
      fetchEnquiries();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Contact Enquiries</h2>

      {loading ? (
        <p>Loading enquiries...</p>
      ) : enquiries.length === 0 ? (
        <p>No enquiries found</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {enquiries.map((item) => (
              <tr key={item._id}>
                {/* ✅ FIXED FIELD NAME */}
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>{item.phone}</td>
                <td style={{ maxWidth: "250px" }}>{item.message}</td>

                <td>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateStatus(item._id, e.target.value)
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() => deleteEnquiry(item._id)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
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
      )}
    </div>
  );
};

export default AdminEnquiryManager;