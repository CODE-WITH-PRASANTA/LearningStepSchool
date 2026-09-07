const Admin = require("../models/adminAuth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { deleteImageFile } = require("../middleware/upload");

/* =====================================================
   HELPER
===================================================== */

const getSafeAdmin = (admin) => {
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    role: admin.role,
    bio: admin.bio,
    avatar: admin.avatar,
    notifications: admin.notifications,
    theme: admin.theme,
  };
};

/* =====================================================
   REGISTER ADMIN
===================================================== */

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Only one admin allowed
    const adminExists = await Admin.findOne();

    if (adminExists) {
      return res.status(400).json({
        message:
          "Admin already registered. You cannot create another.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name: "Admin",
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "Administrator",
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: getSafeAdmin(admin),
    });
  } catch (error) {
    console.error("REGISTER ADMIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   LOGIN ADMIN
===================================================== */

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
        permissions: ["ALL"],
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: getSafeAdmin(admin),
    });
  } catch (error) {
    console.error("LOGIN ADMIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET ADMIN PROFILE
===================================================== */

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select(
      "-password"
    );

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: admin,
    });
  } catch (error) {
    console.error("GET ADMIN PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE ADMIN PROFILE
===================================================== */

exports.updateAdminProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      notifications,
      theme,
      avatar,
    } = req.body;

    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    /* ---------- NAME ---------- */

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      admin.name = name.trim();
    }

    /* ---------- EMAIL ---------- */

    if (email !== undefined) {
      const cleanEmail = email.toLowerCase().trim();

      if (!cleanEmail) {
        return res.status(400).json({
          message: "Email cannot be empty",
        });
      }

      const emailExists = await Admin.findOne({
        email: cleanEmail,
        _id: { $ne: admin._id },
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      admin.email = cleanEmail;
    }

    /* ---------- PHONE ---------- */

    if (phone !== undefined) {
      admin.phone = phone.trim();
    }

    /* ---------- BIO ---------- */

    if (bio !== undefined) {
      admin.bio = bio.trim();
    }

    /* ---------- NOTIFICATIONS ---------- */

    if (notifications !== undefined) {
      admin.notifications =
        notifications === true ||
        notifications === "true";
    }

    /* ---------- THEME ---------- */

    if (theme !== undefined) {
      if (!["light", "dark"].includes(theme)) {
        return res.status(400).json({
          message: "Invalid theme",
        });
      }

      admin.theme = theme;
    }

    /* ---------- AVATAR ---------- */

    if (avatar !== undefined && avatar !== "") {
      // Delete previous avatar
      if (admin.avatar) {
        deleteImageFile(admin.avatar);
      }

      // Save new avatar path
      admin.avatar = avatar;
    }

    await admin.save();

    const updatedAdmin = await Admin.findById(
      admin._id
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedAdmin,
    });
  } catch (error) {
    console.error("UPDATE ADMIN PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE PASSWORD
===================================================== */

exports.updatePassword = async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword,
    } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password incorrect",
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      admin.password
    );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from old password",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    admin.password = hashedPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   LOGOUT
===================================================== */

exports.logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};