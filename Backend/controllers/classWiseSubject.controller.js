const ClassWiseSubject = require("../models/ClassWiseSubject.model");

/* ================= ADD / UPDATE ================= */
exports.addSubjects = async (req, res) => {
  try {
    const { classId, subjects } = req.body;

    if (!classId || !subjects || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "classId and subjects are required",
      });
    }

    // ✅ normalize incoming subjects
    const normalizedSubjects = subjects.map((s) =>
      typeof s === "string"
        ? { name: s.trim(), type: "regular" }
        : {
            name: s.name.trim(),
            type: s.type || "regular",
          }
    );

    let existing = await ClassWiseSubject.findOne({ classId });

    if (existing) {
      // ✅ normalize OLD DATA
      existing.subjects = existing.subjects.map((s) =>
        typeof s === "string"
          ? { name: s.trim(), type: "regular" }
          : {
              name: s.name.trim(),
              type: s.type || "regular",
            }
      );

      // ✅ merge + update
      normalizedSubjects.forEach((newSub) => {
        const exists = existing.subjects.find(
          (s) => s.name.toLowerCase() === newSub.name.toLowerCase()
        );

        if (!exists) {
          existing.subjects.push(newSub);
        } else {
          exists.type = newSub.type; // update type
        }
      });

      await existing.save();

      return res.json({
        success: true,
        message: "Subjects updated",
        data: existing,
      });
    }

    // ✅ create new
    const data = await ClassWiseSubject.create({
      classId,
      subjects: normalizedSubjects,
    });

    res.json({
      success: true,
      message: "Subjects added",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getAll = async (req, res) => {
  try {
    const data = await ClassWiseSubject.find()
      .populate("classId", "className");

    // ✅ normalize safely (no mutation issues)
    const normalized = data.map((doc) => ({
      _id: doc._id,
      classId: doc.classId,
      subjects: doc.subjects.map((s) =>
        typeof s === "string"
          ? { name: s.trim(), type: "regular" }
          : {
              name: s.name.trim(),
              type: s.type || "regular",
            }
      ),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    res.json({
      success: true,
      data: normalized,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET BY CLASS ================= */
exports.getByClass = async (req, res) => {
  try {
    const doc = await ClassWiseSubject.findOne({
      classId: req.params.classId,
    }).populate("classId", "className");

    if (!doc) {
      return res.json({ success: true, data: null });
    }

    const normalized = {
      _id: doc._id,
      classId: doc.classId,
      subjects: doc.subjects.map((s) =>
        typeof s === "string"
          ? { name: s.trim(), type: "regular" }
          : {
              name: s.name.trim(),
              type: s.type || "regular",
            }
      ),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    res.json({
      success: true,
      data: normalized,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= REMOVE SUBJECT ================= */
exports.removeSubject = async (req, res) => {
  try {
    const { classId, subjectName } = req.body;

    if (!classId || !subjectName) {
      return res.status(400).json({
        success: false,
        message: "classId and subjectName required",
      });
    }

    const existing = await ClassWiseSubject.findOne({ classId });

    if (!existing) {
      return res.json({
        success: true,
        message: "No data found",
      });
    }

    // ✅ normalize before filtering
    existing.subjects = existing.subjects.map((s) =>
      typeof s === "string"
        ? { name: s.trim(), type: "regular" }
        : {
            name: s.name.trim(),
            type: s.type || "regular",
          }
    );

    existing.subjects = existing.subjects.filter(
      (s) => s.name.toLowerCase() !== subjectName.trim().toLowerCase()
    );

    await existing.save();

    res.json({
      success: true,
      message: "Subject removed",
      data: existing,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE CLASS ================= */
exports.deleteClassSubjects = async (req, res) => {
  try {
    await ClassWiseSubject.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Class deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};