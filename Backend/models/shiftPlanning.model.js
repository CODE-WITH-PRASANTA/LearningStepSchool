const mongoose = require("mongoose");

const shiftPlanningSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shiftType: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Night"],
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

shiftPlanningSchema.index(
  {
    teacherId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "ShiftPlanning",
  shiftPlanningSchema
);