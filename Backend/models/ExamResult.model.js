const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const subjectSchema = new Schema({
  subject: String,
  marks: Number,
  fullMarks: Number
});

const examResultSchema = new Schema(
  {
    admissionNo: String,
    name: String,
    rollNumber: String,

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class"
    },

    class: String, // ✅ ADD THIS

    examType: String,

    subjects: [subjectSchema],

    total: Number,
    fullMarks: Number,
    percentage: Number,
    grade: String,
    result: String
  },
  { timestamps: true }
);

module.exports = model("ExamResult", examResultSchema);