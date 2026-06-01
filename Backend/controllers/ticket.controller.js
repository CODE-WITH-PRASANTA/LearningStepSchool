const Ticket = require("../models/ticket.model");

/* ===================================
   GENERATE TICKET NUMBER
=================================== */

const generateTicketNo = () => {
  const year = new Date().getFullYear();

  const random = Math.floor(100000 + Math.random() * 900000);

  return `TKT-${year}-${random}`;
};

/* ===================================
   CREATE TICKET
=================================== */

exports.createTicket = async (req, res) => {
  try {
    const image = req.body.image?.length > 0 ? req.body.image[0] : "";

    const ticket = await Ticket.create({
      ticketNo: generateTicketNo(),
      title: req.body.title,
      description: req.body.description,
      image,
      priority: req.body.priority || "Medium",
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   GET ALL TICKETS
=================================== */

exports.getAllTickets = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const query = {
      $or: [
        {
          ticketNo: {
            $regex: search,
            $options: "i",
          },
        },
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const total = await Ticket.countDocuments(query);

    const tickets = await Ticket.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,

      total,

      currentPage: page,

      totalPages: Math.ceil(total / limit),

      data: tickets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   GET SINGLE TICKET
=================================== */

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   ADD REPLY
=================================== */

exports.addReply = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.chats.push({
      sender: req.body.sender || "Parent",

      message: req.body.message,
    });

    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Reply added successfully",

      data: ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   UPDATE ticket
=================================== */
exports.updateTicket = async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
      };
  
      if (req.body.image?.length > 0) {
        updateData.image = req.body.image[0];
      }
  
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: "Ticket updated successfully",
        data: ticket,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/* ===================================
   UPDATE STATUS
=================================== */

exports.updateStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      },
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",

      data: ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   DELETE TICKET
=================================== */

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===================================
   TICKET STATS
=================================== */

exports.ticketStats = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();

    const pending = await Ticket.countDocuments({
      status: "Pending",
    });

    const solved = await Ticket.countDocuments({
      status: "Solved",
    });

    const closed = await Ticket.countDocuments({
      status: "Closed",
    });

    return res.status(200).json({
      success: true,

      data: {
        total,
        pending,
        solved,
        closed,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
