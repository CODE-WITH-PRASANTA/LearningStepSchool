const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },

    pumpName: {
      type: String,
      required: [true, "Pump name is required"],
      trim: true,
    },

    // Vehicle number or vehicle name
    vehicle: {
      type: String,
      default: "",
      trim: true,
    },

    // Purpose of travel or additional notes
    description: {
      type: String,
      default: "",
      trim: true,
    },

    date: {
      type: Date,
      required: [true, "Fuel date is required"],
    },

    invoiceNo: {
      type: String,
      required: [true, "Invoice number is required"],
      trim: true,
      uppercase: true,
    },

    km: {
      type: Number,
      default: 0,
      min: [0, "KM cannot be negative"],
    },

    rate: {
      type: Number,
      default: 0,
      min: [0, "Rate cannot be negative"],
    },

    volume: {
      type: Number,
      default: 0,
      min: [0, "Volume cannot be negative"],
    },

    amount: {
      type: Number,
      default: 0,
      min: [0, "Amount cannot be negative"],
    },

    fuelBill: {
      type: String,
      default: "",
      trim: true,
    },

    fuelBillOriginalName: {
      type: String,
      default: "",
      trim: true,
    },

    fuelBillMimeType: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

fuelSchema.pre("save", function () {
  const rate = Number(this.rate) || 0;
  const volume = Number(this.volume) || 0;

  this.amount = Number((rate * volume).toFixed(2));
});

fuelSchema.index({ invoiceNo: 1 });
fuelSchema.index({ employeeName: 1 });
fuelSchema.index({ pumpName: 1 });
fuelSchema.index({ vehicle: 1 });
fuelSchema.index({ date: -1 });
fuelSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Fuel", fuelSchema);