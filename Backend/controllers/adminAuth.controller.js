const Admin = require("../models/adminAuth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;

    // ✅ STRICT CHECK (only one admin EVER)
    const adminCount = await Admin.countDocuments();

    if (adminCount > 0) {
      return res.status(400).json({
        message: "Admin already registered. You cannot create another.",
      });
    }

    // ✅ DEFAULT PASSWORD IF NOT PROVIDED
    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    const admin = await Admin.create({
      name: name || "Admin",
      email: "admin@gmail.com", // 🔒 fixed
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully ✅",
      admin,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN (FIXED EMAIL) =================
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔒 FIX EMAIL CHECK
    if (email !== "admin@gmail.com") {
      return res.status(400).json({ message: "Invalid email" });
    }

    const admin = await Admin.findOne({ email: "admin@gmail.com" });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not registered. Please register once.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PASSWORD =================
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({
      message: "Password updated successfully ✅",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGOUT =================
exports.logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};