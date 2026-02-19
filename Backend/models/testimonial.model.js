const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [2, "Client name must be at least 2 characters"],
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },

    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: [150, "Designation cannot exceed 150 characters"],
    },

    feedback: {
      type: String,
      required: [true, "Feedback is required"],
      minlength: [5, "Feedback must be at least 5 characters"],
      maxlength: [1000, "Feedback cannot exceed 1000 characters"],
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },

    photo: {
      type: String,
      required: [true, "Photo is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ================= INDEX (Optional but Recommended) ================= */
testimonialSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);