const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Public Holiday",
        "School Holiday",
        "Festival",
        "Other",
      ],
      default: "Public Holiday",
    },

    // true = salary is paid for this holiday
    // false = salary is not paid
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate holiday on same date
holidaySchema.index(
  {
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.models.Holiday ||
  mongoose.model("Holiday", holidaySchema);