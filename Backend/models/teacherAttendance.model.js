const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Punch In",
        "Punch Out",
        "Break Start",
        "Break End",
      ],
      required: true,
    },

    time: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const breakSchema = new mongoose.Schema(
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
      min: 0,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const teacherAttendanceSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
      Logical attendance date.

      Always stored as UTC midnight.

      Example:
      July 13, 2026
      =>
      2026-07-13T00:00:00.000Z
    */

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Present",
        "Absent",
        "Leave",
        "Late",
        "Half Day",
      ],
      default: "Absent",
      required: true,
    },

    punchIn: {
      type: Date,
      default: null,
    },

    punchOut: {
      type: Date,
      default: null,
    },

    breaks: {
      type: [breakSchema],
      default: [],
    },

    workSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    breakSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtimeSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    lateMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    earlyLeavingMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    leaveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
      default: null,
    },

    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

teacherAttendanceSchema.index(
  {
    teacherId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.models.TeacherAttendance ||
  mongoose.model(
    "TeacherAttendance",
    teacherAttendanceSchema
  );