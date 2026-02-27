const Event = require("../models/event.model");
const { deleteImageFile } = require("../middleware/upload");

/* ================= CREATE ================= */
exports.createEvent = async (req, res) => {
  try {
    const { title, location, date, review, rating } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, location and date are required",
      });
    }

    const event = await Event.create({
      title,
      location,
      date,
      review,
      rating: rating !== undefined ? Number(rating) : undefined,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json({
      success: true,
      data: event,
    });

  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: events,
    });

  } catch (err) {
    console.error("GET EVENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, date, review, rating } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 🔥 Replace image if new one uploaded
    if (req.file?.path) {
      deleteImageFile(event.image); // delete old image
      event.image = req.file.path;
    }

    // 🔥 Update fields safely
    if (title !== undefined) event.title = title;
    if (location !== undefined) event.location = location;
    if (date !== undefined) event.date = date;
    if (review !== undefined) event.review = review;
    if (rating !== undefined) event.rating = Number(rating);

    await event.save();

    res.json({
      success: true,
      data: event,
    });

  } catch (err) {
    console.error("UPDATE EVENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 🔥 Delete image safely
    deleteImageFile(event.image);

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Event deleted successfully",
    });

  } catch (err) {
    console.error("DELETE EVENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};