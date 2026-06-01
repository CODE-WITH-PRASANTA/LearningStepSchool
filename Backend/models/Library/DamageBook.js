const mongoose = require("mongoose");

const damageBookSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    damageDate: {
      type: Date,
      required: true,
    },
    damagedQty: {
      type: Number,
      required: true,
      min: 1,
    },
    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DamageBook", damageBookSchema);