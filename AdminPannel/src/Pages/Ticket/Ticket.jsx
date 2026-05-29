import React, { useRef, useState } from "react";

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

  const [tickets, setTickets] = useState([
    {
      id: 20,
      date: "28/05/2026, 9:55 AM",
      title: "My Child Not Learning Anything !",
      description: "Name :- Adayasa , Cls - 5",
      status: "Solved",
      chats: ["Solved"],
      bg: "#edf8f0",
      image: "",
    },

    {
      id: 14,
      date: "18/12/2025, 12:29 PM",
      title: "test",
      description: "test",
      status: "pending",
      chats: ["test1", "demo"],
      bg: "#f8f2eb",
      image: "",
    },

    {
      id: 13,
      date: "18/12/2025, 12:22 PM",
      title: "test",
      description: "test",
      status: "pending",
      chats: [],
      bg: "#faf1f7",
      image: "",
    },

    {
      id: 12,
      date: "18/12/2025, 11:42 AM",
      title: "test",
      description: "test",
      status: "pending",
      chats: ["test", "test 4"],
      bg: "#f1f4ff",
      image: "",
    },
  ]);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showChatModal, setShowChatModal] =
    useState(false);

  const [showImageModal, setShowImageModal] =
    useState(false);

  const [selectedTicket, setSelectedTicket] =
    useState(null);

  const [previewImage, setPreviewImage] =
    useState("");

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [chatText, setChatText] =
    useState("");

  /* =========================
     IMAGE UPLOAD
  ========================= */

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(file);

    setNewTicket({
      ...newTicket,
      image: imageUrl,
    });
  };

  /* =========================
     ADD TICKET
  ========================= */

  const handleAddTicket = () => {

    if (
      !newTicket.title ||
      !newTicket.description
    ) {
      alert("Please fill all fields");
      return;
    }

    const ticket = {
      id: Date.now(),

      date: new Date().toLocaleString(),

      title: newTicket.title,

      description: newTicket.description,

      status: "pending",

      chats: [],

      bg: "#f4f6ff",

      image: newTicket.image,
    };

    setTickets([ticket, ...tickets]);

    setNewTicket({
      title: "",
      description: "",
      image: "",
    });

    setShowAddModal(false);
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

  const handleAddChat = () => {

    if (!chatText.trim()) return;

    const updated = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            chats: [
              ...ticket.chats,
              chatText,
            ],
          }
        : ticket
    );

    setTickets(updated);

    setSelectedTicket({
      ...selectedTicket,
      chats: [
        ...selectedTicket.chats,
        chatText,
      ],
    });

    setChatText("");

    setShowChatModal(false);
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

  return (
    <div className="ticket-page">

      {/* TOPBAR */}

      <div className="ticket-topbar">

        <div className="ticket-search-box">

          <FaSearch className="ticket-search-icon" />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

        <div className="ticket-top-right">

          <span className="ticket-count">
            {tickets.length} / 30
          </span>

          <button
            className="ticket-add-btn"
            onClick={() =>
              setShowAddModal(true)
            }
          >
            <FaPlus />
          </button>

        </div>

      </div>

      {/* GRID */}

      <div className="ticket-grid">

        {tickets.map((ticket) => (

          <div
            className="ticket-card"
            key={ticket.id}
            style={{
              background: ticket.bg,
            }}
          >

            {/* CARD TOP */}

            <div className="ticket-card-top">

              <span className="ticket-date">
                {ticket.date} #{ticket.id}
              </span>

              <span
                className={`ticket-status ${
                  ticket.status === "Solved"
                    ? "ticket-status-solved"
                    : "ticket-status-pending"
                }`}
              >
                {ticket.status}
              </span>

            </div>

            {/* CARD IMAGE */}

            {ticket.image && (
              <div className="ticket-card-image">

                <img
                  src={ticket.image}
                  alt="ticket"
                />

              </div>
            )}

            {/* CONTENT */}

            <div className="ticket-content">

              <h3>
                <span>Title:</span>{" "}
                {ticket.title}
              </h3>

              <p>
                <span>Description:</span>{" "}
                {ticket.description}
              </p>

              <div className="ticket-chat-list">

                {ticket.chats.map(
                  (chat, index) => (
                    <div
                      className="ticket-chat-item"
                      key={index}
                    >
                      <FaRegCommentDots />

                      <span>{chat}</span>
                    </div>
                  )
                )}

              </div>

            </div>

            {/* FOOTER */}

            <div className="ticket-footer">

              <button
                className="ticket-icon-btn"
                onClick={() =>
                  handleViewImage(
                    ticket.image
                  )
                }
              >
                <FaEye />
              </button>

              <button
                className="ticket-icon-btn"
                onClick={() =>
                  openChat(ticket)
                }
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
                onClick={() =>
                  setShowAddModal(false)
                }
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
                    description:
                      e.target.value,
                  })
                }
              />

              {/* IMAGE PREVIEW */}

              {newTicket.image && (

                <div className="ticket-preview-scroll">

                  <div className="ticket-preview-image">

                    <img
                      src={newTicket.image}
                      alt="preview"
                    />

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
                onChange={
                  handleImageChange
                }
              />

              {/* BROWSE BUTTON */}

              <button
                className="ticket-upload-btn"
                onClick={
                  handleBrowseClick
                }
              >
                <FaCloudUploadAlt />

                Browse Image
              </button>

              {/* FOOTER */}

              <div className="ticket-modal-footer">

                <button
                  className="ticket-cancel-btn"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="ticket-submit-btn"
                  onClick={handleAddTicket}
                >
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
                onClick={() =>
                  setShowChatModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="ticket-modal-body">

              <textarea
                placeholder="Your Query *"
                value={chatText}
                onChange={(e) =>
                  setChatText(
                    e.target.value
                  )
                }
              />

              <div className="ticket-modal-footer">

                <button
                  className="ticket-cancel-btn"
                  onClick={() =>
                    setShowChatModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="ticket-submit-btn"
                  onClick={handleAddChat}
                >
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
              onClick={() =>
                setShowImageModal(false)
              }
            >
              <FaTimes />
            </button>

            <img
              src={previewImage}
              alt="preview"
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default Ticket;