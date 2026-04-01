const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },

    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },

        // ✅ ADD THESE
        name: {
          type: String,
          required: true,
        },
        rollNumber: {
          type: String,
          default: "",
        },

        status: {
          type: String,
          enum: ["Present", "Absent", "Leave"],
          default: "Present",
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

// 🔥 prevent duplicate per day
attendanceSchema.index(
  { className: 1, section: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);