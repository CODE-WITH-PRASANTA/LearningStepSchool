import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";

const AdminEnquiryManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const enquiriesPerPage = 5;

  /* ================= FETCH ================= */
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

  /* ================= STATUS ================= */
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

  /* ================= FEEDBACK ================= */
  const giveFeedback = async (item) => {
    const { value: text } = await Swal.fire({
      title: "Admin Feedback",
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your feedback here...",
      inputValue: item.feedback || "",
      showCancelButton: true,
    });

    if (text !== undefined) {
      try {
        await API.put(`/enquiries/${item._id}/feedback`, {
          feedback: text,
        });

        Swal.fire("Saved!", "Feedback updated", "success");
        fetchEnquiries();
      } catch (error) {
        console.error("FEEDBACK ERROR:", error);
        Swal.fire("Error", "Failed to save feedback", "error");
      }
    }
  };

  /* ================= WHATSAPP ================= */
  const openWhatsApp = (item) => {
    let phone = item.phone.replace(/\D/g, "");

    if (!phone.startsWith("91")) {
      phone = "91" + phone;
    }

    const message = `Hello ${item.name}, regarding your enquiry: ${item.message}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  /* ================= FILTER ================= */
  const uniqueAddresses = [
    ...new Set(enquiries.map((e) => e.address)),
  ];

  const filteredData = selectedAddress
    ? enquiries.filter((e) => e.address === selectedAddress)
    : enquiries;

  /* ================= PAGINATION ================= */
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;

  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / enquiriesPerPage);

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Contact Enquiries</h2>

      {loading ? (
        <p>Loading enquiries...</p>
      ) : enquiries.length === 0 ? (
        <p>No enquiries found</p>
      ) : (
        <>
          {/* FILTER */}
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
              {uniqueAddresses.map((addr, i) => (
                <option key={i} value={addr}>
                  {addr}
                </option>
              ))}
            </select>
          </div>

          {/* TABLE */}
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
                  <th style={th}>SL</th>
                  <th style={th}>Name</th>
                  <th style={th}>Address</th>
                  <th style={th}>Phone</th>
                  <th style={th}>Message</th>
                  <th style={th}>Feedback</th>
                  <th style={th}>Status</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item._id}>
                    <td style={td}>{indexOfFirst + index + 1}</td>

                    <td style={td}>{item.name}</td>
                    <td style={td}>{item.address}</td>
                    <td style={td}>{item.phone}</td>
                    <td style={td}>{item.message}</td>

                    <td style={td}>
                      {item.feedback || (
                        <span style={{ color: "#9ca3af" }}>
                          No feedback
                        </span>
                      )}
                    </td>

                    <td style={td}>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateStatus(item._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td style={td}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        
                        {/* WhatsApp */}
                        <button
                          onClick={() => openWhatsApp(item)}
                          style={whatsappBtn}
                        >
                          <FaWhatsapp />
                        </button>

                        {/* Feedback */}
                        <button
                          onClick={() => giveFeedback(item)}
                          style={feedbackBtn}
                        >
                          {item.feedback ? "Edit" : "Add"}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteEnquiry(item._id)}
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

const th = {
  padding: "10px",
  border: "1px solid #e5e7eb",
};

const td = {
  padding: "10px",
  border: "1px solid #e5e7eb",
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
};

const feedbackBtn = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
};

const whatsappBtn = {
  background: "#25D366",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
};

const pageBtn = {
  padding: "6px 12px",
  margin: "0 5px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
        
export default AdminEnquiryManager;