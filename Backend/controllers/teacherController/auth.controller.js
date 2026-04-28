const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/techerModel/createteacher.model");
const hashPassword = require("../../utils/hash");



exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // ✅ find teacher
    const teacher = await User.findOne({ email });

    if (!teacher) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    // ✅ check password
    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ create token (VERY IMPORTANT)
    const token = jwt.sign(
      {
        id: teacher._id, // ✅ correct user
        role: teacher.role, // ✅ "teacher"
        permissions: teacher.permissions || [], // ✅ dynamic
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // ✅ send safe response
    res.status(200).json({
      message: "Teacher login successful",
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        permissions: teacher.permissions,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGOUT =================
exports.logoutTeacher = async (req, res) => {
  try {
    // 🧹 clear cookie (if used)
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};