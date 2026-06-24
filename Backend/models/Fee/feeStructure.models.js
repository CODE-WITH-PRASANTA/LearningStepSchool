const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema(
  {
    structureType: {
      type: String,
      required: true,
      enum: ["Monthly", "Quarterly", "Half-Yearly", "Annually"],
    },

    className: {
      type: String,
      required: true,
    },

    stream: {
      type: String,
      default: "None",
    },

    feeItems: [
      {
        feeHead: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FeeHead",
        },

        amounts: {
          type: Map,
          of: Number,
        },

        total: {
          type: Number,
          default: 0,
        },
      },
    ],

    grandTotal: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model(
  "FeeStructure",
  feeStructureSchema
);