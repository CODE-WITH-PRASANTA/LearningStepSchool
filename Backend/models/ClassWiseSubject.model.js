const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["regular", "optional"],
    default: "regular",
  },
});

const classWiseSubjectSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      unique: true,
    },

    subjects: [subjectSchema], // ✅ UPDATED
  },
  {
    timestamps: true,
  }
);

module.exports = model("ClassWiseSubject", classWiseSubjectSchema);