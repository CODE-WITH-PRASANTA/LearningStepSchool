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
  "/students": "uploads/students",
  "/blogs": "uploads/blogs",
  "/team": "uploads/team",
  "/client-logos": "uploads/client-logos",
  "/photo-gallery": "uploads/gallery",
  "/teachers": "uploads/teachers",
  "/notices": "uploads/notices",
  "/awards": "uploads/awards",
  "/testimonials": "uploads/testimonials",
  "/class-data": "uploads/class-data",
  "/events": "uploads/events",
  "/advertisements": "uploads/advertisements",
  "/classes": "uploads/classes",
  "/subjects": "uploads/subjects",
};

/* ================= GET UPLOAD PATH ================= */
const getUploadPath = (req) => {
  let uploadPath = "uploads/common";

  for (const route in routeFolderMap) {
    if (req.originalUrl.includes(route)) {
      uploadPath = routeFolderMap[route];
      break;
    }
  }

  ensureDir(uploadPath);
  return uploadPath;
};

/* ================= MULTER CONFIG ================= */
const storage = multer.memoryStorage();

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  const route = req.originalUrl;
  const mime = file.mimetype;

  const isImage = mime.startsWith("image/");
  const isPDF = mime === "application/pdf";
  const isDOC =
    mime === "application/msword" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  /* ================= STUDENT VALIDATION ================= */
  if (route.includes("/students")) {
    const field = file.fieldname;

    const imageFields = [
      "studentPhoto",
      "fatherPhoto",
      "motherPhoto",
      "guardianPhoto",
    ];

    const pdfFields = [
      "reportCard",
      "tc",
      "samagraId",
      "nidaCard",
      "previousMarksheet",
      "dobCertificate",
      "incomeCertificate",
      "pip",
    ];

    const pdfOrImageFields = ["aadhaarStudent", "aadhaarParent"];

    if (imageFields.includes(field)) {
      return isImage
        ? cb(null, true)
        : cb(new Error(`${field} must be an image`));
    }

    if (pdfFields.includes(field)) {
      return isPDF
        ? cb(null, true)
        : cb(new Error(`${field} must be a PDF`));
    }

    if (pdfOrImageFields.includes(field)) {
      return isPDF || isImage
        ? cb(null, true)
        : cb(new Error(`${field} must be PDF or image`));
    }
  }

  /* ================= DEFAULT VALIDATION ================= */
  if (isImage || isPDF || isDOC) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDF, DOC, DOCX files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ================= FILE PROCESSOR ================= */
const processFile = async (file, uploadPath) => {
  const isImage = file.mimetype.startsWith("image/");

  if (isImage) {
    const filename = `${file.fieldname}_${Date.now()}.webp`;
    const outputPath = path.join(uploadPath, filename);

    await sharp(file.buffer)
      .resize(1200, 1200, { fit: "inside" })
      .webp({ quality: 80 })
      .toFile(outputPath);

    return "/" + outputPath.replace(/\\/g, "/");
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const filename = `${file.fieldname}_${Date.now()}${ext}`;
  const outputPath = path.join(uploadPath, filename);

  fs.writeFileSync(outputPath, file.buffer);

  return "/" + outputPath.replace(/\\/g, "/");
};

/* ================= SHARP CONVERTER ================= */
const convertToWebp = async (req, res, next) => {
  try {
    if (!req.file && !req.files) return next();

    const uploadPath = getUploadPath(req);

    /* SINGLE FILE */
    if (req.file) {
      const pathSaved = await processFile(req.file, uploadPath);
      req.file.path = pathSaved;
      req.body[req.file.fieldname] = pathSaved;
    }

    /* MULTIPLE FILES */
    if (req.files) {
      for (const field in req.files) {
        req.body[field] = [];

        for (const file of req.files[field]) {
          const pathSaved = await processFile(file, uploadPath);
          file.path = pathSaved;
          req.body[field].push(pathSaved);
        }
      }
    }

    next();
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE IMAGE ================= */
const deleteImageFile = (imagePath) => {
  try {
    if (!imagePath) return;

    const fullPath = path.join(__dirname, "..", imagePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("Deleted:", fullPath);
    }
  } catch (err) {
    console.error("DELETE ERROR:", err);
  }
};

module.exports = {
  upload,
  convertToWebp,
  deleteImageFile,
};