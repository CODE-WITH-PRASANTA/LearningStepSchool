const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema(
  {
    /* =========================================
       EMPLOYEE
    ========================================= */

    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },

    /* =========================================
       PUMP
    ========================================= */

    pumpName: {
      type: String,
      required: [true, "Pump name is required"],
      trim: true,
    },

    /* =========================================
       DATE
    ========================================= */

    date: {
      type: Date,
      required: [true, "Fuel date is required"],
    },

    /* =========================================
       INVOICE
    ========================================= */

    invoiceNo: {
      type: String,
      required: [true, "Invoice number is required"],
      trim: true,
    },

    /* =========================================
       ODOMETER
    ========================================= */

    km: {
      type: Number,
      default: 0,
      min: [0, "KM cannot be negative"],
    },

    /* =========================================
       RATE
    ========================================= */

    rate: {
      type: Number,
      default: 0,
      min: [0, "Rate cannot be negative"],
    },

    /* =========================================
       VOLUME
    ========================================= */

    volume: {
      type: Number,
      default: 0,
      min: [0, "Volume cannot be negative"],
    },

    /* =========================================
       AMOUNT
    ========================================= */

    amount: {
      type: Number,
      default: 0,
      min: [0, "Amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   CALCULATE AMOUNT BEFORE SAVE
========================================================= */

fuelSchema.pre("save", function () {
  const rate = Number(this.rate) || 0;
  const volume = Number(this.volume) || 0;

  this.amount = Number(
    (rate * volume).toFixed(2)
  );
});


/* =========================================================
   MODEL
========================================================= */

module.exports = mongoose.model(
  "Fuel",
  fuelSchema
);