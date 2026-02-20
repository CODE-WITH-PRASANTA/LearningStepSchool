const fs = require("fs");
const Event = require("../models/event.model");

/* CREATE */
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      title: req.body.title,
      location: req.body.location,
      date: req.body.date,
      review: req.body.review,
      rating: req.body.rating,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL */
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Not found" });

    const updateData = {
      title: req.body.title,
      location: req.body.location,
      date: req.body.date,
      review: req.body.review,
      rating: req.body.rating,
    };

    if (req.file?.path) {
      if (event.image && fs.existsSync(event.image)) {
        fs.unlinkSync(event.image);
      }
      updateData.image = req.file.path;
    }

    const updated = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });

    if (event.image && fs.existsSync(event.image)) {
      fs.unlinkSync(event.image);
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
