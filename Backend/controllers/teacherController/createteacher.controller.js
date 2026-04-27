
const User = require("../../models/techerModel/createteacher.model");
const hashPassword = require("../../utils/hash");

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check existing
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // hash password
    const hashed = await hashPassword(password);

    // create teacher
    const teacher = await User.create({
      name,
      email,
      password: hashed,
      role: "teacher",
      permissions: permissions || [],
    });

    res.status(201).json({
      message: "Teacher created successfully",
      teacher,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find().select("-password");

    res.status(200).json({
      data: teachers, // ✅ FIXED
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select("-password");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMeTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).select("-password");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      permissions: teacher.permissions || [],
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    const teacher = await User.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // ✅ update fields
    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (permissions) teacher.permissions = permissions;

    // 🔐 update password only if provided
    if (password) {
      teacher.password = await hashPassword(password);
    }

    await teacher.save();

    const teacherObj = teacher.toObject();
    delete teacherObj.password;

    res.json({
      message: "Teacher updated successfully",
      teacher: teacherObj,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

