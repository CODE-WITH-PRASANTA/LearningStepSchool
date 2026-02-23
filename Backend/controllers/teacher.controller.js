const fs = require("fs");
const Teacher = require("../models/teacher.model");

/* ================= CREATE ================= */
exports.createTeacher = async (req, res) => {
  try {
    const {
      name,
      designation,
      review,
      rating,
      instagram,
      facebook,
      linkedin,
      photo   // 🔥 middleware injects this
    } = req.body;

    if (!photo) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const teacher = await Teacher.create({
      name,
      designation,
      review,
      rating,
      photo,
      instagram,
      facebook,
      linkedin,
    });

    res.status(201).json(teacher);
  } catch (err) {
    console.error("CREATE TEACHER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    console.error("GET TEACHERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      designation,
      review,
      rating,
      instagram,
      facebook,
      linkedin,
      photo  // 🔥 injected if new image uploaded
    } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const updateData = {
      name,
      designation,
      review,
      rating,
      instagram,
      facebook,
      linkedin,
    };

    // 🔥 If new photo uploaded
    if (photo) {
      // delete old photo
      if (teacher.photo && fs.existsSync(teacher.photo)) {
        fs.unlinkSync(teacher.photo);
      }

      updateData.photo = photo;
    }

    const updated = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("UPDATE TEACHER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // delete photo file
    if (teacher.photo && fs.existsSync(teacher.photo)) {
      fs.unlinkSync(teacher.photo);
    }

    await Teacher.findByIdAndDelete(id);

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error("DELETE TEACHER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};