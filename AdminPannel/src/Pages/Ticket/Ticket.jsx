import React, { useEffect, useRef, useState } from "react";

import API, { IMAGE_URL } from "../../api/axios";

import {
  FaSearch,
  FaPlus,
  FaEye,
  FaCommentDots,
  FaRegCommentDots,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";

import "./Ticket.css";

const Ticket = () => {
  const fileInputRef = useRef(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [showChatModal, setShowChatModal] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [previewImage, setPreviewImage] = useState("");

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
  });

  const [chatText, setChatText] = useState("");

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const fetchTickets = async (searchValue = "") => {
    try {
      setLoading(true);

      const res = await API.get(`/ticket?search=${searchValue}`);

      setTickets(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================
     IMAGE UPLOAD
  ========================= */

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
  };

  /* =========================
     ADD TICKET
  ========================= */

  const handleAddTicket = async () => {
    try {
      if (!newTicket.title || !newTicket.description) {
        alert("Please fill all fields");
        return;
      }

      const formData = new FormData();

      formData.append("title", newTicket.title);

      formData.append("description", newTicket.description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await API.post("/ticket/create", formData);

      fetchTickets();

      setShowAddModal(false);

      setNewTicket({
        title: "",
        description: "",
      });

      setImageFile(null);

      setImagePreview("");
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     OPEN CHAT
  ========================= */

  const openChat = (ticket) => {
    setSelectedTicket(ticket);
    setShowChatModal(true);
  };

  /* =========================
     ADD CHAT
  ========================= */

  const handleAddChat = async () => {
    try {
      if (!chatText.trim()) return;

      await API.post(`/ticket/${selectedTicket._id}/reply`, {
        sender: "Parent",
        message: chatText,
      });

      setChatText("");

      setShowChatModal(false);

      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     VIEW IMAGE
  ========================= */

  const handleViewImage = (image) => {
    if (!image) {
      alert("No image uploaded");
      return;
    }

    setPreviewImage(image);

    setShowImageModal(true);
  };

  const handleToggleStatus = async (ticket) => {
    try {
      let newStatus = "Pending";

      if (ticket.status === "Pending") {
        newStatus = "In Progress";
      } else if (ticket.status === "In Progress") {
        newStatus = "Solved";
      } else if (ticket.status === "Solved") {
        newStatus = "Closed";
      } else {
        newStatus = "Pending";
      }

      await API.put(`/ticket/${ticket._id}/status`, {
        status: newStatus,
      });

      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ticket-page">
      {/* TOPBAR */}

      <div className="ticket-topbar">
        <div className="ticket-search-box">
          <FaSearch className="ticket-search-icon" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ticket-top-right">
          <span className="ticket-count">{tickets.length} / 30</span>

          <button
            className="ticket-add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* GRID */}

      {loading && <h3>Loading Tickets...</h3>}

      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <div
            className="ticket-card"
            key={ticket._id}
            style={{
              background: ticket.bg,
            }}
          >
            {/* CARD TOP */}

            <div className="ticket-card-top">
              <span className="ticket-date">
                {new Date(ticket.createdAt).toLocaleString()} #{ticket.ticketNo}
              </span>

              <span
                onClick={() => handleToggleStatus(ticket)}
                style={{
                  cursor: "pointer",
                }}
                className={`ticket-status ${
                  ticket.status === "Solved"
                    ? "ticket-status-solved"
                    : ticket.status === "Closed"
                      ? "ticket-status-solved"
                      : ticket.status === "In Progress"
                        ? "ticket-status-progress"
                        : "ticket-status-pending"
                }`}
              >
                {ticket.status}
              </span>
            </div>

            {/* CARD IMAGE */}

            {ticket.image && (
              <div className="ticket-card-image">
                <img src={`${IMAGE_URL}${ticket.image}`} alt="ticket" />
              </div>
            )}

            {/* CONTENT */}

            <div className="ticket-content">
              <h3>
                <span>Title:</span> {ticket.title}
              </h3>

              <p>
                <span>Description:</span> {ticket.description}
              </p>

              <div className="ticket-chat-list">
                {ticket.chats?.map((chat, index) => (
                  <div className="ticket-chat-item" key={index}>
                    <FaRegCommentDots />

                    <span>{chat.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}

            <div className="ticket-footer">
              <button
                className="ticket-icon-btn"
                onClick={() => handleViewImage(`${IMAGE_URL}${ticket.image}`)}
              >
                <FaEye />
              </button>

              <button
                className="ticket-icon-btn"
                onClick={() => openChat(ticket)}
              >
                <FaCommentDots />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}

      {showAddModal && (
        <div className="ticket-modal-overlay">
          <div className="ticket-modal">
            <div className="ticket-modal-header">
              <h2>ADD TICKET</h2>

              <button
                className="ticket-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="ticket-modal-body">
              <input
                type="text"
                placeholder="Title*"
                value={newTicket.title}
                onChange={(e) =>
                  setNewTicket({
                    ...newTicket,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Description*"
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({
                    ...newTicket,
                    description: e.target.value,
                  })
                }
              />

              {/* IMAGE PREVIEW */}

              {imagePreview && (
                <div className="ticket-preview-scroll">
                  <div className="ticket-preview-image">
                    <img src={imagePreview} alt="preview" />
                  </div>
                </div>
              )}

              {/* FILE INPUT */}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{
                  display: "none",
                }}
                onChange={handleImageChange}
              />

              {/* BROWSE BUTTON */}

              <button className="ticket-upload-btn" onClick={handleBrowseClick}>
                <FaCloudUploadAlt />
                Browse Image
              </button>

              {/* FOOTER */}

              <div className="ticket-modal-footer">
                <button
                  className="ticket-cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button className="ticket-submit-btn" onClick={handleAddTicket}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAT MODAL */}

      {showChatModal && (
        <div className="ticket-modal-overlay">
          <div className="ticket-chat-modal">
            <div className="ticket-modal-header">
              <h2>CHAT</h2>

              <button
                className="ticket-close-btn"
                onClick={() => setShowChatModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="ticket-modal-body">
              <textarea
                placeholder="Your Query *"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
              />

              <div className="ticket-modal-footer">
                <button
                  className="ticket-cancel-btn"
                  onClick={() => setShowChatModal(false)}
                >
                  Cancel
                </button>

                <button className="ticket-submit-btn" onClick={handleAddChat}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}

      {showImageModal && (
        <div className="ticket-modal-overlay">
          <div className="ticket-image-modal">
            <button
              className="ticket-image-close"
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes />
            </button>

            <img src={previewImage} alt="preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticket;
