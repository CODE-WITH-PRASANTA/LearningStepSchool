const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

/* ================= HELPERS ================= */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/* ================= ROUTE → FOLDER MAP ================= */
const routeFolderMap = {
  "/blogs": "uploads/blogs",
  "/team": "uploads/team",
  "/client-logos": "uploads/client-logos",
  "/photo-gallery": "uploads/gallery",
  "/teachers": "uploads/teachers",
  "/notices": "uploads/notices",
  "/awards": "uploads/awards",
  "/testimonials": "uploads/testimonials",
  "/class-data": "uploads/class-data", 
  "/events": "uploads/events",// ✅ added
};

/* ================= MULTER CONFIG ================= */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ================= SHARP CONVERTER ================= */
const convertToWebp = async (req, res, next) => {
  try {
    if (!req.file && !req.files) return next();

    let uploadPath = "uploads/common";

    for (const route in routeFolderMap) {
      if (req.originalUrl.includes(route)) {
        uploadPath = routeFolderMap[route];
        break;
      }
    }

    ensureDir(uploadPath);

    /* ================= SINGLE FILE ================= */
    if (req.file) {
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.webp`;

      const outputPath = path.join(uploadPath, filename);

      await sharp(req.file.buffer)
        .resize(1200, 1200, { fit: "inside" })
        .webp({ quality: 80 })
        .toFile(outputPath);

      const relativePath = "/" + outputPath.replace(/\\/g, "/");

      // ✅ IMPORTANT FIX
      req.file.path = relativePath;
      req.body[req.file.fieldname] = relativePath;
    }

    /* ================= MULTIPLE FILES ================= */
    if (req.files) {
      for (const field in req.files) {
        req.body[field] = [];

        for (const file of req.files[field]) {
          const filename = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.webp`;

          const outputPath = path.join(uploadPath, filename);

          await sharp(file.buffer)
            .resize(1200, 1200, { fit: "inside" })
            .webp({ quality: 80 })
            .toFile(outputPath);

          const relativePath = "/" + outputPath.replace(/\\/g, "/");

          file.path = relativePath;
          req.body[field].push(relativePath);
        }
      }
    }

    next();
  } catch (err) {
    console.error("SHARP ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { upload, convertToWebp };