const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Punch In", "Punch Out", "Break Start", "Break End"],
    },

    time: {
      type: Date,
    },
  },
  { _id: false },
);

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

    // Attendance Status
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Late", "Half Day"],
      default: "Absent",
    },

    // Punch Times
    punchIn: {
      type: Date,
      default: null,
    },

    punchOut: {
      type: Date,
      default: null,
    },

    // Break
    breaks: [
      {
        start: {
          type: Date,
          default: null,
        },

        end: {
          type: Date,
          default: null,
        },

        durationSeconds: {
          type: Number,
          default: 0,
        },

        reason: {
          type: String,
          default: "",
        },
      },
    ],

    // Time Calculation
    workSeconds: {
      type: Number,
      default: 0,
    },

    breakSeconds: {
      type: Number,
      default: 0,
    },

    overtimeSeconds: {
      type: Number,
      default: 0,
    },

    lateMinutes: {
      type: Number,
      default: 0,
    },

    earlyLeavingMinutes: {
      type: Number,
      default: 0,
    },

    leaveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },

    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// One attendance per teacher per day
teacherAttendanceSchema.index(
  {
    teacherId: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

module.exports =
  mongoose.models.TeacherAttendance ||
  mongoose.model("TeacherAttendance", teacherAttendanceSchema);
