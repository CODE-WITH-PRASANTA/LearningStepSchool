const fs = require("fs");
const Testimonial = require("../models/testimonial.model");

/* ================= CREATE ================= */
exports.createTestimonial = async (req, res) => {
  try {
    const { clientName, designation, feedback, rating } = req.body;

    if (!clientName || !designation || !feedback || !rating) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    const testimonial = await Testimonial.create({
      clientName,
      designation,
      feedback,
      rating: Number(rating),
      photo: req.file.path,
    });

    res.status(201).json({
      success: true,
      data: testimonial,
    });

  } catch (error) {
    console.error("CREATE TESTIMONIAL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: testimonials,
    });

  } catch (error) {
    console.error("GET TESTIMONIALS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, designation, feedback, rating } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const updateData = {};

    if (clientName) updateData.clientName = clientName;
    if (designation) updateData.designation = designation;
    if (feedback) updateData.feedback = feedback;
    if (rating) updateData.rating = Number(rating);

    /* Replace photo if new one uploaded */
    if (req.file) {
      if (testimonial.photo && fs.existsSync(testimonial.photo)) {
        fs.unlinkSync(testimonial.photo);
      }
      updateData.photo = req.file.path;
    }

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: updated,
    });

  } catch (error) {
    console.error("UPDATE TESTIMONIAL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    /* Delete image from folder */
    if (testimonial.photo && fs.existsSync(testimonial.photo)) {
      fs.unlinkSync(testimonial.photo);
    }

    await Testimonial.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });

  } catch (error) {
    console.error("DELETE TESTIMONIAL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};