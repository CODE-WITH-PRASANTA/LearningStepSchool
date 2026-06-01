const mongoose = require("mongoose");

const teacherAttendanceSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      required: true,
    },

    leaveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
  },
  { timestamps: true }
);

// prevent duplicate
teacherAttendanceSchema.index(
  { teacherId: 1, date: 1 },
  { unique: true }
);

// 🔥 SAFE EXPORT
module.exports =
  mongoose.models.TeacherAttendance ||
  mongoose.model("TeacherAttendance", teacherAttendanceSchema);