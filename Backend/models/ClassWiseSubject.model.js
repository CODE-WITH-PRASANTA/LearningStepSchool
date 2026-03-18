const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const classWiseSubjectSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      unique: true, // one class = one document
    },

    subjects: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("ClassWiseSubject", classWiseSubjectSchema);