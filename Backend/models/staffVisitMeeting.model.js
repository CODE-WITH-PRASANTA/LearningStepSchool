const mongoose = require("mongoose");

const staffVisitMeetingSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    schoolName: {
      type: String,
      required: true,
    },

    remark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StaffVisitMeeting",
  staffVisitMeetingSchema
);