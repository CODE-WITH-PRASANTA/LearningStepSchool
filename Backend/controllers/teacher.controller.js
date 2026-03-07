const Teacher = require("../models/teacher.model");
const { deleteImageFile } = require("../middleware/upload");

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
    } = req.body;

    // ✅ Get photo from multer
    const photo = req.file ? req.file.path : null;

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    const teacher = await Teacher.create({
      name,
      designation,
      review,
      rating: rating !== undefined ? Number(rating) : undefined,
      photo,
      instagram,
      facebook,
      linkedin,
    });

    res.status(201).json({
      success: true,
      data: teacher,
    });

  } catch (err) {
    console.error("CREATE TEACHER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: teachers,
    });

  } catch (err) {
    console.error("GET TEACHERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const {
      name,
      designation,
      review,
      rating,
      instagram,
      facebook,
      linkedin,
    } = req.body;

    const newPhoto = req.file ? req.file.path : null;

    // ✅ Replace photo if new uploaded
    if (newPhoto) {
      deleteImageFile(teacher.photo);
      teacher.photo = newPhoto;
    }

    // ✅ Safe field updates
    if (name !== undefined) teacher.name = name;
    if (designation !== undefined) teacher.designation = designation;
    if (review !== undefined) teacher.review = review;
    if (rating !== undefined) teacher.rating = Number(rating);
    if (instagram !== undefined) teacher.instagram = instagram;
    if (facebook !== undefined) teacher.facebook = facebook;
    if (linkedin !== undefined) teacher.linkedin = linkedin;

    await teacher.save();

    res.json({
      success: true,
      data: teacher,
    });

  } catch (err) {
    console.error("UPDATE TEACHER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // ✅ Delete photo safely
    if (teacher.photo) {
      deleteImageFile(teacher.photo);
    }

    await Teacher.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });

  } catch (err) {
    console.error("DELETE TEACHER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};