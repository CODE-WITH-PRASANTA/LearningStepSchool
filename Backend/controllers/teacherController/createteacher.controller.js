
const User = require("../../models/techerModel/createteacher.model");
const hashPassword = require("../../utils/hash");

// =====================================================
// HELPER: PARSE PERMISSIONS
// =====================================================
const parsePermissions = (permissions) => {
  if (!permissions) return [];

  if (Array.isArray(permissions)) {
    return permissions;
  }

  if (typeof permissions === "string") {
    const parsed = JSON.parse(permissions);
    return Array.isArray(parsed) ? parsed : [];
  }

  return [];
};

// =====================================================
// HELPER: NORMALIZE STATUS
// =====================================================
const normalizeStatus = (status) => {
  if (status === undefined || status === null || status === "") {
    return "active";
  }

  const normalized = String(status).trim().toLowerCase();

  if (!["active", "inactive"].includes(normalized)) {
    throw new Error("Status must be active or inactive");
  }

  return normalized;
};

// =====================================================
// HELPER: SAFE TEACHER RESPONSE
// =====================================================
const formatTeacher = (teacher) => {
  const data =
    typeof teacher.toObject === "function"
      ? teacher.toObject()
      : { ...teacher };

  delete data.password;

  // Existing records without status default to active.
  data.status =
    String(data.status || "active").toLowerCase() === "inactive"
      ? "inactive"
      : "active";

  data.permissions = Array.isArray(data.permissions)
    ? data.permissions
    : [];

  return data;
};

// =====================================================
// CREATE TEACHER
// POST /api/admin/teachers
// =====================================================
exports.createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contact,
      department,
      designation,
      permissions,
      status,
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingTeacher = await User.findOne({
      email: normalizedEmail,
    });

    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: "Teacher already exists with this email",
      });
    }

    let parsedPermissions;
    let teacherStatus;

    try {
      parsedPermissions = parsePermissions(permissions);
      teacherStatus = normalizeStatus(status);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const hashedPassword = await hashPassword(password);

    const teacher = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      contact: contact || "",
      department: department?.trim() || "",
      designation: designation?.trim() || "",
      image: req.file?.path || req.body.image || "",
      role: "teacher",
      permissions: parsedPermissions,
      status: teacherStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: formatTeacher(teacher),
    });
  } catch (error) {
    console.error("CREATE TEACHER ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create teacher",
    });
  }
};

// =====================================================
// GET ALL TEACHERS
// GET /api/admin/teachers
// =====================================================
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const formattedTeachers = teachers.map((teacher) =>
      formatTeacher(teacher)
    );

    const activeCount = formattedTeachers.filter(
      (teacher) => teacher.status === "active"
    ).length;

    const inactiveCount = formattedTeachers.filter(
      (teacher) => teacher.status === "inactive"
    ).length;

    return res.status(200).json({
      success: true,
      count: formattedTeachers.length,
      activeCount,
      inactiveCount,
      data: formattedTeachers,
    });
  } catch (error) {
    console.error("GET TEACHERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch teachers",
    });
  }
};

// =====================================================
// SEARCH TEACHERS
// GET /api/admin/teachers/search?search=name
// Register this route before /teachers/:id if you add it.
// =====================================================
exports.searchTeachers = async (req, res) => {
  try {
    const searchText = String(req.query.search || "").trim();

    if (!searchText) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const escapedSearch = searchText.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const teachers = await User.find({
      role: "teacher",
      $or: [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
        { contact: { $regex: escapedSearch, $options: "i" } },
        { department: { $regex: escapedSearch, $options: "i" } },
        { designation: { $regex: escapedSearch, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(10)
      .lean();

    const formattedTeachers = teachers.map((teacher) =>
      formatTeacher(teacher)
    );

    return res.status(200).json({
      success: true,
      count: formattedTeachers.length,
      data: formattedTeachers,
    });
  } catch (error) {
    console.error("SEARCH TEACHERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to search teachers",
    });
  }
};

// =====================================================
// GET TEACHER BY ID
// GET /api/admin/teachers/:id
// =====================================================
exports.getTeacherById = async (req, res) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
    }).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: formatTeacher(teacher),
    });
  } catch (error) {
    console.error("GET TEACHER BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch teacher",
    });
  }
};

// =====================================================
// UPDATE TEACHER
// PUT /api/admin/teachers/:id
// =====================================================
exports.updateTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contact,
      department,
      designation,
      permissions,
      status,
    } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Teacher name cannot be empty",
        });
      }

      teacher.name = name.trim();
    }

    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingTeacher = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: teacher._id },
      });

      if (existingTeacher) {
        return res.status(409).json({
          success: false,
          message: "This email is already in use",
        });
      }

      teacher.email = normalizedEmail;
    }

    if (contact !== undefined) {
      teacher.contact = contact;
    }

    if (department !== undefined) {
      teacher.department = department.trim();
    }

    if (designation !== undefined) {
      teacher.designation = designation.trim();
    }

    if (permissions !== undefined) {
      try {
        teacher.permissions = parsePermissions(permissions);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid permissions format",
        });
      }
    }

    // Persist status changes in MongoDB.
    if (status !== undefined) {
      try {
        teacher.status = normalizeStatus(status);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    // Preserve the current image when no new image is uploaded.
    if (req.file) {
      teacher.image = req.file.path || teacher.image;
    } else if (req.body.image !== undefined) {
      teacher.image = req.body.image;
    }

    if (password?.trim()) {
      teacher.password = await hashPassword(password);
    }

    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: formatTeacher(teacher),
    });
  } catch (error) {
    console.error("UPDATE TEACHER ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A teacher with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update teacher",
    });
  }
};

// =====================================================
// DELETE TEACHER
// DELETE /api/admin/teachers/:id
// =====================================================
exports.deleteTeacher = async (req, res) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID",
      });
    }

    const teacher = await User.findOneAndDelete({
      _id: req.params.id,
      role: "teacher",
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TEACHER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete teacher",
    });
  }
};

// =====================================================
// GET LOGGED-IN TEACHER
// =====================================================
exports.getMeTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: formatTeacher(teacher),
    });
  } catch (error) {
    console.error("GET MY TEACHER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch profile",
    });
  }
};

// =====================================================
// UPDATE LOGGED-IN TEACHER PROFILE IMAGE
// =====================================================
exports.updateMyTeacherImage = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (!req.file && !req.body.image) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    teacher.image = req.file?.path || req.body.image || teacher.image;

    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      image: teacher.image || "",
    });
  } catch (error) {
    console.error("UPDATE TEACHER IMAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile image",
    });
  }
};
